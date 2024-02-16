import Part from "@/enum/part.enum";
import createClient from "@/lib/supabase/client";

export default async function addCourseWord(
  title: string,
  ipa: string,
  parts: Part[],
  meaning: string,
  synonyms: string[],
  sentences: string[],
) {  
  const supabase = createClient();
  const insertWordRes = await supabase.from("words").insert({
    title,
    ipa,
    parts,
    meaning,
    synonyms,
  });
  if (insertWordRes.error) {
    throw new Error(insertWordRes.error.message);
  }
}
