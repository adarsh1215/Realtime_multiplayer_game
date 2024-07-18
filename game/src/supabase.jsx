import { createClient } from '@supabase/supabase-js';

const client = createClient("https://hqkozzyusgqjzkfaqkqt.supabase.co", import.meta.env.VITE_SUPABASE_KEY);

const get_supabase = () => client;

export default get_supabase;