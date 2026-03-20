import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

// ── Mocks ───────────────────────────────────────────────

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// ── Helpers ─────────────────────────────────────────────

function formData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

const session = { user: { id: "user-1" } };

// ── Tests ───────────────────────────────────────────────

describe("createCategory", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns error when name is empty", async () => {
    mockAuth.mockResolvedValue(session);
    const result = await createCategory(formData({ name: "  " }));
    expect(result).toEqual({ error: "Name is required" });
  });

  it("returns error when category already exists", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue({ id: "cat-1", name: "Food" });

    const result = await createCategory(formData({ name: "Food" }));
    expect(result).toEqual({ error: "Category already exists" });
  });

  it("returns generic error when prisma throws", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockRejectedValue(new Error("FK constraint"));

    const result = await createCategory(formData({ name: "Food" }));
    expect(result).toEqual({ error: "Something went wrong. Please try again." });
  });

  it("creates a category successfully", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "cat-1", name: "Food" });

    const result = await createCategory(formData({ name: "Food" }));
    expect(result).toEqual({ success: true });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: "Food", kind: "EXPENSE", userId: "user-1" },
    });
  });

  it("throws when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    await expect(createCategory(formData({ name: "Food" }))).rejects.toThrow("Unauthorized");
  });
});

describe("updateCategory", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns error when category not found", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue(null);

    const result = await updateCategory("cat-1", formData({ name: "Updated" }));
    expect(result).toEqual({ error: "Category not found" });
  });

  it("returns error when duplicate name exists", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst
      .mockResolvedValueOnce({ id: "cat-1", name: "Food" }) // ownership check
      .mockResolvedValueOnce({ id: "cat-2", name: "Groceries" }); // duplicate check

    const result = await updateCategory("cat-1", formData({ name: "Groceries" }));
    expect(result).toEqual({ error: "Category already exists" });
  });

  it("returns generic error when prisma throws", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst
      .mockResolvedValueOnce({ id: "cat-1", name: "Food" })
      .mockResolvedValueOnce(null);
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const result = await updateCategory("cat-1", formData({ name: "Groceries" }));
    expect(result).toEqual({ error: "Something went wrong. Please try again." });
  });

  it("updates a category successfully", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst
      .mockResolvedValueOnce({ id: "cat-1", name: "Food" })
      .mockResolvedValueOnce(null);
    mockUpdate.mockResolvedValue({ id: "cat-1", name: "Groceries" });

    const result = await updateCategory("cat-1", formData({ name: "Groceries" }));
    expect(result).toEqual({ success: true });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "cat-1" },
      data: { name: "Groceries" },
    });
  });
});

describe("deleteCategory", () => {
  beforeEach(() => jest.clearAllMocks());

  it("archives a category (soft delete)", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue({ id: "cat-1", name: "Food" });
    mockUpdate.mockResolvedValue({});

    const result = await deleteCategory("cat-1");
    expect(result).toEqual({ success: true });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "cat-1" },
      data: { archived: true },
    });
  });

  it("returns error when category not found", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue(null);

    const result = await deleteCategory("cat-1");
    expect(result).toEqual({ error: "Category not found" });
  });

  it("returns generic error when prisma throws", async () => {
    mockAuth.mockResolvedValue(session);
    mockFindFirst.mockResolvedValue({ id: "cat-1", name: "Food" });
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const result = await deleteCategory("cat-1");
    expect(result).toEqual({ error: "Something went wrong. Please try again." });
  });
});
