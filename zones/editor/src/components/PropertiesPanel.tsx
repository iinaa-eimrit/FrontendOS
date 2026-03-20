import React from "react";
import { motion } from "framer-motion";
import { useEditorStore } from "../store";

export function PropertiesPanel(): React.ReactElement {
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const removeElement = useEditorStore((s) => s.removeElement);

  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length === 0) return <></>;
  const el = selected[0]!;

  return (
    <motion.div
      className="w-64 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Properties
      </h3>

      <div className="space-y-4">
        {/* Type */}
        <div>
          <label className="text-xs text-gray-500">Type</label>
          <p className="text-sm text-gray-200 capitalize">{el.type}</p>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="prop-x" className="text-xs text-gray-500">X</label>
            <input
              id="prop-x"
              type="number"
              value={Math.round(el.x)}
              onChange={(e) =>
                updateElement(el.id, { x: Number(e.target.value) })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="prop-y" className="text-xs text-gray-500">Y</label>
            <input
              id="prop-y"
              type="number"
              value={Math.round(el.y)}
              onChange={(e) =>
                updateElement(el.id, { y: Number(e.target.value) })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
            />
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="prop-width" className="text-xs text-gray-500">Width</label>
            <input
              id="prop-width"
              type="number"
              value={Math.round(el.width)}
              onChange={(e) =>
                updateElement(el.id, { width: Number(e.target.value) })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="prop-height" className="text-xs text-gray-500">Height</label>
            <input
              id="prop-height"
              type="number"
              value={Math.round(el.height)}
              onChange={(e) =>
                updateElement(el.id, { height: Number(e.target.value) })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
            />
          </div>
        </div>

        {/* Fill */}
        <div>
          <label htmlFor="prop-fill" className="text-xs text-gray-500">Fill</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="prop-fill"
              type="color"
              value={el.fill}
              onChange={(e) =>
                updateElement(el.id, { fill: e.target.value })
              }
              className="w-8 h-8 rounded border border-gray-700 cursor-pointer"
            />
            <span className="text-sm text-gray-300 font-mono">{el.fill}</span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label htmlFor="prop-opacity" className="text-xs text-gray-500">Opacity</label>
          <input
            id="prop-opacity"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={el.opacity}
            onChange={(e) =>
              updateElement(el.id, { opacity: Number(e.target.value) })
            }
            className="w-full mt-1"
          />
          <span className="text-xs text-gray-500">{Math.round(el.opacity * 100)}%</span>
        </div>

        {/* Rotation */}
        <div>
          <label htmlFor="prop-rotation" className="text-xs text-gray-500">Rotation</label>
          <input
            id="prop-rotation"
            type="number"
            value={el.rotation}
            onChange={(e) =>
              updateElement(el.id, { rotation: Number(e.target.value) })
            }
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-gray-800">
          <button
            onClick={() => removeElement(el.id)}
            className="w-full px-3 py-1.5 text-sm bg-red-600/10 text-red-400 rounded hover:bg-red-600/20 transition-colors"
          >
            Delete Element
          </button>
        </div>
      </div>
    </motion.div>
  );
}
