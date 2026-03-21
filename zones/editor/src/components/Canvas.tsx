import React, { useCallback, useRef } from "react";
import { useEditorStore } from "../store";

export function Canvas(): React.ReactElement {
  const canvasRef = useRef<HTMLDivElement>(null);
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const gridEnabled = useEditorStore((s) => s.gridEnabled);
  const setSelection = useEditorStore((s) => s.setSelection);
  const tool = useEditorStore((s) => s.tool);
  const addElement = useEditorStore((s) => s.addElement);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        setSelection([]);
      }

      if (tool === "rectangle" || tool === "ellipse") {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - panX) / zoom;
        const y = (e.clientY - rect.top - panY) / zoom;

        addElement({
          id: `el-${Date.now()}`,
          type: tool,
          x,
          y,
          width: 100,
          height: 100,
          rotation: 0,
          fill: tool === "rectangle" ? "#3B82F6" : "#8B5CF6",
          stroke: "transparent",
          strokeWidth: 0,
          opacity: 1,
          locked: false,
          visible: true,
        });
      }
    },
    [tool, zoom, panX, panY, setSelection, addElement],
  );

  const handleElementClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelection([id]);
    },
    [setSelection],
  );

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full cursor-crosshair"
      onClick={handleCanvasClick}
      style={{
        backgroundImage: gridEnabled
          ? `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`
          : "none",
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panX}px ${panY}px`,
      }}
    >
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {elements.map((el) =>
          el.visible ? (
            <div
              key={el.id}
              onClick={(e) => handleElementClick(el.id, e)}
              className={`absolute cursor-move ${
                selectedIds.includes(el.id)
                  ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-gray-950"
                  : ""
              }`}
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg)`,
                opacity: el.opacity,
                backgroundColor: el.fill,
                border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : "none",
                borderRadius: el.type === "ellipse" ? "50%" : "4px",
                pointerEvents: el.locked ? "none" : "auto",
              }}
            >
              {el.type === "text" && <span className="p-2 text-sm">{el.label || "Text"}</span>}
            </div>
          ) : null,
        )}
      </div>

      {/* Empty state */}
      {elements.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600">Click to add shapes to the canvas</p>
            <p className="mt-1 text-xs text-gray-700">Select a tool from the toolbar</p>
          </div>
        </div>
      )}
    </div>
  );
}
