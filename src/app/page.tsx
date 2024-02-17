"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/text-area";
import Part from "@/enum/part.enum";
import addCourseWord from "@/lib/supabase/add-course-word";
import getCourseWords from "@/lib/supabase/get-course-words";
import Word from "@/types/word.type";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const partOptions = [
  Part.Noun,
  Part.Verb,
  Part.Adjective,
  Part.Adverb,
  Part.Idiom,
];

export default function Home() {
  // For existing words
  const [words, setWords] = useState<Word[]>();

  // For adding a new word
  const [title, setTitle] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [meaning, setMeaning] = useState<string>("");
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [sentences, setSentences] = useState<string[]>(["", "", ""]);
  const [synonyms, setSynonyms] = useState<string[]>(["", "", ""]);

  const fetchWords = useCallback(async () => {
    try {
      const words = await getCourseWords();
      setWords(words);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const inner = async () => {
      await fetchWords();
    };
    inner();
  }, [fetchWords]);

  const handleSubmitNewWord = async () => {
    try {
      if (title.length === 0) return;

      await addCourseWord(
        title,
        pronunciation,
        selectedParts,
        meaning,
        synonyms.filter((synonym) => synonym.length > 0),
        sentences.filter((sentence) => sentence.length > 0),
      );

      setTitle("");
      setPronunciation("");
      setMeaning("");
      setSelectedParts([]);
      setSynonyms(["", "", ""]);
      setSentences(["", "", ""]);

      await fetchWords();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-stretch justify-between gap-y-8 px-4">
      <div className="flex items-center justify-between gap-x-4">
        <Separator className="z-0 h-[1px] flex-1 -translate-y-1/2 bg-primary-900" />
        <h2 className="z-50 bg-primary-100 text-center text-lg font-bold text-primary-900">
          Add New Word
        </h2>
        <Separator className="z-0 h-[1px] flex-1 -translate-y-1/2 bg-primary-900" />
      </div>
      <div className="flex flex-col gap-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            placeholder="e.g., nudge"
          />
        </div>
        <div>
          <Label>Pronunciation</Label>
          <Input
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            type="text"
            id="pronunciation"
            placeholder="e.g., nʌdʒ"
          />
        </div>
        <div>
          <Label>Meaning</Label>
          <Textarea
            id="meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="e.g., Subtle design element or technique used to gently encourage users to take a specific action or guide them toward a desired behavior without being too forceful or interruptive. "
            className="h-28"
          />
        </div>
        <div>
          <Label>Part</Label>
          <Listbox value={selectedParts} onChange={setSelectedParts} multiple>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300 sm:text-sm">
                {selectedParts.length > 0 ? (
                  <span className="block truncate">
                    {selectedParts.join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-500">Select part</span>
                )}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {/* <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                /> */}
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {partOptions.map((partOption, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-primary-100 text-primary-900"
                            : "text-gray-900"
                        }`
                      }
                      value={partOption}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {partOption}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-900">
                              <FaCheck />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div>
          <Label>Sentence</Label>
          {sentences.map((sentence, index) => (
            <Textarea
              key={index}
              id="title"
              value={sentence}
              onChange={(e) => {
                const newSentences = [...sentences];
                newSentences[index] = e.target.value;
                setSentences(newSentences);
              }}
              className="mb-1 h-28"
              placeholder={`e.g., To nudge users towards completing their purchase, the site might employ a subtle reminder, such as displaying a message like "Hurry! Only 1 item left in stock."`}
            />
          ))}
        </div>
        <div>
          <Label>Synonym</Label>
          {synonyms.map((synonym, index) => (
            <Input
              key={index}
              id="synonym"
              value={synonym}
              onChange={(e) => {
                const newSynonyms = [...synonyms];
                newSynonyms[index] = e.target.value;
                setSynonyms(newSynonyms);
              }}
              className="mb-1"
              placeholder={"prompt"}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmitNewWord} className="w-24">
            Submit
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-4">
        <Separator className="z-0 h-[1px] flex-1 -translate-y-1/2 bg-primary-900" />
        <h2 className="z-50 bg-primary-100 text-center text-xl font-bold text-primary-900">
          Word List
        </h2>
        <Separator className=" z-0 h-[1px] flex-1 -translate-y-1/2 bg-primary-900" />
      </div>
      <div className="flex flex-col gap-y-2">
        {words?.map((word, index) => (
          <div
            key={index}
            className="flex w-full flex-col gap-y-2 bg-white p-4 shadow-md"
          >
            <div className="flex items-center gap-x-2">
              <h3 className="text-lg font-bold">{word.title}</h3>
              <p className="text-sm italic">{word.ipa}</p>
            </div>
            <div>
              <p>[{word.parts.join(", ")}]</p>
              <p>{word.meaning}</p>
            </div>
            <div>
              {word.sentences.map((sentence, index) => (
                <p key={index} className="italic">
                  {sentence}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {word.synonyms.map((synonym, index) => (
                <p
                  key={index}
                  className="rounded-full border border-primary-900 bg-primary-100 px-3 py-1 text-sm text-primary-900"
                >
                  {synonym}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
