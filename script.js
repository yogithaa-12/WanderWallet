// Enhanced Global variables
let expenses = [];
let budget = {
    total: 0,
    currency: 'USD',
    categories: {
        accommodation: 0,
        food: 0,
        transport: 0,
        activities: 0,
        shopping: 0,
        other: 0
    }
};

// Enhanced Currency exchange rates with more currencies
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    KWD: 0.30,
    SAR: 3.75,
    CHF: 0.92,
    JPY: 110.25,
    AUD: 1.35,
    CAD: 1.25,
    CNY: 6.45,
    lastUpdated: new Date().toLocaleString()
};

// DOM Content Loaded with animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    loadData();
    setupEventListeners();
    updateUI();
    
    // Add animation classes
    setTimeout(() => {
        document.querySelectorAll('.card, table, .chart-container').forEach((el, index) => {
            el.classList.add('fade-in', `delay-${index % 4}`);
        });
    }, 100);
});

// Dark mode toggle functionality
function setupDarkModeToggle() {
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.innerHTML = `
        <button class="toggle-btn" id="dark-mode-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
        </button>
    `;
    document.body.appendChild(toggleBtn);
    
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Enhanced loadData with error handling
function loadData() {
    try {
        const savedExpenses = localStorage.getItem('travelExpenses');
        const savedBudget = localStorage.getItem('travelBudget');
        
        if (savedExpenses) {
            expenses = JSON.parse(savedExpenses);
        } else {
            // Load sample data if no saved data exists
            expenses = [...sampleExpenses];
        }
        
        if (savedBudget) {
            budget = JSON.parse(savedBudget);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Initialize with empty data if there's an error
        expenses = [];
        budget = {
            total: 0,
            currency: 'USD',
            categories: {
                accommodation: 0,
                food: 0,
                transport: 0,
                activities: 0,
                shopping: 0,
                other: 0
            }
        };
    }
}

// Enhanced setupEventListeners with more interactive elements
function setupEventListeners() {
    // Expense form
    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addExpense(e);
            // Show success notification
            showNotification('Expense added successfully!', 'success');
        });
    }
    
    // Budget form
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            setBudget(e);
            showNotification('Budget set successfully!', 'success');
        });
    }
    
    // Category budget form
    const categoryBudgetForm = document.getElementById('category-budget-form');
    if (categoryBudgetForm) {
        categoryBudgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            setCategoryBudgets(e);
            showNotification('Category budgets saved!', 'success');
        });
    }
    
    // Converter form
    const converterForm = document.getElementById('converter-form');
    if (converterForm) {
        converterForm.addEventListener('submit', convertCurrency);
    }
    
    // Setup dark mode toggle
    setupDarkModeToggle();
    
    // Add tooltips to all info icons
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('mouseenter', showTooltip);
        icon.addEventListener('mouseleave', hideTooltip);
    });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced addExpense with validation
function addExpense(e) {
    e.preventDefault();
    
    const date = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const currency = document.getElementById('expense-currency').value;
    const category = document.getElementById('expense-category').value;
    
    // Validation
    if (!date || !description || isNaN(amount) || amount <= 0 || !currency || !category) {
        showNotification('Please fill all fields correctly!', 'error');
        return;
    }
    
    const newExpense = {
        id: Date.now(),
        date,
        description,
        amount,
        currency,
        category
    };
    
    expenses.push(newExpense);
    saveData();
    updateUI();
    e.target.reset();
    
    // Add animation to new expense
    const expenseRow = document.querySelector(`[data-id="${newExpense.id}"]`);
    if (expenseRow) {
        expenseRow.classList.add('highlight');
        setTimeout(() => {
            expenseRow.classList.remove('highlight');
        }, 1000);
    }
}

// Enhanced UI updates with animations
function updateUI() {
    updateDashboard();
    updateExpenseTables();
    updateBudgetProgress();
    updateExchangeRatesTable();
    updateCharts();
    
    // Add pulse animation to cards when data changes
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('pulse');
        setTimeout(() => {
            card.classList.remove('pulse');
        }, 500);
    });
}

// Enhanced dashboard with more metrics
function updateDashboard() {
    const totalBudgetElement = document.getElementById('total-budget');
    const moneySpentElement = document.getElementById('money-spent');
    const moneyRemainingElement = document.getElementById('money-remaining');
    const primaryCurrencyElement = document.getElementById('primary-currency');
    const dailySpendingElement = document.getElementById('daily-spending');
    
    if (totalBudgetElement) {
        totalBudgetElement.textContent = `${budget.total.toFixed(2)} ${budget.currency}`;
    }
    
    if (primaryCurrencyElement) {
        primaryCurrencyElement.textContent = budget.currency;
    }
    
    if (moneySpentElement && moneyRemainingElement) {
        const totalSpent = calculateTotalSpent();
        const totalSpentInBudgetCurrency = convertCurrencyAmount(totalSpent.amount, totalSpent.currency, budget.currency);
        
        moneySpentElement.textContent = `${totalSpentInBudgetCurrency.toFixed(2)} ${budget.currency}`;
        
        const remaining = budget.total - totalSpentInBudgetCurrency;
        moneyRemainingElement.textContent = `${remaining.toFixed(2)} ${budget.currency}`;
        
        // Change color based on remaining amount
        if (remaining < budget.total * 0.2) {
            moneyRemainingElement.style.color = 'var(--danger-color)';
        } else if (remaining < budget.total * 0.5) {
            moneyRemainingElement.style.color = 'var(--warning-color)';
        } else {
            moneyRemainingElement.style.color = 'var(--success-color)';
        }
    }
    
    if (dailySpendingElement) {
        const dailyAvg = calculateDailySpending();
        dailySpendingElement.textContent = `${dailyAvg.toFixed(2)} ${budget.currency}`;
    }
}

// New function to calculate daily spending average
function calculateDailySpending() {
    if (expenses.length === 0) return 0;
    
    // Get trip duration
    const dates = expenses.map(e => new Date(e.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const tripDuration = (maxDate - minDate) / (1000 * 60 * 60 * 24) + 1;
    
    const totalSpent = calculateTotalSpent();
    const totalSpentInBudgetCurrency = convertCurrencyAmount(totalSpent.amount, totalSpent.currency, budget.currency);
    
    return totalSpentInBudgetCurrency / tripDuration;
}

// Enhanced expense tables with sorting
function updateExpenseTables() {
    const recentExpensesTable = document.getElementById('recent-expenses');
    const allExpensesTable = document.getElementById('all-expenses');
    
    if (recentExpensesTable) {
        const tbody = recentExpensesTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        const recentExpenses = expenses.slice(-5).reverse();
        
        recentExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', expense.id);
            row.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td><span class="currency-flag">${getCurrencyFlag(expense.currency)} ${expense.currency}</span></td>
                <td><span class="category-tag ${expense.category}">${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</span></td>
            `;
            tbody.appendChild(row);
        });
    }
    
    if (allExpensesTable) {
        const tbody = allExpensesTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Sort expenses by date (newest first)
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', expense.id);
            row.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td><span class="currency-flag">${getCurrencyFlag(expense.currency)} ${expense.currency}</span></td>
                <td><span class="category-tag ${expense.category}">${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</span></td>
                <td>
                    <button class="delete-btn" data-id="${expense.id}" title="Delete expense">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                showDeleteConfirmation(id);
            });
        });
        
        // Make table headers sortable
        const headers = allExpensesTable.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(index);
            });
        });
    }
}

// Enhanced delete with confirmation modal
function showDeleteConfirmation(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this expense?</p>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        deleteExpense(id);
        modal.remove();
        document.body.style.overflow = '';
        showNotification('Expense deleted successfully!', 'success');
    });
}

// Helper functions for enhanced UI
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getCurrencyFlag(currency) {
    const flags = {
        USD: '🇺🇸',
        EUR: '🇪🇺',
        GBP: '🇬🇧',
        KWD: '🇰🇼',
        SAR: '🇸🇦',
        CHF: '🇨🇭',
        JPY: '🇯🇵',
        AUD: '🇦🇺',
        CAD: '🇨🇦',
        CNY: '🇨🇳'
    };
    return flags[currency] || '';
}

// Add these styles to your CSS for the new UI elements
/*
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
}

.notification.show {
    opacity: 1;
}

.notification.success {
    background-color: var(--success-color);
}

.notification.error {
    background-color: var(--danger-color);
}

.notification.info {
    background-color: var(--primary-color);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.cancel-btn {
    background-color: #ccc;
}

.confirm-btn {
    background-color: var(--danger-color);
}

.currency-flag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.category-tag {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: white;
}

.category-tag.accommodation { background-color: #3498db; }
.category-tag.food { background-color: #2ecc71; }
.category-tag.transport { background-color: #f39c12; }
.category-tag.activities { background-color: #9b59b6; }
.category-tag.shopping { background-color: #e74c3c; }
.category-tag.other { background-color: #95a5a6; }

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

.pulse {
    animation: pulse 0.5s ease;
}

.highlight {
    animation: highlight 1s ease;
}

@keyframes highlight {
    0% { background-color: rgba(46, 204, 113, 0.3); }
    100% { background-color: transparent; }
}
*/