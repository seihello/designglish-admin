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
  const insertWordRes = await supabase
    .from("words")
    .insert({
      title,
      ipa,
      parts,
      meaning,
      synonyms,
    })
    .select()
    .single();
  if (insertWordRes.error) {
    throw new Error(insertWordRes.error.message);
  }

  const addedId = insertWordRes.data.id;
  for (const sentence of sentences) {
    const insertSentencesRes = await supabase.from("sentences").insert({
      word_id: addedId,
      sentence: sentence,
    });
    if (insertSentencesRes.error) {
      throw new Error(insertSentencesRes.error.message);
    }
  }
}
