import supabase from "@/supabase/supabase";
import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
interface ScanProps {
  event_id: number;
  location_id: number;
}

const Scan: React.FC<ScanProps> = ({ event_id, location_id }) => {
  const [result, setResult] = useState<number>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const { ref } = useZxing({
    onResult(result) {
      if (!Number.isNaN(parseInt(result.getText()))) {
        setResult(parseInt(result.getText()));
      }
    },
  });
  navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;

  useEffect(() => {
    console.log(result);
    if (result !== undefined) {
      if (navigator.vibrate) {
        navigator.vibrate(150);
      }

      insertAttendance(result);
    }
  }, [result]);

  const insertAttendance = async (employee_id: number) => {
    setLoading(true);
    setOpen(true);
    const { data, error } = await supabase
      .from("attendance")
      .insert([{ employee_id, event_id, location_id }]);

    if (error) {
      if (error.code === "23505") {
        setError("Employee already scanned");
      } else if (error.code === "23503") {
        setError("Employee does not exist");
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="border h-full">
      <video ref={ref} style={{ height: "100%", width: "100%" }} />
      <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Employee : {result}</AlertDialogTitle>
            <AlertDialogDescription>
              {loading ? (
                <Loader className="mr-2 inline-block animate-spin" size={16} />
              ) : error ? (
                <div className="bg-red-400/20 border-red-700 border rounded-md p-4">
                  <p className="text-white">{error}</p>
                </div>
              ) : (
                <div className="bg-green-400/20 border-green-700 border rounded-md p-4">
                  <p className="text-white ">Success</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              disabled={loading}
              onClick={() => {
                setOpen(false);
                setResult(undefined);
                setError(null);
              }}
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Scan;
