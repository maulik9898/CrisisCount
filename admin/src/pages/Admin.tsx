import Employees from "@/components/Employees/Employees";
import Events from "@/components/Events";
import Locations from "@/components/Locations/Locations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Admin = () => {
  return (
    <div className="m-4">
      <div className="flex justify-center">
        <Tabs className="w-full" defaultValue="events">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="loctions">Loctions</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-8" value="events">
            <Events />
          </TabsContent>
          <TabsContent value="employees">
            <Employees />
          </TabsContent>
          <TabsContent value="loctions">
            <Locations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
