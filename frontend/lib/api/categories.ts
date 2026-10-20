import type { Category } from "@/types";
import { mockCategories } from "@/lib/mock/categories";

export async function getCategories(): Promise<Category[]> {
  return [...mockCategories];
}

export async function getCategoriesByType(
  type: Category["type"],
): Promise<Category[]> {
  return mockCategories.filter((category) => category.type === type);
}
