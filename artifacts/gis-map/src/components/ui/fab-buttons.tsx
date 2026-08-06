import { useMapState } from '@/contexts/map-context';
import { AlertTriangle, Plus, Navigation } from 'lucide-react';
import { useMap } from 'react-leaflet';

export function FabButtons() {
  const { setIsSosActive, setIsReportModalOpen, userLocation } = useMapState();
  const map = useMap();

  const flyToUser = () => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true, duration: 1.5 });
    }
  };

  return (
    <>
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
        {userLocation && (
          <button
            onClick={flyToUser}
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
          <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75 group-hover:opacity-100"></span>
          <AlertTriangle className="w-7 h-7 relative z-10" />
        </button>
      </div>
    </>
  );
}
