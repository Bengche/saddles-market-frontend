"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Tag,
  Mail,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login?redirect=/admin");
      return;
    }
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <Link
          href="/admin"
          className="font-serif text-lg font-bold text-primary-500"
        >
          Admin Panel
        </Link>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg border border-gray-200 p-2 text-gray-700"
          aria-label="Toggle admin navigation"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-900 text-white flex-shrink-0 flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="font-serif text-xl font-bold text-white">
            Saddles Market
          </Link>
          <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-white/15 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto pb-6">{children}</main>
    </div>
  );
}
