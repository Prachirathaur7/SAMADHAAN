import { useGetMapStats } from '@workspace/api-client-react';
import { Activity, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatsHeader() {
  const { data: stats, isLoading } = useGetMapStats({
    query: {
      refetchInterval: 30000, // refresh every 30s
      queryKey: ['/api/map/stats']
    }
  });

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Nagar<span className="text-primary">Drishti</span>
        </h1>
        <p className="text-xs text-white/70 font-medium tracking-wider uppercase drop-shadow-md mt-1">Live Intelligence</p>
      </div>

      <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-4 pointer-events-auto shadow-lg">
        {isLoading || !stats ? (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2" title="Critical Issues">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <span className="text-sm font-semibold text-white">{stats.totalCritical.toLocaleString()}</span>
            </div>
            
            <div className="w-px h-4 bg-white/20" />
            
            <div className="flex items-center gap-1.5" title="Open Issues">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-sm font-medium text-white/90">{stats.totalOpen.toLocaleString()}</span>
            </div>
            
            <div className="w-px h-4 bg-white/20" />
            
            <div className="flex items-center gap-1.5" title="Reports Today">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span className="text-sm font-medium text-white/90">{stats.last24hCount.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
