import { useMapState } from '@/contexts/map-context';
import { useGetEmergencyServices } from '@workspace/api-client-react';
import { X, Phone, Shield, Ambulance, Flame, Building2, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SosPanel() {
  const { isSosActive, setIsSosActive, userLocation } = useMapState();

  const { data: services, isLoading } = useGetEmergencyServices(
    { lat: userLocation?.lat ?? 0, lng: userLocation?.lng ?? 0 },
    { query: { enabled: isSosActive && !!userLocation, queryKey: ['emergency', userLocation?.lat, userLocation?.lng] } }
  );

  if (!isSosActive) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'police': return Shield;
      case 'hospital': return Ambulance;
      case 'fire_station': return Flame;
      default: return Building2;
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-red-950/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
      <div className="p-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
            </span>
            EMERGENCY SOS
          </h2>
          <p className="text-red-200 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4" />
            {userLocation ? "Showing nearest services" : "Location required"}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSosActive(false)} 
          className="text-white hover:bg-white/10 hover:text-white rounded-full w-12 h-12"
        >
          <X className="w-8 h-8" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {!userLocation ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-red-200 font-medium">Please enable location services to find nearby help.</p>
            </div>
          ) : isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-red-200">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-medium text-lg">Locating nearby emergency services...</p>
            </div>
          ) : !services?.length ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-red-200 font-medium">No services found in immediate vicinity.</p>
              <Button asChild size="lg" className="mt-6 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg h-14 px-8">
                <a href="tel:112">CALL NATIONAL EMERGENCY (112)</a>
              </Button>
            </div>
          ) : (
            services.map((service) => {
              const Icon = getIcon(service.type);
              return (
                <div key={service.id} className="bg-black/40 border border-red-500/30 rounded-2xl p-5 flex flex-col shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white leading-tight">{service.name}</h3>
                      <p className="text-red-300 font-medium">{service.distanceKm.toFixed(1)} km away</p>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    className="w-full mt-auto bg-white hover:bg-gray-100 text-red-950 font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <a href={`tel:${service.phone}`}>
                      <Phone className="w-6 h-6 fill-current" />
                      CALL {service.phone}
                    </a>
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
