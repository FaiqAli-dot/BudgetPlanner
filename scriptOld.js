const TOTAL_BUDGET = 1000000;
const expenseBody = document.getElementById('expense-body');
const totalSpentEl = document.getElementById('total-spent');
const remainingCashEl = document.getElementById('remaining-cash');
const addBtn = document.getElementById('add-btn');

// Initial Data
let expenses = [
    { category: 'Venue', description: 'Main Hall', estimated: 300000, paid: 50000 },
    { category: 'Catering', description: 'Dinner for 300', estimated: 400000, paid: 0 },
    { category: 'Photography', description: 'Full Event Coverage', estimated: 100000, paid: 20000 }
];

function formatCurrency(amount) {
    return 'PKR ' + amount.toLocaleString();
}

function updateSummary() {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.paid, 0);
    const remainingCash = TOTAL_BUDGET - totalSpent;

    totalSpentEl.textContent = formatCurrency(totalSpent);
    remainingCashEl.textContent = formatCurrency(remainingCash);
    
    // Change color if over budget
    remainingCashEl.style.color = remainingCash < 0 ? '#ff4d4d' : 'white';
}

function renderTable() {
    expenseBody.innerHTML = '';
    expenses.forEach((exp, index) => {
        const pending = exp.estimated - exp.paid;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="editable-cell"><input type="text" value="${exp.category}" onchange="updateExpense(${index}, 'category', this.value)"></td>
            <td class="editable-cell"><input type="text" value="${exp.description}" onchange="updateExpense(${index}, 'description', this.value)"></td>
            <td class="editable-cell"><input type="number" value="${exp.estimated}" onchange="updateExpense(${index}, 'estimated', this.value)"></td>
            <td class="editable-cell"><input type="number" value="${exp.paid}" onchange="updateExpense(${index}, 'paid', this.value)"></td>
            <td>${formatCurrency(pending)}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseBody.appendChild(row);
    });
    updateSummary();
}

window.updateExpense = function(index, field, value) {
    if (field === 'estimated' || field === 'paid') {
        expenses[index][field] = parseFloat(value) || 0;
    } else {
        expenses[index][field] = value;
    }
    renderTable();
};

window.deleteExpense = function(index) {
    expenses.splice(index, 1);
    renderTable();
};

addBtn.addEventListener('click', () => {
    const category = document.getElementById('new-category').value;
    const description = document.getElementById('new-description').value;
    const estimated = parseFloat(document.getElementById('new-estimated').value) || 0;
    const paid = parseFloat(document.getElementById('new-paid').value) || 0;

    if (category) {
        expenses.push({ category, description, estimated, paid });
        renderTable();
        
        // Clear inputs
        document.getElementById('new-category').value = '';
        document.getElementById('new-description').value = '';
        document.getElementById('new-estimated').value = '';
        document.getElementById('new-paid').value = '';
    } else {
        alert('Please enter at least a category name.');
    }
});

// Initial render
renderTable();
