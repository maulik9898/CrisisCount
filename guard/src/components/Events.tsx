import supabase from "@/supabase/supabase";

import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import React, { useEffect } from "react";
import Event from "./Event";
import { RealtimeChangesPayload, Events } from "@/types/types";
import { Button } from "./ui/button";
import { CalendarHeartIcon, CalendarPlus } from "lucide-react";
import CreateEvent from "./CreateEvent";

const Events = () => {
  const [events, setEvents] = React.useState<Events[]>([]);

  useEffect(() => {
    let events = getEventSubscription((payload) => {
      switch (payload.eventType) {
        case "INSERT":
          setEvents((events) => [payload.new as Events, ...events]);
          break;
        case "UPDATE":
          setEvents((events) =>
            events.map((event) =>
              event.id === payload.new.id ? (payload.new as Events) : event
            )
          );
          break;
        case "DELETE":
          setEvents((events) =>
            events.filter((event) => event.id !== payload.old.id)
          );
      }
    });
    return () => {
      events.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getEvents().then((events) => {
      if (events) {
        setEvents(events);
      }
    });
  }, []);

  async function getEvents() {
    let { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }

    return events;
  }

  function getEventSubscription(fn: (payload: RealtimeChangesPayload) => void) {
    const events = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        fn
      )
      .subscribe((_, err) => {
        if (err) {
          console.error(err);
        }
      });
    return events;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <CreateEvent />

      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};

export default Events;
