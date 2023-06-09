import { createClient } from "@supabase/supabase-js";
import { Database } from '../types/supabase'
console.log(import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
export default supabase;
