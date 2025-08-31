"use client";

// FINAL FIX: We import `init` and derive the KLineChart type from it.
import { init, LineType, IndicatorSeries, type Indicator } from "klinecharts";
// This is how we get the type for the chart instance
type KLineChart = ReturnType<typeof init>;

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

  // This effect initializes the chart and runs only once.
  useEffect(() => {
    if (containerRef.current && !chartRef.current) {
      const chart = init(containerRef.current, { styles: "dark" });
      chartRef.current = chart;
      // Use optional chaining here
      chart?.createIndicator("VOL");

      fetch("/data/ohlcv.json")
        .then((res) => res.json())
        .then((data: OHLCV[]) => {
          // Map OHLCV[] to KLineData[]
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

      // The cleanup function must call `dispose()` to prevent duplicate charts.
      return () => {
        chart;
      };
    }
  }, []);

  // This effect updates the indicator whenever its settings change.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || chart.getDataList().length === 0) return;

    const data = chart.getDataList() as OHLCV[];
    const indicatorData = computeBollingerBands(data, bbInputs);

    // Dynamically build the figures and styles arrays based on visibility.
    const figures = [];
    const lines = [];

    if (bbStyles.upper.visible) {
      figures.push({ key: "upper", title: "Upper: ", type: "line" });
      lines.push({
        color: bbStyles.upper.color,
        size: bbStyles.upper.lineWidth,
        style:
          bbStyles.upper.lineStyle === "dashed"
            ? LineType.Dashed
            : LineType.Solid,
      });
    }
    if (bbStyles.basis.visible) {
      figures.push({ key: "basis", title: "Basis: ", type: "line" });
      lines.push({
        color: bbStyles.basis.color,
        size: bbStyles.basis.lineWidth,
        style:
          bbStyles.basis.lineStyle === "dashed"
            ? LineType.Dashed
            : LineType.Solid,
      });
    }
    if (bbStyles.lower.visible) {
      figures.push({ key: "lower", title: "Lower: ", type: "line" });
      lines.push({
        color: bbStyles.lower.color,
        size: bbStyles.lower.lineWidth,
        style:
          bbStyles.lower.lineStyle === "dashed"
            ? LineType.Dashed
            : LineType.Solid,
      });
    }

    // CORRECTED LOGIC: Conditionally create the areas array.
    const areas = [];
    if (
      bbStyles.background.visible &&
      bbStyles.upper.visible &&
      bbStyles.lower.visible
    ) {
      areas.push({
        key: "upper_lower_area",
        color: bbStyles.upper.color,
        opacity: bbStyles.background.opacity,
      });
    }

    const bbIndicator: Indicator = {
      name: "BB",
      shortName: `BB(${bbInputs.length}, ${bbInputs.stdDev})`,
      figures: figures,
      calc: () => indicatorData,
      styles: {
        lines: lines,
        areas: areas, // Use the dynamically created areas array
      },
      id: "",
      paneId: "",
      precision: 0,
      calcParams: [],
      shouldOhlc: false,
      shouldFormatBigNumber: false,
      visible: false,
      zLevel: 0,
      extendData: undefined,
      series: IndicatorSeries.Normal,
      minValue: null,
      maxValue: null,
      shouldUpdate: null,
      regenerateFigures: null,
      createTooltipDataSource: null,
      draw: null,
      onDataStateChange: null,
      onClick: null,
      result: []
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
