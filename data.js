// Sample expenses data (for demo purposes)
const sampleExpenses = [
    {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: "Hotel booking",
        amount: 150,
        currency: "USD",
        category: "accommodation"
    },
    {
        id: Date.now() + 1,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        description: "Dinner at restaurant",
        amount: 35,
        currency: "EUR",
        category: "food"
    },
    {
        id: Date.now() + 2,
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
        description: "Museum tickets",
        amount: 24,
        currency: "GBP",
        category: "activities"
    }
];

// Default budget configuration
const defaultBudget = {
    total: 1000,
    currency: "USD",
    categories: {
        accommodation: 400,
        food: 300,
        transport: 150,
        activities: 100,
        shopping: 30,
        other: 20
    }
};

// Current exchange rates (base: USD)
const exchangeRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    KWD: 0.30,  // Kuwaiti Dinar
    SAR: 3.75,  // Saudi Riyal
    CHF: 0.92,  // Swiss Franc
    JPY: 110.25, // Japanese Yen
    AUD: 1.35,  // Australian Dollar
    CAD: 1.25,  // Canadian Dollar
    lastUpdated: new Date().toLocaleString()
};

// Category metadata for UI
const categories = {
    accommodation: {
        name: "Accommodation",
        icon: "fa-hotel",
        color: "#3498db"
    },
    food: {
        name: "Food",
        icon: "fa-utensils",
        color: "#2ecc71"
    },
    transport: {
        name: "Transport",
        icon: "fa-bus",
        color: "#f39c12"
    },
    activities: {
        name: "Activities",
        icon: "fa-ticket-alt",
        color: "#9b59b6"
    },
    shopping: {
        name: "Shopping",
        icon: "fa-shopping-bag",
        color: "#e74c3c"
    },
    other: {
        name: "Other",
        icon: "fa-ellipsis-h",
        color: "#95a5a6"
    }
};

// Get currency symbol
function getCurrencySymbol(currencyCode) {
    const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        KWD: 'KD',
        SAR: 'SR',
        CHF: 'CHF',
        JPY: '¥',
        AUD: 'A$',
        CAD: 'C$'
    };
    return symbols[currencyCode] || currencyCode;
}

// Format money amount
function formatMoney(amount, currency) {
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
}

// Get flag emoji for currency
function getCurrencyFlag(currencyCode) {
    const flags = {
        USD: '🇺🇸',
        EUR: '🇪🇺',
        GBP: '🇬🇧',
        KWD: '🇰🇼',
        SAR: '🇸🇦',
        CHF: '🇨🇭',
        JPY: '🇯🇵',
        AUD: '🇦🇺',
        CAD: '🇨🇦'
    };
    return flags[currencyCode] || '';
}

// Load data from localStorage
function loadData() {
    let expenses = JSON.parse(localStorage.getItem('wanderWalletExpenses')) || sampleExpenses;
    let budget = JSON.parse(localStorage.getItem('wanderWalletBudget')) || defaultBudget;
    
    return { expenses, budget };
}

// Save data to localStorage
function saveData(expenses, budget) {
    localStorage.setItem('wanderWalletExpenses', JSON.stringify(expenses));
    localStorage.setItem('wanderWalletBudget', JSON.stringify(budget));
}

// Initialize data if empty
function initializeData() {
    if (!localStorage.getItem('wanderWalletExpenses')) {
        saveData(sampleExpenses, defaultBudget);
    }
}

// Convert amount between currencies
function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[toCurrency];
}

// Get all supported currencies
function getSupportedCurrencies() {
    return Object.keys(exchangeRates).filter(currency => currency !== 'lastUpdated');
}

// For modular JavaScript (if you're using import/export)
export {
    sampleExpenses,
    defaultBudget,
    exchangeRates,
    categories,
    getCurrencySymbol,
    formatMoney,
    getCurrencyFlag,
    loadData,
    saveData,
    initializeData,
    convertCurrency,
    getSupportedCurrencies
};

// For traditional script usage
// Initialize data when script loads
initializeData();
