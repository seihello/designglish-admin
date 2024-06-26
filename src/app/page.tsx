"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/text-area";
import Part from "@/enum/part.enum";
import addCourseWord from "@/lib/supabase/add-course-word";
import getCategories from "@/lib/supabase/get-categories";
import getCourseWord from "@/lib/supabase/get-course-word";
import getCourseWords from "@/lib/supabase/get-course-words";
import getPhases from "@/lib/supabase/get-phases";
import toggleWordEnable from "@/lib/supabase/toggle-word-enable";
import updateCourseWord from "@/lib/supabase/update-course-word";
import Word from "@/types/word.type";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import BeatLoader from "react-spinners/BeatLoader";

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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Hash map for categories/phases
  const [categoryOptions, setCategoryOptions] = useState<Map<number, string>>(
    new Map(),
  );
  const [phaseOptions, setPhaseOptions] = useState<Map<number, string>>(
    new Map(),
  );

  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchWords = useCallback(async () => {
    try {
      setIsLoadingWords(true);
      const words = await getCourseWords();
      setWords(words);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsLoadingWords(false), 1000);
    }
  }, []);

  const fetchWord = useCallback(async (wordId: number) => {
    try {
      const newWord = await getCourseWord(wordId);

      setWords((prev) => {
        if (!prev) return prev;
        const index = prev.findIndex((prevWord) => prevWord.id === wordId);

        if (index === -1) {
          const newWords = [...prev];
          newWords.unshift(newWord);
          return newWords;
        } else {
          return prev.map((prevWord) =>
            prevWord.id === wordId ? newWord : prevWord,
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const toggleEnable = async (wordId: number, isEnable: boolean) => {
    try {
      await toggleWordEnable(wordId, isEnable);
      await fetchWord(wordId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchWords();
    };
    run();
  }, [fetchWords]);

  useEffect(() => {
    const prepareCategoriesAndPhases = async () => {
      const categories = await getCategories();
      const categoryOptions = new Map<number, string>();
      categories.forEach((category) => {
        categoryOptions.set(category.id, category.name);
      });
      setCategoryOptions(categoryOptions);

      const phases = await getPhases();
      const phaseOptions = new Map<number, string>();
      phases.forEach((phase) => {
        phaseOptions.set(phase.id, phase.name);
      });
      setPhaseOptions(phaseOptions);
    };
    prepareCategoriesAndPhases();
  }, []);

  const handleEditWord = async (index: number) => {
    if (!words) return;

    const editingWord = words[index];

    setEditingId(editingWord.id);
    setTitle(editingWord.title);
    setPronunciation(editingWord.ipa);
    setMeaning(editingWord.meaning);
    setSelectedParts(editingWord.parts);
    setSentences([...editingWord.sentences, "", "", ""].slice(0, 3));
    setSynonyms([...editingWord.synonyms, "", "", ""].slice(0, 3));
    setSelectedCategoryIds(editingWord.categoryIds);
    setSelectedPhaseIds(editingWord.phaseIds);

    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (title.length === 0) return;

      setIsSubmitting(true);

      if (editingId === null) {
        const newWordId = await addCourseWord(
          title,
          pronunciation,
          selectedParts,
          meaning,
          synonyms.filter((synonym) => synonym.length > 0),
          sentences.filter((sentence) => sentence.length > 0),
          selectedCategoryIds,
          selectedPhaseIds,
        );
        await fetchWord(newWordId);
      } else {
        await updateCourseWord(
          editingId,
          title,
          pronunciation,
          selectedParts,
          meaning,
          synonyms.filter((synonym) => synonym.length > 0),
          sentences.filter((sentence) => sentence.length > 0),
          selectedCategoryIds,
          selectedPhaseIds,
        );
        await fetchWord(editingId);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setEditingId(null);
      setTitle("");
      setPronunciation("");
      setMeaning("");
      setSelectedParts([]);
      setSynonyms(["", "", ""]);
      setSentences(["", "", ""]);
      setSelectedCategoryIds([]);
      setSelectedPhaseIds([]);
    }
  }, [isDialogOpen]);

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-stretch justify-between gap-y-8 px-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="bg-main-100 h-[80vh] w-screen max-w-[800px] overflow-scroll"
        >
          <div className="flex items-center justify-between gap-x-4">
            <Separator className="bg-main-900 z-0 h-[1px] flex-1 -translate-y-1/2" />
            <h2
              id="form"
              className="bg-main-100 text-main-900 z-50 text-center text-lg font-bold"
            >
              {editingId === null ? "Add New Word" : "Edit Word"}
            </h2>
            <Separator className="bg-main-900 z-0 h-[1px] flex-1 -translate-y-1/2" />
          </div>
          <div className="flex flex-col gap-y-4">
            <div>
              <Label>
                Title<span className="text-error-900">*</span>
              </Label>
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
              <Listbox
                value={selectedParts}
                onChange={setSelectedParts}
                multiple
              >
                <div className="relative mt-1">
                  <Listbox.Button className="focus-visible:ring-offset-main-300 relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 sm:text-sm">
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {partOptions.map((partOption, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-main-100 text-main-900"
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
                                <span className="text-main-900 absolute inset-y-0 left-0 flex items-center pl-3">
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
              <Label>Category</Label>
              <Listbox
                value={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
                multiple
              >
                <div className="relative mt-1">
                  <Listbox.Button className="focus-visible:ring-offset-main-300 relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 sm:text-sm">
                    {selectedCategoryIds.length > 0 ? (
                      <span className="block truncate">
                        {selectedCategoryIds
                          .map((selectedCategoryId) =>
                            categoryOptions.get(selectedCategoryId),
                          )
                          .join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-500">Select categories</span>
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {Array.from(categoryOptions.entries()).map(
                        (categoryOption, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-main-100 text-main-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={categoryOption[0]}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {categoryOption[1]}
                                </span>
                                {selected ? (
                                  <span className="text-main-900 absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FaCheck />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ),
                      )}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div>
              <Label>Phase</Label>
              <Listbox
                value={selectedPhaseIds}
                onChange={setSelectedPhaseIds}
                multiple
              >
                <div className="relative mt-1">
                  <Listbox.Button className="focus-visible:ring-offset-main-300 relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 sm:text-sm">
                    {selectedPhaseIds.length > 0 ? (
                      <span className="block truncate">
                        {selectedPhaseIds
                          .map((selectedPhaseId) =>
                            phaseOptions.get(selectedPhaseId),
                          )
                          .join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-500">Select phases</span>
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {Array.from(phaseOptions.entries()).map(
                        (phaseOption, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-main-100 text-main-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={phaseOption[0]}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {phaseOption[1]}
                                </span>
                                {selected ? (
                                  <span className="text-main-900 absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FaCheck />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ),
                      )}
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
                  id="sentence"
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
            <div className="flex justify-end gap-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={title.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <BeatLoader color="white" loading={true} size={8} />
                ) : editingId === null ? (
                  "Submit"
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add New</Button>
      </div>
      <div className="flex flex-col gap-y-2">
        {isLoadingWords ? (
          <>
            <Skeleton className="h-24 w-full bg-gray-100 shadow-md" />
            <Skeleton className="h-24 w-full bg-gray-100 shadow-md" />
            <Skeleton className="h-24 w-full bg-gray-100 shadow-md" />
          </>
        ) : (
          words?.map((word, index) => (
            <div
              key={word.id}
              className="relative flex w-full flex-col gap-y-4 bg-white p-4 shadow-md"
            >
              <div className="flex items-center gap-x-2">
                <h3 className="text-lg font-bold">{word.title}</h3>
                <p className="text-sm italic">{word.ipa}</p>
              </div>
              <div className="flex flex-col gap-y-2">
                <div>
                  <p>[{word.parts.join(", ")}]</p>
                  <p>{word.meaning}</p>
                </div>
                <div>
                  {word.sentences.map((sentence, index) => (
                    <p key={index} className="italic">
                      - {sentence}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  {word.synonyms.map((synonym, index) => (
                    <p
                      key={index}
                      className="border-main-900 bg-main-100 text-main-900 rounded-full border px-3 py-1 text-sm"
                    >
                      {synonym}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                {word.categoryIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                    <span className="w-20 text-sm text-gray-700">
                      Categories:
                    </span>
                    {word.categoryIds.map((categoryId) => (
                      <p
                        key={categoryId}
                        className="rounded-md border border-warning-500 bg-warning-100 px-3 py-1 text-sm text-warning-900"
                      >
                        {categoryOptions.get(categoryId)}
                      </p>
                    ))}
                  </div>
                )}
                {word.phaseIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                    <span className="w-20 text-sm text-gray-700">Phases:</span>
                    {word.phaseIds.map((phaseId) => (
                      <p
                        key={phaseId}
                        className="rounded-md border border-error-500 bg-error-100 px-3 py-1 text-sm text-error-900"
                      >
                        {phaseOptions.get(phaseId)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute right-4 flex items-center gap-x-2">
                <div className="flex items-center gap-x-1">
                  <span className="text-sm font-semibold text-gray-700">
                    Public
                  </span>
                  <Switch
                    defaultChecked={word.enable}
                    onCheckedChange={(checked) =>
                      toggleEnable(word.id, checked)
                    }
                  />
                </div>
                <ScrollLink to="form" smooth={true} duration={200}>
                  <Button onClick={() => handleEditWord(index)}>Edit</Button>
                </ScrollLink>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
