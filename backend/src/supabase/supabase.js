import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://hqkozzyusgqjzkfaqkqt.supabase.co", process.env.SUPABASE_KEY);

export default supabase;