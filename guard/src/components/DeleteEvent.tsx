import React from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
interface DeleteEventProps {
  id: number;
}
const DeleteEvent: React.FC<DeleteEventProps> = ({ id }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const deleteEvent = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("events")
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
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully",
      });
    },
  });
  return (
    <Button
      onClick={() => {
        deleteEvent.mutate();
      }}
      className="mt-2 text-red-400"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 inline-block animate-spin" size={16} />
      ) : (
        <Trash2 className="mr-2 inline-block " size={16} />
      )}
      Delete Event
    </Button>
  );
};

export default DeleteEvent;
