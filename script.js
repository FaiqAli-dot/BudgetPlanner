// Firebase will be initialized after scripts load
let app, auth, database;

// Get Firebase functions - these will be available after Firebase loads
// Firebase compat uses the v8 API structure
function getFirebaseAuth() {
    return window.firebase?.auth;
}

function getFirebaseDatabase() {
    return window.firebase?.database;
}

function initializeFirebase() {
    if (!window.firebase || !window.firebaseConfig) {
        console.error('Firebase or firebaseConfig not available');
        return false;
    }
    
    // Firebase compat uses the v8 API structure
    app = window.firebase.initializeApp(window.firebaseConfig);
    auth = window.firebase.auth();
    database = window.firebase.database();
    return true;
}

// Predefined expense categories
const EXPENSE_CATEGORIES = [
    { name: 'Venue', description: 'Wedding hall or outdoor venue rental', estimatedBudget: 300000, icon: '🏛️' },
    { name: 'Catering', description: 'Food and beverages for guests', estimatedBudget: 400000, icon: '🍽️' },
    { name: 'Photography', description: 'Professional photographer and videographer', estimatedBudget: 100000, icon: '📸' },
    { name: 'Decoration', description: 'Flowers, lights, and decorations', estimatedBudget: 80000, icon: '🌸' },
    { name: 'Music & Entertainment', description: 'DJ, band, or live entertainment', estimatedBudget: 60000, icon: '🎵' },
    { name: 'Invitations & Stationery', description: 'Cards, invites, and printed materials', estimatedBudget: 15000, icon: '📧' },
    { name: 'Makeup & Hair', description: 'Bridal and guest makeup services', estimatedBudget: 25000, icon: '💄' },
    { name: 'Wedding Attire', description: 'Bride, groom, and party dresses', estimatedBudget: 150000, icon: '👗' },
    { name: 'Transportation', description: 'Vehicles and transportation for guests', estimatedBudget: 40000, icon: '🚗' },
    { name: 'Accommodation', description: 'Hotel rooms for out-of-town guests', estimatedBudget: 50000, icon: '🏨' },
    { name: 'Gifts & Favors', description: 'Guest favors and wedding gifts', estimatedBudget: 30000, icon: '🎁' },
    { name: 'Other', description: 'Miscellaneous expenses', estimatedBudget: 0, icon: '📝' },
];

// State
let currentUser = null;
let currentBudgetId = null;
let state = {
    totalBudget: 1000000,
    expenses: [],
    sharedWith: [],
};

let editingExpenseId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase first
    initializeFirebase();
    
    if (!auth) {
        console.error('Firebase auth not initialized');
        return;
    }
    
    const authModule = getFirebaseAuth();
    authModule.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            showAppScreen();
            initializeBudget();
            renderQuickAddButtons();
            listenToExpenses();
            listenToSharedUsers();
        } else {
            currentUser = null;
            showAuthScreen();
        }
    });
});

// Screen Management
function showAuthScreen() {
    document.getElementById('authScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
}

function showAppScreen() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
}

// Auth Functions
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    if (tab === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('signupForm').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        errorDiv.classList.remove('show');
        const authModule = getFirebaseAuth();
        await authModule.signInWithEmailAndPassword(email, password);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const errorDiv = document.getElementById('signupError');

    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
        return;
    }

    try {
        errorDiv.classList.remove('show');
        const authModule = getFirebaseAuth();
        const dbModule = getFirebaseDatabase();
        const userCred = await authModule.createUserWithEmailAndPassword(email, password);
        
        // Create user profile
        const userRef = dbModule.ref(`users/${userCred.user.uid}`);
        await userRef.set({
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
}

async function handleLogout() {
    try {
        const authModule = getFirebaseAuth();
        await authModule.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Budget Management
async function initializeBudget() {
    try {
        const db = getFirebaseDatabase();
        const budgetsRef = db.ref(`budgets`);
        const snapshot = await budgetsRef.once('value');
        
        if (snapshot.exists()) {
            const budgets = snapshot.val();
            // Find budget created by current user or shared with them
            for (const budgetId in budgets) {
                const budget = budgets[budgetId];
                if (budget.createdBy === currentUser.uid || (budget.sharedWith && budget.sharedWith[currentUser.uid])) {
                    currentBudgetId = budgetId;
                    state.totalBudget = budget.totalBudget || 1000000;
                    updateSummary();
                    return;
                }
            }
        }
        
        // Create new budget if none exists
        createNewBudget();
    } catch (error) {
        console.error('Error initializing budget:', error);
    }
}

async function createNewBudget() {
    try {
        const db = getFirebaseDatabase();
        const budgetsRef = db.ref('budgets');
        const newBudgetRef = budgetsRef.push();
        const budgetId = newBudgetRef.key;
        
        await newBudgetRef.set({
            createdBy: currentUser.uid,
            totalBudget: 1000000,
            createdAt: new Date().toISOString(),
            sharedWith: {},
        });
        
        currentBudgetId = budgetId;
        state.totalBudget = 1000000;
        updateSummary();
    } catch (error) {
        console.error('Error creating budget:', error);
    }
}

// Listen to Expenses
function listenToExpenses() {
    if (!currentBudgetId) return;
    
    const db = getFirebaseDatabase();
    const expensesRef = db.ref(`budgets/${currentBudgetId}/expenses`);
    expensesRef.on('value', (snapshot) => {
        state.expenses = [];
        if (snapshot.exists()) {
            const expenses = snapshot.val();
            for (const expenseId in expenses) {
                state.expenses.push({
                    id: expenseId,
                    ...expenses[expenseId],
                });
            }
        }
        renderExpenses();
        updateSummary();
    });
}

// Listen to Shared Users
function listenToSharedUsers() {
    if (!currentBudgetId) return;
    
    const db = getFirebaseDatabase();
    const budgetRef = db.ref(`budgets/${currentBudgetId}/sharedWith`);
    budgetRef.on('value', (snapshot) => {
        state.sharedWith = [];
        if (snapshot.exists()) {
            const sharedWith = snapshot.val();
            for (const userId in sharedWith) {
                state.sharedWith.push({
                    userId: userId,
                    email: sharedWith[userId].email,
                });
            }
        }
        renderSharedUsers();
    });
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Calculate totals
function getTotalSpent() {
    return state.expenses.reduce((sum, exp) => sum + (exp.paid || 0), 0);
}

function getRemainingCash() {
    return state.totalBudget - getTotalSpent();
}

function getSpentPercentage() {
    return Math.round((getTotalSpent() / state.totalBudget) * 100);
}

// Update Summary
function updateSummary() {
    const totalSpent = getTotalSpent();
    const remainingCash = getRemainingCash();
    const percentage = getSpentPercentage();

    document.getElementById('totalBudgetDisplay').textContent = formatCurrency(state.totalBudget);
    document.getElementById('totalSpentDisplay').textContent = formatCurrency(totalSpent);
    document.getElementById('spentPercentage').textContent = `${percentage}% of budget`;
    document.getElementById('remainingDisplay').textContent = formatCurrency(remainingCash);

    const budgetStatus = document.getElementById('budgetStatus');
    if (remainingCash < 0) {
        budgetStatus.textContent = 'Over Budget';
        budgetStatus.className = 'budget-status over-budget';
    } else {
        budgetStatus.textContent = '';
        budgetStatus.className = 'budget-status';
    }
}

// Render Quick Add Buttons
function renderQuickAddButtons() {
    const container = document.getElementById('quickAddContainer');
    container.innerHTML = '';

    EXPENSE_CATEGORIES.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'quick-add-btn';
        btn.innerHTML = `<span class="icon">${category.icon}</span>${category.name}`;
        btn.onclick = () => quickAddExpense(category);
        container.appendChild(btn);
    });
}

// Quick Add Expense
async function quickAddExpense(category) {
    if (!currentBudgetId) return;
    
    try {
        const db = getFirebaseDatabase();
        const expensesRef = db.ref(`budgets/${currentBudgetId}/expenses`);
        const newExpenseRef = expensesRef.push();
        
        await newExpenseRef.set({
            category: category.name,
            description: '',
            estimated: category.estimatedBudget,
            paid: 0,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

// Render Expenses
function renderExpenses() {
    const container = document.getElementById('expensesContainer');
    const count = document.getElementById('expenseCount');

    count.textContent = `${state.expenses.length} items`;

    if (state.expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No expenses yet</p>
                <p class="empty-state-hint">Add your first expense using the quick add buttons above</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    state.expenses.forEach(expense => {
        const pending = expense.estimated - expense.paid;
        const pendingClass = pending > 0 ? 'pending' : pending === 0 ? 'pending zero' : 'pending negative';

        const card = document.createElement('div');
        card.className = 'expense-card';
        card.innerHTML = `
            <div class="expense-header">
                <div class="expense-title">
                    <div class="expense-category">${expense.category}</div>
                    <div class="expense-description">${expense.description || 'No description'}</div>
                </div>
                <div class="expense-actions">
                    <button class="expense-btn edit-btn" onclick="editExpense('${expense.id}')">Edit</button>
                    <button class="expense-btn delete-btn" onclick="deleteExpense('${expense.id}')">Delete</button>
                </div>
            </div>
            <div class="expense-details">
                <div class="expense-row">
                    <span class="expense-label">Estimated:</span>
                    <span class="expense-value">${formatCurrency(expense.estimated)}</span>
                </div>
                <div class="expense-row">
                    <span class="expense-label">Paid:</span>
                    <span class="expense-value paid">${formatCurrency(expense.paid)}</span>
                </div>
                <div class="expense-row">
                    <span class="expense-label">Pending:</span>
                    <span class="expense-value ${pendingClass}">${formatCurrency(pending)}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Open Add Expense Modal
function openAddExpenseModal() {
    editingExpenseId = null;
    document.getElementById('modalTitle').textContent = 'Add New Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

// Edit Expense
function editExpense(id) {
    editingExpenseId = id;
    const expense = state.expenses.find(e => e.id === id);
    if (!expense) return;

    document.getElementById('modalTitle').textContent = 'Edit Expense';
    document.getElementById('categoryInput').value = expense.category;
    document.getElementById('descriptionInput').value = expense.description;
    document.getElementById('estimatedInput').value = expense.estimated;
    document.getElementById('paidInput').value = expense.paid;

    document.getElementById('expenseModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

// Save Expense
async function saveExpense(event) {
    event.preventDefault();

    const category = document.getElementById('categoryInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    const estimated = parseFloat(document.getElementById('estimatedInput').value) || 0;
    const paid = parseFloat(document.getElementById('paidInput').value) || 0;

    if (!category) {
        alert('Please enter a category');
        return;
    }

    if (paid > estimated) {
        if (!confirm(`Amount paid (${formatCurrency(paid)}) is greater than estimated (${formatCurrency(estimated)}). Continue?`)) {
            return;
        }
    }

    try {
        const db = getFirebaseDatabase();
        if (editingExpenseId) {
            const expenseRef = db.ref(`budgets/${currentBudgetId}/expenses/${editingExpenseId}`);
            await expenseRef.update({
                category,
                description,
                estimated,
                paid,
            });
        } else {
            const expensesRef = db.ref(`budgets/${currentBudgetId}/expenses`);
            const newExpenseRef = expensesRef.push();
            
            await newExpenseRef.set({
                category,
                description,
                estimated,
                paid,
                createdAt: new Date().toISOString(),
            });
        }

        closeExpenseModal();
    } catch (error) {
        console.error('Error saving expense:', error);
        alert('Error saving expense');
    }
}

// Delete Expense
async function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            const db = getFirebaseDatabase();
            const expenseRef = db.ref(`budgets/${currentBudgetId}/expenses/${id}`);
            await expenseRef.remove();
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Error deleting expense');
        }
    }
}

// Close Expense Modal
function closeExpenseModal() {
    document.getElementById('expenseModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    editingExpenseId = null;
}

// Open Budget Modal
function openBudgetModal() {
    document.getElementById('budgetInput').value = state.totalBudget;
    document.getElementById('budgetModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

// Close Budget Modal
function closeBudgetModal() {
    document.getElementById('budgetModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

// Save Budget
async function saveBudget(event) {
    event.preventDefault();

    const budget = parseFloat(document.getElementById('budgetInput').value) || 0;

    if (budget <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }

    try {
        const db = getFirebaseDatabase();
        const budgetRef = db.ref(`budgets/${currentBudgetId}`);
        await budgetRef.update({ totalBudget: budget });
        state.totalBudget = budget;
        updateSummary();
        closeBudgetModal();
    } catch (error) {
        console.error('Error saving budget:', error);
        alert('Error saving budget');
    }
}

// Close All Modals
function closeAllModals() {
    closeExpenseModal();
    closeBudgetModal();
}

// Sharing Functions
async function shareBudgetWithUser() {
    const email = document.getElementById('shareEmail').value.trim();
    const statusDiv = document.getElementById('sharingStatus');

    if (!email) {
        statusDiv.textContent = 'Please enter an email address';
        statusDiv.className = 'sharing-status show error';
        return;
    }

    try {
        // Find user by email
        const db = getFirebaseDatabase();
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        let targetUserId = null;

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const userId in users) {
                if (users[userId].email === email) {
                    targetUserId = userId;
                    break;
                }
            }
        }

        if (!targetUserId) {
            statusDiv.textContent = 'User not found. Make sure they have created an account.';
            statusDiv.className = 'sharing-status show error';
            return;
        }

        // Add user to shared list
        const sharedRef = db.ref(`budgets/${currentBudgetId}/sharedWith/${targetUserId}`);
        await sharedRef.set({
            email: email,
            sharedAt: new Date().toISOString(),
        });

        statusDiv.textContent = `Budget shared with ${email}`;
        statusDiv.className = 'sharing-status show success';
        document.getElementById('shareEmail').value = '';

        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 3000);
    } catch (error) {
        console.error('Error sharing budget:', error);
        statusDiv.textContent = 'Error sharing budget';
        statusDiv.className = 'sharing-status show error';
    }
}

// Render Shared Users
function renderSharedUsers() {
    const container = document.getElementById('sharedUsers');
    
    if (state.sharedWith.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '<div style="font-size: 12px; color: var(--muted); margin-top: 12px; font-weight: 600;">Shared with:</div>';
    
    state.sharedWith.forEach(user => {
        const item = document.createElement('div');
        item.className = 'shared-user-item';
        item.innerHTML = `
            <span>${user.email}</span>
            <button class="remove-user-btn" onclick="removeSharedUser('${user.userId}')">Remove</button>
        `;
        container.appendChild(item);
    });
}

// Remove Shared User
async function removeSharedUser(userId) {
    if (confirm('Remove this user from the shared budget?')) {
        try {
            const db = getFirebaseDatabase();
            const sharedRef = db.ref(`budgets/${currentBudgetId}/sharedWith/${userId}`);
            await sharedRef.remove();
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Error removing user');
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});
