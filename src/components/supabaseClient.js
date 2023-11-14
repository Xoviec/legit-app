import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://bpkpqswpimtoshzxozch.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwa3Bxc3dwaW10b3NoenhvemNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NzE4NTgsImV4cCI6MjAxNTU0Nzg1OH0.Uj78lh9cIscc1NVnLXmayGSnqxAuVo4kVtkABerUzf8'
    ) 

