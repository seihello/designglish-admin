import createClient from "@/lib/supabase/client";
import Category from "@/types/category.type";

export default async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("categories")
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
