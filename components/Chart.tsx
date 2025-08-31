"use client";

import {
  init,
  utils,
  LineType,
  KLineChart,
  type Indicator,
} from "klinecharts";
import { useEffect, useRef, useState } from "react";
import {
  OHLCV,
  BollingerBandsInputSettings,
  BollingerBandsStyleSettings,
} from "../lib/types";
import { computeBollingerBands } from "../lib/indicators/bollinger";
import BollingerSettings from "./BollingerSettings";

const Chart = () => {
  const chartRef = useRef<KLineChart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [bbInputs, setBbInputs] = useState<BollingerBandsInputSettings>({
    length: 20,
    stdDev: 2,
    offset: 0,
    source: "close",
  });
  const [bbStyles, setBbStyles] = useState<BollingerBandsStyleSettings>({
    basis: {
      visible: true,
      color: "#FFD700",
      lineWidth: 1,
      lineStyle: "solid",
    },
    upper: {
      visible: true,
      color: "#2962FF",
      lineWidth: 1,
      lineStyle: "solid",
    },
    lower: {
      visible: true,
      color: "#2962FF",
      lineWidth: 1,
      lineStyle: "solid",
    },
    background: { visible: true, opacity: 0.1 },
  });

useEffect(() => {
  if (containerRef.current && !chartRef.current) {
    const chart = init(containerRef.current, { styles: "dark" });
    chartRef.current = chart;
    chart?.createIndicator("VOL");

    fetch("/data/ohlcv.json")
      .then((res) => res.json())

      .then((data: OHLCV[]) => {
        const klineData = data.map((item) => ({
          timestamp: item.timestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        }));

        chart?.applyNewData(klineData);
      });

    return () => {
      chart;
    };
  }
}, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || chart.getDataList().length === 0) return;

    const data = chart.getDataList() as OHLCV[];
    const indicatorData = computeBollingerBands(data, bbInputs);

    const bbIndicator: Indicator = {
      name: "BB",
      shortName: `BB(${bbInputs.length}, ${bbInputs.stdDev})`,
      figures: [
        { key: "upper", title: "Upper: ", type: "line" },
        { key: "basis", title: "Basis: ", type: "line" },
        { key: "lower", title: "Lower: ", type: "line" },
      ],
      calc: () => indicatorData,
      styles: {
        lines: [
          {
            key: "upper",
            color: bbStyles.upper.color,
            lineWidth: bbStyles.upper.lineWidth,
            display: bbStyles.upper.visible,
            lineStyle:
              bbStyles.upper.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
          },
          {
            key: "basis",
            color: bbStyles.basis.color,
            lineWidth: bbStyles.basis.lineWidth,
            display: bbStyles.basis.visible,
            lineStyle:
              bbStyles.basis.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
          },
          {
            key: "lower",
            color: bbStyles.lower.color,
            lineWidth: bbStyles.lower.lineWidth,
            display: bbStyles.lower.visible,
            lineStyle:
              bbStyles.lower.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
          },
        ],
        areas: [
          {
            key: "upper_lower_area",
            color: bbStyles.upper.color,
            opacity: bbStyles.background.opacity,
            display: bbStyles.background.visible,
          },
        ],
      },
    };

    chart.createIndicator(bbIndicator, false, { id: "bb_indicator" });
  }, [bbInputs, bbStyles]);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <h1 className="text-xl font-bold text-white mr-4">
          Bollinger Bands Chart
        </h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Indicator Settings
        </button>
      </div>

      {isSettingsOpen && (
        <BollingerSettings
          inputSettings={bbInputs}
          styleSettings={bbStyles}
          onInputChange={setBbInputs}
          onStyleChange={setBbStyles}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <div ref={containerRef} className="h-[600px] w-full" />
    </div>
  );
};

export default Chart;
