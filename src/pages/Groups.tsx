import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Group } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GroupForm from "@/components/groups/GroupForm";
import GroupCard from "@/components/groups/GroupCard";
import GroupExpenseForm from "@/components/groups/GroupExpenseForm";
import GroupExpenseCard from "@/components/groups/GroupExpenseCard";

const Groups = () => {
  const { groups, groupExpenses } = useBudget();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const groupsWithExpenseCount = groups.map(group => {
    const count = groupExpenses.filter(expense => 
      group.members.some(m => m.id === expense.paidBy)
    ).length;
    
    return { ...group, expenseCount: count };
  });

  // Get expenses for selected group
  const selectedGroupExpenses = selectedGroup 
    ? groupExpenses.filter(expense => 
        selectedGroup.members.some(m => m.id === expense.paidBy)
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Groups</h1>
        <p className="text-gray-500">Split expenses with roommates, trips and more</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupsWithExpenseCount.length > 0 ? (
              groupsWithExpenseCount.map((group) => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  onClick={() => handleGroupClick(group)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No groups created yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create a group to split expenses with friends, roommates, or family
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <GroupForm />
        </div>
      </div>
      
      {/* Group Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedGroup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Add New Expense</h3>
                <GroupExpenseForm group={selectedGroup} />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Group Expenses</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {selectedGroupExpenses.length > 0 ? (
                    selectedGroupExpenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <GroupExpenseCard 
                          key={expense.id} 
                          expense={expense} 
                          group={selectedGroup} 
                        />
                      ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No expenses for this group yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
