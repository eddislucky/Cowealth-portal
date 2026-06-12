import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://rgpsmeujgjdvzgujsbep.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncHNtZXVqZ2pkdnpndWpzYmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODE0MjMsImV4cCI6MjA5Njc1NzQyM30.K3H96aIAnOVsPZ9jwT5oldg4B9PSimKK6VE8ekQhfAo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
