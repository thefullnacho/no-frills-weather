# Feature Specification: Winter Storm & UX Enhancements

## 1. Context
With an incoming winter storm, the user has identified critical gaps in the "No Frills" experience. The app currently displays static data that becomes stale (past hours) and lacks specific winter-hazard details (snow vs. rain, power risks).

## 2. Feature 1: Rolling Hourly Forecast
**Problem:** The hourly view currently displays the first 24 hours received from the API (starting at 00:00 or the request time). As the day progresses, users see "past" hours (e.g., seeing 8 AM when it is 8 PM) and must scroll to find the current time.
**Goal:** The hourly forecast should be "live" and relative to the current wall-clock time.
**Requirements:**
1.  **Filter Past Hours:** On render, filter the `hourly` data arrays to exclude any timestamp older than the current hour.
2.  **Dynamic Window:** Always display the *next* 24 hours available from the filtered list.
3.  **Auto-Update:** If the user leaves the app open, the view should ideally refresh (or at least re-filter) as the hour changes.
**Technical Details:**
*   Current logic: `hourlyData.time.slice(0, 24)`
*   New logic: 
    *   `const currentHour = new Date().toISOString()`
    *   Find index `i` where `hourlyData.time[i]` >= `currentHour`.
    *   Slice `i` to `i + 24`.

## 3. Feature 2: Snow Accumulation Distinction
**Problem:** "Precipitation" is generic. In winter, knowing if 0.5" is rain (wet) or snow (accumulation) is vital. Open-Meteo provides specific snowfall data.
**Goal:** Explicitly show Snow Accumulation when strictly relevant.
**Requirements:**
1.  **Data Fetching:** Update `buildWeatherUrl` in `App.jsx` to request `snowfall` (hourly) and `snowfall_sum` (daily).
2.  **Display Logic:**
    *   If `snowfall > 0` (or a small threshold like 0.01"), display "Snow: X in" explicitly.
    *   This applies to both **HourlyForecast** (e.g., a white bar or text indicating snow) and **DailyForecast** (Total daily accumulation).
3.  **Visuals:** Distinct visual cue (e.g., snowflake icon or white color theme) for snow data vs. generic blue rain data.

## 4. Feature 3: Power Outage Risk Alerts
**Problem:** Users need to be warned about potential power loss, which is a specific derivative risk of high wind/ice.
**Goal:** Highlight "Power Outage" risks within the Alert system.
**Scope (No Frills Approach):** We will not integrate a third-party utility API (too complex/costly). We will extract this signal from existing NWS data.
**Requirements:**
1.  **Keyword Scanning:** Analyze the `description`, `headline`, and `instruction` fields of incoming NWS alerts.
2.  **Triggers:** Look for regex matches: `/(power|electric).*(outage|failure|loss)/i` or specific event types like "Ice Storm Warning".
3.  **UI:**
    *   If a match is found, add a specific **"⚡ POWER OUTAGE RISK"** badge to the Alert card.
    *   Potentially pin this risk to the top of the `Alerts` component.

## 5. Implementation Plan
1.  **Refactor `App.jsx`**: Update API URL to include snowfall parameters.
2.  **Refactor `HourlyForecast.jsx`**: Implement the time-filtering logic and add Snowfall data row/indicator.
3.  **Refactor `DailyForecast.jsx`**: Add `snowfall_sum` display.
4.  **Refactor `Alerts.jsx` / `weatherUtils.js`**: Add the keyword scanner and badge logic.
