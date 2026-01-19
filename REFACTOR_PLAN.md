# Refactoring Plan: No Frills Weather

This document outlines the steps to refactor the monolithic `App.jsx` into a modular, component-based structure. This will improve readability, maintainability, and testability.

## 1. Directory Structure

We will create a `src` directory (if it doesn't strictly exist as a root for source) and a `components` subdirectory to house our React components.

```text
/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Alerts.jsx
│   │   ├── StatusBar.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── WeatherDetails.jsx
│   │   ├── Radar.jsx
│   │   ├── HourlyForecast.jsx
│   │   ├── PressureGraph.jsx
│   │   ├── DailyForecast.jsx
│   │   ├── RawDataViewer.jsx
│   │   └── LoadingScreen.jsx
│   └── App.jsx  <-- (Moved from root to src/ if we decide to fully standardize, or kept at root but simplified)
```

*Note: For this refactor, we will keep `App.jsx` in the root for now to avoid breaking Vite entry points, but we will move the logic out.*

## 2. Component Breakdown

### A. Shared Logic & Constants
We will extract the `WeatherCodeMap` and helper functions (formatting) to a utility file.
*   **File:** `src/utils/weatherUtils.js`
*   **Contents:** `WeatherCodeMap`, `formatDate`, `formatTime`

### B. UI Components

1.  **Header.jsx**
    *   **Props:** `searchInput`, `setSearchInput`, `handleSubmit`, `handleLocate`, `unit`, `setUnit`, `showRaw`, `setShowRaw`
    *   **Description:** Contains the logo, search bar, locate button, and toggle buttons.

2.  **Alerts.jsx**
    *   **Props:** `alerts`
    *   **Description:** Displays the red severe weather alert banner if alerts exist.

3.  **StatusBar.jsx**
    *   **Props:** `loading`, `error`
    *   **Description:** The yellow status bar showing connection state.

4.  **CurrentWeather.jsx**
    *   **Props:** `weatherData`, `WeatherCodeMap`
    *   **Description:** Large current temperature, location name, coordinates, and weather condition text.

5.  **WeatherDetails.jsx**
    *   **Props:** `weatherData`
    *   **Description:** Grid showing Wind Speed, Humidity, Pressure (Current), and Precipitation.

6.  **Radar.jsx**
    *   **Props:** `geo`, `interactive`, `setInteractive`
    *   **Description:** The iframe displaying the radar.

7.  **HourlyForecast.jsx**
    *   **Props:** `hourlyData`, `formatTime`
    *   **Description:** Horizontal scrollable tape showing 24h temperature and rain probability.

8.  **PressureGraph.jsx**
    *   **Props:** `hourly`, `unit`
    *   **Description:** The SVG graph visualization (currently defined inside App.jsx).

9.  **DailyForecast.jsx**
    *   **Props:** `dailyData`, `WeatherCodeMap`, `formatDate`
    *   **Description:** The 7-day forecast grid.

10. **RawDataViewer.jsx**
    *   **Props:** `data`
    *   **Description:** The JSON dump view for debugging.

11. **LoadingScreen.jsx**
    *   **Props:** None
    *   **Description:** The "Fetching Data" animation.

## 3. Execution Steps

1.  **Create Directories**:
    *   `mkdir -p src/components`
    *   `mkdir -p src/utils`

2.  **Extract Utilities**:
    *   Create `src/utils/weatherUtils.js` and move `WeatherCodeMap`, `formatDate`, and `formatTime` there.

3.  **Extract Components**:
    *   Iteratively create each `.jsx` file in `src/components/`, copy the relevant JSX and logic, and add necessary imports (React, Lucide icons).

4.  **Update App.jsx**:
    *   Import all new components.
    *   Import utilities.
    *   Replace the massive JSX return statement with the clean composition of components.
    *   Keep the core State and API logic (`handleSearchOrLoad`, `useEffect`, etc.) in `App.jsx` for now as the "Container" component.

## 4. Verification

*   Check that the application runs without errors (`npm run dev` or `vite`).
*   Verify all interactive elements (search, units, toggles) still function.
