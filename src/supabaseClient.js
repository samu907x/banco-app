import { createClient } from "@supabase/supabase-js";

// Estas dos variables vienen del archivo .env (ver .env.example).
// Nunca pongas aquí la clave "sb_secret_..." — esa es la clave privada
// y solo debe usarse en un servidor, nunca en código de React.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);