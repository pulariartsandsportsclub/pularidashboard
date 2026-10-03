/**
 * Pulari Arts & Sports Club - Financial Admin Portal
 * Master Application Logic & Google Sheets Integration
 */

// ==========================================
// Initial Sample / Demo Data (Pulari Club)
// ==========================================
const DEMO_TRANSACTIONS = [
  {
    ID: "TXN-20260901-001",
    Type: "income",
    Title: "Annual Member Subscription - Batch A (15 Members)",
    Category: "Membership Fees",
    Amount: 15000,
    Date: "2026-09-01",
    PaymentMode: "UPI",
    Notes: "Collected by Rahul K (Treasurer), UPI Ref 928374",
    CreatedBy: "Admin",
    Timestamp: "2026-09-01 10:30:00"
  },
  {
    ID: "TXN-20260828-002",
    Type: "income",
    Title: "Onam Sevens Football Tournament Sponsorship",
    Category: "Sponsorship",
    Amount: 25000,
    Date: "2026-08-28",
    PaymentMode: "Bank Transfer",
    Notes: "Sponsored by City Supermarket, Cheque / NEFT credited",
    CreatedBy: "Admin",
    Timestamp: "2026-08-28 16:45:00"
  },
  {
    ID: "TXN-20260825-003",
    Type: "expense",
    Title: "Football Turf Grass Cutting & Ground Leveling",
    Category: "Ground Maintenance",
    Amount: 4800,
    Date: "2026-08-25",
    PaymentMode: "Cash",
    Notes: "Paid to Contractor Shibu for 2 days ground preparation",
    CreatedBy: "Admin",
    Timestamp: "2026-08-25 18:15:00"
  },
  {
    ID: "TXN-20260820-004",
    Type: "income",
    Title: "Badminton Tournament Team Registration Fees (12 Teams)",
    Category: "Tournament Entry",
    Amount: 7200,
    Date: "2026-08-20",
    PaymentMode: "UPI",
    Notes: "Registration fee ₹600 per double team",
    CreatedBy: "Admin",
    Timestamp: "2026-08-20 14:20:00"
  },
  {
    ID: "TXN-20260818-005",
    Type: "expense",
    Title: "Sports Equipment (Nivia Footballs, Shuttlecocks & Net)",
    Category: "Sports Equipment",
    Amount: 8500,
    Date: "2026-08-18",
    PaymentMode: "UPI",
    Notes: "Purchased from Winners Sports World, Bill #W-4091",
    CreatedBy: "Admin",
    Timestamp: "2026-08-18 11:30:00"
  },
  {
    ID: "TXN-20260812-006",
    Type: "expense",
    Title: "Club House Electricity & Floodlights Bill",
    Category: "Electricity & Water",
    Amount: 2350,
    Date: "2026-08-12",
    PaymentMode: "UPI",
    Notes: "KSEB Online Payment for Consumer #4829104",
    CreatedBy: "Admin",
    Timestamp: "2026-08-12 15:10:00"
  },
  {
    ID: "TXN-20260805-007",
    Type: "income",
    Title: "Patron Donation - Pravasi Well-wisher",
    Category: "Donation",
    Amount: 10000,
    Date: "2026-08-05",
    PaymentMode: "Bank Transfer",
    Notes: "Contributed towards Club Library & Indoor games by Mr. Manoj",
    CreatedBy: "Admin",
    Timestamp: "2026-08-05 09:15:00"
  },
  {
    ID: "TXN-20260802-008",
    Type: "expense",
    Title: "Independence Day Tug-of-War Snacks & Tea",
    Category: "Refreshments",
    Amount: 1650,
    Date: "2026-08-02",
    PaymentMode: "Cash",
    Notes: "Purchased from Modern Bakery for participants and kids",
    CreatedBy: "Admin",
    Timestamp: "2026-08-02 17:00:00"
  },
  {
    ID: "TXN-20260725-009",
    Type: "income",
    Title: "Monthly Membership Fees - July Collections",
    Category: "Membership Fees",
    Amount: 12000,
    Date: "2026-07-25",
    PaymentMode: "UPI",
    Notes: "Direct GPay receipts from 12 active members",
    CreatedBy: "Admin",
    Timestamp: "2026-07-25 19:00:00"
  },
  {
    ID: "TXN-20260715-010",
    Type: "expense",
    Title: "First Aid Kit Restocking & Ice Packs",
    Category: "Medical & First Aid",
    Amount: 1200,
    Date: "2026-07-15",
    PaymentMode: "Cash",
    Notes: "Medical spray, bandages and crepe rolls from Apollo Pharmacy",
    CreatedBy: "Admin",
    Timestamp: "2026-07-15 11:00:00"
  }
];

// ==========================================
// Admin Authentication Credentials
// ==========================================
const AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'admin@1235789'
};

// ==========================================
// Application State
// ==========================================
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3fQPLuHUERree9oy2yVEzEpHkclqRnkBEgDo0Kbj8-SsrLcZfjBHtAv1JdfcsBA6m/exec';

const AppState = {
  transactions: [],
  googleScriptUrl: localStorage.getItem('pulari_sheet_api_url') || DEFAULT_SCRIPT_URL,
  isOnlineMode: false,
  isLoading: false,
  filterType: 'all', // 'all' | 'income' | 'expense'
  searchQuery: '',
  categoryFilter: 'all',
  paymentModeFilter: 'all',
  sortBy: 'date-desc',
  chartCashflow: null,
  chartCategory: null,
  chartCategoryType: 'all' // 'all' | 'income' | 'expense'
};

// ==========================================
// DOM Elements
// ==========================================
const Elements = {
  // Authentication Elements
  loginOverlay: document.getElementById('loginOverlay'),
  loginForm: document.getElementById('loginForm'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  loginErrorAlert: document.getElementById('loginErrorAlert'),
  loginErrorMsg: document.getElementById('loginErrorMsg'),
  loginSubmitBtn: document.getElementById('loginSubmitBtn'),
  togglePasswordBtn: document.getElementById('togglePasswordBtn'),
  passwordEyeIcon: document.getElementById('passwordEyeIcon'),
  logoutBtn: document.getElementById('logoutBtn'),
  appMainWrapper: document.getElementById('appMainWrapper'),

  syncStatusBadge: document.getElementById('syncStatusBadge'),
  syncStatusDot: document.getElementById('syncStatusDot'),
  syncStatusText: document.getElementById('syncStatusText'),
  refreshBtn: document.getElementById('refreshBtn'),
  refreshIcon: document.getElementById('refreshIcon'),
  settingsModalOpenBtn: document.getElementById('settingsModalOpenBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  currentDateDisplay: document.getElementById('currentDateDisplay'),

  // Action Buttons
  openAddIncomeBtn: document.getElementById('openAddIncomeBtn'),
  openAddExpenseBtn: document.getElementById('openAddExpenseBtn'),
  exportExcelBtn: document.getElementById('exportExcelBtn'),
  exportPdfBtn: document.getElementById('exportPdfBtn'),

  // Metrics
  statTotalIncome: document.getElementById('statTotalIncome'),
  statTotalExpense: document.getElementById('statTotalExpense'),
  statNetBalance: document.getElementById('statNetBalance'),
  incomeCountLabel: document.getElementById('incomeCountLabel'),
  expenseCountLabel: document.getElementById('expenseCountLabel'),
  netBalanceBadge: document.getElementById('netBalanceBadge'),
  netStatusText: document.getElementById('netStatusText'),

  // Charts
  cashflowChartCanvas: document.getElementById('cashflowChart'),
  categoryChartCanvas: document.getElementById('categoryChart'),
  chartTimeframeSelect: document.getElementById('chartTimeframeSelect'),

  // Table & Filters
  typeTabButtons: document.querySelectorAll('.type-tab-btn'),
  countAll: document.getElementById('countAll'),
  countIncome: document.getElementById('countIncome'),
  countExpense: document.getElementById('countExpense'),
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  paymentModeFilter: document.getElementById('paymentModeFilter'),
  sortBySelect: document.getElementById('sortBySelect'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  transactionsTableBody: document.getElementById('transactionsTableBody'),
  tableEmptyState: document.getElementById('tableEmptyState'),

  // Modals & Forms
  addIncomeModal: document.getElementById('addIncomeModal'),
  addIncomeForm: document.getElementById('addIncomeForm'),
  incomeDate: document.getElementById('incomeDate'),
  submitIncomeBtn: document.getElementById('submitIncomeBtn'),

  addExpenseModal: document.getElementById('addExpenseModal'),
  addExpenseForm: document.getElementById('addExpenseForm'),
  expenseDate: document.getElementById('expenseDate'),
  submitExpenseBtn: document.getElementById('submitExpenseBtn'),

  settingsModal: document.getElementById('settingsModal'),
  googleScriptUrlInput: document.getElementById('googleScriptUrlInput'),
  saveAndTestUrlBtn: document.getElementById('saveAndTestUrlBtn'),
  useDemoDataBtn: document.getElementById('useDemoDataBtn'),
  copyScriptCodeBtn: document.getElementById('copyScriptCodeBtn'),
  appsScriptSnippet: document.getElementById('appsScriptSnippet'),

  detailModal: document.getElementById('detailModal'),
  detailModalBody: document.getElementById('detailModalBody'),
  detailModalTitle: document.getElementById('detailModalTitle'),
  detailModalIcon: document.getElementById('detailModalIcon'),

  toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDates();
  initAppsScriptSnippet();
  bindEvents();
  checkAuth();
});

function initDates() {
  const today = new Date().toISOString().split('T')[0];
  if (Elements.incomeDate) Elements.incomeDate.value = today;
  if (Elements.expenseDate) Elements.expenseDate.value = today;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  if (Elements.currentDateDisplay) {
    Elements.currentDateDisplay.textContent = `Financial Summary • ${formattedDate}`;
  }
}

function initTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('pulari_theme', 'light');
  updateThemeIcon('light');
}

function updateThemeIcon(theme) {
  if (!Elements.themeIcon) return;
  Elements.themeIcon.className = 'fa-solid fa-sun';
}

function toggleTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('pulari_theme', 'light');
  updateThemeIcon('light');
  renderCharts();
}

// ==========================================
// Event Listeners
// ==========================================
function bindEvents() {
  // Authentication Listeners
  if (Elements.loginForm) Elements.loginForm.addEventListener('submit', handleLoginSubmit);
  if (Elements.logoutBtn) Elements.logoutBtn.addEventListener('click', handleLogout);
  if (Elements.togglePasswordBtn) Elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

  // Theme & Settings
  if (Elements.themeToggleBtn) Elements.themeToggleBtn.addEventListener('click', toggleTheme);
  if (Elements.settingsModalOpenBtn) Elements.settingsModalOpenBtn.addEventListener('click', () => openModal('settingsModal'));
  Elements.refreshBtn.addEventListener('click', () => syncData(true));

  // Action Buttons
  Elements.openAddIncomeBtn.addEventListener('click', () => openModal('addIncomeModal'));
  Elements.openAddExpenseBtn.addEventListener('click', () => openModal('addExpenseModal'));
  if (Elements.exportExcelBtn) Elements.exportExcelBtn.addEventListener('click', exportToExcel);
  if (Elements.exportPdfBtn) Elements.exportPdfBtn.addEventListener('click', exportToPDF);

  // Forms
  Elements.addIncomeForm.addEventListener('submit', handleAddIncomeSubmit);
  Elements.addExpenseForm.addEventListener('submit', handleAddExpenseSubmit);

  // Filters & Search
  Elements.typeTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      Elements.typeTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.filterType = btn.getAttribute('data-filter-type');
      renderTransactionsTable();
    });
  });

  Elements.searchInput.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value.trim().toLowerCase();
    renderTransactionsTable();
  });

  Elements.categoryFilter.addEventListener('change', (e) => {
    AppState.categoryFilter = e.target.value;
    renderTransactionsTable();
  });

  Elements.paymentModeFilter.addEventListener('change', (e) => {
    AppState.paymentModeFilter = e.target.value;
    renderTransactionsTable();
  });

  Elements.sortBySelect.addEventListener('change', (e) => {
    AppState.sortBy = e.target.value;
    renderTransactionsTable();
  });

  Elements.resetFiltersBtn.addEventListener('click', resetFilters);
  Elements.chartTimeframeSelect.addEventListener('change', () => renderCharts());

  // Category Chart Filter Toggle (All / Income / Expense)
  document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.chartCategoryType = btn.getAttribute('data-cat-type') || 'all';
      renderCharts();
    });
  });

  // Mobile Navigation Bottom Bar Actions
  const mobileAddIncomeBtn = document.getElementById('mobileAddIncomeBtn');
  const mobileAddExpenseBtn = document.getElementById('mobileAddExpenseBtn');
  const mobileSyncBtn = document.getElementById('mobileSyncBtn');
  const mobileLedgerBtn = document.getElementById('mobileLedgerBtn');
  const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');

  if (mobileAddIncomeBtn) mobileAddIncomeBtn.addEventListener('click', () => openModal('addIncomeModal'));
  if (mobileAddExpenseBtn) mobileAddExpenseBtn.addEventListener('click', () => openModal('addExpenseModal'));
  if (mobileSyncBtn) mobileSyncBtn.addEventListener('click', () => syncData(true));
  if (mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', () => openModal('settingsModal'));
  if (mobileLedgerBtn) {
    mobileLedgerBtn.addEventListener('click', () => {
      const ledgerSec = document.querySelector('.ledger-section');
      if (ledgerSec) {
        ledgerSec.scrollIntoView({ behavior: 'smooth' });
        const searchBox = document.getElementById('searchInput');
        if (searchBox) searchBox.focus();
      }
    });
  }

  // Settings Modal Handlers
  Elements.saveAndTestUrlBtn.addEventListener('click', handleSaveAndTestUrl);
  Elements.useDemoDataBtn.addEventListener('click', handleUseDemoData);
  Elements.copyScriptCodeBtn.addEventListener('click', handleCopyScriptCode);

  // Close modals via data attribute
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Close modals when clicking on background backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}

function resetFilters() {
  Elements.searchInput.value = '';
  Elements.categoryFilter.value = 'all';
  Elements.paymentModeFilter.value = 'all';
  Elements.sortBySelect.value = 'date-desc';
  AppState.searchQuery = '';
  AppState.categoryFilter = 'all';
  AppState.paymentModeFilter = 'all';
  AppState.sortBy = 'date-desc';
  renderTransactionsTable();
  showToast('Filters reset to default', 'info');
}

// ==========================================
// Authentication System & Guard
// ==========================================
function checkAuth() {
  const isAuth = sessionStorage.getItem('pulari_auth_session') === 'active';
  const overlay = document.getElementById('loginOverlay');
  const mainWrapper = document.getElementById('appMainWrapper');

  if (isAuth) {
    if (overlay) overlay.style.display = 'none';
    if (mainWrapper) mainWrapper.style.display = 'flex';
    loadInitialData();
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (mainWrapper) mainWrapper.style.display = 'none';
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorMsg = document.getElementById('loginErrorMsg');
  const submitBtn = document.getElementById('loginSubmitBtn');

  const user = usernameInput ? usernameInput.value.trim() : '';
  const pass = passwordInput ? passwordInput.value : '';

  if (user === AUTH_CREDENTIALS.username && pass === AUTH_CREDENTIALS.password) {
    if (errorAlert) errorAlert.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    }

    setTimeout(() => {
      sessionStorage.setItem('pulari_auth_session', 'active');
      const overlay = document.getElementById('loginOverlay');
      const mainWrapper = document.getElementById('appMainWrapper');
      if (overlay) overlay.style.display = 'none';
      if (mainWrapper) mainWrapper.style.display = 'flex';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Sign In to Dashboard</span>';
      }

      loadInitialData();
      showToast('Welcome back, Admin! Session authenticated.', 'success');
    }, 400);
  } else {
    if (errorAlert) {
      errorAlert.style.display = 'flex';
      if (errorMsg) errorMsg.textContent = 'Invalid User ID or Password. Please try again.';
      errorAlert.classList.remove('shake');
      void errorAlert.offsetWidth; // trigger reflow
      errorAlert.classList.add('shake');
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('pulari_auth_session');
  const overlay = document.getElementById('loginOverlay');
  const mainWrapper = document.getElementById('appMainWrapper');
  if (overlay) overlay.style.display = 'flex';
  if (mainWrapper) mainWrapper.style.display = 'none';

  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const errorAlert = document.getElementById('loginErrorAlert');
  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';
  if (errorAlert) errorAlert.style.display = 'none';

  showToast('Logged out of Admin Portal.', 'info');
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('loginPassword');
  const eyeIcon = document.getElementById('passwordEyeIcon');
  if (!passwordInput || !eyeIcon) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.className = 'fa-solid fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    eyeIcon.className = 'fa-solid fa-eye';
  }
}

// ==========================================
// Data Sync & Google Sheets API Integration
// ==========================================
function loadInitialData() {
  if (AppState.googleScriptUrl) {
    Elements.googleScriptUrlInput.value = AppState.googleScriptUrl;
    syncData(false);
  } else {
    // Load Demo Data
    const localCached = localStorage.getItem('pulari_local_transactions');
    if (localCached) {
      try {
        AppState.transactions = JSON.parse(localCached);
      } catch (e) {
        AppState.transactions = DEMO_TRANSACTIONS;
      }
    } else {
      AppState.transactions = [...DEMO_TRANSACTIONS];
    }
    setSyncStatus('offline', 'Demo Mode (No Sheet URL)');
    updateDashboard();
  }
}

async function syncData(showToasts = true) {
  if (!AppState.googleScriptUrl) {
    setSyncStatus('offline', 'Demo Mode');
    updateDashboard();
    if (showToasts) showToast('Operating in Demo Mode. Connect a Google Sheet in settings.', 'info');
    return;
  }

  setSyncStatus('syncing', 'Connecting...');
  if (Elements.refreshIcon) Elements.refreshIcon.classList.add('fa-spin');
  const mobSyncIcon = document.getElementById('mobileSyncIcon');
  if (mobSyncIcon) mobSyncIcon.classList.add('fa-spin');

  try {
    const response = await fetch(AppState.googleScriptUrl, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const result = await response.json();

    if (result && result.status === 'success' && Array.isArray(result.data)) {
      AppState.transactions = result.data.map(item => ({
        ...item,
        Amount: parseFloat(item.Amount) || 0
      }));
      AppState.isOnlineMode = true;
      localStorage.setItem('pulari_local_transactions', JSON.stringify(AppState.transactions));
      setSyncStatus('online', 'Connected');
      updateDashboard();
      if (showToasts) showToast('Data synchronized successfully from Google Sheets!', 'success');
    } else {
      throw new Error(result.message || 'Invalid sheet response');
    }
  } catch (error) {
    console.warn('Google Sheets sync error, using cached data:', error);
    setSyncStatus('error', 'Sync Failed (Offline Cache)');
    if (showToasts) showToast('Could not fetch from Google Sheet. Using local cache.', 'error');

    const localCached = localStorage.getItem('pulari_local_transactions');
    if (localCached) {
      AppState.transactions = JSON.parse(localCached);
    }
    updateDashboard();
  } finally {
    if (Elements.refreshIcon) Elements.refreshIcon.classList.remove('fa-spin');
    if (mobSyncIcon) mobSyncIcon.classList.remove('fa-spin');
  }
}

function setSyncStatus(status, text) {
  Elements.syncStatusDot.className = `status-dot ${status}`;
  Elements.syncStatusText.textContent = text;
}

// ==========================================
// Dashboard Update & Calculation Logic
// ==========================================
function updateDashboard() {
  calculateTotals();
  populateCategoryFilter();
  renderTransactionsTable();
  renderCharts();
}

function calculateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  AppState.transactions.forEach(t => {
    const amount = parseFloat(t.Amount) || 0;

    if (t.Type && t.Type.toLowerCase() === 'income') {
      totalIncome += amount;
      incomeCount++;
    } else if (t.Type && t.Type.toLowerCase() === 'expense') {
      totalExpense += amount;
      expenseCount++;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // Format currency
  Elements.statTotalIncome.textContent = formatCurrency(totalIncome);
  Elements.statTotalExpense.textContent = formatCurrency(totalExpense);
  Elements.statNetBalance.textContent = formatCurrency(netBalance);

  Elements.incomeCountLabel.textContent = `${incomeCount} Inflow Entries`;
  Elements.expenseCountLabel.textContent = `${expenseCount} Outflow Entries`;

  // Net Balance badge formatting
  if (netBalance >= 0) {
    Elements.netBalanceBadge.className = 'metric-badge positive';
    Elements.netBalanceBadge.innerHTML = '<i class="fa-solid fa-arrow-up"></i> Positive Balance';
    Elements.netStatusText.textContent = 'Surplus Fund';
    Elements.netStatusText.style.color = 'var(--income-color)';
  } else {
    Elements.netBalanceBadge.className = 'metric-badge negative';
    Elements.netBalanceBadge.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Deficit Alert';
    Elements.netStatusText.textContent = 'Overspent';
    Elements.netStatusText.style.color = 'var(--expense-color)';
  }

  // Update tab counts
  Elements.countAll.textContent = AppState.transactions.length;
  Elements.countIncome.textContent = incomeCount;
  Elements.countExpense.textContent = expenseCount;
}

function formatCurrency(num) {
  return '₹' + Number(num || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function parseDateSafe(dateStr) {
  if (!dateStr) return null;
  const str = String(dateStr).trim();

  // 1. YYYY-MM-DD or YYYY/MM/DD
  const ymd = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (ymd) {
    const y = parseInt(ymd[1], 10);
    const m = parseInt(ymd[2], 10) - 1;
    const d = parseInt(ymd[3], 10);
    return new Date(y, m, d);
  }

  // 2. DD-MM-YYYY or DD/MM/YYYY
  const dmy = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmy) {
    const d = parseInt(dmy[1], 10);
    const m = parseInt(dmy[2], 10) - 1;
    const y = parseInt(dmy[3], 10);
    return new Date(y, m, d);
  }

  // 3. Fallback to standard Date constructor
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;

  return null;
}

function parseMonthKey(dateStr) {
  const d = parseDateSafe(dateStr);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'N/A';
  const d = parseDateSafe(dateStr);
  if (d) {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  return dateStr;
}

// ==========================================
// Filter & Render Table
// ==========================================
function populateCategoryFilter() {
  const currentVal = Elements.categoryFilter ? Elements.categoryFilter.value : 'all';
  const categories = new Set([
    'Room Rent',
    'Event',
    'Culturals',
    'Membership Fees',
    'Tournament Entry',
    'Sponsorship',
    'Donation',
    'Sports Equipment',
    'Ground Maintenance',
    'Tournament Expense',
    'Refreshments',
    'Electricity & Water',
    'Prizes & Trophies',
    'Printing & Banners',
    'Medical & First Aid',
    'Other Income',
    'Miscellaneous'
  ]);

  AppState.transactions.forEach(t => {
    if (t.Category) categories.add(t.Category.trim());
  });

  let optionsHtml = '<option value="all">All Categories</option>';
  Array.from(categories).sort().forEach(cat => {
    optionsHtml += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  });

  if (Elements.categoryFilter) {
    Elements.categoryFilter.innerHTML = optionsHtml;
    if (categories.has(currentVal)) {
      Elements.categoryFilter.value = currentVal;
    }
  }
}

function getFilteredTransactions() {
  return AppState.transactions.filter(t => {
    // Type Filter
    const type = (t.Type || '').toLowerCase();
    if (AppState.filterType !== 'all' && type !== AppState.filterType) {
      return false;
    }

    // Category Filter
    if (AppState.categoryFilter !== 'all' && (t.Category || '') !== AppState.categoryFilter) {
      return false;
    }

    // Payment Mode Filter
    if (AppState.paymentModeFilter !== 'all' && (t.PaymentMode || '') !== AppState.paymentModeFilter) {
      return false;
    }

    // Search Query
    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      const matchTitle = (t.Title || '').toLowerCase().includes(q);
      const matchNotes = (t.Notes || '').toLowerCase().includes(q);
      const matchCat = (t.Category || '').toLowerCase().includes(q);
      const matchId = (t.ID || '').toLowerCase().includes(q);
      const matchMode = (t.PaymentMode || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCat && !matchId && !matchMode) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    const dateA = parseDateSafe(a.Date) || new Date(0);
    const dateB = parseDateSafe(b.Date) || new Date(0);
    switch (AppState.sortBy) {
      case 'date-asc':
        return dateA - dateB;
      case 'amount-desc':
        return (parseFloat(b.Amount) || 0) - (parseFloat(a.Amount) || 0);
      case 'amount-asc':
        return (parseFloat(a.Amount) || 0) - (parseFloat(b.Amount) || 0);
      case 'date-desc':
      default:
        return dateB - dateA;
    }
  });
}

function renderTransactionsTable() {
  const filtered = getFilteredTransactions();

  if (filtered.length === 0) {
    if (Elements.transactionsTableBody) Elements.transactionsTableBody.innerHTML = '';
    if (Elements.tableEmptyState) Elements.tableEmptyState.style.display = 'block';
    return;
  }

  if (Elements.tableEmptyState) Elements.tableEmptyState.style.display = 'none';

  let rowsHtml = '';
  filtered.forEach(t => {
    const isIncome = (t.Type || '').toLowerCase() === 'income';
    const amountSign = isIncome ? '+ ' : '- ';
    const amountClass = isIncome ? 'amount-income' : 'amount-expense';
    const typeBadge = isIncome ? 'badge-income' : 'badge-expense';
    const typeIcon = isIncome ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
    const iconClass = isIncome ? 'income' : 'expense';

    rowsHtml += `
      <tr class="txn-row ${isIncome ? 'txn-income-row' : 'txn-expense-row'}">
        <td class="td-title">
          <div class="txn-title-cell">
            <div class="txn-type-icon ${iconClass}">
              <i class="fa-solid ${typeIcon}"></i>
            </div>
            <div class="txn-title-text-wrap">
              <span class="txn-title-main">${escapeHtml(t.Title || 'Untitled')}</span>
              <span class="txn-id-sub">${escapeHtml(t.ID || '')}</span>
            </div>
          </div>
        </td>
        <td class="td-category">
          <span class="badge badge-category">${escapeHtml(t.Category || 'General')}</span>
        </td>
        <td class="td-date">
          <span class="txn-date-chip">${formatDateDisplay(t.Date)}</span>
        </td>
        <td class="td-mode">
          <span class="badge badge-mode">
            <i class="fa-solid fa-credit-card" style="font-size: 0.7rem; margin-right: 4px;"></i>
            ${escapeHtml(t.PaymentMode || 'Cash')}
          </span>
        </td>
        <td class="td-notes ${t.Notes && t.Notes.trim() !== '-' && t.Notes.trim() !== '' ? 'txn-notes-cell' : 'txn-notes-empty'}" title="${escapeHtml(t.Notes || '')}">
          ${t.Notes && t.Notes.trim() !== '-' && t.Notes.trim() !== '' ? escapeHtml(t.Notes) : '<span style="opacity: 0.4;">-</span>'}
        </td>
        <td class="td-amount">
          <span class="${amountClass}">${amountSign}${formatCurrency(t.Amount)}</span>
        </td>
        <td class="td-actions">
          ${t.InvoiceUrl ? `
            <a href="${escapeHtml(t.InvoiceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-icon-only" style="width: 36px; height: 36px; color: #ef4444; margin-right: 4px;" title="View Invoice PDF in Google Drive">
              <i class="fa-solid fa-file-pdf" style="font-size: 0.9rem;"></i>
            </a>
          ` : ''}
          <button type="button" class="btn btn-secondary btn-icon-only" style="width: 36px; height: 36px;" onclick="viewTransactionDetails('${t.ID}')" title="View Details">
            <i class="fa-solid fa-eye" style="font-size: 0.85rem;"></i>
          </button>
        </td>
      </tr>
    `;
  });

  if (Elements.transactionsTableBody) {
    Elements.transactionsTableBody.innerHTML = rowsHtml;
  }
}

function viewTransactionDetails(txnId) {
  const txn = AppState.transactions.find(t => String(t.ID) === String(txnId));
  if (!txn) {
    showToast('Transaction details not found.', 'error');
    return;
  }

  const isIncome = (txn.Type || '').toLowerCase() === 'income';
  const modalIcon = document.getElementById('detailModalIcon');
  const modalTitle = document.getElementById('detailModalTitle');
  const modalBody = document.getElementById('detailModalBody');

  if (modalIcon) {
    modalIcon.className = `modal-header-icon ${isIncome ? 'income' : 'expense'}`;
    modalIcon.innerHTML = `<i class="fa-solid ${isIncome ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>`;
  }

  if (modalTitle) {
    modalTitle.textContent = `${isIncome ? 'Income' : 'Expense'} Voucher #${txn.ID || ''}`;
  }

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.1rem; margin-bottom: 0.85rem; text-align: center;">
        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.2rem;">
          ${escapeHtml(txn.Category || 'General')}
        </div>
        <div style="font-size: 1.75rem; font-weight: 800; font-family: 'Red Hat Display', 'Outfit', sans-serif; color: ${isIncome ? 'var(--income-color)' : 'var(--expense-color)'};">
          ${isIncome ? '+' : '-'}${formatCurrency(txn.Amount)}
        </div>
        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-top: 0.3rem;">
          ${escapeHtml(txn.Title || 'Untitled')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; font-size: 0.82rem; margin-bottom: 0.85rem;">
        <div style="background: var(--bg-tertiary); padding: 0.65rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Date</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-top: 0.2rem;"><i class="fa-regular fa-calendar" style="margin-right: 4px; color: var(--brand-primary);"></i> ${formatDateDisplay(txn.Date)}</div>
        </div>

        <div style="background: var(--bg-tertiary); padding: 0.65rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Payment Mode</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-top: 0.2rem;"><i class="fa-solid fa-credit-card" style="margin-right: 4px; color: var(--oracle-teal);"></i> ${escapeHtml(txn.PaymentMode || 'Cash')}</div>
        </div>

        <div style="background: var(--bg-tertiary); padding: 0.65rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Handled By</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-top: 0.2rem;"><i class="fa-solid fa-user-check" style="margin-right: 4px; color: var(--warning-color);"></i> ${escapeHtml(txn.CreatedBy || 'Admin')}</div>
        </div>

        <div style="background: var(--bg-tertiary); padding: 0.65rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Ref ID</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-top: 0.2rem; font-family: monospace;">${escapeHtml(txn.ID || '-')}</div>
        </div>
      </div>

      ${txn.Notes ? `
        <div style="background: var(--bg-tertiary); padding: 0.65rem 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); margin-bottom: 0.85rem; font-size: 0.82rem;">
          <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.2rem;">Notes & Payer Remarks</div>
          <div style="color: var(--text-secondary); line-height: 1.4;">${escapeHtml(txn.Notes)}</div>
        </div>
      ` : ''}

      ${txn.InvoiceUrl ? `
        <div style="text-align: center; margin-top: 0.5rem;">
          <a href="${escapeHtml(txn.InvoiceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; justify-content: center; min-height: 44px;">
            <i class="fa-solid fa-file-pdf"></i>
            <span>View Attached PDF in Drive</span>
          </a>
        </div>
      ` : ''}
    `;
  }

  openModal('detailModal');
}

// ==========================================
// Chart.js Visualizations
// ==========================================
function renderCharts() {
  if (typeof Chart === 'undefined') {
    // Retry shortly if Chart.js is still downloading
    setTimeout(renderCharts, 250);
    return;
  }

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#524e47' : '#c4c0b8';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
  const chartFontFamily = "'Red Hat Text', 'Plus Jakarta Sans', sans-serif";

  const timeframeSelect = document.getElementById('chartTimeframeSelect');
  const monthsCount = timeframeSelect ? (parseInt(timeframeSelect.value, 10) || 6) : 6;

  // Determine anchor date from latest transaction or current date
  let anchorDate = new Date();
  if (AppState.transactions && AppState.transactions.length > 0) {
    const validDates = AppState.transactions
      .map(t => parseDateSafe(t.Date))
      .filter(Boolean);
    if (validDates.length > 0) {
      anchorDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    }
  }

  const monthLabels = [];
  const monthMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${y}-${m}`;
    const label = `${monthNames[d.getMonth()]} '${String(y).slice(2)}`;

    monthLabels.push({ key, label });
    monthMap[key] = { income: 0, expense: 0 };
  }

  // Aggregate income and expenses per month
  AppState.transactions.forEach(t => {
    const key = parseMonthKey(t.Date);
    if (key && monthMap[key]) {
      const amt = parseFloat(t.Amount) || 0;
      const type = (t.Type || '').toLowerCase();
      if (type === 'income') {
        monthMap[key].income += amt;
      } else if (type === 'expense') {
        monthMap[key].expense += amt;
      }
    }
  });

  const labels = monthLabels.map(m => m.label);
  const incomeData = monthLabels.map(m => monthMap[m.key].income);
  const expenseData = monthLabels.map(m => monthMap[m.key].expense);

  // 1. Render Cashflow Bar Chart (Oracle Redwood)
  const cashflowCanvas = document.getElementById('cashflowChart');
  if (AppState.chartCashflow) {
    AppState.chartCashflow.destroy();
    AppState.chartCashflow = null;
  }

  if (cashflowCanvas) {
    try {
      AppState.chartCashflow = new Chart(cashflowCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Income (₹)',
              data: incomeData,
              backgroundColor: 'rgba(22, 163, 74, 0.85)',
              borderColor: '#16a34a',
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false
            },
            {
              label: 'Expense (₹)',
              data: expenseData,
              backgroundColor: 'rgba(199, 70, 52, 0.85)',
              borderColor: '#c74634',
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, font: { family: chartFontFamily, size: 12, weight: '600' } }
            },
            tooltip: {
              backgroundColor: isLight ? '#ffffff' : '#211f1d',
              titleColor: isLight ? '#161513' : '#f7f6f3',
              bodyColor: isLight ? '#524e47' : '#c4c0b8',
              borderColor: isLight ? '#dedad2' : '#3a3733',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: chartFontFamily } }
            },
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: chartFontFamily },
                callback: (val) => '₹' + val.toLocaleString('en-IN')
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error creating cashflow chart:', e);
    }
  }

  // 2. Prepare Category Breakdown Chart (Oracle Redwood 8-Color Palette)
  const catType = AppState.chartCategoryType || 'all';
  const categoryChartTitle = document.getElementById('categoryChartTitle');
  const categoryChartSubtitle = document.getElementById('categoryChartSubtitle');

  const incomeCatMap = {};
  const expenseCatMap = {};
  const combinedCatMap = {};

  AppState.transactions.forEach(t => {
    const type = (t.Type || '').toLowerCase().trim();
    const cat = t.Category || 'General';
    const amt = parseFloat(t.Amount) || 0;

    if (type === 'income') {
      incomeCatMap[cat] = (incomeCatMap[cat] || 0) + amt;
      const combinedKey = `In: ${cat}`;
      combinedCatMap[combinedKey] = (combinedCatMap[combinedKey] || 0) + amt;
    } else if (type === 'expense') {
      expenseCatMap[cat] = (expenseCatMap[cat] || 0) + amt;
      const combinedKey = `Ex: ${cat}`;
      combinedCatMap[combinedKey] = (combinedCatMap[combinedKey] || 0) + amt;
    }
  });

  let categoryLabels = [];
  let categoryValues = [];
  let categoryColors = [];

  // Oracle Redwood Color Palettes
  const incomePalette = [
    '#16a34a', '#027179', '#0891b2', '#059669', '#2563eb', '#15803d', '#84cc16', '#0d9488'
  ];
  const expensePalette = [
    '#c74634', '#d97706', '#dc2626', '#b45309', '#7e22ce', '#e11d48', '#9333ea', '#ea580c'
  ];

  if (catType === 'income') {
    if (categoryChartTitle) categoryChartTitle.textContent = 'Income Sources';
    if (categoryChartSubtitle) categoryChartSubtitle.textContent = 'Where club funds are received from';
    categoryLabels = Object.keys(incomeCatMap);
    categoryValues = Object.values(incomeCatMap);
    categoryColors = incomePalette.slice(0, categoryLabels.length);
  } else if (catType === 'expense') {
    if (categoryChartTitle) categoryChartTitle.textContent = 'Expense Categories';
    if (categoryChartSubtitle) categoryChartSubtitle.textContent = 'Where club funds are spent';
    categoryLabels = Object.keys(expenseCatMap);
    categoryValues = Object.values(expenseCatMap);
    categoryColors = expensePalette.slice(0, categoryLabels.length);
  } else {
    // Both Income & Expenses ('all')
    if (categoryChartTitle) categoryChartTitle.textContent = 'Category Breakdown (Both)';
    if (categoryChartSubtitle) categoryChartSubtitle.textContent = 'Distribution of Inflows & Outflows';

    const inKeys = Object.keys(incomeCatMap);
    const exKeys = Object.keys(expenseCatMap);

    inKeys.forEach((k, idx) => {
      categoryLabels.push(`[In] ${k}`);
      categoryValues.push(incomeCatMap[k]);
      categoryColors.push(incomePalette[idx % incomePalette.length]);
    });

    exKeys.forEach((k, idx) => {
      categoryLabels.push(`[Ex] ${k}`);
      categoryValues.push(expenseCatMap[k]);
      categoryColors.push(expensePalette[idx % expensePalette.length]);
    });
  }

  const categoryCanvas = document.getElementById('categoryChart');
  if (AppState.chartCategory) {
    AppState.chartCategory.destroy();
    AppState.chartCategory = null;
  }

  if (categoryLabels.length === 0) {
    categoryLabels = ['No Data Yet'];
    categoryValues = [1];
    categoryColors = ['#8c887f'];
  }

  if (categoryCanvas) {
    try {
      AppState.chartCategory = new Chart(categoryCanvas, {
        type: 'doughnut',
        data: {
          labels: categoryLabels,
          datasets: [{
            data: categoryValues,
            backgroundColor: categoryColors,
            borderWidth: 2,
            borderColor: isLight ? '#ffffff' : '#211f1d'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: textColor,
                font: { family: chartFontFamily, size: 11, weight: '500' },
                boxWidth: 10
              }
            },
            tooltip: {
              backgroundColor: isLight ? '#ffffff' : '#211f1d',
              titleColor: isLight ? '#161513' : '#f7f6f3',
              bodyColor: isLight ? '#524e47' : '#c4c0b8',
              borderColor: isLight ? '#dedad2' : '#3a3733',
              borderWidth: 1,
              padding: 8,
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ₹${ctx.parsed.toLocaleString('en-IN')}`
              }
            }
          },
          cutout: '65%'
        }
      });
    } catch (e) {
      console.error('Error creating category chart:', e);
    }
  }
}

// Helper: Convert File object to Base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// ==========================================
// Form Submission Handlers
// ==========================================
async function handleAddIncomeSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('incomeAmount').value);
  const title = document.getElementById('incomeTitle').value.trim();
  const category = document.getElementById('incomeCategory').value;
  const date = document.getElementById('incomeDate').value;
  const paymentMode = document.getElementById('incomePaymentMode').value;
  const createdBy = document.getElementById('incomeCreatedBy').value.trim() || 'Admin';
  const notes = document.getElementById('incomeNotes').value.trim();
  const fileInput = document.getElementById('incomeInvoiceFile');

  if (!amount || amount <= 0 || !title) {
    showToast('Please enter a valid amount and income title.', 'error');
    return;
  }

  let fileData = null;
  let fileName = null;
  let fileMimeType = null;

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    fileName = file.name;
    fileMimeType = file.type || 'application/pdf';
    fileData = await fileToBase64(file);
  }

  const newTxn = {
    id: 'TXN-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14) + '-' + Math.floor(Math.random() * 1000),
    type: 'income',
    title: title,
    category: category,
    amount: amount,
    date: date,
    paymentMode: paymentMode,
    createdBy: createdBy,
    notes: notes,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    fileData: fileData,
    fileName: fileName,
    fileMimeType: fileMimeType
  };

  Elements.submitIncomeBtn.disabled = true;
  Elements.submitIncomeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving & Uploading...';

  try {
    let res = null;
    if (AppState.googleScriptUrl) {
      res = await sendToGoogleSheet(newTxn);
    }

    const invoiceUrl = (res && res.data && res.data.InvoiceUrl) ? res.data.InvoiceUrl : '';
    const invoiceUploadError = (res && res.data && res.data.InvoiceUploadError) ? res.data.InvoiceUploadError : '';

    // Save to state
    const normalizedItem = {
      ID: newTxn.id,
      Type: 'income',
      Title: newTxn.title,
      Category: newTxn.category,
      Amount: newTxn.amount,
      Date: newTxn.date,
      PaymentMode: newTxn.paymentMode,
      CreatedBy: newTxn.createdBy,
      Notes: newTxn.notes,
      InvoiceUrl: invoiceUrl,
      Timestamp: newTxn.timestamp
    };

    AppState.transactions.unshift(normalizedItem);
    localStorage.setItem('pulari_local_transactions', JSON.stringify(AppState.transactions));

    updateDashboard();
    closeModal('addIncomeModal');
    Elements.addIncomeForm.reset();
    initDates();
    showToast(invoiceUploadError
      ? `Income saved, but the invoice was not uploaded. ${invoiceUploadError}`
      : `Income of ₹${amount.toLocaleString('en-IN')} added successfully!`, invoiceUploadError ? 'error' : 'success');

  } catch (error) {
    console.error(error);
    showToast('Failed to save to Google Sheets. Check connection.', 'error');
  } finally {
    Elements.submitIncomeBtn.disabled = false;
    Elements.submitIncomeBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Save Income';
  }
}

async function handleAddExpenseSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const title = document.getElementById('expenseTitle').value.trim();
  const category = document.getElementById('expenseCategory').value;
  const date = document.getElementById('expenseDate').value;
  const paymentMode = document.getElementById('expensePaymentMode').value;
  const createdBy = document.getElementById('expenseCreatedBy').value.trim() || 'Admin';
  const notes = document.getElementById('expenseNotes').value.trim();
  const fileInput = document.getElementById('expenseInvoiceFile');

  if (!amount || amount <= 0 || !title) {
    showToast('Please enter a valid amount and description.', 'error');
    return;
  }

  let fileData = null;
  let fileName = null;
  let fileMimeType = null;

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    fileName = file.name;
    fileMimeType = file.type || 'application/pdf';
    fileData = await fileToBase64(file);
  }

  const newTxn = {
    id: 'TXN-' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14) + '-' + Math.floor(Math.random() * 1000),
    type: 'expense',
    title: title,
    category: category,
    amount: amount,
    date: date,
    paymentMode: paymentMode,
    createdBy: createdBy,
    notes: notes,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    fileData: fileData,
    fileName: fileName,
    fileMimeType: fileMimeType
  };

  Elements.submitExpenseBtn.disabled = true;
  Elements.submitExpenseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Recording & Uploading...';

  try {
    let res = null;
    if (AppState.googleScriptUrl) {
      res = await sendToGoogleSheet(newTxn);
    }

    const invoiceUrl = (res && res.data && res.data.InvoiceUrl) ? res.data.InvoiceUrl : '';
    const invoiceUploadError = (res && res.data && res.data.InvoiceUploadError) ? res.data.InvoiceUploadError : '';

    // Save to state
    const normalizedItem = {
      ID: newTxn.id,
      Type: 'expense',
      Title: newTxn.title,
      Category: newTxn.category,
      Amount: newTxn.amount,
      Date: newTxn.date,
      PaymentMode: newTxn.paymentMode,
      CreatedBy: newTxn.createdBy,
      Notes: newTxn.notes,
      InvoiceUrl: invoiceUrl,
      Timestamp: newTxn.timestamp
    };

    AppState.transactions.unshift(normalizedItem);
    localStorage.setItem('pulari_local_transactions', JSON.stringify(AppState.transactions));

    updateDashboard();
    closeModal('addExpenseModal');
    Elements.addExpenseForm.reset();
    initDates();
    showToast(invoiceUploadError
      ? `Expense saved, but the invoice was not uploaded. ${invoiceUploadError}`
      : `Expense of ₹${amount.toLocaleString('en-IN')} recorded successfully.`, invoiceUploadError ? 'error' : 'success');

  } catch (error) {
    console.error(error);
    showToast('Failed to save to Google Sheets. Check connection.', 'error');
  } finally {
    Elements.submitExpenseBtn.disabled = false;
    Elements.submitExpenseBtn.innerHTML = '<i class="fa-solid fa-minus"></i> Record Expense';
  }
}

async function sendToGoogleSheet(item) {
  const response = await fetch(AppState.googleScriptUrl, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8' // Standard for Apps Script without preflight
    },
    body: JSON.stringify(item)
  });

  const res = await response.json();
  if (res.status !== 'success') {
    throw new Error(res.message || 'Error recording in sheet');
  }
  return res;
}

// ==========================================
// Settings & Google Apps Script Setup
// ==========================================
async function handleSaveAndTestUrl() {
  const url = Elements.googleScriptUrlInput.value.trim();

  if (!url) {
    showToast('Please enter a valid Google Apps Script Web App URL.', 'error');
    return;
  }

  Elements.saveAndTestUrlBtn.disabled = true;
  Elements.saveAndTestUrlBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing Connection...';

  try {
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    const data = await response.json();

    if (data && data.status === 'success') {
      AppState.googleScriptUrl = url;
      localStorage.setItem('pulari_sheet_api_url', url);
      closeModal('settingsModal');
      showToast('Connected to Google Sheet successfully!', 'success');
      syncData(true);
    } else {
      throw new Error(data.message || 'Could not verify sheet response');
    }
  } catch (err) {
    showToast('Connection failed. Make sure the Web App is deployed with "Anyone" access.', 'error');
  } finally {
    Elements.saveAndTestUrlBtn.disabled = false;
    Elements.saveAndTestUrlBtn.innerHTML = '<i class="fa-solid fa-link"></i> Save & Test Connection';
  }
}

function handleUseDemoData() {
  AppState.googleScriptUrl = '';
  localStorage.removeItem('pulari_sheet_api_url');
  Elements.googleScriptUrlInput.value = '';
  AppState.transactions = [...DEMO_TRANSACTIONS];
  localStorage.setItem('pulari_local_transactions', JSON.stringify(AppState.transactions));
  closeModal('settingsModal');
  setSyncStatus('offline', 'Demo Mode');
  updateDashboard();
  showToast('Switched to Pulari Club demo dataset.', 'info');
}

function initAppsScriptSnippet() {
  const snippet = `const TRANSACTIONS_SHEET_NAME = "Transactions";
const INCOME_SHEET_NAME = "Income";
const EXPENSE_SHEET_NAME = "Expenses";
const INVOICE_FOLDER_ID = "1PuBuDfmdQDxdytIS-_Es9JeZ1CSWGeBx";

const TRANSACTIONS_HEADERS = ["ID", "Type", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "CreatedBy", "InvoiceUrl", "Timestamp"];
const INCOME_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "ReceivedBy", "InvoiceUrl", "Timestamp"];
const EXPENSE_HEADERS = ["ID", "Title", "Category", "Amount", "Date", "PaymentMode", "Notes", "AuthorizedBy", "InvoiceUrl", "Timestamp"];

function getInvoiceFolder() {
  if (INVOICE_FOLDER_ID && INVOICE_FOLDER_ID.trim() !== "") {
    try { return DriveApp.getFolderById(INVOICE_FOLDER_ID.trim()); }
    catch (err) { Logger.log("Folder by ID access warning: " + err.toString()); }
  }
  const folderName = "Pulari Club Invoices";
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

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
}`;

  Elements.appsScriptSnippet.textContent = snippet;
}

function handleCopyScriptCode() {
  const code = Elements.appsScriptSnippet.textContent;
  navigator.clipboard.writeText(code).then(() => {
    Elements.copyScriptCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      Elements.copyScriptCodeBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Script';
    }, 2000);
    showToast('Apps Script code copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Please copy script manually from the box.', 'info');
  });
}

// ==========================================
// Transaction Details Modal
// ==========================================
window.viewTransactionDetails = function (id) {
  const txn = AppState.transactions.find(t => t.ID === id);
  if (!txn) return;

  const isIncome = (txn.Type || '').toLowerCase() === 'income';
  Elements.detailModalTitle.textContent = isIncome ? 'Income Details' : 'Expense Details';
  Elements.detailModalIcon.className = `modal-header-icon ${isIncome ? 'income' : 'expense'}`;
  Elements.detailModalIcon.innerHTML = `<i class="fa-solid ${isIncome ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>`;

  const bodyHtml = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}" style="font-size: 0.85rem; padding: 0.35rem 0.85rem; margin-bottom: 0.5rem;">
        ${(txn.Type || 'Transaction').toUpperCase()}
      </span>
      <h2 style="font-size: 2rem; color: ${isIncome ? 'var(--income-color)' : 'var(--expense-color)'};">
        ${isIncome ? '+' : '-'} ${formatCurrency(txn.Amount)}
      </h2>
      <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-top: 0.25rem;">
        ${escapeHtml(txn.Title || 'Untitled')}
      </p>
    </div>

    <div style="background: var(--bg-tertiary); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-subtle);">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.85rem;">
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Transaction ID</label>
          <div style="font-size: 0.85rem; font-family: monospace; color: var(--text-primary);">${escapeHtml(txn.ID || '-')}</div>
        </div>
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Category</label>
          <div style="font-size: 0.88rem; font-weight: 600; color: var(--brand-primary);">${escapeHtml(txn.Category || '-')}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.85rem;">
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Date</label>
          <div style="font-size: 0.88rem; color: var(--text-primary);">${formatDateDisplay(txn.Date)}</div>
        </div>
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Payment Mode</label>
          <div style="font-size: 0.88rem; color: var(--text-primary);">${escapeHtml(txn.PaymentMode || 'Cash')}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.85rem;">
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Recorded By</label>
          <div style="font-size: 0.88rem; color: var(--text-primary);">${escapeHtml(txn.CreatedBy || 'Admin')}</div>
        </div>
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Logged Time</label>
          <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(txn.Timestamp || '-')}</div>
        </div>
      </div>

      <div style="margin-bottom: 0.85rem;">
        <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Notes & Reference</label>
        <div style="font-size: 0.88rem; color: var(--text-secondary); background: var(--bg-glass-input); padding: 0.65rem; border-radius: var(--radius-sm); margin-top: 0.25rem;">
          ${escapeHtml(txn.Notes || 'No notes provided.')}
        </div>
      </div>

      ${txn.InvoiceUrl ? `
        <div>
          <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Invoice Attachment</label>
          <div style="margin-top: 0.35rem;">
            <a href="${escapeHtml(txn.InvoiceUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
              <i class="fa-solid fa-file-pdf" style="font-size: 1.1rem;"></i>
              <span>View Invoice PDF on Google Drive</span>
              <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i>
            </a>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  Elements.detailModalBody.innerHTML = bodyHtml;
  openModal('detailModal');
};

// ==========================================
// Excel (.xlsx) Export (Multi-Tab)
// ==========================================
function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('Excel library not loaded. Check internet connection.', 'error');
    return;
  }

  const filtered = getFilteredTransactions();
  if (filtered.length === 0) {
    showToast('No transactions to export.', 'error');
    return;
  }

  const wb = XLSX.utils.book_new();

  // 1. All Transactions Sheet
  const allHeaders = ['Transaction ID', 'Type', 'Title', 'Category', 'Amount (INR)', 'Date', 'Payment Mode', 'Notes', 'Person', 'Timestamp'];
  const allData = [
    allHeaders,
    ...filtered.map(t => [
      t.ID || '',
      (t.Type || '').toUpperCase(),
      t.Title || '',
      t.Category || '',
      parseFloat(t.Amount) || 0,
      t.Date || '',
      t.PaymentMode || '',
      t.Notes || '',
      t.CreatedBy || '',
      t.Timestamp || ''
    ])
  ];
  const wsAll = XLSX.utils.aoa_to_sheet(allData);
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Transactions');

  // 2. Income Sheet
  const incomeList = filtered.filter(t => (t.Type || '').toLowerCase() === 'income');
  const incomeHeaders = ['Transaction ID', 'Title', 'Category', 'Amount (INR)', 'Date', 'Payment Mode', 'Notes', 'Received By', 'Timestamp'];
  const incomeData = [
    incomeHeaders,
    ...incomeList.map(t => [
      t.ID || '',
      t.Title || '',
      t.Category || '',
      parseFloat(t.Amount) || 0,
      t.Date || '',
      t.PaymentMode || '',
      t.Notes || '',
      t.CreatedBy || '',
      t.Timestamp || ''
    ])
  ];
  const wsIncome = XLSX.utils.aoa_to_sheet(incomeData);
  XLSX.utils.book_append_sheet(wb, wsIncome, 'Income');

  // 3. Expenses Sheet
  const expenseList = filtered.filter(t => (t.Type || '').toLowerCase() === 'expense');
  const expenseHeaders = ['Transaction ID', 'Title', 'Category', 'Amount (INR)', 'Date', 'Payment Mode', 'Notes', 'Authorized By', 'Timestamp'];
  const expenseData = [
    expenseHeaders,
    ...expenseList.map(t => [
      t.ID || '',
      t.Title || '',
      t.Category || '',
      parseFloat(t.Amount) || 0,
      t.Date || '',
      t.PaymentMode || '',
      t.Notes || '',
      t.CreatedBy || '',
      t.Timestamp || ''
    ])
  ];
  const wsExpense = XLSX.utils.aoa_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(wb, wsExpense, 'Expenses');

  // 4. Financial Summary Sheet
  let totalInc = incomeList.reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);
  let totalExp = expenseList.reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);
  let netBal = totalInc - totalExp;

  const summaryData = [
    ['PULARI ARTS & SPORTS CLUB - FINANCIAL SUMMARY'],
    ['Generated On', new Date().toLocaleString('en-IN')],
    [''],
    ['Metric', 'Amount (INR)', 'Record Count'],
    ['Total Income', totalInc, incomeList.length],
    ['Total Expenses', totalExp, expenseList.length],
    ['Net Available Balance', netBal, filtered.length],
    ['Status', netBal >= 0 ? 'Surplus' : 'Deficit', '']
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Pulari_Club_Accounts_${dateStr}.xlsx`);
  showToast('Excel workbook exported successfully!', 'success');
}

// ==========================================
// ==========================================
// Lightweight Compressed JPEG Logo Loader Helper for PDF Header
// Loads PULARI.jpg and compresses it via HTML5 Canvas to keep PDF file size minimal
// ==========================================
function loadJpgLogoBase64() {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const targetWidth = 240;
        const targetHeight = (img.naturalHeight / img.naturalWidth) * targetWidth || 240;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = 'PULARI.jpg';
  });
}

// ==========================================
// Malayalam support for PDF export
// jsPDF cannot shape Malayalam (conjuncts / vowel signs), so any table cell
// containing Malayalam is drawn through the browser's text engine (canvas)
// using Noto Sans Malayalam and placed in the PDF as a crisp image.
// ==========================================
const ML_REGEX = /[\u0D00-\u0D7F]/;
const ML_FONT_FAMILY = 'PulariNotoMalayalam';
const ML_CANVAS_STACK = `'${ML_FONT_FAMILY}', 'Noto Sans Malayalam', 'Nirmala UI', 'Kartika', Helvetica, Arial, sans-serif`;
const ML_COL_WIDTHS = [7, 18, 52, 28, 18, 38, 29]; // must match ledger columnStyles
const ML_PX_PER_MM = 12;                           // ~300 dpi
let _mlFontPromise = null;

function hasMalayalam(str) {
  return ML_REGEX.test(String(str == null ? '' : str));
}

function loadMalayalamFont() {
  if (_mlFontPromise) return _mlFontPromise;
  _mlFontPromise = (async () => {
    try {
      if (!window.FontFace || !document.fonts) return;
      let source = null;
      if (window.MALAYALAM_FONT_REGULAR) {
        const bin = atob(window.MALAYALAM_FONT_REGULAR);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        source = bytes.buffer;
      } else {
        source = 'url(NotoSansMalayalam-Regular.ttf)';
      }
      const face = new FontFace(ML_FONT_FAMILY, source);
      await face.load();
      document.fonts.add(face);
    } catch (e) {
      console.warn('Malayalam font load failed, using system fallback fonts:', e);
    }
  })();
  return _mlFontPromise;
}

// Split text into lines that fit maxWidthPx (word wrap, grapheme-safe hard break)
function wrapMalayalamText(ctx, text, maxWidthPx) {
  const segmenter = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter('ml', { granularity: 'grapheme' }) : null;
  const graphemes = (w) => segmenter ? Array.from(segmenter.segment(w), x => x.segment) : Array.from(w);
  const lines = [];
  String(text).split(/\r?\n/).forEach(paragraph => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width <= maxWidthPx) {
        line = test;
        return;
      }
      if (line) { lines.push(line); line = ''; }
      if (ctx.measureText(word).width <= maxWidthPx) {
        line = word;
      } else {
        let chunk = '';
        graphemes(word).forEach(g => {
          if (chunk && ctx.measureText(chunk + g).width > maxWidthPx) { lines.push(chunk); chunk = g; }
          else chunk += g;
        });
        line = chunk;
      }
    });
    lines.push(line);
  });
  return lines.length ? lines : [''];
}

// autoTable didParseCell hook: reserve height for Malayalam cells
function mlParseCell(data) {
  if (data.section !== 'body') return;
  const raw = data.cell.raw;
  if (!hasMalayalam(raw)) return;
  const colW = ML_COL_WIDTHS[data.column.index];
  if (!colW) return;

  const fontPt = data.cell.styles.fontSize || 7;
  const fontMM = fontPt * 0.3528;
  const pad = (typeof data.cell.padding === 'function') ? data.cell.padding('left') : 1.5;
  const padV = (typeof data.cell.padding === 'function') ? data.cell.padding('top') : 1.5;
  const innerW = colW - pad * 2;
  const lineH = fontMM * 1.6;

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = `${fontMM * ML_PX_PER_MM}px ${ML_CANVAS_STACK}`;
  const lines = wrapMalayalamText(ctx, raw, innerW * ML_PX_PER_MM);

  data.cell._ml = { lines, fontMM, lineH, innerW, pad, padV };
  data.cell.text = lines.map(() => ' ');
  data.cell.styles.minCellHeight = lines.length * lineH + padV * 2;
}

// autoTable didDrawCell hook: paint the shaped Malayalam text image
function mlDrawCell(doc, data) {
  const ml = data.cell._ml;
  if (!ml) return;
  const wPx = Math.ceil(ml.innerW * ML_PX_PER_MM);
  const hPx = Math.ceil(ml.lines.length * ml.lineH * ML_PX_PER_MM);
  const c = document.createElement('canvas');
  c.width = wPx;
  c.height = hPx;
  const ctx = c.getContext('2d');
  ctx.font = `${ml.fontMM * ML_PX_PER_MM}px ${ML_CANVAS_STACK}`;
  ctx.fillStyle = '#1e293b';
  ctx.textBaseline = 'middle';
  ml.lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i + 0.5) * ml.lineH * ML_PX_PER_MM);
  });
  try {
    doc.addImage(c.toDataURL('image/png'), 'PNG', data.cell.x + ml.pad, data.cell.y + ml.padV, ml.innerW, ml.lines.length * ml.lineH, undefined, 'FAST');
  } catch (e) {
    console.warn('Could not draw Malayalam cell:', e);
  }
}

// ==========================================
// PDF Statement Export (jsPDF + AutoTable)
// Structure: 1. All Incomes -> 2. All Expenses -> 3. Executive Summary + Verified Seal
// ==========================================
async function exportToPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast('PDF library not loaded. Check internet connection.', 'error');
    return;
  }

  const filtered = getFilteredTransactions();
  if (filtered.length === 0) {
    showToast('No transactions to export.', 'error');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Load compressed JPEG logo (PULARI.jpg) for top header only
  const logoJpgBase64 = await loadJpgLogoBase64();

  // Preload Malayalam font only when the report actually contains Malayalam text
  if (filtered.some(t => hasMalayalam(t.Title) || hasMalayalam(t.Category) || hasMalayalam(t.Notes) || hasMalayalam(t.PaymentMode))) {
    await loadMalayalamFont();
  }

  // Separate Income and Expense records
  const incomeList = filtered.filter(t => (t.Type || '').toLowerCase().trim() === 'income');
  const expenseList = filtered.filter(t => (t.Type || '').toLowerCase().trim() === 'expense');

  const totalInc = incomeList.reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);
  const totalExp = expenseList.reduce((sum, t) => sum + (parseFloat(t.Amount) || 0), 0);
  const netBal = totalInc - totalExp;

  // 1. Top Compact Header Banner (Drawn on Page 1)
  doc.setFillColor(15, 23, 42); // Slate #0f172a
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Emerald accent stripe
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 24, pageWidth, 1.8, 'F');

  let textStartX = 10;
  if (logoJpgBase64) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(9.5, 3.5, 17, 17, 2, 2, 'F');
      doc.addImage(logoJpgBase64, 'JPEG', 10, 4, 16, 16);
      textStartX = 30;
    } catch (e) {
      console.warn('Could not render PULARI.jpg logo in header:', e);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('PULARI ARTS & SPORTS CLUB', textStartX, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('FINANCIAL AUDIT STATEMENT REPORT', textStartX, 15);

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${reportDate}`, textStartX, 20);

  let currentY = 30;

  // ==========================================
  // SECTION 1: ALL INCOME RECORDS
  // ==========================================
  const incomeRows = incomeList.map((t, idx) => [
    idx + 1,
    formatDateDisplay(t.Date),
    t.Title || 'Untitled Income',
    t.Category || 'General',
    t.PaymentMode || 'Cash',
    t.Notes || '-',
    `+ Rs. ${(parseFloat(t.Amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  ]);

  if (incomeRows.length === 0) {
    incomeRows.push(['-', '-', 'No income records found for this period', '-', '-', '-', 'Rs. 0.00']);
  }

  // Income Section Header Bar
  doc.setFillColor(6, 95, 70); // Emerald green #065f46
  doc.roundedRect(10, currentY, pageWidth - 20, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`1. INCOME & RECEIPTS LEDGER (${incomeList.length} Entries • Total: Rs. ${totalInc.toLocaleString('en-IN')})`, 13, currentY + 4.2);

  currentY += 7.5;

  doc.autoTable({
    startY: currentY,
    head: [['#', 'Date', 'Description / Title', 'Category', 'Mode', 'Notes & Reference', 'Amount (INR)']],
    body: incomeRows,
    foot: [
      ['', '', `SUBTOTAL INCOME (${incomeList.length} Entries)`, '', '', '', `+ Rs. ${totalInc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1.5
    },
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: 1.5,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 1.5
    },
    footStyles: {
      fillColor: [236, 253, 245],
      textColor: [6, 95, 70],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 1.5,
      halign: 'right'
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 18 },
      2: { cellWidth: 52 },
      3: { cellWidth: 28 },
      4: { cellWidth: 18 },
      5: { cellWidth: 38 },
      6: { cellWidth: 29, halign: 'right', fontStyle: 'bold', textColor: [6, 95, 70] }
    },
    didParseCell: mlParseCell,
    didDrawCell: (data) => mlDrawCell(doc, data),
    margin: { left: 10, right: 10 }
  });

  // ==========================================
  // SECTION 2: ALL EXPENSE RECORDS
  // ==========================================
  currentY = doc.lastAutoTable.finalY + 6;
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 12;
  }

  const expenseRows = expenseList.map((t, idx) => [
    idx + 1,
    formatDateDisplay(t.Date),
    t.Title || 'Untitled Expense',
    t.Category || 'General',
    t.PaymentMode || 'Cash',
    t.Notes || '-',
    `- Rs. ${(parseFloat(t.Amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  ]);

  if (expenseRows.length === 0) {
    expenseRows.push(['-', '-', 'No expense records found for this period', '-', '-', '-', 'Rs. 0.00']);
  }

  // Expense Section Header Bar
  doc.setFillColor(153, 27, 27); // Crimson red #991b1b
  doc.roundedRect(10, currentY, pageWidth - 20, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`2. EXPENSES & EXPENDITURES LEDGER (${expenseList.length} Entries • Total: Rs. ${totalExp.toLocaleString('en-IN')})`, 13, currentY + 4.2);

  currentY += 7.5;

  doc.autoTable({
    startY: currentY,
    head: [['#', 'Date', 'Description / Purpose', 'Category', 'Mode', 'Notes & Reference', 'Amount (INR)']],
    body: expenseRows,
    foot: [
      ['', '', `SUBTOTAL EXPENSES (${expenseList.length} Entries)`, '', '', '', `- Rs. ${totalExp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1.5
    },
    headStyles: {
      fillColor: [153, 27, 27],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: 1.5,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 1.5
    },
    footStyles: {
      fillColor: [254, 242, 242],
      textColor: [153, 27, 27],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 1.5,
      halign: 'right'
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 18 },
      2: { cellWidth: 52 },
      3: { cellWidth: 28 },
      4: { cellWidth: 18 },
      5: { cellWidth: 38 },
      6: { cellWidth: 29, halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] }
    },
    didParseCell: mlParseCell,
    didDrawCell: (data) => mlDrawCell(doc, data),
    margin: { left: 10, right: 10 }
  });

  // ==========================================
  // SECTION 3: EXECUTIVE FINANCIAL SUMMARY (AT THE END)
  // ==========================================
  currentY = doc.lastAutoTable.finalY + 6;
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 12;
  }

  // Summary Section Header Bar
  doc.setFillColor(15, 23, 42); // Slate dark #0f172a
  doc.roundedRect(10, currentY, pageWidth - 20, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('3. FINAL EXECUTIVE FINANCIAL SUMMARY & NET POSITION', 13, currentY + 4.2);

  currentY += 7.5;

  const statusText = netBal >= 0 ? 'Surplus Fund (Positive Reserve)' : 'Deficit (Expenditure Exceeds Inflow)';
  const netSign = netBal >= 0 ? '+' : '-';

  doc.autoTable({
    startY: currentY,
    head: [['Financial Metric', 'Count / Details', 'Amount (INR)']],
    body: [
      ['Total Inflow (Income & Collections)', `${incomeList.length} Recorded Entries`, `+ Rs. ${totalInc.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Total Outflow (Expenditures & Bills)', `${expenseList.length} Recorded Entries`, `- Rs. ${totalExp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['NET AVAILABLE BALANCE', `${filtered.length} Total Transactions`, `${netSign} Rs. ${Math.abs(netBal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Club Financial Status', 'Account Health Indicator', statusText]
    ],
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 1.5
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 1.5
    },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 50 },
      2: { cellWidth: 70, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function (data) {
      if (data.section === 'body') {
        if (data.row.index === 0 && data.column.index === 2) {
          data.cell.styles.textColor = [6, 95, 70];
        }
        if (data.row.index === 1 && data.column.index === 2) {
          data.cell.styles.textColor = [153, 27, 27];
        }
        if (data.row.index === 2) {
          data.cell.styles.fillColor = netBal >= 0 ? [236, 253, 245] : [254, 242, 242];
          data.cell.styles.textColor = netBal >= 0 ? [6, 95, 70] : [153, 27, 27];
          data.cell.styles.fontSize = 8.5;
        }
        if (data.row.index === 3 && data.column.index === 2) {
          data.cell.styles.textColor = netBal >= 0 ? [6, 95, 70] : [153, 27, 27];
        }
      }
    },
    margin: { left: 10, right: 10 }
  });

  // ==========================================
  // SIGNATURES & AUTHORIZATION SEAL (COMPACT & WITHOUT LOGO IN SEAL BOX)
  // ==========================================
  let signY = doc.lastAutoTable.finalY + 8;
  if (signY > pageHeight - 30) {
    doc.addPage();
    signY = 14;
  }

  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.3);

  const boxWidth = (pageWidth - 20 - 10) / 3; // ~59.6mm per sign box

  // 1. Treasurer Sign Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, signY, boxWidth, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Prepared by:', 13, signY + 5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Treasurer / Admin', 13, signY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Accounts Reconciled', 13, signY + 16);

  // 2. Secretary Sign Box
  doc.setFillColor(248, 250, 252);
  const box2X = 10 + boxWidth + 5;
  doc.roundedRect(box2X, signY, boxWidth, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Verified by:', box2X + 3, signY + 5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Secretary / President', box2X + 3, signY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Executive Committee', box2X + 3, signY + 16);

  // 3. Official Authorization Seal (NO LOGO inside box, clean & compact)
  const sealX = 10 + (boxWidth + 5) * 2;
  doc.setFillColor(240, 253, 244); // Light Emerald Background #f0fdf4
  doc.setDrawColor(187, 247, 208); // Light emerald border #bbf7d0
  doc.roundedRect(sealX, signY, boxWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 95, 70);
  doc.text('Authorization Seal:', sealX + 3, signY + 4.5);

  // Verified Badge with green tick
  doc.setFillColor(16, 185, 129); // Emerald Green #10b981
  doc.roundedRect(sealX + 3, signY + 6.2, boxWidth - 6, 5.2, 1, 1, 'F');

  // Crisp white checkmark icon
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.45);
  doc.line(sealX + 13, signY + 8.8, sealX + 14.2, signY + 10);
  doc.line(sealX + 14.2, signY + 10, sealX + 16.5, signY + 7.5);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('OFFICIALLY VERIFIED', sealX + (boxWidth / 2) + 2, signY + 9.8, { align: 'center' });

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Pulari Arts & Sports Club', sealX + 3, signY + 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Official Accounts Approved', sealX + 3, signY + 18);

  // ==========================================
  // FOOTER & PAGE NUMBERING (ALL PAGES)
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // #94a3b8

    // Footer rule line
    doc.setDrawColor(226, 232, 240);
    doc.line(10, pageHeight - 8, pageWidth - 10, pageHeight - 8);

    doc.text('Pulari Arts & Sports Club • Confidential Financial Statement Report', 10, pageHeight - 4);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 24, pageHeight - 4);
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Pulari_Club_Statement_${dateStr}.pdf`);
  showToast(`PDF Statement exported successfully (${totalPages} page${totalPages > 1 ? 's' : ''})!`, 'success');
}
// ==========================================
// Modal Helpers
// ==========================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
  }
}

// ==========================================
// Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  Elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// Utility Helpers
// ==========================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}