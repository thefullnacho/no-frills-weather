# Feature Specification: Severe Weather Push Alerts

## 1. Context & Problem
**The Problem:** Weather apps often spam users with "Rain starting in 10 minutes" notifications, causing alert fatigue. Users ignore them. However, for *life-threatening* events (Tornadoes, Flash Floods, Hurricanes), users *need* to be interrupted, even if the app is closed.
**The Goal:** Provide high-signal, low-noise push notifications strictly for "Severe" and "Extreme" weather events defined by official meteorological agencies (NWS).

## 2. User Experience (UX)
*   **Onboarding:**
    *   On first visit (or via a "Notifications" toggle), request Browser Notification Permission.
    *   "We only notify you for emergencies. No daily forecasts. No rain alerts."
*   **The Notification:**
    *   **Title:** "TORNADO WARNING" (Event Name).
    *   **Body:** "Immediate threat for [Location]. Take shelter now."
    *   **Action:** Clicking opens the app to the `AlertDetails` view.
*   **Configuration (Future Phase):**
    *   User selects specific alert types (e.g., "Ignore Marine Warnings").
    *   Quiet hours (though generally overridden for "Extreme" events).

## 3. Technical Implementation (The Backend Pivot)

**CRITICAL:** Real push notifications (receiving alerts when the app/tab is closed) *require* a backend server. We cannot do this purely client-side.

### A. Architecture
1.  **Frontend (PWA):**
    *   Register a Service Worker (`sw.js`).
    *   Use the Web Push API to generate a `PushSubscription` (contains an endpoint URL and keys).
    *   Send this subscription + User's Location (Lat/Lon) to our Backend.
2.  **Backend (The "Watcher" Service):**
    *   **Database:** Store `[SubscriptionID, Lat, Lon, LastAlertTimestamp]`.
    *   **Poller:** A cron job (e.g., every 5-10 mins) that:
        1.  Iterates through active subscriptions.
        2.  Checks NWS/OpenMeteo Alerts API for those coordinates.
        3.  Filters for Severity (`Severe`, `Extreme`).
        4.  If a *new* alert is found (ID mismatch with `LastAlertTimestamp`), trigger the Push.
3.  **Push Service:**
    *   Use VAPID keys (Voluntary Application Server Identification) to authenticate with Google/Apple/Mozilla push services.

### B. MVP Scope
*   **Hardcoded Rules:** Only notify for NWS Severity "Severe" or "Extreme".
*   **Single Location:** Notifications track the user's *last saved* location.
*   **Platform:** Web Push (works on Android, Windows, Mac; iOS requires "Add to Home Screen" for PWA push).

## 4. Risks & Challenges
*   **Cost/Scale:** Polling weather APIs for *every* user every 5 minutes scales linearly. 1,000 users = 12,000 API calls/hour.
    *   *Mitigation:* Clustering. Group users by geographic regions (e.g., Zip Code or 10km grid) to reduce API calls.
*   **iOS Support:** iOS Web Push requires the user to "Add to Home Screen" (PWA install). We must guide them.
*   **Latency:** A 10-minute poll interval might be too slow for a Tornado *Warning* (which is immediate).
    *   *Mitigation:* Use NWS streaming/websocket API if available, or poll critical zones more frequently.

## 5. Next Steps
1.  **Decision:** Are we building a backend for this? (Node.js/Express + Redis/Postgres).
2.  **PWA Setup:** Convert the current React app to a PWA (manifest.json, service worker).
3.  **Prototype:** Build a simple "Test Notification" button to verify the VAPID pipeline.
