import Link from "next/link";
import { LogOut, Plus } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-color-beige-400 dark:border-dark-100">
        <h1 className="text-2xl font-light tracking-widest uppercase">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/outfit/new" className="inline-flex items-center px-4 py-2 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors rounded-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Outfit
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors rounded-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
