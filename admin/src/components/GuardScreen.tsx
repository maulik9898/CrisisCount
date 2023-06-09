import { Events } from "@/types/types";
import React, { useEffect } from "react";
import { Card, CardTitle } from "./ui/card";
import { MapPin, Pin, Timer } from "lucide-react";
import { CardHeader } from "./ui/card";
import Attendance from "./Attendance";
import LocationSelect from "./LocationSelect";
import Scan from "./Scan";

interface GuardScreenProps {
  activeEvent: Events;
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZone: "Asia/Calcutta",
};
const GuardScreen: React.FC<GuardScreenProps> = ({ activeEvent }) => {
  const [location, setLocation] = React.useState<number>();

  useEffect(() => {
    console.log("location", location);
  }, [location]);
  return (
    <div className="flex flex-col  h-screen p-4">
      <Card className="flex justify-between">
        <CardHeader className="p-4">
          <CardTitle className="flex gap-2 ">
            <p className={`inline-block mr-2  text-2xl`}>Event </p>
            <p
              className={`inline-block mr-2
              text-green-400
            text-2xl`}
            >
              {activeEvent.id}
            </p>
            <Attendance event={activeEvent} />
          </CardTitle>
          <div className="grid gap-1 text-gray-400">
            <div className="flex items-center">
              <Timer className="inline-block  mr-2" size={16} />
              <p>
                {new Intl.DateTimeFormat("en-US", options).format(
                  new Date(activeEvent.start_time!)
                )}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="mt-4">
        <LocationSelect onChange={(value) => setLocation(Number(value))} />
      </div>
      {location && (
        <div className="mt-4">
          <Scan event_id={activeEvent.id} location_id={location} />
        </div>
      )}
    </div>
  );
};

export default GuardScreen;
