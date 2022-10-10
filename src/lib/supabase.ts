import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var supabase: SupabaseClient | undefined;
}

export const supabase =
  global.supabase ||
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  );

if (process.env.NODE_ENV !== 'production') {
  global.supabase = supabase;
}
