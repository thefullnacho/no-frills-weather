# Feature Specification: Generative AI Weather Narratives

## 1. Context & Problem
**The Problem:** Users lack "meteorological context." They see raw numbers (Temp: 40°F -> 30°F) but miss the *narrative* (e.g., "A cold front is passing").
**The Goal:** Restore the "Weatherman" experience by using an LLM to generate natural language summaries of the weather situation based on raw data.

## 2. User Experience (UX)
*   **Location:** A new section, likely near the top (below Current Weather or Alerts), titled "Meteorologist's Summary" or "Forecast Insight."
*   **Content:** A concise paragraph (2-3 sentences) explaining:
    *   Current dominant condition (High pressure, Low pressure system, etc. - inferred from data).
    *   Upcoming significant changes (Temperature drops, precipitation start/stop).
    *   Wind shifts or pressure changes if relevant.
*   **Tone:** Professional, informative, accessible (like a TV meteorologist).
*   **Interaction:**
    *   Auto-generated on data load (with a "Generate Summary" button if we want to save tokens).
    *   Loading skeleton while fetching.

## 3. Technical Implementation

### A. Data Ingestion (The "Context Window")
The LLM needs the following data points to generate an accurate summary. We should format this as a JSON object in the system prompt.
1.  **Current Conditions:** Temp, Wind Speed/Dir, Pressure, Condition Code.
2.  **Immediate Forecast (Next 6-12 hours):** Hourly trend for temp and precip.
3.  **Daily Forecast (Next 2-3 days):** High/Low temps to identify trends (warming/cooling).
4.  **Alerts:** Any active NWS alerts.

### B. Prompt Engineering Strategy
**System Prompt:**
> "You are an expert meteorologist. Interpret the provided weather data for [Location]. Write a brief, human-friendly summary (max 3 sentences). Focus on the 'why'—mention fronts, pressure systems, or diurnal patterns if evident. Do not just list the numbers. Explain the trend."

### C. Architecture Options
*   **Option 1: Client-Side (User Key)** - *Recommended for "No Frills" MVP*
    *   User enters their own OpenAI/Gemini API Key in a generic "Settings" modal.
    *   App calls API directly from browser.
    *   Pros: No backend cost, privacy. Cons: User friction.
*   **Option 2: Proxy Backend**
    *   We host a serverless function.
    *   Pros: Seamless UX. Cons: Costs money, requires maintenance.

### D. New Components
1.  `WeatherSummary.jsx`: The display component.
2.  `SettingsModal.jsx` (if not existing): To input API keys.
3.  `useWeatherSummary` hook: To handle the API call, loading state, and caching (localStorage to prevent re-fetching on reload).

## 4. Risks & Mitigations
*   **Hallucination:** Model might invent a "hurricane" if data is weird.
    *   *Mitigation:* Prompt constraints ("Stick strictly to provided data"). Low temperature (0.2).
*   **Latency:** LLMs are slower than weather APIs.
    *   *Mitigation:* Load weather first, stream summary in later.
*   **Cost:** API calls cost money.
    *   *Mitigation:* Cache summary for 1-3 hours.

## 5. Next Steps
1.  Confirm Architecture (Client-side vs Backend).
2.  Design `SettingsModal` for API Key management.
3.  Implement `WeatherSummary` component.
