"use server";
import createClient from "@/lib/supabase/server";
import Category from "@/types/category.type";

export default async function getCategories(): Promise<Category[]> {
  const supabase = await await createClient();
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
