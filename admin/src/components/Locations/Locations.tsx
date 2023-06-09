import supabase from "@/supabase/supabase";
import { RealtimeChangesPayload, Location } from "@/types/types";
import React, { useEffect } from "react";
import CreateEvent from "../CreateEvent";
import LocationCard from "./Location";
import CreateLocation from "./CreateLocation";

const Locations = () => {
  const [locations, setLocations] = React.useState<Location[]>([]);

  useEffect(() => {
    let events = getEventSubscription((payload) => {
      switch (payload.eventType) {
        case "INSERT":
          setLocations((events) => [payload.new as Location, ...events]);
          break;
        case "UPDATE":
          setLocations((events) =>
            events.map((event) =>
              event.id === payload.new.id ? (payload.new as Location) : event
            )
          );
          break;
        case "DELETE":
          setLocations((events) =>
            events.filter((event) => event.id !== payload.old.id)
          );
      }
    });
    return () => {
      events.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getLocations().then((locations) => {
      if (locations) {
        setLocations(locations);
      }
    });
  }, []);

  async function getLocations() {
    let { data: events, error } = await supabase.from("location").select("*");
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
        { event: "*", schema: "public", table: "location" },
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
    <div className="w-full grid grid-cols-1 gap-4 mt-6">
      <CreateLocation />
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
};

export default Locations;
