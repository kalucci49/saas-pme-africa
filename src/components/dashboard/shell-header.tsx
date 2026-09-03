"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

export function ShellHeader({ orgName }: { orgName: string }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="shrink-0 p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition sm:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12211D]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D9A536" strokeWidth="1.8">
              <path d="M12 3v4M12 17v4M18 6l-2.5 2.5M8.5 15.5L6 18M18 18l-2.5-2.5M8.5 8.5L6 6" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </div>
          <span className="truncate font-semibold text-[15px] text-gray-900 sm:text-base">
            {orgName}
          </span>
        </div>

        <div className="flex-1" />

        {!searchOpen ? (
          <button
            type="button"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(true)}
            className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition sm:hidden"
          >
            <Search size={20} />
          </button>
        ) : (
          <div className="absolute inset-x-0 top-0 z-40 flex items-center gap-2 bg-white px-3 py-2.5 sm:hidden">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              placeholder="Client..."
              className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              style={{ colorScheme: "light" }}
            />
            <button
              type="button"
              aria-label="Fermer la recherche"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 p-1.5 rounded-full text-gray-500 hover:bg-gray-50"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 w-56">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Client..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
