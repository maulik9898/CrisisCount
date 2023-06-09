import React from "react";
import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
interface DeleteEmployeeProps {
  id: number;
}
const DeleteEmployee: React.FC<DeleteEmployeeProps> = ({ id }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const deleteEmployee = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

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
        title: `Error deleting Employee with ID ${id}`,
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Employee Deleted",
        description: `Employee with ID ${id} has been deleted successfully}`,
      });
    },
  });
  return (
    <Button
      onClick={() => {
        deleteEmployee.mutate();
      }}
      variant={"destructive"}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 inline-block animate-spin" size={16} />
      ) : (
        <Trash2 className="mr-2 inline-block " size={16} />
      )}
      Delete
    </Button>
  );
};

export default DeleteEmployee;
