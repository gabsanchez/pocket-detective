"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/categories";
import { CategoryForm } from "./category-form";

interface Category {
  id: string;
  name: string;
}

export function CategoryList({ categories }: { categories: Category[] }) {
  const t = useTranslations("categories");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    await deleteCategory(id);
  }

  if (categories.length === 0) {
    return <p className="text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex items-center justify-between rounded-lg border px-4 py-3"
        >
          {editingId === category.id ? (
            <div className="flex-1">
              <CategoryForm
                category={category}
                onDone={() => setEditingId(null)}
              />
            </div>
          ) : (
            <>
              <span>{category.name}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(category.id)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  {t("delete")}
                </Button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
