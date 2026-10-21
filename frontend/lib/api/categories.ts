import { apiFetch } from "@/lib/api/http";
import type { Category } from "@/types";

export interface ApiCategory {
  id: number;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    type: category.type as Category["type"],
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
}

export async function getCategories(): Promise<Category[]> {
  const categories = await apiFetch<ApiCategory[]>("/api/categories");
  return categories.map(mapCategory);
}

export async function getCategoriesByType(
  type: Category["type"],
): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((category) => category.type === type);
}
