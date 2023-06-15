import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Events, RealtimeChangesPayload } from "@/types/types";
import { Clock3, Delete, Loader2, Timer, TimerOff, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import supabase from "@/supabase/supabase";
import { th } from "date-fns/locale";
import { PostgrestError } from "@supabase/supabase-js";
import { useToast } from "./ui/use-toast";
import DeleteEvent from "./DeleteEvent";
import StopEvent from "./StopEvent";
import Attendance from "./Attendance";
import { useNavigate } from "react-router-dom";

interface EventProps {
  event: Events;
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

const Event: React.FC<EventProps> = ({ event }) => {
  const navigate = useNavigate();

  const [eventState, setEvent] = React.useState<Events>(event);

  function getEventSubscription(fn: (payload: RealtimeChangesPayload) => void) {
    const events = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${event.id}`,
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

  useEffect(() => {
    let events = getEventSubscription((payload) => {
      switch (payload.eventType) {
        case "UPDATE":
          setEvent(payload.new as Events);
          break;

        case "DELETE":
          navigate("/");
          break;
      }
    });
    return () => {
      events.unsubscribe();
    };
  }, []);

  return (
    <Card
      onClick={() => {
        navigate(`/event/${eventState.id}`, { state: { event } });
      }}
      className={` hover:cursor-pointer ${
        event.is_active ? "border-green-400 bg-green-200/10" : ""
      }`}
    >
      <CardHeader className="p-4">
        <CardTitle className="flex gap-2">
          <p className={`inline-block mr-2  text-2xl`}>Event </p>
          <p
            className={`inline-block mr-2 ${
              event.is_active ? "text-green-400" : "text-gray-400"
            } text-2xl`}
          >
            {event.id}
          </p>
          <Attendance event={eventState} />
        </CardTitle>
        <div className="grid gap-1 text-gray-400">
          <div className="flex items-center">
            <Timer className="inline-block  mr-2" size={16} />
            <p>
              {new Intl.DateTimeFormat("en-US", options).format(
                new Date(event.start_time!)
              )}
            </p>
          </div>
          {!eventState.is_active && (
            <>
              <div className="flex items-center">
                <TimerOff className="inline-block  mr-2" size={16} />
                <p>
                  {new Intl.DateTimeFormat("en-US", options).format(
                    new Date(eventState.end_time!)
                  )}
                </p>
              </div>
            </>
          )}

          {eventState.is_active ? (
            <StopEvent id={eventState.id} />
          ) : (
            <DeleteEvent id={eventState.id} />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default Event;
