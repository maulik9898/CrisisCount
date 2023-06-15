import GuardScreen from "@/components/GuardScreen";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/supabase/supabase";
import { Events } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { set } from "date-fns";
import { CalendarOff } from "lucide-react";

import React, { useEffect } from "react";

const Guard = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const [activeEvent, setActiveEvent] = React.useState<Events>();

  useEffect(() => {
    getActiveEvent();
    console.log("subscribing");
    const events = supabase
      .channel("custom-filter-active")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: "is_active=eq.true",
        },
        (payload) => {
          console.log("Guard Active ", payload);
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const ev = payload.new as Events;
            if (ev.is_active === true) {
              setActiveEvent(ev);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log("unsubscribing");
      events.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeEvent === undefined) {
      return;
    }
    console.log(`subscribing ${activeEvent.id}`);
    const events = supabase
      .channel("custom-filter-id")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${activeEvent.id}`,
        },
        (payload) => {
          console.log("Guard: ", payload);
          if (payload.eventType === "DELETE") {
            setActiveEvent(undefined);
          } else if (payload.eventType === "UPDATE") {
            const ev = payload.new as Events;
            if (ev.is_active === false) {
              setActiveEvent(undefined);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`unsubscribing ${activeEvent.id}`);
      events.unsubscribe();
    };
  }, [activeEvent]);

  const getActiveEvent = async () => {
    setLoading(true);

    let { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true);

    if (error) {
      toast({
        title: "Error getting active event",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setActiveEvent(data[0]);
    }
  };

  if (!activeEvent) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 text-gray-500">
        <CalendarOff className="w-24 h-24" />
        <p className="text-2xl font-semibold">No active event</p>
      </div>
    );
  }

  return <GuardScreen activeEvent={activeEvent} />;
};

export default Guard;
