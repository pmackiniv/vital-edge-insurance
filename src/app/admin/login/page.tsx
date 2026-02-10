import { loginAdmin } from "@/app/admin/_actions/auth";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function errorMessage(code: string | undefined): string | null {
  if (!code) return null;
  if (code === "invalid_credentials") return "Invalid email/password combination.";
  if (code === "not_allowed") return "This account is not in the admin approver list.";
  return "Login failed.";
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const resolved = searchParams ? await searchParams : undefined;
  const error = errorMessage(resolved?.error);

  return (
    <div className="mx-auto max-w-md py-16">
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-semibold text-black">Private admin login</h1>
        <p className="mt-2 text-sm text-black/70">
          Use approved admin credentials and approver email.
        </p>

        {error ? (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {error}
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-4 space-y-3">
          <label className="block text-sm text-black/80">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
              placeholder="owner@vitaledgeinsurance.com"
            />
          </label>

          <label className="block text-sm text-black/80">
            Admin password
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg border border-black/20 bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
