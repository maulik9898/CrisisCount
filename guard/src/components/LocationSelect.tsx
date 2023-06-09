import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Location } from "@/types/types";
import supabase from "@/supabase/supabase";
import { Label } from "@radix-ui/react-dropdown-menu";

interface LocationSelectProps {
  onChange: (value: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ onChange }) => {
  const [locations, setLocations] = React.useState<Location[]>([]);

  React.useEffect(() => {
    getLocations().then((locations) => {
      if (locations) {
        setLocations(locations);
      }
    });
  }, []);

  async function getLocations() {
    let { data, error } = await supabase.from("location").select("*");
    if (error) {
      console.error(error);
      return;
    }
    return data;
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Location</Label>
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id.toString()}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelect;
