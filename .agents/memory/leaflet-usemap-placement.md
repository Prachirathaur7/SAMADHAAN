---
name: Leaflet useMap placement
description: react-leaflet useMap() hook requires the component to be a descendant of MapContainer
---

## Rule
Any React component that calls `useMap()` (or any other react-leaflet context hook like `useMapEvents`, `useLeafletContext`) **must** be rendered as a child of `<MapContainer>`, not as a sibling outside it.

**Why:** `useMap()` reads from the Leaflet React context, which is only available inside the MapContainer tree. If rendered outside (e.g. as a floating UI panel in a parent div alongside MapContainer), it throws: `No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>`.

**How to apply:**
- For map-layer components (heatmap, clusters, ward polygons, user location): naturally go inside MapContainer.
- For UI components that ALSO need map access (e.g. FabButtons that calls `map.flyTo()`): place them inside `<MapContainer>` as children. React-leaflet passes children through to the map context. Use absolute CSS positioning with high z-index so they overlay visually.
- For UI panels that do NOT need map access (stats header, filter pills, modals, SOS panel): keep them outside MapContainer as normal DOM siblings.
