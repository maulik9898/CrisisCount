import { Location } from "@/types/types";
import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { Loader2, Trash2 } from "lucide-react";

interface LocationProps {
  location: Location;
}

const Location: React.FC<LocationProps> = ({ location }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const deleteLocation = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("location")
        .delete()
        .eq("id", location.id);

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
        title: `Error deleting  ${location.name} location`,
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Location Deleted",
        description: `Location ${location.name} has been deleted successfully}`,
      });
    },
  });
  return (
    <Card className="p-6 flex justify-between">
      <p className="text-2xl font-semibold">{location.name}</p>
      <Button
        onClick={() => {
          deleteLocation.mutate();
        }}
        variant={"destructive"}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="inline-block animate-spin" size={16} />
        ) : (
          <Trash2 className="inline-block " size={16} />
        )}
      </Button>
    </Card>
  );
};

export default Location;
