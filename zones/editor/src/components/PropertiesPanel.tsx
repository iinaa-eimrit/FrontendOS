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
      className="w-64 overflow-y-auto border-l border-gray-800 bg-gray-900 p-4"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Properties
      </h3>

      <div className="space-y-4">
        {/* Type */}
        <div>
          <label className="text-xs text-gray-500">Type</label>
          <p className="text-sm capitalize text-gray-200">{el.type}</p>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="prop-x" className="text-xs text-gray-500">
              X
            </label>
            <input
              id="prop-x"
              type="number"
              value={Math.round(el.x)}
              onChange={(e) => updateElement(el.id, { x: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="prop-y" className="text-xs text-gray-500">
              Y
            </label>
            <input
              id="prop-y"
              type="number"
              value={Math.round(el.y)}
              onChange={(e) => updateElement(el.id, { y: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200"
            />
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="prop-width" className="text-xs text-gray-500">
              Width
            </label>
            <input
              id="prop-width"
              type="number"
              value={Math.round(el.width)}
              onChange={(e) => updateElement(el.id, { width: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="prop-height" className="text-xs text-gray-500">
              Height
            </label>
            <input
              id="prop-height"
              type="number"
              value={Math.round(el.height)}
              onChange={(e) => updateElement(el.id, { height: Number(e.target.value) })}
              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200"
            />
          </div>
        </div>

        {/* Fill */}
        <div>
          <label htmlFor="prop-fill" className="text-xs text-gray-500">
            Fill
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="prop-fill"
              type="color"
              value={el.fill}
              onChange={(e) => updateElement(el.id, { fill: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-gray-700"
            />
            <span className="font-mono text-sm text-gray-300">{el.fill}</span>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label htmlFor="prop-opacity" className="text-xs text-gray-500">
            Opacity
          </label>
          <input
            id="prop-opacity"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={el.opacity}
            onChange={(e) => updateElement(el.id, { opacity: Number(e.target.value) })}
            className="mt-1 w-full"
          />
          <span className="text-xs text-gray-500">{Math.round(el.opacity * 100)}%</span>
        </div>

        {/* Rotation */}
        <div>
          <label htmlFor="prop-rotation" className="text-xs text-gray-500">
            Rotation
          </label>
          <input
            id="prop-rotation"
            type="number"
            value={el.rotation}
            onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })}
            className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-200"
          />
        </div>

        {/* Actions */}
        <div className="border-t border-gray-800 pt-2">
          <button
            onClick={() => removeElement(el.id)}
            className="w-full rounded bg-red-600/10 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-600/20"
          >
            Delete Element
          </button>
        </div>
      </div>
    </motion.div>
  );
}
