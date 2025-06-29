import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwsmfsbmklpqnuvarept.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3c21mc2Jta2xwcW51dmFyZXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjgyNDksImV4cCI6MjA2NjcwNDI0OX0.1DLiUbBN_HvBTV2-JQmBIS0Jt2tlsOJuidEVOllOuLU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 