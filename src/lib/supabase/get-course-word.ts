"use server";
import createClient from "@/lib/supabase/server";
import Word from "../../types/word.type";

export default async function getCourseWord(wordId: number): Promise<Word> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("words")
      .select(
        "*, sentences(sentence), word_categories(categories(*)), word_phases(phases(*))",
      )
      .eq("id", wordId)
      .single();
    if (error) {
      throw new Error(error.message);
    }

    const wordCopy = { ...data };
    if (wordCopy) {
      const sentences: string[] = wordCopy.sentences.map(
        (sentence: any) => sentence.sentence,
      );
      const categoryIds: number[] = wordCopy.word_categories.map(
        (category: any) => category.categories.id,
      );
      const phaseIds: number[] = wordCopy.word_phases.map(
        (phase: any) => phase.phases.id,
      );
      delete wordCopy.word_categories;
      delete wordCopy.word_phases;
      return { ...wordCopy, sentences, categoryIds, phaseIds };
    }
    throw new Error("Word not found.");
  } catch (error) {
    throw error;
  }
}
