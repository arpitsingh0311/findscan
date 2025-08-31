# FindScan - Bollinger Bands Chart Indicator
This project is a production-ready Bollinger Bands indicator built for the FindScan Frontend Intern Assignment. The application is developed using Next.js, React, TypeScript, and TailwindCSS, with all charting functionality rendered exclusively via the KLineCharts library.

## 🔗 **Live Demo**: [https://findscan-988r.vercel.app/](https://findscan-988r.vercel.app/)

The indicator is fully interactive, allowing real-time updates to its input parameters and style settings, closely replicating the user experience of professional charting platforms like TradingView.

## Features
- Dynamic Candlestick Chart: Renders over 200 data points of OHLCV data.

- Bollinger Bands Indicator: Overlays the BB indicator on the main chart.

- Real-time Settings Panel: A two-tab modal for instant updates with no page refresh.

Inputs Tab: Configure Length, StdDev (multiplier), and Offset.

Style Tab: Control visibility, color, line width, and line style for the Basis, Upper, and Lower bands.

- Customizable Background Fill: Toggle visibility and adjust the opacity of the area between the upper and lower bands.

- Crosshair Tooltip: Displays the specific values for Basis, Upper, and Lower bands for the hovered candle.

## Tech Stack
- Framework: Next.js 14+

- Library: React 18+

- Language: TypeScript

- Styling: TailwindCSS

- Charting: KLineCharts

## Setup and Run Instructions
To run this project locally, follow these steps:

### 1.)Clone the repository:

git clone [https://github.com/your-username/findscan-bollinger-bands.git](https://github.com/your-username/findscan-bollinger-bands.git)
cd findscan-bollinger-bands

### 2.) Install dependencies:

npm install

### 3.) Run the development server:

npm run dev

### 4.) Open the application:
Open http://localhost:3000 in your browser.

## Technical Notes
### Formulas and Standard Deviation
The indicator's calculations adhere to the standard financial formulas for Bollinger Bands.

For the volatility calculation, this project uses Sample Standard Deviation (with n-1 in the denominator), which is a common and appropriate choice for analyzing a sample of market data.

### KLineCharts Version
klinecharts: 9.8.3 (Please verify this version from your package.json file)

## Screenshots
Main chart view with the Bollinger Bands indicator applied.

<img width="1909" height="813" alt="image" src="https://github.com/user-attachments/assets/aed52039-9c2b-4e2d-a20e-d63e949765cc" />

Indicator settings panel allowing real-time customization of inputs and styles.

<img width="612" height="461" alt="image" src="https://github.com/user-attachments/assets/91e1a400-2329-41b2-851d-3a1b0b673d94" />
