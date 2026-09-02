/**
 * Pulari Arts & Sports Club - Financial Management Backend
 * Google Apps Script Web App (Multi-Sheet + Master Ledger: Transactions, Income & Expenses)
 * 
 * SETUP / UPDATE INSTRUCTIONS:
 * 1. Open your Google Sheet ("Pulari Club Finances")
 * 2. Click on "Extensions" > "Apps Script"
 * 3. Replace all code in Code.gs with this updated code
 * 4. Click "Save" (disk icon)
 * 5. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > Version: "New version" > "Deploy"
 */

const TRANSACTIONS_SHEET_NAME = "Transactions";
const INCOME_SHEET_NAME = "Income";
const EXPENSE_SHEET_NAME = "Expenses";

const TRANSACTIONS_HEADERS = ["ID", "Type", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "CreatedBy", "Timestamp"];
const INCOME_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "ReceivedBy", "Timestamp"];
const EXPENSE_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "AuthorizedBy", "Timestamp"];

/**
 * Initialize and get the specific sheet (Transactions, Income, or Expenses)
 */
function getSheet(sheetType) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lower = (sheetType || "").toLowerCase();
  
  let name = TRANSACTIONS_SHEET_NAME;
  let headers = TRANSACTIONS_HEADERS;
  let headerBg = "#1e293b"; // Slate Dark Navy for Master Transactions

  if (lower === "income") {
    name = INCOME_SHEET_NAME;
    headers = INCOME_HEADERS;
    headerBg = "#065f46"; // Emerald green for Income
  } else if (lower === "expense" || lower === "expenses") {
    name = EXPENSE_SHEET_NAME;
    headers = EXPENSE_HEADERS;
    headerBg = "#991b1b"; // Crimson red for Expenses
  }

  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(headerBg);
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Read transactions from a specific sheet
 */
function readSheetRows(sheet, defaultType) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const item = { Type: defaultType || "income" };
    headers.forEach((header, colIndex) => {
      let val = row[colIndex];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      item[header] = val;
    });

    if (item.ReceivedBy && !item.CreatedBy) item.CreatedBy = item.ReceivedBy;
    if (item.AuthorizedBy && !item.CreatedBy) item.CreatedBy = item.AuthorizedBy;

    return item;
  }).filter(item => item.ID || item.Title);
}

/**
 * Handle HTTP GET Requests (Fetch All Transactions & Summary)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const txnSheet = ss.getSheetByName(TRANSACTIONS_SHEET_NAME);
    let allTransactions = [];

    // Check if Transactions master sheet has data
    if (txnSheet && txnSheet.getLastRow() > 1) {
      allTransactions = readSheetRows(txnSheet, "income");
    } else {
      // Fallback to reading from individual Income and Expense tabs
      const incomeSheet = getSheet("income");
      const expenseSheet = getSheet("expense");
      const incomeRows = readSheetRows(incomeSheet, "income");
      const expenseRows = readSheetRows(expenseSheet, "expense");
      allTransactions = [...incomeRows, ...expenseRows];
    }

    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(item => {
      const amount = parseFloat(item.Amount) || 0;
      if (item.Type && item.Type.toLowerCase() === "income") {
        totalIncome += amount;
      } else if (item.Type && item.Type.toLowerCase() === "expense") {
        totalExpense += amount;
      }
    });

    // Sort newest first
    allTransactions.sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));

    return createJsonResponse({
      status: "success",
      data: allTransactions,
      summary: {
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        netBalance: totalIncome - totalExpense,
        count: allTransactions.length
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Handle HTTP POST Requests:
 * Adds record into both:
 * 1. The specific sheet (Income or Expenses)
 * 2. The master "Transactions" sheet (containing both Income and Expense)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const type = (payload.type || "income").toLowerCase();
    const isIncome = type === "income";

    const prefix = isIncome ? "INC-" : "EXP-";
    const id = payload.id || prefix + Utilities.formatDate(new Date(), "GMT+05:30", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 1000);
    const title = payload.title || "Untitled";
    const category = payload.category || "General";
    const amount = parseFloat(payload.amount) || 0;
    const date = payload.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    const paymentMode = payload.paymentMode || "Cash";
    const notes = payload.notes || "";
    const person = payload.createdBy || (isIncome ? "Treasurer" : "Secretary");
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    // 1. Append to Master "Transactions" sheet (All Incomes & Expenses)
    const transactionsSheet = getSheet("transactions");
    transactionsSheet.appendRow([
      id,
      type,
      title,
      category,
      amount,
      date,
      paymentMode,
      notes,
      person,
      timestamp
    ]);

    // 2. Append to Specific Sheet ("Income" or "Expenses")
    const specificSheet = getSheet(type);
    specificSheet.appendRow([
      id,
      title,
      category,
      amount,
      date,
      paymentMode,
      notes,
      person,
      timestamp
    ]);

    return createJsonResponse({
      status: "success",
      message: `${isIncome ? "Income" : "Expense"} recorded in ${isIncome ? "Income" : "Expenses"} and Transactions sheet`,
      data: {
        ID: id,
        Type: type,
        Title: title,
        Category: category,
        Amount: amount,
        Date: date,
        PaymentMode: paymentMode,
        Notes: notes,
        CreatedBy: person,
        Timestamp: timestamp
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Return formatted JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
