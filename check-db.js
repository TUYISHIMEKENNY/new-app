import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

console.log('Reading .env file...');
const envContent = fs.readFileSync('.env', 'utf-8');
const lines = envContent.split('\n');

let url = '';
let key = '';

for (const line of lines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    url = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    key = line.split('=')[1].trim();
  }
}

console.log('Testing Supabase Connection...');
console.log('URL:', url);
console.log('Key:', key);

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('posts').select('*').limit(1);
  if (error) {
    console.error('Error querying posts table:', error);
  } else {
    console.log('Success! posts table query result:', data);
  }
}

check();
