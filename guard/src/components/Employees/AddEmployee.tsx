import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, UserPlus, Users } from "lucide-react";
import { Button } from "../ui/button";

const AddEmployee = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Create Employee</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Users className="mr-2 h-4 w-4" />
          <span>Import from CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddEmployee;
