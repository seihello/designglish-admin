import createClient from "@/lib/supabase/client";
import Word from "../../types/word.type";

export default async function getCourseWords(): Promise<Word[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("words")
      .select(
        "*, sentences(sentence), word_categories(categories(*)), word_phases(phases(*))",
      )
      .order("id", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    const dataCopy = [...data];

    const words: Word[] = [];
    if (dataCopy) {
      for (const wordRow of dataCopy) {
        const sentences: string[] = wordRow.sentences.map(
          (sentence: any) => sentence.sentence,
        );
        const categoryIds: number[] = wordRow.word_categories.map(
          (category: any) => category.categories.id,
        );
        const phaseIds: number[] = wordRow.word_phases.map(
          (phase: any) => phase.phases.id,
        );
        delete wordRow.word_categories;
        delete wordRow.word_phases;
        words.push({ ...wordRow, sentences, categoryIds, phaseIds });
      }
    }

    return words;
  } catch (error) {
    throw error;
  }
}
