import React, { useCallback } from "react";
import { motion } from "framer-motion";

import { useEditorStore } from "./store";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { PropertiesPanel } from "./components/PropertiesPanel";

export function EditorZone(): React.ReactElement {
  const tool = useEditorStore((s) => s.tool);
  const selectedIds = useEditorStore((s) => s.selectedIds);

  return (
    <div className="flex h-full bg-gray-950 text-gray-50" data-zone="editor" data-framework="react">
      {/* Toolbar */}
      <Toolbar />

      {/* Canvas Area */}
      <motion.div
        className="flex-1 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Canvas />

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900/90 backdrop-blur border-t border-gray-800 flex items-center px-4 text-xs text-gray-500 gap-4">
          <span>Tool: {tool}</span>
          <span>Selected: {selectedIds.length}</span>
          <span className="ml-auto">FrontendOS Editor · React + Zustand + Framer Motion</span>
        </div>
      </motion.div>

      {/* Properties Panel */}
      {selectedIds.length > 0 && <PropertiesPanel />}
    </div>
  );
}
