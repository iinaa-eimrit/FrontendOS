import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useEditorStore } from "../store";
const tools = [
    { id: "select", label: "Select", shortcut: "V" },
    { id: "rectangle", label: "Rectangle", shortcut: "R" },
    { id: "ellipse", label: "Ellipse", shortcut: "O" },
    { id: "text", label: "Text", shortcut: "T" },
    { id: "frame", label: "Frame", shortcut: "F" },
    { id: "hand", label: "Hand", shortcut: "H" },
];
export function Toolbar() {
    const currentTool = useEditorStore((s) => s.tool);
    const setTool = useEditorStore((s) => s.setTool);
    const zoom = useEditorStore((s) => s.zoom);
    const setZoom = useEditorStore((s) => s.setZoom);
    const gridEnabled = useEditorStore((s) => s.gridEnabled);
    const toggleGrid = useEditorStore((s) => s.toggleGrid);
    return (_jsxs("div", { className: "flex w-12 flex-col items-center gap-1 border-r border-gray-800 bg-gray-900 py-3", children: [tools.map((tool) => (_jsx("button", { onClick: () => setTool(tool.id), className: `flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs transition-colors ${currentTool === tool.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"}`, title: `${tool.label} (${tool.shortcut})`, children: tool.shortcut }, tool.id))), _jsx("div", { className: "my-2 h-px w-6 bg-gray-800" }), _jsx("button", { onClick: () => setZoom(zoom + 0.25), className: "flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white", title: "Zoom in", children: "+" }), _jsxs("span", { className: "text-[10px] text-gray-500", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { onClick: () => setZoom(zoom - 0.25), className: "flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white", title: "Zoom out", children: "\u2212" }), _jsx("div", { className: "my-2 h-px w-6 bg-gray-800" }), _jsx("button", { onClick: toggleGrid, className: `flex h-9 w-9 items-center justify-center rounded-lg text-xs transition-colors ${gridEnabled ? "bg-gray-800 text-blue-400" : "text-gray-500 hover:bg-gray-800"}`, title: "Toggle grid", children: "#" })] }));
}
//# sourceMappingURL=Toolbar.js.map