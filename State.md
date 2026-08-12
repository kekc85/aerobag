# AeroBag Predictor v10.0 - State & Architecture Log

## Project Info
- Name: AeroBag Predictor v10.0 (MySQL Edition)
- Domain: Aviation Load Control & Baggage Weight Forecasting
- Stack: HTML5, CSS3 (HUD Dark/Light Theme), Vanilla JavaScript, PHP Backend (api.php), MySQL DB / JSON Backup (baggage_db.json)

## Key Components & Files
- `index.html`: Main HUD UI layout (Prediction, Preliminary Load Plan, ULD/BULK container tables, History, Admin Auth Modal).
- `app.js`: Client-side state, autocompletion, 30-day calculation algorithms, ULD/BULK distribution, gold-border locks, REST calculation, history persistence.
- `style.css`: Visual styling, aviation HUD theme, golden neon borders, light/dark mode variables.
- `api.php`: Server-side API endpoints for database sync & flight history retrieval.
- `db_config.php`: MySQL database credentials & configuration.
- `baggage_db.json`: Offline fallback dataset.
- `USER_MANUAL.md`: User instruction manual for flight dispatchers.

## Current System State
- Core forecasting engine: ACTIVE (PCS/PAX, Weight/PC, HB/PAX ratios).
- Container loading grid: ACTIVE (ULD 1..12, BULK 1..4, auto REST distribution, manual weight lock with gold glow).
- Admin auth password: `NW2026`.
- Data sources: Excel files (`AVERAGO BAGGEGE WEIGHT TABLE 07_2026.xlsx`, `stats_july.xls`).

## Action Log
- Initialized `State.md` context tracking.
- Rewrote `USER_MANUAL.md` into plain-language dispatcher user guide with detailed analysis settings breakdown (Scope & Data Period).
- Expanded Section 3 of `USER_MANUAL.md` with in-depth breakdown and aviation scenarios for all Scope and Seasonality Period parameters.
- Converted and formatted updated `USER_MANUAL.md` into production `USER_MANUAL.docx` with styles and embedded screenshots.
- Optimized mobile responsiveness in `style.css` (iOS auto-zoom fix for inputs, touch-friendly 40-44px tap targets, table horizontal touch-scroll, header buttons flex-wrap, centered modals).
- Git repository setup initiated for https://github.com/kekc85/aerobag.




