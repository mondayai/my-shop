"use client";

import Link from "next/link";
import { CATEGORY_DATA, SubCategory } from "@/lib/categories";
import { PRODUCT_DATA } from "@/lib/products";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  subCategoryId: string;
}

export default function CategoryGrid() {
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORY_DATA[0].id);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Fetch banners
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBanners(data);
        } else {
          console.error("Banners API returned non-array:", data);
          setBanners([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch banners:", err);
        setBanners([]);
      });
  }, []);

  const activeCategory =
    CATEGORY_DATA.find((c) => c.id === activeCategoryId) || CATEGORY_DATA[0];

  return (
    <section className="py-8 bg-white min-h-screen">
      <div className="container-custom px-4 flex gap-6 sm:gap-8 min-h-[600px]">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-54 shrink-0 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-4">
            Categories
          </h2>
          <div className="flex flex-col gap-1">
            {CATEGORY_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-left ${
                  activeCategoryId === cat.id
                    ? "bg-[#007AFF] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <cat.icon
                  className={`w-5 h-5 ${
                    activeCategoryId === cat.id ? "text-white" : "text-gray-400"
                  }`}
                />
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pb-20">
          {activeCategory.subcategories.map((sub) => (
            <SubCategorySection
              key={sub.id}
              sub={sub}
              categoryId={activeCategory.id}
              banners={banners.filter((b) => b.subCategoryId === sub.id)}
            />
          ))}

          {/* Empty State if no products in any subcategory */}
          {!PRODUCT_DATA.some((p) => p.categoryId === activeCategory.id) && (
            <div className="w-full py-20 text-center text-gray-400">
              No products found in this category yet.
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

function SubCategorySection({
  sub,
  categoryId,
  banners,
}: {
  sub: SubCategory;
  categoryId: string;
  banners: Banner[];
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Filter products for this subcategory
  const allProducts = PRODUCT_DATA.filter(
    (p) => p.categoryId === categoryId && p.subCategoryId === sub.id
  );

  // Chunk products into pages
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) =>
    allProducts.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
  );

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (allProducts.length === 0) return null;

  return (
    <div className="mb-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/95 backdrop-blur-sm py-3 z-10 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900">{sub.name}</h3>

        {/* Header Link */}
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="text-[#007AFF] text-sm font-medium hover:underline ml-4"
          >
            See All
          </Link>
        </div>
      </div>

      {/* Banner Carousel (Group of 2) */}
      {banners.length > 0 && <BannerCarousel banners={banners} />}

      {/* Product Sliding Viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(page - 1) * 100}%)` }}
        >
          {pages.map((pageProducts, i) => (
            <div
              key={i}
              className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-4 content-start min-h-[270px]"
            >
              {pageProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 items-center group bg-white p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all h-[120px]"
                >
                  {/* App Icon Squircle */}
                  <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-[18px] border border-black/5 shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center text-gray-300">
                      {/* Fallback Icon */}
                      <div className="w-10 h-10 rounded-lg bg-gray-100" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col h-full justify-center gap-1">
                    <h3
                      className="font-bold text-gray-900 text-base leading-tight line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {product.supplier}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-fit uppercase font-bold tracking-wider text-gray-500 bg-gray-100 border border-gray-200 rounded px-2 py-0.5">
                        MOQ: {product.minOrder}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end justify-center shrink-0 self-center">
                    <button className="bg-blue-50 hover:bg-[#007AFF] hover:text-white text-[#007AFF] font-bold text-xs uppercase tracking-wide px-5 py-2 rounded-full transition-all">
                      INQUIRE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls (Bottom Right) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600 px-3 min-w-[50px] text-center">
              {page}/{totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle loop reset
  useEffect(() => {
    if (index === banners.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500); // Match transition duration
      return () => clearTimeout(timeout);
    }
    if (index === 0 && !isTransitioning) {
      // Re-enable transition shortly after reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [index, banners.length, isTransitioning]);

  // If we have fewer than 2 banners, just show static
  if (banners.length < 2) {
    return (
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 overflow-hidden">
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * 50}%)`,
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {[...banners, ...banners].map((banner, i) => (
          <div key={`${banner.id}-${i}`} className="w-1/2 flex-shrink-0 px-2">
            <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Text overlay removed as requested */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
