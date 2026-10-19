# Breakfast Donation Tracker

A single-screen fundraising display that shows live progress toward the breakfast fundraising goal. It is built with [Nuxt 4](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com) and is meant to run full screen on a TV or projector during an event.

## What the app does

- **Shows the running total.** The screen displays the total raised (including pledges), a progress bar toward the goal, and either the amount still to go or "Goal Reached!".
- **Reads donations from a Google Sheet.** Donations are logged in a Google Sheet. The app downloads that sheet as CSV (`fetchDonations` in [app/composables/store.ts](app/composables/store.ts)), using the sheet and tab set by `NUXT_SHEET_ID` and `NUXT_GID` (see [Configuration](#configuration)), and counts only the rows whose `Published` column is `TRUE`, so staff can add rows before they appear on screen.
- **Adds a starting amount.** The total is a fixed base amount raised before the event (`TOTAL_BASE`, currently $730,000) plus the sum of the sheet's `Amount ($)` column. The goal is `GOAL` (currently $800,000).
- **Refreshes automatically.** The sheet is fetched again on an interval (see [Configuration](#configuration)), so new gifts appear without reloading the page.
- **Invites more giving.** A QR code links viewers to the giving page.
- **Staff guide.** Instructions for the person entering donations in the sheet are in [SHEET-GUIDE.md](SHEET-GUIDE.md).
- **Goes full screen.** The "Full Screen" button in the top-right corner puts the display into full-screen mode.

### How the data flows

```
Google Sheet (CSV export)
  → parseDonationsCsv()   parse and keep published rows
  → store.csvObject       shared state in useStore()
  → calcProgress()        total, percent, amount remaining
  → toCurrency()          "$765,000"
  → components            TotalRaised, ComparisonBar
```

## Utilities

The functions in [app/utils/](app/utils/) hold the app's data logic. They are plain TypeScript functions with no Vue code, which keeps them easy to test. Nuxt auto-imports them, so components and composables can call them without an import statement.

### [sheet.ts](app/utils/sheet.ts): turning the sheet into progress numbers

- **`parseDonationsCsv(csvText)`** turns the raw CSV export into an array of rows (typed as `CSVData`, see [types/csv.ts](types/csv.ts)). It uses [PapaParse](https://www.papaparse.com/) and:
  - skips the 3 title lines above the header row in the sheet,
  - trims whitespace from header names,
  - drops blank rows,
  - keeps only rows whose `Published` value is `true` (any capitalization, surrounding spaces ignored). Rows with a missing or other `Published` value are left out.
- **`calcProgress(rows, base, goal)`** returns everything the display needs about progress:
  - `total`: `base` plus the sum of `Amount ($)`. Before the sheet has loaded (`rows` is `undefined`), it is just `base`.
  - `percent`: share of the goal as a string with one decimal place, such as `"95.6%"`. It can go above 100% once the goal is passed.
  - `remaining`: how much is left to reach the goal. It never goes below 0.

### [currency.ts](app/utils/currency.ts): reading and formatting dollar amounts

Amounts are typed into the sheet by hand, so these functions are built to cope with messy input.

- **`parseCurrency(str)`** turns a cell such as `"$1,234.56"` or `" 50 "` into a number. Empty, missing, or unreadable values (such as `"N/A"` or `"1.2.3"`) become `0`, so one bad cell never breaks the total.
- **`sumColumn(rows, column)`** adds up one column across all rows, using `parseCurrency` on each cell.
- **`toCurrency(number)`** formats a number as whole US dollars, such as `$800,000`.

### Tests

[currency.test.ts](app/utils/currency.test.ts) and [sheet.test.ts](app/utils/sheet.test.ts) use [Vitest](https://vitest.dev) to check how the utilities handle real-world sheet data: formatted amounts, blank and short rows, trailing newlines, and the `Published` filter. Run them with:

```bash
pnpm test
```

## Configuration

| Setting | Where | Purpose |
| --- | --- | --- |
| `NUXT_SHEET_ID` | `.env` | ID of the Google Sheet to read: the part after `/spreadsheets/d/` in the sheet's URL. The sheet must be viewable by anyone with the link. |
| `NUXT_GID` | `.env` | Which tab of the sheet to read: the number after `gid=` in the URL when that tab is open. |
| `NUXT_FETCH_INTERVAL` | `.env` | How often to re-fetch the sheet, in milliseconds. Defaults to `60000` (1 minute). |
| `GOAL` | [store.ts](app/composables/store.ts) | The fundraising goal. |
| `TOTAL_BASE` | [store.ts](app/composables/store.ts) | Amount raised before the sheet was started; added to the sheet total. |

A minimal `.env` looks like this:

```bash
NUXT_SHEET_ID=your-google-sheet-id
NUXT_GID=0
NUXT_FETCH_INTERVAL=60000
```

## Development

Install dependencies:

```bash
pnpm install
```

Create a `.env` file in the project root with the settings above, then start the development server at `http://localhost:3000`:

```bash
pnpm dev
```

Run the tests, linter, and type check:

```bash
pnpm test
pnpm lint
pnpm typecheck
```

Build for production and preview the build locally:

```bash
pnpm build
pnpm preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options.
