"use server";
import Part from "@/enum/part.enum";
// import createClient from "@/lib/supabase/client";
import createClient from "@/lib/supabase/server";

export default async function addCourseWord(
  title: string,
  ipa: string,
  parts: Part[],
  meaning: string,
  synonyms: string[],
  // phaseId: string,
  sentences: string[],
  categoryIds: number[],
  phaseIds: number[],
) {
  const supabase = await createClient();
  const insertWordRes = await supabase
    .from("words")
    .insert({
      title,
      ipa,
      parts,
      meaning,
      synonyms,
      // phase_id: phaseId,
    })
    .select()
    .single();
  if (insertWordRes.error) {
    throw new Error(insertWordRes.error.message);
  }

  const addedId = insertWordRes.data.id;
  // TODO: Can't be added by single query?
  for (const sentence of sentences) {
    const insertSentencesRes = await supabase.from("sentences").insert({
      word_id: addedId,
      sentence: sentence,
    });
    if (insertSentencesRes.error) {
      throw new Error(insertSentencesRes.error.message);
    }
  }

  // TODO: Can't be added by single query?
  for (const categoryId of categoryIds) {
    const insertCategoryRes = await supabase.from("word_categories").insert({
      word_id: addedId,
      category_id: categoryId,
    });
    if (insertCategoryRes.error) {
      throw new Error(insertCategoryRes.error.message);
    }
  }

  // TODO: Can't be added by single query?
  for (const phaseId of phaseIds) {
    const insertPhaseRes = await supabase.from("word_phases").insert({
      word_id: addedId,
      phase_id: phaseId,
    });
    if (insertPhaseRes.error) {
      throw new Error(insertPhaseRes.error.message);
    }
  }
}
