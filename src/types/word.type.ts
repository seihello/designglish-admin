import Part from "@/enum/part.enum";

type Word = {
  id: number;
  title: string;
  meaning: string;
  sentences: string[];
  ipa: string;
  parts: Part[];
  synonyms: string[];
  categoryIds: number[];
  phaseIds: number[];
  enable: boolean;
};

export default Word;
