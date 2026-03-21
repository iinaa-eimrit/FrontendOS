import { create } from "zustand";
export const useEditorStore = create((set) => ({
    elements: [],
    selectedIds: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    tool: "select",
    gridEnabled: true,
    snapEnabled: true,
    addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
    removeElement: (id) => set((state) => ({
        elements: state.elements.filter((el) => el.id !== id),
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),
    updateElement: (id, updates) => set((state) => ({
        elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    })),
    setSelection: (ids) => set({ selectedIds: ids }),
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
    setPan: (x, y) => set({ panX: x, panY: y }),
    toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
    toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
}));
//# sourceMappingURL=store.js.map