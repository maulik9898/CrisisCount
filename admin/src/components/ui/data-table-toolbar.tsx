"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const statuses = [
  {
    value: "internal",
    label: "Internal",
  },
  {
    value: "contractor",
    label: "Contractor",
  },
];
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center flex-col justify-between gap-4">
      <div className="flex justify-between gap-2 ">
        <Input
          placeholder="Filter by name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 "
        />
        <Input
          placeholder="Filter by ID"
          type="number"
          value={(table.getColumn("id")?.getFilterValue() as number) ?? ""}
          onChange={(event) => {
            table.getColumn("id")?.setFilterValue(event.target.value);
          }}
          className="h-8  "
        />

        {/* <Select
          value={(table.getColumn("employee_type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            table.getColumn("employee_type")?.setFilterValue(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"CONTRACTOR"}>CONTRACTOR</SelectItem>
            <SelectItem value={"INTERNAL"}>INTERNAL</SelectItem>
          </SelectContent>
        </Select> */}

        <DataTableViewOptions table={table} />
      </div>
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 "
        >
          Reset
          <X className=" h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
