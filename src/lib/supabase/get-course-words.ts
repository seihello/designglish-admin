import createClient from "@/lib/supabase/client";
import Word from "../../types/word.type";

export default async function getCourseWords(): Promise<Word[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("words")
      .select(
        "*, sentences(sentence), word_categories(categories(*)), phases(name)",
      )
      .order("id", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    const words: Word[] = [];
    if (data) {
      for (const wordRow of data) {
        const sentences: string[] = wordRow.sentences.map(
          (sentence: any) => sentence.sentence,
        );
        const categoryIds: number[] = wordRow.word_categories.map(
          (category: any) => category.categories.id,
        );
        delete wordRow.word_categories;
        words.push({ ...wordRow, sentences, categoryIds });
      }
    }

    return words;
  } catch (error) {
    throw error;
  }
}
