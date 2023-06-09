import { CalendarPlus, Loader2, MapPin } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase/supabase";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

const CreateLocation = () => {
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const { toast } = useToast();
  const createLocation = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("location")
        .insert([{ name }]);

      if (error) {
        throw error;
      }
      return data;
    },
    onSettled(data, error, variables, context) {
      setLoading(false);
    },
    onError(error: PostgrestError, variables, context) {
      console.error(error);
      toast({
        title: "Error creating location",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      console.log(data);
      toast({
        title: "Location Created",
        description: "Location has been created successfully",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 inline-block animate-spin" size={16} />
          ) : (
            <MapPin className="mr-2 inline-block " size={16} />
          )}
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading || name === ""}
            onClick={(event) => createLocation.mutateAsync()}
          >
            {loading && (
              <Loader2 className="mr-2 inline-block animate-spin" size={16} />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLocation;
