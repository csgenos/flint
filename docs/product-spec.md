# Finch — Product Specification

## Vision

Finch is a premium personal finance desktop application that gives individuals a true command center for their financial life. Unlike web-based tools that feel generic and browser-bound, Finch runs natively on macOS, Windows, and Linux via Tauri — fast, private, offline-first, and polished.

The guiding principle is **informed confidence**: users should open Finch and immediately understand where they stand, where they are headed, and what choices will materially change their trajectory.

---

## Target Users

**Primary:** High-income professionals aged 28–45 who are financially engaged — they already track spending and have investment accounts, but rely on spreadsheets or fragmented apps. They want one authoritative view.

**Secondary:** Recent graduates with student loans and early investment portfolios who want to build good habits from the start.

**Not targeting:** Users who need full bank-sync automation on day one (Plaid-style integration is Phase 2). The MVP is for people comfortable manually importing or entering data.

---

## MVP Feature Set (Phase 1)

### Dashboard
- Net worth KPI with 12-month trend chart (area chart)
- Monthly income, spending, and savings rate KPIs
- Cash flow bar chart (income vs expenses, last 6 months)
- Spending breakdown donut chart by category
- Account list with balances
- Recent transactions feed
- Financial health score (composite 0–100 with sub-scores)

### Budget
- Monthly budget by category
- Progress bars showing spent vs budgeted
- Overall budget usage indicator
- Over-budget warnings

### Transactions
- Searchable, filterable transaction table
- Filter by type: all / income / expense
- Category lookup per transaction

### Projections
- 30-year net worth projection based on configurable assumptions
- Investment value trajectory (separate line)
- Key milestone readout: projected net worth at retirement age
- Editable assumptions panel (income growth, expense growth, return rate, inflation)

### Monte Carlo Simulator
- 500-simulation probabilistic outcome engine
- Percentile bands: 10th, 25th, 50th, 75th, 90th
- Success probability metric (% of simulations that reach retirement solvent)
- Visual area chart with shaded bands

### Tax Calculator
- US federal tax engine with 2024 brackets
- Supports all four filing statuses
- Accounts for retirement contributions (401k/IRA) and HSA
- Full breakdown: gross → AGI → taxable income → component taxes
- Effective rate, marginal rate, after-tax income

### Settings
- Currency selector
- Data export placeholder
- About panel

---

## Success Metrics

| Metric | Target |
|---|---|
| App launch to meaningful data on screen | < 2 seconds |
| TypeScript errors at build | 0 |
| Pages with real, non-placeholder functionality | 7 of 8 |
| Build size (gzipped JS) | < 250 KB |
| Financial calculation accuracy | Matches IRS published figures for 2024 |

---

## Design Principles

1. **Density without clutter.** Financial data is inherently dense. Finch uses tight spacing, small typography, and subtle visual hierarchy to present a lot of information without feeling overwhelming.

2. **Numbers are primary.** The visual design defers to data. Charts are restrained — minimal axis noise, monochromatic palettes with semantic color only for positive/negative signals.

3. **Zero chrome.** No modals for simple interactions. No onboarding wizards unless necessary. The app trusts that the user is financially literate.

4. **Local first.** All data lives in the user's localStorage/file system. No accounts, no cloud sync required in Phase 1.

---

## Out of Scope (Phase 1)

- Bank/brokerage account sync (Plaid, MX, Finicity)
- Mobile app
- AI-powered insights
- Multi-currency real-time conversion
- Tax filing integration
- Bill reminders and payment tracking
- Shared/couples finance features
