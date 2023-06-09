import supabase from "@/supabase/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { Loader2, TimerOff } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

interface StopEventProps {
  id: number;
}
const StopEvent: React.FC<StopEventProps> = ({ id }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const stopEvent = useMutation({
    mutationFn: async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .update({ end_time: new Date().toISOString(), is_active: false })
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
        title: "Error stopping event",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      console.log(data);
      toast({
        title: "Event Stopped",
        description: "Event has been stopped successfully",
      });
    },
  });
  return (
    <Button
      onClick={() => {
        stopEvent.mutate();
      }}
      variant={"destructive"}
      className="mt-2"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 inline-block animate-spin" size={16} />
      ) : (
        <TimerOff className="mr-2 inline-block " size={16} />
      )}
      Stop Event
    </Button>
  );
};

export default StopEvent;
