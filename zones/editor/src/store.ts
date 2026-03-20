import { create } from "zustand";

export interface CanvasElement {
  id: string;
  type: "rectangle" | "ellipse" | "text" | "image" | "frame";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  label?: string;
  locked: boolean;
  visible: boolean;
}

export interface EditorState {
  elements: CanvasElement[];
  selectedIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  tool: "select" | "rectangle" | "ellipse" | "text" | "frame" | "hand";
  gridEnabled: boolean;
  snapEnabled: boolean;

  // Actions
  addElement: (element: CanvasElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  setSelection: (ids: string[]) => void;
  setTool: (tool: EditorState["tool"]) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  elements: [],
  selectedIds: [],
  zoom: 1,
  panX: 0,
  panY: 0,
  tool: "select",
  gridEnabled: true,
  snapEnabled: true,

  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  setSelection: (ids) => set({ selectedIds: ids }),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
}));
