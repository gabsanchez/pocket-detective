"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory } from "@/lib/actions/categories";

interface CategoryFormProps {
  category?: { id: string; name: string };
  onDone?: () => void;
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const t = useTranslations("categories");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onDone?.();
  }

  return (
    <form action={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="category-name">{t("name")}</Label>
        <Input
          id="category-name"
          name="name"
          defaultValue={category?.name ?? ""}
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {category ? t("save") : t("create")}
      </Button>
      {category && (
        <Button type="button" variant="ghost" onClick={onDone}>
          {t("cancel")}
        </Button>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
