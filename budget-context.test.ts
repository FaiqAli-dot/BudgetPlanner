import { describe, it, expect } from 'vitest';

// Mock expense data for testing
const mockExpenses = [
  { id: '1', category: 'Venue', description: 'Main Hall', estimated: 300000, paid: 50000 },
  { id: '2', category: 'Catering', description: 'Dinner for 300', estimated: 400000, paid: 0 },
  { id: '3', category: 'Photography', description: 'Full Event Coverage', estimated: 100000, paid: 20000 },
];

const totalBudget = 1000000;

describe('Budget Calculations', () => {
  it('should calculate total spent correctly', () => {
    const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.paid, 0);
    expect(totalSpent).toBe(70000);
  });

  it('should calculate remaining cash correctly', () => {
    const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.paid, 0);
    const remainingCash = totalBudget - totalSpent;
    expect(remainingCash).toBe(930000);
  });

  it('should calculate pending amount for each expense', () => {
    const pending1 = mockExpenses[0].estimated - mockExpenses[0].paid;
    const pending2 = mockExpenses[1].estimated - mockExpenses[1].paid;
    const pending3 = mockExpenses[2].estimated - mockExpenses[2].paid;

    expect(pending1).toBe(250000);
    expect(pending2).toBe(400000);
    expect(pending3).toBe(80000);
  });

  it('should update total spent when paid amount changes', () => {
    const updatedExpenses = [
      { ...mockExpenses[0], paid: 150000 }, // Changed from 50000 to 150000
      mockExpenses[1],
      mockExpenses[2],
    ];

    const newTotalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.paid, 0);
    expect(newTotalSpent).toBe(170000);

    const newRemainingCash = totalBudget - newTotalSpent;
    expect(newRemainingCash).toBe(830000);
  });

  it('should handle pending amount when paid exceeds estimated', () => {
    const expense = { ...mockExpenses[0], paid: 350000 }; // Paid more than estimated
    const pending = expense.estimated - expense.paid;
    expect(pending).toBe(-50000); // Negative pending
  });

  it('should calculate spending percentage correctly', () => {
    const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.paid, 0);
    const percentage = Math.round((totalSpent / totalBudget) * 100);
    expect(percentage).toBe(7);
  });

  it('should handle zero paid amounts', () => {
    const expense = mockExpenses[1]; // Catering with 0 paid
    const pending = expense.estimated - expense.paid;
    expect(pending).toBe(400000);
  });

  it('should handle fully paid expenses', () => {
    const expense = { ...mockExpenses[0], paid: 300000 }; // Fully paid
    const pending = expense.estimated - expense.paid;
    expect(pending).toBe(0);
  });
});
