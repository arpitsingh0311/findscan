import { OHLCV, BollingerBandsInputSettings } from "../types";

export interface BollingerBandPoint {
  basis?: number;
  upper?: number;
  lower?: number;
}

/**
 * Computes Bollinger Bands from OHLCV data.
 * @param data - Array of OHLCV candle data.
 * @param settings - The user-configurable input settings for the indicator.
 * @returns An array of calculated Bollinger Band points.
 */
export const computeBollingerBands = (
  data: OHLCV[],
  settings: BollingerBandsInputSettings
): BollingerBandPoint[] => {
  // Destructure settings for easier access
  const { length, stdDev: stdDevMultiplier, source, offset } = settings;

  const sourceData = data.map((d) => d[source]);
  const results: BollingerBandPoint[] = [];

  for (let i = 0; i < sourceData.length; i++) {
    if (i < length - 1) {
      results.push({}); 
      continue;
    }

    // Get the window of data we need for the calculation (e.g., the last 20 prices)
    const slice = sourceData.slice(i - length + 1, i + 1);

    // 1. Calculate Basis (Simple Moving Average)
    const sum = slice.reduce((acc, val) => acc + val, 0);
    const basis = sum / length;

    // 2. Calculate Sample Standard Deviation
    const sumOfSquaredDiffs = slice.reduce((acc, val) => {
      return acc + Math.pow(val - basis, 2);
    }, 0);
    // Then, calculate the standard deviation
    const stdDev = Math.sqrt(sumOfSquaredDiffs / (length - 1)); 
    // 3. Calculate Upper and Lower Bands
    const upper = basis + stdDevMultiplier * stdDev;
    const lower = basis - stdDevMultiplier * stdDev;

    results.push({ basis, upper, lower });
  }

  // 4. Apply the Offset after all calculations are done
  if (offset === 0) {
    return results;
  }

  const emptyPoints = Array(Math.abs(offset)).fill({});
  if (offset > 0) {
    return [...emptyPoints, ...results.slice(0, -offset)];
  } else {
    return [...results.slice(Math.abs(offset)), ...emptyPoints];
  }
};
