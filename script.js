// Firebase will be initialized after scripts load
let app, auth, database;

// Get Firebase functions - these will be available after Firebase loads
// Firebase compat uses the v8 API structure
function getFirebaseAuth() {
    // Return the auth service instance (not the module)
    return window.firebase?.auth();
}

function getFirebaseDatabase() {
    // Return the database service instance (not the module)
    return window.firebase?.database();
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
    console.log('Firebase initialized successfully');
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
function initApp() {
    // Wait for Firebase to be available
    if (!window.firebase) {
        console.log('Waiting for Firebase to load...');
        setTimeout(initApp, 100);
        return;
    }
    
    // Initialize Firebase first
    if (!initializeFirebase()) {
        console.error('Failed to initialize Firebase');
        return;
    }
    
    if (!auth) {
        console.error('Firebase auth not initialized');
        return;
    }
    
    console.log('Setting up auth state listener');
    // Use the initialized auth instance directly
    auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? user.email : 'signed out');
        if (user) {
            currentUser = user;
            console.log('User signed in, showing app screen');
            showAppScreen();
            renderQuickAddButtons();
            // Initialize budget first, then set up listeners
            initializeBudget().then(() => {
                listenToExpenses();
                listenToSharedUsers();
            });
        } else {
            currentUser = null;
            console.log('User signed out, showing auth screen');
            showAuthScreen();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initApp();
});

// Screen Management
function showAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    
    if (!authScreen || !appScreen) {
        console.error('Screen elements not found!', { authScreen, appScreen });
        return;
    }
    
    authScreen.classList.add('active');
    appScreen.classList.remove('active');
}

function showAppScreen() {
    console.log('Showing app screen');
    const authScreen = document.getElementById('authScreen');
    const appScreen = document.getElementById('appScreen');
    
    if (!authScreen || !appScreen) {
        console.error('Screen elements not found!', { authScreen, appScreen });
        return;
    }
    
    console.log('Before:', {
        authScreenClasses: authScreen.className,
        appScreenClasses: appScreen.className
    });
    
    authScreen.classList.remove('active');
    appScreen.classList.add('active');
    
    console.log('After:', {
        authScreenClasses: authScreen.className,
        appScreenClasses: appScreen.className
    });
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
        console.log('Attempting to sign in:', email);
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        console.log('Sign in successful:', userCred.user.email);
    } catch (error) {
        console.error('Sign in error:', error);
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
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        
        // Create user profile
        const userRef = database.ref(`users/${userCred.user.uid}`);
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
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Budget Management
async function initializeBudget() {
    try {
        console.log('Initializing budget for user:', currentUser.uid);
        const budgetsRef = database.ref(`budgets`);
        const snapshot = await budgetsRef.once('value');
        
        if (snapshot.exists()) {
            const budgets = snapshot.val();
            console.log('Found budgets:', Object.keys(budgets));
            // Find budget created by current user or shared with them
            for (const budgetId in budgets) {
                const budget = budgets[budgetId];
                if (budget.createdBy === currentUser.uid || (budget.sharedWith && budget.sharedWith[currentUser.uid])) {
                    console.log('Found existing budget:', budgetId);
                    currentBudgetId = budgetId;
                    state.totalBudget = budget.totalBudget || 1000000;
                    updateSummary();
                    return Promise.resolve();
                }
            }
        }
        
        // Create new budget if none exists
        console.log('No existing budget found, creating new one');
        await createNewBudget();
    } catch (error) {
        console.error('Error initializing budget:', error);
        return Promise.reject(error);
    }
}

async function createNewBudget() {
    try {
        console.log('Creating new budget...');
        const budgetsRef = database.ref('budgets');
        const newBudgetRef = budgetsRef.push();
        const budgetId = newBudgetRef.key;
        
        await newBudgetRef.set({
            createdBy: currentUser.uid,
            totalBudget: 1000000,
            createdAt: new Date().toISOString(),
            sharedWith: {},
        });
        
        console.log('Budget created with ID:', budgetId);
        currentBudgetId = budgetId;
        state.totalBudget = 1000000;
        updateSummary();
        return Promise.resolve();
    } catch (error) {
        console.error('Error creating budget:', error);
        return Promise.reject(error);
    }
}

// Listen to Expenses
function listenToExpenses() {
    if (!currentBudgetId) {
        console.warn('Cannot listen to expenses: currentBudgetId not set');
        return;
    }
    
    console.log('Setting up expense listener for budget:', currentBudgetId);
    const expensesRef = database.ref(`budgets/${currentBudgetId}/expenses`);
    expensesRef.on('value', (snapshot) => {
        console.log('Expense data received:', snapshot.exists() ? snapshot.val() : 'empty');
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
        console.log('Updated state.expenses:', state.expenses.length, 'items');
        renderExpenses();
        updateSummary();
    });
}

// Listen to Shared Users
function listenToSharedUsers() {
    if (!currentBudgetId) return;
    
    const budgetRef = database.ref(`budgets/${currentBudgetId}/sharedWith`);
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
    console.log('Quick add expense called:', category.name, 'Budget ID:', currentBudgetId);
    if (!currentBudgetId) {
        console.error('No currentBudgetId set!');
        alert('Budget not initialized. Please refresh the page.');
        return;
    }
    
    try {
        console.log('Creating expense in database...');
        const expensesRef = database.ref(`budgets/${currentBudgetId}/expenses`);
        const newExpenseRef = expensesRef.push();
        
        const expenseData = {
            category: category.name,
            description: '',
            estimated: category.estimatedBudget,
            paid: 0,
            createdAt: new Date().toISOString(),
        };
        
        console.log('Setting expense data:', expenseData);
        await newExpenseRef.set(expenseData);
        console.log('Expense added successfully!');
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense: ' + error.message);
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
    
    console.log('Save expense called, currentBudgetId:', currentBudgetId);

    const category = document.getElementById('categoryInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    const estimated = parseFloat(document.getElementById('estimatedInput').value) || 0;
    const paid = parseFloat(document.getElementById('paidInput').value) || 0;

    console.log('Expense data:', { category, description, estimated, paid, editingExpenseId });

    if (!category) {
        alert('Please enter a category');
        return;
    }
    
    if (!currentBudgetId) {
        console.error('No currentBudgetId set!');
        alert('Budget not initialized. Please refresh the page.');
        return;
    }

    if (paid > estimated) {
        if (!confirm(`Amount paid (${formatCurrency(paid)}) is greater than estimated (${formatCurrency(estimated)}). Continue?`)) {
            return;
        }
    }

    try {
        if (editingExpenseId) {
            console.log('Updating existing expense:', editingExpenseId);
            const expenseRef = database.ref(`budgets/${currentBudgetId}/expenses/${editingExpenseId}`);
            await expenseRef.update({
                category,
                description,
                estimated,
                paid,
            });
            console.log('Expense updated successfully');
        } else {
            console.log('Creating new expense...');
            const expensesRef = database.ref(`budgets/${currentBudgetId}/expenses`);
            const newExpenseRef = expensesRef.push();
            
            const expenseData = {
                category,
                description,
                estimated,
                paid,
                createdAt: new Date().toISOString(),
            };
            
            console.log('Setting expense data:', expenseData);
            await newExpenseRef.set(expenseData);
            console.log('Expense created successfully');
        }

        closeExpenseModal();
    } catch (error) {
        console.error('Error saving expense:', error);
        alert('Error saving expense: ' + error.message);
    }
}

// Delete Expense
async function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            const expenseRef = database.ref(`budgets/${currentBudgetId}/expenses/${id}`);
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
        const budgetRef = database.ref(`budgets/${currentBudgetId}`);
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
        const usersRef = database.ref('users');
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
        const sharedRef = database.ref(`budgets/${currentBudgetId}/sharedWith/${targetUserId}`);
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
            const sharedRef = database.ref(`budgets/${currentBudgetId}/sharedWith/${userId}`);
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
