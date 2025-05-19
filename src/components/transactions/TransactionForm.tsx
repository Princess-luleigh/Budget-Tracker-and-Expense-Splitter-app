import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Transaction, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionFormProps {
  type: "income" | "expense";
}

const categories: Category[] = [
  "Food",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Salary",
  "Investment",
  "Gift",
  "Other",
];

const TransactionForm = ({ type }: TransactionFormProps) => {
  const { addTransaction } = useBudget();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<Category>("Other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date) return;

    const newTransaction: Omit<Transaction, "id"> = {
      amount: parseFloat(amount),
      description,
      date,
      category,
      type,
    };

    addTransaction(newTransaction);

    // Reset form
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Other");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Add {type === "income" ? "Income" : "Expense"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(cat => type === "income" 
                    ? ["Salary", "Investment", "Gift", "Other"].includes(cat) 
                    : !["Salary", "Investment"].includes(cat))
                  .map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${type === "income" ? "bg-budget-income hover:bg-green-600" : "bg-budget-expense hover:bg-red-600"}`}
          >
            Add {type === "income" ? "Income" : "Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
