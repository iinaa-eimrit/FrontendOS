import React from "react";
import { useEditorStore } from "../store";

const tools = [
  { id: "select" as const, label: "Select", shortcut: "V" },
  { id: "rectangle" as const, label: "Rectangle", shortcut: "R" },
  { id: "ellipse" as const, label: "Ellipse", shortcut: "O" },
  { id: "text" as const, label: "Text", shortcut: "T" },
  { id: "frame" as const, label: "Frame", shortcut: "F" },
  { id: "hand" as const, label: "Hand", shortcut: "H" },
] as const;

export function Toolbar(): React.ReactElement {
  const currentTool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const gridEnabled = useEditorStore((s) => s.gridEnabled);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);

  return (
    <div className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-3 gap-1">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setTool(tool.id)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono transition-colors ${
            currentTool === tool.id
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.shortcut}
        </button>
      ))}

      <div className="w-6 h-px bg-gray-800 my-2" />

      {/* Zoom controls */}
      <button
        onClick={() => setZoom(zoom + 0.25)}
        className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white flex items-center justify-center text-sm"
        title="Zoom in"
      >
        +
      </button>
      <span className="text-[10px] text-gray-500">{Math.round(zoom * 100)}%</span>
      <button
        onClick={() => setZoom(zoom - 0.25)}
        className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white flex items-center justify-center text-sm"
        title="Zoom out"
      >
        −
      </button>

      <div className="w-6 h-px bg-gray-800 my-2" />

      {/* Grid toggle */}
      <button
        onClick={toggleGrid}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-colors ${
          gridEnabled
            ? "bg-gray-800 text-blue-400"
            : "text-gray-500 hover:bg-gray-800"
        }`}
        title="Toggle grid"
      >
        #
      </button>
    </div>
  );
}
