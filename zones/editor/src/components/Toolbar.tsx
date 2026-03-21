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
    <div className="flex w-12 flex-col items-center gap-1 border-r border-gray-800 bg-gray-900 py-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setTool(tool.id)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs transition-colors ${
            currentTool === tool.id
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.shortcut}
        </button>
      ))}

      <div className="my-2 h-px w-6 bg-gray-800" />

      {/* Zoom controls */}
      <button
        onClick={() => setZoom(zoom + 0.25)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
        title="Zoom in"
      >
        +
      </button>
      <span className="text-[10px] text-gray-500">{Math.round(zoom * 100)}%</span>
      <button
        onClick={() => setZoom(zoom - 0.25)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
        title="Zoom out"
      >
        −
      </button>

      <div className="my-2 h-px w-6 bg-gray-800" />

      {/* Grid toggle */}
      <button
        onClick={toggleGrid}
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs transition-colors ${
          gridEnabled ? "bg-gray-800 text-blue-400" : "text-gray-500 hover:bg-gray-800"
        }`}
        title="Toggle grid"
      >
        #
      </button>
    </div>
  );
}
