import { NavLink } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { PieChart, DollarSign, Users, Calendar } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: PieChart,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: DollarSign,
  },
  {
    title: "Income",
    url: "/income",
    icon: Calendar,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: Users,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 flex items-center">
          <h1 className="text-2xl font-bold text-budget-primary">BudgetSplitter</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-budget-primary" : ""
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
