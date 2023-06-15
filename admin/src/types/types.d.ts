import { Database } from "@/types/supabase";
type RealtimeChangesPayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
}>;

type Events = Database["public"]["Tables"]["events"]["Row"];
type Employees = Database["public"]["Tables"]["employees"]["Row"];
type Location = Database["public"]["Tables"]["location"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
