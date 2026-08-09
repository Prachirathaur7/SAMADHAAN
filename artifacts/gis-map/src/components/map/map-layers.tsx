import { useEffect, useState } from 'react';
import { Circle, Marker, Polygon, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useGetClusters, useGetHeatmap, useGetWardStatus } from '@workspace/api-client-react';
import { useMapState } from '@/contexts/map-context';
import { AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet.heat';
import { cn } from '@/lib/utils';

// ── Ward Severity Overlay ─────────────────────────────────────────────────────

const SEVERITY_STYLES = {
  none:     { color: '#64748b', fillColor: 'transparent', fillOpacity: 0 },
  low:      { color: '#3b82f6', fillColor: '#1d4ed8',     fillOpacity: 0.2 },
  medium:   { color: '#f59e0b', fillColor: '#d97706',     fillOpacity: 0.4 },
  high:     { color: '#ef4444', fillColor: '#dc2626',     fillOpacity: 0.4 },
  critical: { color: '#ef4444', fillColor: '#dc2626',     fillOpacity: 0.7 },
} as const;

function WardLayer() {
  const { data: wards } = useGetWardStatus();
  const { selectedCategory } = useMapState();
  const isFiltered = selectedCategory !== 'all';

  if (!wards) return null;

  return (
    <>
      {wards.map((ward) => {
        const style = SEVERITY_STYLES[ward.severityLevel] ?? SEVERITY_STYLES.none;
        return (
          <Polygon
            key={ward.wardId}
            positions={ward.boundaryCoords as [number, number][]}
            pathOptions={{
              color: style.color,
              weight: 1,
              fillColor: style.fillColor,
              fillOpacity: style.fillOpacity * (isFiltered ? 0.5 : 1),
              dashArray: '4 4',
            }}
          >
            <Tooltip sticky className="custom-leaflet-tooltip glass-panel border-0 text-white p-0">
              <div className="p-3 w-48 bg-card/90 backdrop-blur-md text-white rounded-lg border border-white/10 shadow-2xl">
                <h3 className="font-bold text-base mb-1">{ward.wardName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center text-white/80">
                    <span>Active Issues</span>
                    <span className="font-mono font-medium">{ward.complaintCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Critical
                    </span>
                    <span className="font-mono font-bold">{ward.criticalCount}</span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}

// ── Heatmap Layer ─────────────────────────────────────────────────────────────

function HeatmapLayer() {
  const map = useMap();
  const { selectedCategory } = useMapState();
  const { data: heatmapData } = useGetHeatmap(
    { category: selectedCategory as any },
    { query: { queryKey: ['heatmap', selectedCategory] } },
  );

  useEffect(() => {
    if (!heatmapData?.length) return;

    const heat = (L as any).heatLayer(
      heatmapData.map((p) => [p.lat, p.lng, p.weight] as L.HeatLatLngTuple),
      {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.2: '#22d3ee', 0.5: '#f59e0b', 0.8: '#ef4444', 1.0: '#7f1d1d' },
      },
    ).addTo(map);

    return () => { map.removeLayer(heat); };
  }, [map, heatmapData]);

  return null;
}

// ── Cluster Markers ───────────────────────────────────────────────────────────

function ClusterLayer() {
  const map = useMapEvents({
    moveend: () => updateBounds(),
    zoomend: () => updateBounds(),
  });
  const { selectedCategory, setSelectedCluster } = useMapState();
  const [bounds, setBounds] = useState<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null);

  const updateBounds = () => {
    const b = map.getBounds();
    setBounds({
      swLat: b.getSouthWest().lat,
      swLng: b.getSouthWest().lng,
      neLat: b.getNorthEast().lat,
      neLng: b.getNorthEast().lng,
    });
  };

  // Capture initial bounds once on mount
  useEffect(() => { updateBounds(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: clusters } = useGetClusters(
    { ...(bounds ?? { swLat: 0, swLng: 0, neLat: 0, neLng: 0 }), category: selectedCategory as any },
    { query: { enabled: !!bounds, queryKey: ['clusters', bounds, selectedCategory] } },
  );

  useEffect(() => {
    if (!clusters) return;

    const markers = clusters.map((cluster) => {
      const size = Math.min(Math.max(32, 20 + Math.log10(cluster.count) * 15), 64);
      const icon = L.divIcon({
        html: `<div class="cluster-marker bg-severity-${cluster.topSeverity}" style="width:${size}px;height:${size}px">${cluster.count}</div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      return L.marker([cluster.lat, cluster.lng], { icon })
        .addTo(map)
        .on('click', () => {
          setSelectedCluster(cluster);
          map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, 18), { animate: true });
        });
    });

    return () => { markers.forEach((m) => map.removeLayer(m)); };
  }, [map, clusters, setSelectedCluster]);

  return null;
}

// ── User Location ─────────────────────────────────────────────────────────────

const dotIcon = L.divIcon({
  html: `
    <div class="relative flex h-5 w-5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
    </div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function UserLocationLayer() {
  const map = useMap();
  const { userLocation, setUserLocation } = useMapState();
  const [hasFlown, setHasFlown] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        setUserLocation({ lat: latitude, lng: longitude });
        if (!hasFlown) {
          map.flyTo([latitude, longitude], 14, { animate: true, duration: 2 });
          setHasFlown(true);
        }
      },
      (err) => { console.warn('Geolocation error:', err); },
      { enableHighAccuracy: true, maximumAge: 10000 },
    );

    return () => { navigator.geolocation.clearWatch(watchId); };
  }, [map, setUserLocation, hasFlown]);

  if (!userLocation) return null;

  return (
    <>
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={2000}
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '5 5' }}
      />
      <Marker position={[userLocation.lat, userLocation.lng]} icon={dotIcon} />
    </>
  );
}

// ── Composite export ──────────────────────────────────────────────────────────

export function MapLayers() {
  return (
    <>
      <WardLayer />
      <HeatmapLayer />
      <ClusterLayer />
      <UserLocationLayer />
    </>
  );
}
