import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tlzhkctgptpvgwoythqn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CUwiG5_yh7xTqYJ_-Zkh_g_AaNp5GfI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
