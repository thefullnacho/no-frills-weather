# No Frills Weather

**A brutalist, ad-free weather dashboard for people who just want the data.**

![No Frills Weather Preview](https://placehold.co/800x400/000000/ffffff?text=NO+FRILLS+WEATHER+PREVIEW)

## Why?

I was tired of opening weather apps just to be harassed by full-screen ads, tracking pixels, and bloated interfaces. I built **No Frills Weather** to do one thing: show me the weather.

*   **No Ads.**
*   **No Tracking.**
*   **No Nonsense.**

## Features

*   **Global Search:** City name or US Zip Code.
*   **Live Radar:** Interactive weather radar powered by Windy.com.
*   **Severe Alerts:** Direct feed from the National Weather Service (NWS) for US locations.
*   **Data Rich:**
    *   Real-time temperature, humidity, wind, and pressure.
    *   24-hour hourly forecast tape.
    *   7-day daily forecast grid.
    *   Interactive Pressure Graph.
*   **Brutalist Design:** High contrast, mono-spaced font, raw data visibility.

## Tech Stack

*   **Frontend:** React (Vite)
*   **Styling:** Tailwind CSS (custom brutalist configuration)
*   **Icons:** Lucide React
*   **APIs:**
    *   [Open-Meteo](https://open-meteo.com/) (Weather Data)
    *   [Zippopotam.us](https://api.zippopotam.us/) (Zip Code Geocoding)
    *   [Weather.gov](https://api.weather.gov/) (NWS Alerts)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/no-frills-weather.git
    cd no-frills-weather
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    npm run preview
    ```

## License

MIT
