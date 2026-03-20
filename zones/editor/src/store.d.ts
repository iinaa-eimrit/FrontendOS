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
export declare const useEditorStore: import("zustand").UseBoundStore<import("zustand").StoreApi<EditorState>>;
//# sourceMappingURL=store.d.ts.map