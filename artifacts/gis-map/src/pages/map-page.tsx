import { MapProvider } from '@/contexts/map-context';
import { MapView } from '@/components/map/map-view';
import { MapOverlays } from '@/components/ui/map-overlays';
import { ComplaintDetailPanel } from '@/components/ui/panels/complaint-detail-panel';
import { SosPanel } from '@/components/ui/panels/sos-panel';
import { ReportProblemModal } from '@/components/ui/panels/report-problem-modal';

export default function MapPage() {
  return (
    <MapProvider>
      <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0f1c]">
        <MapView />       {/* map + layers + FAB buttons */}
        <MapOverlays />   {/* stats header + category filters */}
        <ComplaintDetailPanel />
        <SosPanel />
        <ReportProblemModal />
      </div>
    </MapProvider>
  );
}
