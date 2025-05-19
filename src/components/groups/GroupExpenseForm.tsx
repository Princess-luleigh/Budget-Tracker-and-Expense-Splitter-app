import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Group, GroupExpense, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GroupExpenseFormProps {
  group: Group;
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
  "Other",
];

const GroupExpenseForm = ({ group }: GroupExpenseFormProps) => {
  const { addGroupExpense } = useBudget();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<Category>("Other");
  const [paidBy, setPaidBy] = useState(group.members[0].id);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(group.members.map(m => m.id));

  const handleSelectMember = (memberId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date || selectedMembers.length === 0) return;

    const newExpense: Omit<GroupExpense, "id"> = {
      amount: parseFloat(amount),
      description,
      date,
      category,
      paidBy,
      splitBetween: selectedMembers,
    };

    addGroupExpense(newExpense);

    // Reset form
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Other");
    setPaidBy(group.members[0].id);
    setSelectedMembers(group.members.map(m => m.id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Group Expense</CardTitle>
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
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="paidBy">Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {group.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} {member.id === "1" && "(You)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Split between</Label>
            <div className="grid gap-2">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => 
                      handleSelectMember(member.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`member-${member.id}`}
                    className="text-sm font-normal"
                  >
                    {member.name} {member.id === "1" && "(You)"}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-budget-primary hover:bg-blue-600"
            disabled={selectedMembers.length === 0}
          >
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GroupExpenseForm;
