import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, DollarSign, Calendar, Plus } from "lucide-react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import TransactionCard from "@/components/transactions/TransactionCard";
import { Button } from "@/components/ui/button";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Dashboard = () => {
  const { transactions, currency } = useBudget();
  const [viewMore, setViewMore] = useState(false);
  
  // Calculate summary data
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, viewMore ? 10 : 5);

  // Expense by category for pie chart
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: Record<string, number>, t: Transaction) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of your finances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Balance" 
          amount={balance} 
          currency={currency}
          icon={<DollarSign className="h-4 w-4" />} 
        />
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          currency={currency}
          type="income" 
          icon={<Plus className="h-4 w-4" />} 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpense} 
          currency={currency}
          type="expense" 
          icon={<Calendar className="h-4 w-4" />} 
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${currency.symbol}${value.toFixed(2)}`, 'Amount']} />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No expense data to display</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.length > 0 ? (
                <>
                  {recentTransactions.map((transaction) => (
                    <TransactionCard 
                      key={transaction.id} 
                      transaction={transaction} 
                    />
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-budget-primary"
                    onClick={() => setViewMore(!viewMore)}
                  >
                    {viewMore ? "View Less" : "View More"}
                  </Button>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
