import React from "react"; // assuming you have UI components for Button and Badge
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Employees } from "@/types/types";
import DeleteEmployee from "./DeleteEmployee";
import QRCode from "react-qr-code";
import EditEmployee from "./EditEmployee";

interface EmployeeDetailCardProps {
  employee: Employees;
}

const EmployeeDetailCard: React.FC<EmployeeDetailCardProps> = ({
  employee,
}) => {
  return (
    <Card className="">
      <div className="p-6 flex gap-4 align-baseline ">
        <p className="inline-block font-bold leading-none tracking-tight text-gray-400 text-2xl">
          {employee.id}
        </p>
        <p
          className={`inline-block  text-2xl font-semibold leading-none tracking-tight`}
        >
          {employee.name}
        </p>

        <Badge variant={"outline"}>{employee.employee_type}</Badge>
      </div>
      <div className="p-6">
        <div className="border-white border-2 flex items-center">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={employee.id.toString()}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-6">
        <EditEmployee employee={employee} />
        <DeleteEmployee id={employee.id} />
      </div>
    </Card>
  );
};

export default EmployeeDetailCard;
