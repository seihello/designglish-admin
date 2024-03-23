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
  phaseIds: number[],
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

  const deleteCategoriesRes = await supabase
    .from("word_categories")
    .delete()
    .eq("word_id", id);
  if (deleteCategoriesRes.error) {
    throw new Error(deleteCategoriesRes.error.message);
  }

  for (const categoryId of categoryIds) {
    const insertCategoryRes = await supabase.from("word_categories").insert({
      word_id: id,
      category_id: categoryId,
    });
    if (insertCategoryRes.error) {
      throw new Error(insertCategoryRes.error.message);
    }
  }

  const deletePhasesRes = await supabase
    .from("word_phases")
    .delete()
    .eq("word_id", id);
  if (deletePhasesRes.error) {
    throw new Error(deletePhasesRes.error.message);
  }

  for (const phaseId of phaseIds) {
    const insertPhaseRes = await supabase.from("word_phases").insert({
      word_id: id,
      phase_id: phaseId,
    });
    if (insertPhaseRes.error) {
      throw new Error(insertPhaseRes.error.message);
    }
  }
}
