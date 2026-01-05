import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Expense {
  id: string;
  category: string;
  description: string;
  estimated: number;
  paid: number;
}

export interface BudgetState {
  totalBudget: number;
  expenses: Expense[];
  isLoading: boolean;
}

type BudgetAction =
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: BudgetState = {
  totalBudget: 1000000,
  expenses: [
    { id: '1', category: 'Venue', description: 'Main Hall', estimated: 300000, paid: 50000 },
    { id: '2', category: 'Catering', description: 'Dinner for 300', estimated: 400000, paid: 0 },
    { id: '3', category: 'Photography', description: 'Full Event Coverage', estimated: 100000, paid: 20000 },
  ],
  isLoading: true,
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_BUDGET':
      return { ...state, totalBudget: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface BudgetContextType {
  state: BudgetState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: number) => void;
  getTotalSpent: () => number;
  getRemainingCash: () => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      saveData();
    }
  }, [state.expenses, state.totalBudget]);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('budgetData');
      if (savedData) {
        const { totalBudget, expenses } = JSON.parse(savedData);
        dispatch({ type: 'SET_BUDGET', payload: totalBudget });
        dispatch({ type: 'SET_EXPENSES', payload: expenses });
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        'budgetData',
        JSON.stringify({
          totalBudget: state.totalBudget,
          expenses: state.expenses,
        })
      );
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_EXPENSE', payload: { ...expense, id } });
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: { ...expense, id } });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const setBudget = (budget: number) => {
    dispatch({ type: 'SET_BUDGET', payload: budget });
  };

  const getTotalSpent = () => {
    return state.expenses.reduce((sum, exp) => sum + exp.paid, 0);
  };

  const getRemainingCash = () => {
    return state.totalBudget - getTotalSpent();
  };

  return (
    <BudgetContext.Provider
      value={{
        state,
        addExpense,
        updateExpense,
        deleteExpense,
        setBudget,
        getTotalSpent,
        getRemainingCash,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
