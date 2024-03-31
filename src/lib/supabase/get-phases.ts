"use server";
import createClient from "@/lib/supabase/server";
import Phase from "@/types/phase.type";

export default async function getPhases(): Promise<Phase[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("phases")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
