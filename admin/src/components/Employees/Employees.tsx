import React, { useEffect } from "react";
import { columns } from "./columns";
import { Employees } from "@/types/types";
import { DataTable } from "../ui/data-table";
import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import SearchById from "./SearchById";
import EmployeeDetailCard from "./EmployeeDetailCard";
import { Button } from "../ui/button";
import { Edit2, Plus } from "lucide-react";
import AddEmployee from "./AddEmployee";

const Employees = () => {
  const [employee, setEmployee] = React.useState<Employees>();

  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const employees = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "employees",
          filter: `id=eq.${employee?.id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          setEmployee(payload.new as Employees);
        }
      )
      .subscribe();

    return () => {
      employees.unsubscribe();
    };
  }, [employee?.id]);

  const getEmployee = useMutation({
    mutationFn: async (id: number) => {
      setLoading(true);
      let { data, error } = await supabase
        .from("employees")
        .select("*")
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
        title: "Error get Employee",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      if (data && data?.length > 0) {
        setEmployee(data[0]);
      } else {
        console.log("not found");
        setEmployee(undefined);
        toast({
          description: `Employee with ID ${variables} not found`,
          variant: "destructive",
        });
      }
    },
  });
  return (
    <div className="py-6 grid grid-cols-1 gap-6">
      <div className="flex gap-2">
        <SearchById
          loading={loading}
          onClick={(id) => {
            getEmployee.mutate(id);
          }}
        />
        {/* <AddEmployee /> */}
      </div>
      {employee && <EmployeeDetailCard employee={employee} />}
    </div>
  );
};

export default Employees;
