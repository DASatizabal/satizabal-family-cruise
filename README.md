# Satizabal Family Cruise 2026 — Cabin Selector

A single-page web app for the Satizabal family to browse, compare, and select cabins for a 3-day Bahamas cruise on Norwegian Joy (Nov 20–23, 2026).

## Project Structure

```
index.html                        Main application (HTML + CSS + JS, all-in-one)
cabin_base_price_20260131.csv     Cabin pricing data
family_groups.csv                 Family group definitions and members
connectingRooms.csv               Connecting room pair definitions
cabin_code_map.csv                Cabin code-to-type mapping for connecting rooms
selectionScript.gs                Google Apps Script for cabin selection submissions
```

## Deployment

### 1. Host the Static Site

The app is a single `index.html` file that loads CSV data via `fetch`. It needs to be served over HTTP(S) — opening the file directly (`file://`) will not work due to browser fetch restrictions.

**Option A — GitHub Pages (recommended)**

1. Go to the repository on GitHub: https://github.com/DASatizabal/satizabal-family-cruise
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `main` and folder to `/ (root)`
5. Click **Save**
6. The site will be live at `https://dasatizabal.github.io/satizabal-family-cruise/` within a few minutes

**Option B — Any static host**

Upload all files to any static hosting provider (Netlify, Vercel, Cloudflare Pages, etc.). No build step is required — just serve the files as-is.

### 2. Set Up the Google Sheet

This powers the "Select This Cabin" submission feature.

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like `Cruise Cabin Selections`
3. In **Row 1**, add these column headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Group | Members | Cabin Type | Room Types | Drink Pkg | Dinner Pkg | FAS Plus | Tips | Deposit Type | Total | Deposit | Balance | Per Person |

### 3. Deploy the Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any default code in the editor
3. Copy and paste the entire contents of `selectionScript.gs` into the editor
4. Click the **Save** icon (or Ctrl+S)
5. Click **Deploy** > **New deployment**
6. Click the gear icon next to "Select type" and choose **Web app**
7. Configure:
   - **Description**: `Cabin Selection Handler`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
8. Click **Deploy**
9. If prompted, authorize the script to access Google Sheets and Gmail
10. Copy the **Web app URL** that appears (it looks like `https://script.google.com/macros/s/.../exec`)

### 4. Connect the Script to the Site

1. Open `index.html`
2. Find this line (around line 3412):
   ```js
   const APPS_SCRIPT_URL = ''; // Paste your deployed Google Apps Script URL here
   ```
3. Paste your deployment URL between the quotes:
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
4. Commit and push the change

### 5. Verify

1. Open the site and select a travel group
2. Click **Select This Cabin** on any cabin card
3. Review the confirmation modal and click **Confirm Selection**
4. Check that:
   - A new row appears in the Google Sheet
   - An email is received at dasatizabal@gmail.com
   - A confirmation toast appears on the site

## Updating Cabin Prices

To update pricing data, replace `cabin_base_price_20260131.csv` with a new CSV file and update the filename reference in `index.html` (search for `CSVParser.load`).

## Updating Family Groups

Edit `family_groups.csv` to add, remove, or modify family groups and their members.
