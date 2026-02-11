import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { logoutAdmin } from "@/app/admin/_actions/auth";

export const metadata: Metadata = {
  title: "Agent mission control",
  description: "Vital Edge agent observability and handoff queue.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/admin/inbox", label: "Inbox" },
    { href: "/admin/runs/weekly", label: "Weekly Runs" },
    { href: "/admin/runs/monthly", label: "Monthly Runs" },
    { href: "/admin/agents", label: "Agents" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <Container className="py-6">
      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-black/60">Admin</div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-black/80 hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black/80 hover:bg-black/5"
          >
            Login
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black/80 hover:bg-black/5"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
      {children}
    </Container>
  );
}
