import { Transaction } from "@/types";
import { useBudget } from "@/context/BudgetContext";
import { formatCurrency, formatDate, getCategoryColor } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const { currency, deleteTransaction } = useBudget();
  const { id, amount, description, date, category, type } = transaction;
  
  return (
    <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1 w-full md:w-auto">
        <div className="flex justify-between md:justify-start gap-2">
          <h3 className="font-medium text-gray-900">{description}</h3>
          <span 
            className={`font-semibold ${type === "income" ? "text-budget-income" : "text-budget-expense"}`}
          >
            {type === "income" ? "+" : "-"}{formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatDate(date)}</span>
          <Badge className={`${getCategoryColor(category)}`}>{category}</Badge>
        </div>
      </div>
      <button 
        onClick={() => deleteTransaction(id)}
        className="mt-2 md:mt-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete transaction"
      >
        <Trash className="h-4 w-4" />
      </button>
    </Card>
  );
};

export default TransactionCard;
