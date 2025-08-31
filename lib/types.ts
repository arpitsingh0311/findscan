export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Defines the possible line styles for the indicator bands [cite: 20, 21, 22]
export type LineStyle = "solid" | "dashed";

// A reusable type for the style of a single line (e.g., Upper band, Basis, etc.) [cite: 20, 21, 22]
export interface BandStyle {
  visible: boolean;
  color: string;
  lineWidth: number;
  lineStyle: LineStyle;
}

// Groups all the configurable "Style" settings together [cite: 14]
export interface BollingerBandsStyleSettings {
  basis: BandStyle; // Styles for the middle band [cite: 20]
  upper: BandStyle; // Styles for the upper band [cite: 21]
  lower: BandStyle; // Styles for the lower band [cite: 22]
  background: {
    // Styles for the fill between upper and lower bands [cite: 23]
    visible: boolean;
    opacity: number;
  };
}

// Groups all the configurable "Input" settings together [cite: 11]
export interface BollingerBandsInputSettings {
  length: number; // Default: 20 [cite: 12]
  stdDev: number; // This is the multiplier, default: 2 [cite: 17]
  offset: number; // Default: 0 [cite: 18]
  source: "close"; // Source is fixed to 'close' for this assignment
}
