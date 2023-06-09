import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Loader2, Save, Trash2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Employees } from "@/types/types";
import React from "react";
import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { id } from "date-fns/locale";
import { useToast } from "../ui/use-toast";

interface EditEmployeeProps {
  employee: Employees;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ employee }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const [name, setName] = React.useState(employee.name);
  const [employee_type, setEmployeeType] = React.useState(
    employee.employee_type
  );

  const updateEmployee = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("employees")
        .update({ name, employee_type })
        .eq("id", employee.id);

      if (error) {
        throw error;
      }
      return data;
    },

    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onError(error: PostgrestError, variables, context) {
      console.error(error);
      toast({
        title: `Error updating Employee with ID ${employee.id}`,
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Employee Updated",
        description: `Employee with ID ${employee.id} has been updated successfully}`,
      });
    },
  });

  const disabled = !name || !employee_type || loading;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mx-6">
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name ? name : ""}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <RadioGroup
              onValueChange={(value) => setEmployeeType(value.toUpperCase())}
              value={employee_type.toLowerCase()}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="r2" />
                <Label htmlFor="r2">Internal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contractor" id="r3" />
                <Label htmlFor="r3">Contractor</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            onClick={() => {
              updateEmployee.mutate();
            }}
            disabled={disabled}
            variant={"secondary"}
          >
            {loading ? (
              <Loader2 className="mr-2 inline-block animate-spin" size={16} />
            ) : (
              <Save className="mr-2 inline-block " size={16} />
            )}
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditEmployee;
