# Finch Development Roadmap

## Phase 1 — MVP Scaffold (Current)

**Goal:** A complete, buildable, visually polished application with real financial logic and realistic sample data. No external service dependencies.

### Deliverables
- [x] Tauri + React 18 + TypeScript + Vite project structure
- [x] Tailwind CSS with custom design system tokens
- [x] AppShell with collapsible sidebar navigation
- [x] Dashboard: KPI cards, net worth chart, cash flow chart, spending pie
- [x] Financial health score (composite 0–100)
- [x] Budget page: category progress bars, overall usage
- [x] Transactions page: searchable/filterable table
- [x] Projections page: 30-year deterministic trajectory
- [x] Monte Carlo simulator: 500 simulations, percentile bands
- [x] Tax calculator: 2024 US federal brackets, all filing statuses, FICA
- [x] Scenarios page: placeholder (Phase 2)
- [x] Settings page: currency selector
- [x] Zustand stores with localStorage persistence
- [x] Sample data: 6 accounts, 15 transactions, 8 category budgets
- [x] TypeScript: zero errors
- [x] Build: passes `tsc && vite build`

---

## Phase 2 — Data Integrations (Q3 2025)

**Goal:** Real financial data flows into the app automatically. Users no longer manually enter transactions.

### Planned Features

#### Account Sync
- Plaid Link integration for US bank and brokerage accounts
- OAuth-based connection flow within Tauri WebView
- Incremental transaction sync with deduplication
- Institution logo and color mapping

#### CSV Import
- Import transactions from bank/credit card exports
- Column mapping UI (date, amount, description, type)
- Category auto-suggestion based on description matching
- Duplicate detection

#### Brokerage Data
- Investment account positions (ticker, quantity, cost basis)
- Daily price updates via public APIs (Yahoo Finance fallback)
- Portfolio performance: total return, time-weighted return
- Asset allocation breakdown (stocks/bonds/cash/alternatives)

#### Manual Accounts
- Property values (Zillow estimate or manual)
- Vehicle values (KBB estimate or manual)
- Crypto holdings (CoinGecko prices)

### Technical Work
- Rust backend commands for encrypted credential storage (OS keychain via Tauri)
- SQLite database for transaction history (replacing in-memory store)
- Background sync with configurable frequency
- Conflict resolution strategy for manual vs synced data

---

## Phase 3 — Intelligence Layer (Q1 2026)

**Goal:** Finch proactively surfaces insights and recommendations rather than waiting to be asked.

### Planned Features

#### Smart Insights Feed
- Spending anomalies (e.g., "Your food spend is 40% above your 3-month average")
- Recurring charge detection (new subscriptions, price increases)
- Seasonal pattern recognition
- Net worth milestone alerts

#### AI-Powered Categorization
- Local ML model for transaction categorization (ONNX runtime via Tauri)
- User feedback loop to improve accuracy
- Merchant database with canonical names

#### Tax Optimization
- Year-round tax-loss harvesting opportunities
- Roth conversion window analysis
- HSA contribution optimization
- W-4 withholding calculator with refund/owe projection

#### Scenario Sandbox (Full)
- Create named scenarios with custom assumptions
- Side-by-side comparison chart
- One-time events (home purchase, job change, inheritance)
- "What if I retire at 55?" instant recalculation
- Save and export scenarios as PDF

#### Goal Tracking
- Define goals: house down payment, emergency fund, retirement target
- Progress tracking with projected completion date
- Savings rate recommendations to hit goals on time

---

## Phase 4 — Cross-Platform Expansion (2026)

**Goal:** Finch reaches users on mobile and enables optional cloud sync for multi-device access.

### Planned Features

#### iOS / Android App
- React Native port sharing business logic
- Biometric authentication
- Widget for net worth and daily spend
- Push notifications for budget alerts

#### Finch Cloud (Optional)
- End-to-end encrypted sync across devices
- Zero-knowledge architecture (server never sees plaintext data)
- Encrypted backup to user's own S3 bucket or iCloud
- Subscription model: $6/month or $48/year

#### Collaboration
- Partner/spouse view with separate accounts or shared view
- Permission levels: view-only vs edit
- Shared goals and joint net worth tracking

#### Developer API
- Local REST API for power users (port 4242, opt-in)
- Zapier/Make integration for custom automations
- CSV/JSON export endpoints

---

## Guiding Engineering Principles

1. **Privacy first.** Every feature that touches data must have a clear answer to "where does this data go?" The default answer is: nowhere but the user's device.

2. **Performance budget.** The app must remain < 3s to first meaningful paint on a 5-year-old laptop. No feature ships that regresses this.

3. **Type safety always.** Zero TypeScript `any` in business logic. The compiler is the first line of defense against financial calculation bugs.

4. **Test financial math.** Tax calculations, Monte Carlo, and projection logic have unit tests. A bug in a compound interest formula is a product defect, not just a code defect.

5. **Incremental adoption.** Each phase ships independently usable value. Users on Phase 1 never feel penalized for not using Phase 2 features.
