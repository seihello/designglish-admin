import Part from "@/enum/part.enum";
import createClient from "@/lib/supabase/client";

export default async function updateCourseWord(
  id: number,
  title: string,
  ipa: string,
  parts: Part[],
  meaning: string,
  synonyms: string[],
  sentences: string[],
) {
  const supabase = createClient();
  const updateWordRes = await supabase
    .from("words")
    .update({
      title,
      ipa,
      parts,
      meaning,
      synonyms,
    })
    .eq("id", id);

  if (updateWordRes.error) {
    throw new Error(updateWordRes.error.message);
  }
}
