import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useGetClusters } from '@workspace/api-client-react';
import { useMapState } from '@/contexts/map-context';
import L from 'leaflet';

export function ClusterLayer() {
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

  useEffect(() => {
    updateBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: clusters } = useGetClusters(
    { 
      ...(bounds || { swLat: 0, swLng: 0, neLat: 0, neLng: 0 }),
      category: selectedCategory as any 
    },
    { 
      query: { 
        enabled: !!bounds, 
        queryKey: ['clusters', bounds, selectedCategory]
      } 
    }
  );

  // We manage markers manually to have full control over custom HTML
  useEffect(() => {
    if (!clusters) return;

    const markers: L.Marker[] = [];

    clusters.forEach(cluster => {
      // Calculate size: min 32px, max 64px based on count
      const size = Math.min(Math.max(32, 20 + Math.log10(cluster.count) * 15), 64);
      
      const severityColorClass = `bg-severity-${cluster.topSeverity}`;

      const icon = L.divIcon({
        html: `<div class="cluster-marker ${severityColorClass}" style="width: ${size}px; height: ${size}px;">${cluster.count}</div>`,
        className: '', // reset default leaflet class
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      });

      const marker = L.marker([cluster.lat, cluster.lng], { icon })
        .addTo(map)
        .on('click', () => {
          setSelectedCluster(cluster);
          map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, 18), { animate: true });
        });
      
      markers.push(marker);
    });

    return () => {
      markers.forEach(m => map.removeLayer(m));
    };
  }, [map, clusters, setSelectedCluster]);

  return null;
}
