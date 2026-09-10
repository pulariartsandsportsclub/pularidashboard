/** Pulari Arts & Sports Club financial-management web-app backend. */
const TRANSACTIONS_SHEET_NAME = "Transactions";
const INCOME_SHEET_NAME = "Income";
const EXPENSE_SHEET_NAME = "Expenses";
const INVOICE_FOLDER_ID = "1PuBuDfmdQDxdytIS-_Es9JeZ1CSWGeBx";

const TRANSACTIONS_HEADERS = ["ID", "Type", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "CreatedBy", "InvoiceUrl", "Timestamp"];
const INCOME_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "ReceivedBy", "InvoiceUrl", "Timestamp"];
const EXPENSE_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "AuthorizedBy", "InvoiceUrl", "Timestamp"];

function getInvoiceFolder() {
  if (INVOICE_FOLDER_ID && INVOICE_FOLDER_ID.trim() !== "") {
    try {
      return DriveApp.getFolderById(INVOICE_FOLDER_ID.trim());
    } catch (err) {
      Logger.log("Folder by ID access warning: " + err.toString());
    }
  }
  const folderName = "Pulari Club Invoices";
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

// Run once from the Apps Script editor to grant Drive write permission.
function authorizeDrive() {
  const folder = getInvoiceFolder();
  const tempFile = folder.createFile("auth_test.txt", "Drive Authorization Test");
  tempFile.setTrashed(true);
  return "Google Drive Write Permission Granted Successfully! Folder ID: " + folder.getId();
}

function getSheet(sheetType) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lower = (sheetType || "").toLowerCase();
  let name = TRANSACTIONS_SHEET_NAME;
  let headers = TRANSACTIONS_HEADERS;
  let headerBg = "#1e293b";
  if (lower === "income") {
    name = INCOME_SHEET_NAME;
    headers = INCOME_HEADERS;
    headerBg = "#065f46";
  } else if (lower === "expense" || lower === "expenses") {
    name = EXPENSE_SHEET_NAME;
    headers = EXPENSE_HEADERS;
    headerBg = "#991b1b";
  }
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground(headerBg).setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    if (currentHeaders.indexOf("InvoiceUrl") === -1) sheet.getRange(1, currentHeaders.length + 1).setValue("InvoiceUrl").setFontWeight("bold");
  }
  return sheet;
}

// Works with both old sheets (where InvoiceUrl was appended after Timestamp) and new sheets.
function appendRecord(sheet, values) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(header => {
    if (header === "ReceivedBy" || header === "AuthorizedBy") return values.CreatedBy || "";
    return Object.prototype.hasOwnProperty.call(values, header) ? values[header] : "";
  }));
}

function readSheetRows(sheet, defaultType) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const item = { Type: defaultType || "income" };
    headers.forEach((header, index) => {
      let value = row[index];
      if (value instanceof Date) value = Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
      item[header] = value;
    });
    if (item.ReceivedBy && !item.CreatedBy) item.CreatedBy = item.ReceivedBy;
    if (item.AuthorizedBy && !item.CreatedBy) item.CreatedBy = item.AuthorizedBy;
    return item;
  }).filter(item => item.ID || item.Title);
}

function doGet() {
  try {
    const transactionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRANSACTIONS_SHEET_NAME);
    const allTransactions = transactionSheet && transactionSheet.getLastRow() > 1
      ? readSheetRows(transactionSheet, "income")
      : [...readSheetRows(getSheet("income"), "income"), ...readSheetRows(getSheet("expense"), "expense")];
    let totalIncome = 0;
    let totalExpense = 0;
    allTransactions.forEach(item => {
      const amount = parseFloat(item.Amount) || 0;
      if ((item.Type || "").toLowerCase() === "income") totalIncome += amount;
      else if ((item.Type || "").toLowerCase() === "expense") totalExpense += amount;
    });
    allTransactions.sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));
    return createJsonResponse({ status: "success", data: allTransactions, summary: { totalIncome, totalExpense, netBalance: totalIncome - totalExpense, count: allTransactions.length } });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    const payload = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : ((e && e.parameter) || {});
    const type = (payload.type || "income").toLowerCase();
    const isIncome = type === "income";
    const id = payload.id || (isIncome ? "INC-" : "EXP-") + Utilities.formatDate(new Date(), "GMT+05:30", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 1000);
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    const record = {
      ID: id, Type: type, Title: payload.title || "Untitled", Category: payload.category || "General",
      Amount: parseFloat(payload.amount) || 0, Date: payload.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
      PaymentMode: payload.paymentMode || "Cash", Notes: payload.notes || "",
      CreatedBy: payload.createdBy || (isIncome ? "Treasurer" : "Secretary"), InvoiceUrl: payload.invoiceUrl || "", Timestamp: timestamp
    };
    let invoiceUploadError = "";
    if (payload.fileData && payload.fileName) {
      try {
        const fileName = (id + "_" + payload.fileName).replace(/[^a-zA-Z0-9_.-]/g, "_");
        const blob = Utilities.newBlob(Utilities.base64Decode(payload.fileData), payload.fileMimeType || "application/pdf", fileName);
        const folder = getInvoiceFolder();
        const file = folder.createFile(blob);
        record.InvoiceUrl = file.getUrl();
        try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); }
        catch (sharingError) { Logger.log("Drive sharing warning: " + sharingError.toString()); }
      } catch (driveError) {
        Logger.log("Drive upload error: " + driveError.toString());
        invoiceUploadError = "Invoice upload failed: " + driveError.toString();
      }
    }
    appendRecord(getSheet("transactions"), record);
    appendRecord(getSheet(type), record);
    return createJsonResponse({ status: "success", message: "Saved to both sheets & Drive", data: Object.assign({}, record, { InvoiceUploadError: invoiceUploadError }) });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
