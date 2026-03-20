import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/actions/categories";
import { CategoryForm } from "./category-form";
import { CategoryList } from "./category-list";

export default async function CategoriesPage() {
  const t = await getTranslations("categories");
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <div className="mb-8">
        <CategoryForm />
      </div>
      <CategoryList categories={categories} />
    </main>
  );
}
