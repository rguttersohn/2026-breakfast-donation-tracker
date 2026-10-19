# Guide to Updating the Donation Sheet

This guide is for the person entering donations into the Google Sheet during the event. You don't need any technical knowledge. Just follow the rules below for two columns: **Amount ($)** and **Published**.

## How the sheet and the big screen work together

- The big screen shows the total raised. That total is the money raised before the event plus every row in the sheet that is marked **Published**.
- The screen checks the sheet about once a minute. A new or changed row shows up on screen within a minute or two. You never need to refresh the screen. Google Sheets saves automatically, so after publishing a row there is no need to press save.
- Only two columns change what the screen shows: **Amount ($)** and **Published**. The other columns (donor, date, notes, and so on) are for your records.

## The Amount ($) column

### Do

Type the gift as a plain dollar amount:

| You type | Screen counts |
| --- | --- |
| `100` | $100 |
| `1250` | $1,250 |
| `1250.50` | $1,250.50 |
| `$1,250.50` | $1,250.50 (a dollar sign and commas are fine) |

If the value in the **Amount ($)** column cannot be read as a number, the screen counts it as $0.

- **One amount per cell.** Put anything else (for example "pledge, paying in March") in the **Notes** column.
- **To take money off the total**: update the value in the **Amount ($)** column. For a full refund, delete the row, or turn off Published: uncheck the box, or if you type it instead, change `TRUE` to `FALSE`.
- The screen adds up cents but shows the total rounded to whole dollars.

### Don't

The screen keeps the digits in a cell and ignores the letters and most symbols. That causes surprising results:

| You type | Screen counts | Type this instead |
| --- | --- | --- |
| `100k` | **$100** | `100000` |
| `$50 x 2` | **$502** | `100` |
| `2 gifts of $50` | **$250** | `100` (or one row per gift) |
| `$500–$1,000` (a range) | **$5,001,000** or $0 | One amount only |
| `(100)` to mean minus 100 | **plus $100** | `-100` |
| `1.000,50` (European style) | **about $1** | `1000.50` |
| `TBD`, `N/A`, or blank | $0 | Fine to use until you know the amount |

**Avoid the "Accounting" number format** (Format → Number → Accounting). It shows minus amounts in parentheses, and the screen counts those as plus amounts. Plain numbers or the "Currency" format are fine.

## The Published column

**Published means "show this gift on the big screen."** A row only counts toward the total when it is marked as published.

### Use a checkbox (recommended)

The simplest way is to make the Published column a checkbox: select the cells, then choose **Insert → Checkbox**.

- **Checked:** the gift is on screen.
- **Unchecked:** the gift is not on screen.

### If you type it instead

Type `TRUE`. Capitals don't matter (`true` and `True` work too).

Anything else means **not on screen**, including `Yes`, `Y`, `X`, `1`, `FALSE`, or leaving the cell blank.

### Ways to use it

- **Enter a gift early and reveal it later.** Fill in the row with Published turned off (box unchecked, or `FALSE`), then turn it on (check the box, or type `TRUE`) at the right moment (for example, right after an announcement).
- **Take a gift off the screen without losing it.** Turn off Published: uncheck the box, or change `TRUE` to `FALSE`. The row stays in the sheet for your records.

## Keep the layout as it is

- Don't rename the column headings, especially **Amount ($)** and **Published**.
- Don't add or remove the title lines above the heading row.
- Adding rows below the headings, editing them, and deleting them are all fine. A deleted row comes off the total.

## Quick checklist for each new row

1. The amount is a single plain number, such as `250` or `$250`.
2. Published is checked (or says `TRUE`) when you want the gift on screen.

## If the total looks wrong

1. Wait a minute or two. The screen may not have checked the sheet yet.
2. Look at the newest rows' **Amount ($)** cells for letters, ranges, parentheses, or more than one number.
3. Check that **Published** is turned on (checked, or `TRUE`) for the gifts you expect to see, and turned off for the ones you don't.
4. If it still looks wrong, contact the person who manages the display app.
