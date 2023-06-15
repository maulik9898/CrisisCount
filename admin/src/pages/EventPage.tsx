import Event from "@/components/Event";
import LocationCount from "@/components/LocationCount";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase/supabase";
import { Events, Location } from "@/types/types";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EventPage = () => {
  const [locations, setLocations] = React.useState<Location[]>([]);
  let { state } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
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

      <Event event={state.event} />
      {locations.map((location) => (
        <LocationCount
          key={location.id}
          event_id={state.event.id}
          location={location}
        />
      ))}
    </div>
  );
};

export default EventPage;
