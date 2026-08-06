import { useMapState } from '@/contexts/map-context';
import { cn } from '@/lib/utils';
import { Droplet, Flame, Map, Trash2, Zap, LayoutGrid, CircleEllipsis } from 'lucide-react';
import type { GetHeatmapCategory } from '@workspace/api-client-react';

const FILTERS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'road', label: 'Road', icon: Map },
  { id: 'water', label: 'Water', icon: Droplet },
  { id: 'garbage', label: 'Garbage', icon: Trash2 },
  { id: 'drainage', label: 'Drainage', icon: Droplet },
  { id: 'electricity', label: 'Power', icon: Zap },
  { id: 'other', label: 'Other', icon: CircleEllipsis },
] as const;

export function FilterPillRow() {
  const { selectedCategory, setSelectedCategory } = useMapState();

  return (
    <div className="absolute top-20 left-4 right-4 z-[1000] flex overflow-x-auto pb-4 pt-1 pointer-events-none no-scrollbar snap-x">
      <div className="flex gap-2 pointer-events-auto snap-start px-1">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = selectedCategory === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedCategory(filter.id as any)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground scale-105" 
                  : "glass-panel text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
