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
    return (_jsxs("div", { className: "w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-3 gap-1", children: [tools.map((tool) => (_jsx("button", { onClick: () => setTool(tool.id), className: `w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono transition-colors ${currentTool === tool.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"}`, title: `${tool.label} (${tool.shortcut})`, children: tool.shortcut }, tool.id))), _jsx("div", { className: "w-6 h-px bg-gray-800 my-2" }), _jsx("button", { onClick: () => setZoom(zoom + 0.25), className: "w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white flex items-center justify-center text-sm", title: "Zoom in", children: "+" }), _jsxs("span", { className: "text-[10px] text-gray-500", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { onClick: () => setZoom(zoom - 0.25), className: "w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white flex items-center justify-center text-sm", title: "Zoom out", children: "\u2212" }), _jsx("div", { className: "w-6 h-px bg-gray-800 my-2" }), _jsx("button", { onClick: toggleGrid, className: `w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-colors ${gridEnabled
                    ? "bg-gray-800 text-blue-400"
                    : "text-gray-500 hover:bg-gray-800"}`, title: "Toggle grid", children: "#" })] }));
}
//# sourceMappingURL=Toolbar.js.map