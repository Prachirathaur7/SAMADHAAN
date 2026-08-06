import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useGetHeatmap } from '@workspace/api-client-react';
import { useMapState } from '@/contexts/map-context';
import L from 'leaflet';
import 'leaflet.heat';

export function HeatmapLayer() {
  const map = useMap();
  const { selectedCategory } = useMapState();

  const { data: heatmapData } = useGetHeatmap(
    { category: selectedCategory as any },
    { query: { queryKey: ['heatmap', selectedCategory] } }
  );

  useEffect(() => {
    if (!heatmapData || heatmapData.length === 0) return;

    // The leaflet.heat plugin extends L with heatLayer
    const points = heatmapData.map(p => [p.lat, p.lng, p.weight] as L.HeatLatLngTuple);

    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: '#22d3ee', // Cyan (Low)
        0.5: '#f59e0b', // Amber (Medium/High)
        0.8: '#ef4444', // Red (Critical)
        1.0: '#7f1d1d'  // Dark Red (Dense Critical)
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, heatmapData]);

  return null;
}
