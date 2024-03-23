import createClient from "@/lib/supabase/client";
import Phase from "@/types/phase.type";

export default async function getPhases(): Promise<Phase[]> {
  const supabase = createClient();
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
