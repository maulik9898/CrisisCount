import Event from "@/components/Event";
import LocationCount from "@/components/LocationCount";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase/supabase";
import { Events, Location } from "@/types/types";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EventPage = () => {
  const [locations, setLocations] = React.useState<Location[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = React.useState<Events>();

  React.useEffect(() => {
    getLocations().then((locations) => {
      if (locations) {
        setLocations(locations);
      }
    });
  }, []);

  React.useEffect(() => {
    getEvent().then((event) => {
      if (event) {
        setEvent(event);
      }
    });
  }, []);

  async function getEvent() {
    let { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .limit(1);
    if (error) {
      console.error(error);
      return;
    }
    if (data === null) {
      return;
    }
    return data[0];
  }

  async function getLocations() {
    let { data: events, error } = await supabase.from("location").select("*");
    if (error) {
      console.error(error);
      return;
    }

    return events;
  }

  const eventLocations = useMemo(() => {
    if (!event) return [];
    return locations.map((location) => (
      <LocationCount
        key={location.id}
        event_id={event.id}
        location={location}
      />
    ));
  }, [locations, event]);

  return (
    <div className="m-4 flex gap-4 flex-col">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          <ArrowLeft className=" mr-2 inline-block " size={16} />
          Back
        </Button>
      </div>
      {event && <Event event={event} />}
      {eventLocations}
    </div>
  );
};

export default EventPage;
