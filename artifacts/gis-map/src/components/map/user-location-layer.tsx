import { useEffect, useState } from 'react';
import { Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMapState } from '@/contexts/map-context';

export function UserLocationLayer() {
  const map = useMap();
  const { userLocation, setUserLocation } = useMapState();
  const [hasFlown, setHasFlown] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (!hasFlown) {
          map.flyTo([latitude, longitude], 14, { animate: true, duration: 2 });
          setHasFlown(true);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, setUserLocation, hasFlown]);

  if (!userLocation) return null;

  const dotIcon = L.divIcon({
    html: `
      <div class="relative flex h-5 w-5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
      </div>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <>
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={2000} // 2km
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1,
          dashArray: '5 5'
        }}
      />
      <Marker position={[userLocation.lat, userLocation.lng]} icon={dotIcon} />
    </>
  );
}
