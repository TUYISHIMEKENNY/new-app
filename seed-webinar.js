import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { error } = await supabase.from("posts").insert({
    slug: "webinars",
    title: "Webinars",
    category: "Page",
    author: "System",
    date: new Date().toISOString(),
    status: "Published",
    excerpt: "Join our upcoming webinars and view past recordings.",
    body: "<h2>Upcoming Webinars</h2><p>Content goes here.</p>",
  });

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Successfully seeded webinars page!");
  }
}

main();
