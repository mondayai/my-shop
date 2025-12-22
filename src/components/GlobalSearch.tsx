"use client";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  LayoutGrid,
  Store,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { PRODUCT_DATA } from "@/lib/products";
import { CATEGORY_DATA } from "@/lib/categories";
import { useRouter } from "next/navigation";

interface GlobalSearchProps {
  variant?: "hero" | "nav";
}

type SearchResultType = "product" | "category" | "brand";

interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function GlobalSearch({ variant = "hero" }: GlobalSearchProps) {
  const isHero = variant === "hero";
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Aggregate and filter results
  const filteredResults: SearchResultItem[] = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Search Brands (Suppliers)
    const uniqueSuppliers = Array.from(
      new Set(PRODUCT_DATA.map((p) => p.supplier))
    );
    uniqueSuppliers.forEach((supplier) => {
      if (supplier.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "brand",
          id: `brand-${supplier}`,
          title: supplier,
          subtitle: "Official Brand Store",
          data: supplier,
        });
      }
    });

    // 2. Search Categories
    CATEGORY_DATA.forEach((cat) => {
      // Check main category
      if (cat.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "category",
          id: `cat-${cat.id}`,
          title: cat.name,
          subtitle: "Main Category",
          data: cat,
        });
      }
      // Check subcategories
      cat.subcategories.forEach((sub) => {
        if (
          sub.name.toLowerCase().includes(lowerQuery) ||
          cat.name.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: "category",
            id: `subcat-${sub.id}`,
            title: sub.name,
            subtitle: `${cat.name} > ${sub.name}`,
            data: { ...sub, parentId: cat.id },
          });
        }
      });
    });

    // 3. Search Products
    PRODUCT_DATA.forEach((product) => {
      if (
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: "product",
          id: product.id,
          title: product.name,
          subtitle: product.supplier,
          image: product.image,
          data: product,
        });
      }
    });

    // Sort by relevance (Exact matches first, then starts with, then includes)
    return results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();

      const aExact = aTitle === lowerQuery;
      const bExact = bTitle === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aTitle.startsWith(lowerQuery);
      const bStarts = bTitle.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });
  }, [query]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");

    if (item.type === "product") {
      router.push(`/product/${item.id}`);
    } else if (item.type === "category") {
      // Scroll to category section if on homepage, or navigation logic could be added here
      const elementId = item.data.parentId || item.data.id;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (item.type === "brand") {
      console.log("Navigate to brand:", item.title);
    }
  };

  const getTypeColor = (type: SearchResultType) => {
    switch (type) {
      case "product":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "category":
        return "bg-green-50 text-green-600 border-green-100";
      case "brand":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getTypeIcon = (type: SearchResultType) => {
    switch (type) {
      case "product":
        return <Package className="w-5 h-5" />;
      case "category":
        return <LayoutGrid className="w-5 h-5" />;
      case "brand":
        return <Store className="w-5 h-5" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center transition-all duration-300 ${
        isHero ? "w-full max-w-2xl" : "w-full max-w-2xl"
      }`}
    >
      <div className="relative w-full z-[60]">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // Reset page on query change
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, ingredients, or suppliers..."
          className={`w-full rounded-full border border-gray-200 bg-white/95 backdrop-blur-sm text-[#121317] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all ${
            isHero
              ? "h-14 pl-6 pr-14 text-lg"
              : "h-12 pl-6 pr-12 text-base bg-gray-100/80 border-gray-200 text-gray-900 placeholder:text-gray-500"
          }`}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className={`absolute rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600 top-1/2 -translate-y-1/2 ${
              isHero ? "right-14" : "right-12"
            }`}
          >
            <X className="w-4 h-4 ml-1" />
          </button>
        )}

        <button
          className={`absolute rounded-full flex items-center justify-center transition-colors ${
            isHero
              ? "right-2 top-2 bg-[#121317] text-white hover:bg-[#3c4043] w-10 h-10"
              : "right-1.5 top-1.5 bg-[#121317] text-white hover:bg-[#3c4043] w-9 h-9"
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] min-h-[100px] flex flex-col">
          {/* Header Status */}
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>
              {filteredResults.length > 0
                ? `Found ${filteredResults.length} results`
                : "No results found"}
            </span>
          </div>

          <div className="p-2 flex-1 relative">
            {filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                <Search className="w-8 h-8 opacity-20" />
                <span className="text-sm">
                  Try searching for &quot;ginger&quot;, &quot;soap&quot;, or
                  &quot;facial&quot;
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                {currentResults.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex gap-3 items-center group bg-white px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-50 last:border-0"
                  >
                    {/* Icon / Image */}
                    <div className="relative w-8 h-8 shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-gray-400">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="scale-75">{getTypeIcon(item.type)}</div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Tag */}
                    <div className="shrink-0 self-center">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shadow-sm border ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 flex justify-end">
              <div className="flex items-center bg-white rounded-lg p-0.5 border border-gray-200 shadow-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-[10px] font-bold text-gray-600 px-2 min-w-[30px] text-center">
                  {page}/{totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
