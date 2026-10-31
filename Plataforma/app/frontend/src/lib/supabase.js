import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const studentEmailDomain = import.meta.env.VITE_STUDENT_EMAIL_DOMAIN || 'alumnos.ecoems.mx';
export const appEnv = import.meta.env.VITE_APP_ENV || 'local';

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export function toStudentEmail(username) {
  const clean = String(username || '')
    .trim()
    .toLowerCase()
    .replace(/@.*$/, '')
    .replace(/\s+/g, '');

  return clean ? `${clean}@${studentEmailDomain}` : '';
}
