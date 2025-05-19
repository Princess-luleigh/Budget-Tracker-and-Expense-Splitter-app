export type Category = 
  | "Food" 
  | "Rent" 
  | "Utilities" 
  | "Transportation" 
  | "Entertainment" 
  | "Shopping" 
  | "Health" 
  | "Education" 
  | "Salary" 
  | "Investment" 
  | "Gift" 
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  type: "income" | "expense";
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
}

export interface GroupExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  paidBy: string; // member id
  splitBetween: string[]; // member ids
  shares?: Record<string, number>; // custom splits (member id -> amount)
}

export interface CurrencyFormat {
  code: string;
  symbol: string;
  name: string;
  decimal_digits: number;
  name_plural: string;
}
