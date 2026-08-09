import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation, Plus } from 'lucide-react';
import { useMapState } from '@/contexts/map-context';
import { MapLayers } from './map-layers';
import L from 'leaflet';

// Fix Leaflet's default icon paths under Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

// Must be a child of MapContainer so useMap() has context
function FabButtons() {
  const { setIsSosActive, setIsReportModalOpen, userLocation } = useMapState();
  const map = useMap();

  return (
    <>
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
        {userLocation && (
          <button
            onClick={() => map.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true, duration: 1.5 })}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white shadow-lg hover:bg-white/10 transition-colors"
            title="My Location"
          >
            <Navigation className="w-5 h-5 fill-current" />
          </button>
        )}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all"
          title="Report Problem"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-[1000]">
        <button
          onClick={() => setIsSosActive(true)}
          className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:bg-red-500 hover:scale-105 active:scale-95 transition-all group relative"
          title="Emergency SOS"
        >
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75 group-hover:opacity-100" />
          <AlertTriangle className="w-7 h-7 relative z-10" />
        </button>
      </div>
    </>
  );
}

export function MapView() {
  return (
    <div className="w-full h-[100dvh] bg-[#0a0f1c]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        maxBounds={[[6.7533, 68.1628], [35.5087, 97.3956]]}
        minZoom={4}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        <MapLayers />
        <FabButtons />
      </MapContainer>
    </div>
  );
}
