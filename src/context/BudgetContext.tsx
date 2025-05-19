import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transaction, Group, GroupExpense, CurrencyFormat } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface BudgetContextType {
  transactions: Transaction[];
  groups: Group[];
  groupExpenses: GroupExpense[];
  currency: CurrencyFormat;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  deleteGroup: (id: string) => void;
  addGroupExpense: (expense: Omit<GroupExpense, "id">) => void;
  deleteGroupExpense: (id: string) => void;
  setCurrency: (currency: CurrencyFormat) => void;
}

const defaultCurrency: CurrencyFormat = {
  code: "ZAR",
  symbol: "R",
  name: "South African Rand",
  decimal_digits: 2,
  name_plural: "South African Rands"
};

// Sample data for demo purposes
const initialTransactions: Transaction[] = [
  {
    id: "1",
    amount: 2000,
    description: "Salary",
    date: "2023-05-01",
    category: "Salary",
    type: "income"
  },
  {
    id: "2",
    amount: 800,
    description: "Rent",
    date: "2023-05-02",
    category: "Rent",
    type: "expense"
  },
  {
    id: "3",
    amount: 120,
    description: "Groceries",
    date: "2023-05-03",
    category: "Food",
    type: "expense"
  },
  {
    id: "4",
    amount: 50,
    description: "Electric bill",
    date: "2023-05-04",
    category: "Utilities",
    type: "expense"
  },
  {
    id: "5",
    amount: 300,
    description: "Freelance work",
    date: "2023-05-05",
    category: "Other",
    type: "income"
  }
];

const initialGroups: Group[] = [
  {
    id: "1",
    name: "Apartment",
    members: [
      { id: "1", name: "You" },
      { id: "2", name: "Alex", avatar: "A" },
      { id: "3", name: "Sam", avatar: "S" }
    ]
  }
];

const initialGroupExpenses: GroupExpense[] = [
  {
    id: "1",
    amount: 150,
    description: "Utilities",
    date: "2023-05-01",
    category: "Utilities",
    paidBy: "1",
    splitBetween: ["1", "2", "3"]
  },
  {
    id: "2",
    amount: 90,
    description: "Internet",
    date: "2023-05-02",
    category: "Utilities",
    paidBy: "2",
    splitBetween: ["1", "2", "3"]
  }
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [groupExpenses, setGroupExpenses] = useState<GroupExpense[]>(initialGroupExpenses);
  const [currency, setCurrency] = useState<CurrencyFormat>(defaultCurrency);

  // Load data from localStorage if available
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    const storedGroups = localStorage.getItem("groups");
    const storedGroupExpenses = localStorage.getItem("groupExpenses");
    // Remove stored currency to force new ZAR currency
    localStorage.removeItem("currency");

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedGroups) setGroups(JSON.parse(storedGroups));
    if (storedGroupExpenses) setGroupExpenses(JSON.parse(storedGroupExpenses));
    // Always use ZAR currency
    setCurrency(defaultCurrency);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("groupExpenses", JSON.stringify(groupExpenses));
    localStorage.setItem("currency", JSON.stringify(currency));
  }, [transactions, groups, groupExpenses, currency]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addGroup = (group: Omit<Group, "id">) => {
    const newGroup = { ...group, id: uuidv4() };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    // Also remove related expenses
    setGroupExpenses(groupExpenses.filter(e => !groups.find(g => g.id === id)?.members.some(m => m.id === e.paidBy)));
  };

  const addGroupExpense = (expense: Omit<GroupExpense, "id">) => {
    const newExpense = { ...expense, id: uuidv4() };
    setGroupExpenses([...groupExpenses, newExpense]);
  };

  const deleteGroupExpense = (id: string) => {
    setGroupExpenses(groupExpenses.filter(e => e.id !== id));
  };

  const value = {
    transactions,
    groups,
    groupExpenses,
    currency,
    addTransaction,
    deleteTransaction,
    addGroup,
    deleteGroup,
    addGroupExpense,
    deleteGroupExpense,
    setCurrency
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
