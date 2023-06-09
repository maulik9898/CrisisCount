import supabase from "@/supabase/supabase";
import { Events } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import React, { useEffect } from "react";
import { Badge } from "./ui/badge";

interface AttendanceProps {
  event: Events;
}

const Attendance: React.FC<AttendanceProps> = ({ event }) => {
  const count = useQuery({
    queryKey: ["attendance", event.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);
      if (error) {
        throw error;
      }
      return count;
    },
    refetchInterval: event.is_active ? 1500 : false,
  });

  return (
    <div className="flex items-center">
      <Badge>
        {count.data ? count.data : 0} / {event.total}
      </Badge>
    </div>
  );
};

export default Attendance;
