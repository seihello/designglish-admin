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
  categoryIds: number[],
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

  const deleteSentencesRes = await supabase
    .from("sentences")
    .delete()
    .eq("word_id", id);
  if (deleteSentencesRes.error) {
    throw new Error(deleteSentencesRes.error.message);
  }

  for (const sentence of sentences) {
    const insertSentencesRes = await supabase.from("sentences").insert({
      word_id: id,
      sentence: sentence,
    });
    if (insertSentencesRes.error) {
      throw new Error(insertSentencesRes.error.message);
    }
  }
}
