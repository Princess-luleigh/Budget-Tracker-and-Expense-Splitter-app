import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { CurrencyFormat } from "@/types";

interface SummaryCardProps {
  title: string;
  amount: number;
  currency: CurrencyFormat;
  type?: "income" | "expense" | "balance";
  className?: string;
  icon?: React.ReactNode;
}

const SummaryCard = ({ title, amount, currency, type = "balance", className = "", icon }: SummaryCardProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case "income":
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
      case "expense":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
      default:
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
    }
  };

  return (
    <Card className={`${getTypeStyles()} ${className} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${type === "income" ? "text-budget-income" : type === "expense" ? "text-budget-expense" : "text-budget-primary"}`}>
          {formatCurrency(amount, currency)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
