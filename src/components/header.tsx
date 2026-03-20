import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth();

  if (!session) return null;

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold">Pocket Detective</Link>
        <nav className="flex gap-4">
          <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">
            Categories
          </Link>
        </nav>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin" });
        }}
      >
        <Button variant="link" size="sm" type="submit">
          Sign out
        </Button>
      </form>
    </header>
  );
}
