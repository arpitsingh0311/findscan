"use client";

import { useState } from "react";
import {
  BollingerBandsInputSettings,
  BollingerBandsStyleSettings,
  BandStyle,
} from "../lib/types";

interface Props {
  inputSettings: BollingerBandsInputSettings;
  styleSettings: BollingerBandsStyleSettings;
  onInputChange: (newSettings: BollingerBandsInputSettings) => void;
  onStyleChange: (newSettings: BollingerBandsStyleSettings) => void;
  onClose: () => void;
}

const BollingerSettings = ({
  inputSettings,
  styleSettings,
  onInputChange,
  onStyleChange,
  onClose,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"inputs" | "style">("inputs");

  const handleInputChange = (
    field: keyof BollingerBandsInputSettings,
    value: string
  ) => {
    onInputChange({ ...inputSettings, [field]: parseInt(value, 10) || 0 });
  };

  // CORRECTED: Replaced 'any' with specific types
  const handleBandStyleChange = (
    band: "basis" | "upper" | "lower",
    field: keyof BandStyle,
    value: string | boolean | number
  ) => {
    onStyleChange({
      ...styleSettings,
      [band]: {
        ...styleSettings[band],
        [field]: value,
      },
    });
  };

  // CORRECTED: Replaced 'any' with specific types
  const handleBackgroundChange = (
    field: "visible" | "opacity",
    value: boolean | number
  ) => {
    onStyleChange({
      ...styleSettings,
      background: {
        ...styleSettings.background,
        [field]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-xl w-[450px] border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bollinger Bands</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>

        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("inputs")}
            className={`px-4 py-2 ${
              activeTab === "inputs"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`px-4 py-2 ${
              activeTab === "style"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            Style
          </button>
        </div>

        <div>
          {activeTab === "inputs" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="length">Length</label>
                <input
                  type="number"
                  id="length"
                  value={inputSettings.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="w-24 bg-gray-900 border border-gray-600 rounded p-1 text-center"
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="stdDev">StdDev</label>
                <input
                  type="number"
                  id="stdDev"
                  value={inputSettings.stdDev}
                  onChange={(e) => handleInputChange("stdDev", e.target.value)}
                  className="w-24 bg-gray-900 border border-gray-600 rounded p-1 text-center"
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="offset">Offset</label>
                <input
                  type="number"
                  id="offset"
                  value={inputSettings.offset}
                  onChange={(e) => handleInputChange("offset", e.target.value)}
                  className="w-24 bg-gray-900 border border-gray-600 rounded p-1 text-center"
                />
              </div>
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 items-center gap-2">
                <input
                  type="checkbox"
                  checked={styleSettings.basis.visible}
                  onChange={(e) =>
                    handleBandStyleChange("basis", "visible", e.target.checked)
                  }
                />
                <span>Basis</span>
                <input
                  type="color"
                  value={styleSettings.basis.color}
                  onChange={(e) =>
                    handleBandStyleChange("basis", "color", e.target.value)
                  }
                  className="w-full bg-transparent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <input
                  type="checkbox"
                  checked={styleSettings.upper.visible}
                  onChange={(e) =>
                    handleBandStyleChange("upper", "visible", e.target.checked)
                  }
                />
                <span>Upper</span>
                <input
                  type="color"
                  value={styleSettings.upper.color}
                  onChange={(e) =>
                    handleBandStyleChange("upper", "color", e.target.value)
                  }
                  className="w-full bg-transparent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <input
                  type="checkbox"
                  checked={styleSettings.lower.visible}
                  onChange={(e) =>
                    handleBandStyleChange("lower", "visible", e.target.checked)
                  }
                />
                <span>Lower</span>
                <input
                  type="color"
                  value={styleSettings.lower.color}
                  onChange={(e) =>
                    handleBandStyleChange("lower", "color", e.target.value)
                  }
                  className="w-full bg-transparent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2 border-t border-gray-700 pt-3">
                <input
                  type="checkbox"
                  checked={styleSettings.background.visible}
                  onChange={(e) =>
                    handleBackgroundChange("visible", e.target.checked)
                  }
                />
                <span>Background</span>
                <div className="col-span-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={styleSettings.background.opacity}
                    onChange={(e) =>
                      handleBackgroundChange(
                        "opacity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BollingerSettings;
