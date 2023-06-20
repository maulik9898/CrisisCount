import { Employees } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Employees>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
    filterFn: "weakEquals",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "employee_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge
        className={`${
          row.getValue("employee_type") === "INTERNAL"
            ? "bg-green-500"
            : "bg-blue-500"
        } text-white`}
      >
        {row.getValue("employee_type")}
      </Badge>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];
