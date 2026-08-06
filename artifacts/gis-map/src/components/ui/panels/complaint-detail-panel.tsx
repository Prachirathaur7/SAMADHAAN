import { useMapState } from '@/contexts/map-context';
import { useGetNearbyComplaints } from '@workspace/api-client-react';
import { X, Clock, AlertCircle, Plus, MapPin, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ComplaintDetailPanel() {
  const { selectedCluster, setSelectedCluster, setIsReportModalOpen } = useMapState();

  const { data: complaints, isLoading } = useGetNearbyComplaints(
    { lat: selectedCluster?.lat ?? 0, lng: selectedCluster?.lng ?? 0, radiusKm: 0.5 },
    { query: { enabled: !!selectedCluster, queryKey: ['nearby', selectedCluster?.lat, selectedCluster?.lng] } }
  );

  if (!selectedCluster) return null;

  const severityColorMap: Record<string, string> = {
    critical: 'bg-severity-critical',
    high: 'bg-severity-high',
    medium: 'bg-severity-medium',
    low: 'bg-severity-low',
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-24 md:right-4 md:left-auto md:w-[400px] z-[2000] bg-card/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-t-2xl md:rounded-2xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-right-full duration-300">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className={cn("w-3 h-3 rounded-full", severityColorMap[selectedCluster.topSeverity] || "bg-gray-500")} />
            {selectedCluster.wardName || 'Local Area'}
          </h2>
          <p className="text-sm text-white/60">{selectedCluster.count} reported issues nearby</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedCluster(null)} className="text-white/60 hover:text-white rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="max-h-[40vh] md:max-h-[50vh]">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !complaints?.length ? (
            <p className="text-center text-white/50 py-4">No specific reports found.</p>
          ) : (
            complaints.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
                    complaint.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    complaint.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  )}>
                    {complaint.category}
                  </span>
                  <div className="flex items-center text-xs text-white/50 gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(complaint.reportedAt), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm text-white/90 line-clamp-2">{complaint.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {complaint.reporterCount} upvotes
                  </span>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/80 capitalize">
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 bg-white/5">
        <Button 
          className="w-full gap-2 font-semibold shadow-lg shadow-primary/20"
          onClick={() => {
            setSelectedCluster(null);
            setIsReportModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Your Voice
        </Button>
      </div>
    </div>
  );
}
