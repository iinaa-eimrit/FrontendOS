import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useEditorStore } from "./store";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { PropertiesPanel } from "./components/PropertiesPanel";
export function EditorZone() {
    const tool = useEditorStore((s) => s.tool);
    const selectedIds = useEditorStore((s) => s.selectedIds);
    return (_jsxs("div", { className: "flex h-full bg-gray-950 text-gray-50", "data-zone": "editor", "data-framework": "react", children: [_jsx(Toolbar, {}), _jsxs(motion.div, { className: "flex-1 relative overflow-hidden", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 }, children: [_jsx(Canvas, {}), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 h-8 bg-gray-900/90 backdrop-blur border-t border-gray-800 flex items-center px-4 text-xs text-gray-500 gap-4", children: [_jsxs("span", { children: ["Tool: ", tool] }), _jsxs("span", { children: ["Selected: ", selectedIds.length] }), _jsx("span", { className: "ml-auto", children: "FrontendOS Editor \u00B7 React + Zustand + Framer Motion" })] })] }), selectedIds.length > 0 && _jsx(PropertiesPanel, {})] }));
}
//# sourceMappingURL=EditorZone.js.map