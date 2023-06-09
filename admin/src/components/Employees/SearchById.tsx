import supabase from "@/supabase/supabase";
import { Employees } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { id } from "date-fns/locale";
import React from "react";
import { toast, useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Search } from "lucide-react";

interface SearchByIdProps {
  onClick: (id: number) => void;
  loading: boolean;
}

const SearchById: React.FC<SearchByIdProps> = ({ onClick, loading }) => {
  const [id, setId] = React.useState<number | "">("");

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        value={id}
        onChange={(event) => {
          if (event.target.value) {
            setId(parseInt(event.target.value));
          } else {
            setId("");
          }
        }}
        type="number"
        placeholder="Search by ID"
      />
      <Button
        onClick={() => {
          if (id) {
            onClick(id);
          }
        }}
        disabled={loading || id === ''}
      >
        {loading ? (
          <Loader2 className="inline-block animate-spin" size={16} />
        ) : (
          <Search className="inline-block " size={16} />
        )}
      </Button>
    </div>
  );
};

export default SearchById;
