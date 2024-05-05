"use server";
import createClient from "@/lib/supabase/server";

export default async function toggleWordEnable(id: number, isEnable: boolean) {
  const supabase = await createClient();
  const updateWordRes = await supabase
    .from("words")
    .update({
      enable: isEnable,
    })
    .eq("id", id);

  if (updateWordRes.error) {
    throw new Error(updateWordRes.error.message);
  }
}
