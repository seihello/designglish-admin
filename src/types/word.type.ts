import Part from "@/enum/part.enum";
import Category from "@/types/category.type";
import Phase from "@/types/phase.type";

type Word = {
  id: number;
  title: string;
  meaning: string;
  sentences: string[];
  ipa: string;
  parts: Part[];
  synonyms: string[];
  categories: Category[];
  phase: Phase;
};

export default Word;
