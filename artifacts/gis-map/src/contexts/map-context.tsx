import React, { createContext, useContext, useState } from 'react';
import type { ComplaintCluster } from '@workspace/api-client-react';

type FilterCategory = 'all' | 'road' | 'water' | 'garbage' | 'drainage' | 'electricity' | 'other';

interface MapContextType {
  selectedCategory: FilterCategory;
  setSelectedCategory: (category: FilterCategory) => void;
  selectedCluster: ComplaintCluster | null;
  setSelectedCluster: (cluster: ComplaintCluster | null) => void;
  isSosActive: boolean;
  setIsSosActive: (active: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedCluster, setSelectedCluster] = useState<ComplaintCluster | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <MapContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedCluster,
        setSelectedCluster,
        isSosActive,
        setIsSosActive,
        isReportModalOpen,
        setIsReportModalOpen,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapState() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapProvider');
  }
  return context;
}
