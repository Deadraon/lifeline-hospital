import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yefoumvmtvqhbqkdheys.supabase.co';
const supabaseKey = 'sb_publishable_jC9_HvaaY4BUA1iwor8mfw_4SbZglIw';

export const supabase = createClient(supabaseUrl, supabaseKey);
