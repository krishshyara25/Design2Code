// src/components/ColorPaletteDisplay.tsx
import React from "react";
import { Copy } from "lucide-react";

const ColorPaletteDisplay = ({ colors, copyable = false }: { colors: string[], copyable?: boolean }) => {
  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {colors.map((color, i) => (
        <div key={i} className="text-center">
          <div
            className="w-12 h-12 rounded-lg mx-auto mb-1 cursor-pointer"
            style={{ backgroundColor: color }}
            title={copyable ? "Click to copy" : ""}
            onClick={copyable ? () => handleCopy(color) : undefined}
          />
          <p className="text-xs font-mono">{color}</p>
        </div>
      ))}
    </div>
  );
};

export default ColorPaletteDisplay;