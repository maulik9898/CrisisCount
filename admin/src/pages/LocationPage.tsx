import { columns } from "@/components/Employees/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/supabase/supabase";
import {
  Attendance,
  Employees,
  Location,
  RealtimeChangesPayload,
} from "@/types/types";
import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface EmployeeAttendance {
  employee_id: number;
  event_id: number;
  id: number;
  location_id: number;
  timestamp: string;
  employees: {
    id: number;
    name: string;
    employee_type: string;
  };
}

const LocationPage = () => {
  let { id, location_id } = useParams();
  const navigate = useNavigate();

  const [attendances, setAttendances] = React.useState<EmployeeAttendance[]>(
    []
  );

  const [employees, setEmployees] = React.useState<Employees[]>([]);

  const [location, setLocation] = React.useState<Location>();

  const [count, setCount] = React.useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    getLocations().then((locations) => {
      if (locations) {
        setLocation(locations);
      }
    });
  }, []);

  React.useEffect(() => {
    const count: { [key: string]: number } = employees.reduce(
      (acc: { [key: string]: number }, employee) => {
        acc[employee.employee_type] = (acc[employee.employee_type] || 0) + 1;
        return acc;
      },
      {}
    );
    count["Total"] = employees.length;
    setCount(count);
  }, [employees]);

  async function getLocations() {
    let { data, error } = await supabase
      .from("location")
      .select("*")
      .eq("id", location_id)
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

  React.useEffect(() => {
    const employees = attendances.map((attendance) => attendance.employees);
    setEmployees(employees);
  }, [attendances]);

  async function getAttendances() {
    let { data, error } = await supabase
      .from("attendance")
      .select(
        `
        *,
        employees ( id,name, employee_type)
      `
      )
      .eq("location_id", location_id)
      .eq("event_id", id);
    if (error) {
      console.error(error);
      return;
    }
    if (data === null) {
      return;
    }
    setAttendances(data);
  }

  useEffect(() => {
    let events = getEventSubscription((payload) => {
      switch (payload.eventType) {
        case "INSERT":
          let record = payload.new as Attendance;
          console.log(record);
          if (record.event_id == id && record.location_id == location_id) {
            getAttendances();
          }
          break;
      }
    });

    getAttendances();
    return () => {
      events.unsubscribe();
    };
  }, []);

  function getEventSubscription(fn: (payload: RealtimeChangesPayload) => void) {
    const events = supabase
      .channel(`location-${location_id}-channel`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendance",
          filter: `location_id=eq.${location_id}`,
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
    <div className="flex flex-col gap-4 mb-4 p-4">
      <div className="flex gap-4 align-middle">
        <Button
          onClick={() => {
            navigate(`/event/${id}`, { replace: true });
          }}
        >
          <ArrowLeft className="inline-block " size={16} />
        </Button>
        <p className="text-2xl font-bold self-center">{location?.name}</p>
      </div>
      <Card>
        <CardContent className="p-4">
          {Object.keys(count).map((key) => (
            <div key={key} className="flex items-center">
              <span className="mr-2 font-medium text-gray-300 dark:text-gray-500">
                {key}:
              </span>
              <span className="text-gray-100 dark:text-gray-400">
                {count[key]}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <DataTable data={employees} columns={columns} />
      </div>
    </div>
  );
};

export default LocationPage;
