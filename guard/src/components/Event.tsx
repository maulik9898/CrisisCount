import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Events } from "@/types/types";
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
  timeZone: 'Asia/Calcutta',
};

const Event: React.FC<EventProps> = ({ event }) => {
  return (
    <Card
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
          <Attendance event={event} />
        </CardTitle>
        <div className="grid gap-1 text-gray-400">
          <div className="flex items-center">
            <Timer className="inline-block  mr-2" size={16} />
            <p>
            {new Intl.DateTimeFormat("en-US", options).format(new Date(event.start_time!))}
            </p>
          </div>
          {!event.is_active && (
            <>
              <div className="flex items-center">
                <TimerOff className="inline-block  mr-2" size={16} />
                <p>
                  {new Intl.DateTimeFormat("en-US", options).format(new Date(event.end_time!))}
                </p>
              </div>
            </>
          )}

          {event.is_active ? (
            <StopEvent id={event.id} />
          ) : (
            <DeleteEvent id={event.id} />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default Event;
