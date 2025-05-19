import { CurrencyFormat } from "@/types";

export const formatCurrency = (amount: number, currency: CurrencyFormat): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimal_digits,
    maximumFractionDigits: currency.decimal_digits,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    Food: "bg-yellow-100 text-yellow-800",
    Rent: "bg-purple-100 text-purple-800",
    Utilities: "bg-blue-100 text-blue-800",
    Transportation: "bg-green-100 text-green-800",
    Entertainment: "bg-pink-100 text-pink-800",
    Shopping: "bg-indigo-100 text-indigo-800",
    Health: "bg-red-100 text-red-800",
    Education: "bg-cyan-100 text-cyan-800",
    Salary: "bg-emerald-100 text-emerald-800",
    Investment: "bg-teal-100 text-teal-800",
    Gift: "bg-violet-100 text-violet-800",
    Other: "bg-gray-100 text-gray-800",
  };
  
  return colorMap[category] || "bg-gray-100 text-gray-800";
};
