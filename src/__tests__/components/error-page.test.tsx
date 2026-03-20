import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

// ── Mocks ───────────────────────────────────────────────

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

// ── Tests ───────────────────────────────────────────────

describe("ErrorPage", () => {
  it("renders error title and description", () => {
    render(<ErrorPage error={new Error("test")} reset={jest.fn()} />);

    expect(screen.getByText("error.title")).toBeInTheDocument();
    expect(screen.getByText("error.description")).toBeInTheDocument();
  });

  it("renders retry and home buttons", () => {
    render(<ErrorPage error={new Error("test")} reset={jest.fn()} />);

    expect(screen.getByRole("button", { name: "error.retry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "error.home" })).toBeInTheDocument();
  });

  it("calls reset when retry button is clicked", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error("test")} reset={reset} />);

    await user.click(screen.getByRole("button", { name: "error.retry" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
