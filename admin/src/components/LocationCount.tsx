import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { Attendance, Location, RealtimeChangesPayload } from "@/types/types";
import supabase from "@/supabase/supabase";

interface LocationCountProps {
  location: Location;
  event_id: number;
}

const LocationCount: React.FC<LocationCountProps> = ({
  location,
  event_id,
}) => {
  const [count, setCount] = React.useState<number>(0);

  const getCount = async () => {
    console.log("Getting count for", location.name);
    const { count, error } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event_id)
      .eq("location_id", location.id);
    if (error) {
      console.error(error);
      return;
    }
    if (count === null) {
      setCount(0);
    } else {
      setCount(count);
    }
  };

  useEffect(() => {
    let events = getEventSubscription((payload) => {
      console.log(`Attendance ID ${location.name} :`, payload);
      switch (payload.eventType) {
        case "INSERT":
          let record = payload.new as Attendance;
          if (
            record.event_id === event_id &&
            record.location_id === location.id
          ) {
            getCount();
          }
          break;
      }
    });

    getCount();
    return () => {
      events.unsubscribe();
    };
  }, []);

  function getEventSubscription(fn: (payload: RealtimeChangesPayload) => void) {
    const events = supabase
      .channel(`location-${location.id}-channel`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendance",
          filter: `event_id=eq.${event_id}`,
        },
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
    <Card className="p-4 flex justify-between text-lg">
      <p>{location.name}</p>
      <p className="text-gray-400 text-lg font-bold">{count}</p>
    </Card>
  );
};

export default LocationCount;
