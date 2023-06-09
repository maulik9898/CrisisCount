import { CalendarPlus, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase/supabase";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

const CreateEvent = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const createEvent = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("events")
        .insert([{ end_time: null, is_active: true }]);

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
      if (error.code === "23505") {
        toast({
          title: "Event already exists",
          description: "There is already an active event",
          variant: "destructive",
        });
      }
    },
    onSuccess(data, variables, context) {
      console.log(data);
      toast({
        title: "Event Created",
        description: "Event has been created successfully",
      });
    },
  });

  return (
    <Button disabled={loading} onClick={() => createEvent.mutate()}>
      {loading ? (
        <Loader2 className="mr-2 inline-block animate-spin" size={16} />
      ) : (
        <CalendarPlus className="mr-2 inline-block " size={16} />
      )}
      Add Event
    </Button>
  );
};

export default CreateEvent;
