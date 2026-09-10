# 🏆 Pulari Arts & Sports Club - Income & Expense Admin Dashboard

A financial management web application built for **Pulari Arts & Sports Club** with real-time **Google Sheets as a Database** integration.

---

## 🚀 Key Features

- 📊 **Real-time Admin Dashboard**: Instant overview of **Total Income**, **Total Expenses**, **Net Available Balance**, and **Month-to-Date Cashflow**.
- 📈 **Interactive Visual Analytics**:
  - **Cashflow Bar Chart**: Track Monthly Inflow vs Outflow over 6 or 12 months.
  - **Expense Categories Doughnut Chart**: Visually see where club funds are spent (Equipment, Ground Maintenance, Tournaments, Utilities, etc.).
- 💰 **One-Click Transactions**:
  - **+ Add Income Modal**: Record monthly membership fees, donations, tournament fees, and sponsorships with payment modes (UPI, Cash, Bank Transfer, Cheque).
  - **- Add Expense Modal**: Record maintenance, equipment, food/refreshments, prizes, and utility bills.
- 📋 **Filterable & Searchable Ledger**: Instant search by payer, title, or reference ID; filter by type or category, and sort by date or amount.
- 📄 **PDF Invoice Attachment & Google Drive Storage**:
  - Attach PDF invoices, bills, or receipt photos when adding any Income or Expense.
  - Automatically uploads files to a dedicated folder (**"Pulari Club Invoices"**) inside your Google Drive.
  - Generates direct view links saved in your Google Sheet and displays clickable **📄 View Invoice** buttons directly in the dashboard ledger.
- 📄 **Data Export**: 1-click **Export to Excel (.xlsx)** and **Formatted PDF Statement**.
- 🌙 **Modern Glassmorphism Design**: Rich dark/light mode toggle, responsive layout for desktop, tablet, and mobile.
- ☁️ **Google Sheets & Drive Database Backend**: Complete two-way sync powered by Google Apps Script without needing external paid servers.

---

## 📋 2-Minute Google Sheet Setup Guide

### Step 1: Create your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name the sheet **"Pulari Club Finances"**.

### Step 2: Add Apps Script Code
1. In the Google Sheets top menu, click on **Extensions** > **Apps Script**.
2. Remove any code in the editor (`Code.gs`) and paste the entire contents of [`google_apps_script.js`](./google_apps_script.js).
3. Click the **Save** (disk icon) at the top.

### Step 3: Deploy as Web App
1. In the top right corner, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill in the deployment details:
   - **Description**: `Pulari Club Finance API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: allows the dashboard web app to post transactions)*
4. Click **Deploy**.
5. Grant permissions if prompted (Click *Advanced* > *Go to Pulari Club Finance API (unsafe)* > *Allow*).
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`).

### Step 4: Connect to Dashboard
1. Open the dashboard web app in your browser (`index.html`).
2. Click the ⚙️ **Settings icon** (or the Status badge) at the top right.
3. Paste your **Web App URL** and click **Save & Test Connection**.
4. You're done! All income and expenses added from the dashboard will directly save to your Google Sheet, and existing records will be retrieved automatically.

---

## 🛠️ Tech Stack
- **HTML5 & Vanilla CSS3**: Custom design system with glassmorphism, responsive grid, and fluid typography.
- **JavaScript (ES6+)**: Reactive DOM state management, Chart.js, CSV export.
- **Chart.js**: Dynamic financial chart visualizations.
- **Google Apps Script**: Serverless REST API connected to Google Sheets.
