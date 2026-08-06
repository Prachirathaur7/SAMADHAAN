import { useGetWardStatus } from '@workspace/api-client-react';
import { Polygon, Tooltip } from 'react-leaflet';
import { useMapState } from '@/contexts/map-context';
import { AlertCircle } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { cn } from '@/lib/utils';

export function WardLayer() {
  const { data: wards } = useGetWardStatus();
  const { selectedCategory } = useMapState();

  // If filtering by specific category, we might want to fade out the ward layer slightly
  // or just show it as is. We'll show as is but slightly more transparent if a filter is active.
  const isFiltered = selectedCategory !== 'all';

  if (!wards) return null;

  const severityStyles = {
    none: { color: '#64748b', fillColor: 'transparent', fillOpacity: 0 },
    low: { color: '#3b82f6', fillColor: '#1d4ed8', fillOpacity: 0.2 },
    medium: { color: '#f59e0b', fillColor: '#d97706', fillOpacity: 0.4 },
    high: { color: '#ef4444', fillColor: '#dc2626', fillOpacity: 0.4 },
    critical: { color: '#ef4444', fillColor: '#dc2626', fillOpacity: 0.7 },
  };

  return (
    <>
      {wards.map((ward) => {
        const style = severityStyles[ward.severityLevel] || severityStyles.none;
        const opacityModifier = isFiltered ? 0.5 : 1;

        return (
          <Polygon
            key={ward.wardId}
            positions={ward.boundaryCoords as [number, number][]}
            pathOptions={{
              color: style.color,
              weight: 1,
              fillColor: style.fillColor,
              fillOpacity: style.fillOpacity * opacityModifier,
              dashArray: '4 4'
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
                    <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Critical</span>
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
