import { Group } from "@/types";
import { useBudget } from "@/context/BudgetContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash, Users } from "lucide-react";

interface GroupCardProps {
  group: Group;
  onClick?: () => void;
}

const GroupCard = ({ group, onClick }: GroupCardProps) => {
  const { deleteGroup } = useBudget();
  const { id, name, members } = group;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-4 w-4" />
          {name}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            deleteGroup(id);
          }}
          className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-red-500"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2">
          {members.map((member) => (
            <Avatar key={member.id} className="border-2 border-white">
              <AvatarFallback className="bg-budget-primary text-white">
                {member.avatar || member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">{members.length} members</p>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
