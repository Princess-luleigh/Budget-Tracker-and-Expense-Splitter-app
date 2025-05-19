import { useBudget } from "@/context/BudgetContext";
import { Transaction } from "@/types";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionCard from "@/components/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Expenses = () => {
  const { transactions } = useBudget();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  
  // Get only expenses
  let expenses = transactions.filter(t => t.type === "expense");
  
  // Apply filters
  if (searchTerm) {
    expenses = expenses.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (categoryFilter !== "all") {
    expenses = expenses.filter(t => t.category === categoryFilter);
  }
  
  // Apply sorting
  expenses = [...expenses].sort((a: Transaction, b: Transaction) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "amount") {
      return b.amount - a.amount;
    }
    return 0;
  });
  
  // Get unique categories for filter
  const categories = [...new Set(transactions.filter(t => t.type === "expense").map(t => t.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-gray-500">Manage your expenses</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:flex-1"
            />
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TransactionCard key={expense.id} transaction={expense} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No expenses found</p>
                {(searchTerm || categoryFilter !== "all") && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <TransactionForm type="expense" />
        </div>
      </div>
    </div>
  );
};

export default Expenses;
