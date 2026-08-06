import { MapProvider } from '@/contexts/map-context';
import { MapView } from '@/components/map/map-view';
import { StatsHeader } from '@/components/ui/stats-header';
import { FilterPillRow } from '@/components/ui/filter-pill-row';
import { ComplaintDetailPanel } from '@/components/ui/panels/complaint-detail-panel';
import { SosPanel } from '@/components/ui/panels/sos-panel';
import { ReportProblemModal } from '@/components/ui/panels/report-problem-modal';

export default function MapPage() {
  return (
    <MapProvider>
      <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0f1c]">
        {/* Core Map layer — FabButtons is rendered inside MapContainer */}
        <MapView />

        {/* Floating UI Elements (z-index 1000+) */}
        <StatsHeader />
        <FilterPillRow />

        {/* Floating Panels */}
        <ComplaintDetailPanel />
        <SosPanel />
        <ReportProblemModal />
      </div>
    </MapProvider>
  );
}
