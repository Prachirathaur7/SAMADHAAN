import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import { WardLayer } from './ward-layer';
import { HeatmapLayer } from './heatmap-layer';
import { ClusterLayer } from './cluster-layer';
import { UserLocationLayer } from './user-location-layer';
import { FabButtons } from '@/components/ui/fab-buttons';

// Fix Leaflet's default icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default center: India (approximate center for demo purposes, will flyTo user on load)
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

export function MapView() {
  return (
    <div className="w-full h-[100dvh] bg-[#0a0f1c]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false} // Hide default zoom control to keep UI clean
        maxBounds={[
          [6.7533, 68.1628], // SW bound of India (roughly)
          [35.5087, 97.3956], // NE bound of India
        ]}
        minZoom={4}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        
        {/* Map Layers (Bottom to Top) */}
        <WardLayer />
        <HeatmapLayer />
        <ClusterLayer />
        <UserLocationLayer />
        {/* FAB buttons live inside MapContainer so useMap() works */}
        <FabButtons />
      </MapContainer>
    </div>
  );
}
