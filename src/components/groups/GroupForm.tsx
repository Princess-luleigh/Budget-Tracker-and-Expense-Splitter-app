import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Group, GroupMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash, Plus, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const GroupForm = () => {
  const { addGroup } = useBudget();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<GroupMember[]>([
    { id: "1", name: "You" }
  ]);
  const [memberName, setMemberName] = useState("");

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    
    const newMember: GroupMember = {
      id: uuidv4(),
      name: memberName,
      avatar: memberName.charAt(0).toUpperCase()
    };
    
    setMembers([...members, newMember]);
    setMemberName("");
  };

  const handleRemoveMember = (id: string) => {
    if (id === "1") return; // Can't remove yourself
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName || members.length < 2) return;

    const newGroup: Omit<Group, "id"> = {
      name: groupName,
      members
    };

    addGroup(newGroup);
    
    // Reset form
    setGroupName("");
    setMembers([{ id: "1", name: "You" }]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Apartment, Trip to Paris"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Members</Label>
            <div className="mt-1 space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{member.name} {member.id === "1" && "(You)"}</span>
                  </div>
                  {member.id !== "1" && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-red-500"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="memberName">Add Member</Label>
            <div className="flex gap-2">
              <Input
                id="memberName"
                placeholder="Enter member name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleAddMember}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <Button 
            type="submit" 
            className="w-full bg-budget-primary hover:bg-blue-600"
            disabled={!groupName || members.length < 2}
          >
            Create Group
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GroupForm;
