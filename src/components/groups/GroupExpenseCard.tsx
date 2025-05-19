import { GroupExpense, Group } from "@/types";
import { useBudget } from "@/context/BudgetContext";
import { formatCurrency, formatDate, getCategoryColor } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface GroupExpenseCardProps {
  expense: GroupExpense;
  group: Group;
}

const GroupExpenseCard = ({ expense, group }: GroupExpenseCardProps) => {
  const { currency, deleteGroupExpense } = useBudget();
  const { id, amount, description, date, category, paidBy, splitBetween } = expense;
  
  const paidByMember = group.members.find(m => m.id === paidBy);
  const amountPerPerson = amount / splitBetween.length;
  
  return (
    <Card className="p-4 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{description}</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
            <span>{formatDate(date)}</span>
            <Badge className={`${getCategoryColor(category)}`}>{category}</Badge>
            <span className="text-xs">
              Paid by {paidByMember?.name || "Unknown"} • Split {splitBetween.length} ways
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-semibold text-budget-expense">
            {formatCurrency(amount, currency)}
          </span>
          <span className="text-xs text-gray-500">
            {formatCurrency(amountPerPerson, currency)} per person
          </span>
          <button 
            onClick={() => deleteGroupExpense(id)}
            className="mt-1 p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete expense"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GroupExpenseCard;
