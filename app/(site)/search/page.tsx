import ProductItem from "@/components/ProductItem";
import { Product } from "@/types";
import { getBaseUrl } from "@/utils";
import SearchSidebar from "./SearchSidebar"; // We'll create this next
import Link from "next/link";
import { X } from "lucide-react";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        brand?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const {
        q = "all",
        category = "all",
        brand = "all",
        price = "all",
        rating = "all",
        sort = "newest",
        page = "1",
    } = params;

    const baseUrl = getBaseUrl();
    const queryParams = new URLSearchParams({
        q,
        category,
        brand,
        price,
        rating,
        sort,
        page,
    });

    const res = await fetch(`${baseUrl}/api/search?${queryParams.toString()}`, {
        cache: "no-store",
    });

    const data = await res.json();
    const { products, countProducts, pages, categories, brands } = data;

    const getFilterUrl = (key: string, value: string) => {
        const newParams = new URLSearchParams(queryParams);
        newParams.set(key, value);
        newParams.set("page", "1");
        return `/search?${newParams.toString()}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4 flex-shrink-0">
                    <SearchSidebar
                        categories={categories}
                        brands={brands}
                        category={category}
                        brand={brand}
                        price={price}
                        rating={rating}
                        sort={sort}
                    />
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4">
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-xl font-black text-primary">
                                {q !== "all" ? `Results for "${q}"` : "All Collections"}
                            </h1>
                            <p className="text-xs text-text-dark/50 font-bold uppercase tracking-widest mt-1">
                                {countProducts} {countProducts === 1 ? 'Masterpiece' : 'Masterpieces'} Found
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-text-dark/70">Sort by:</span>
                            <select
                                className="bg-secondary px-4 py-2 rounded-xl text-xs font-bold text-primary border-none outline-none cursor-pointer"
                            // This needs to be a client component or simpler navigation link, 
                            // but for now I'll use a simple client script link wrap or just let the Sidebar handle sort 
                            // Actually simplest is to make this select a client component too, or part of Sidebar.
                            // For simplicity, let's keep it here but we really need client interactivity for onChange.
                            // I will move Sort to the Sidebar component or make a small client wrapper.
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="featured">Featured</option>
                                <option value="lowest">Price: Low to High</option>
                                <option value="highest">Price: High to Low</option>
                                <option value="toprated">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(category !== "all" || brand !== "all" || price !== "all" || rating !== "all" || (q !== "all" && q !== "")) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {q !== "all" && q !== "" && (
                                <Link href={getFilterUrl("q", "all")} className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black transition-colors">
                                    "{q}" <X size={12} />
                                </Link>
                            )}
                            {category !== "all" && (
                                <Link href={getFilterUrl("category", "all")} className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors">
                                    {category} <X size={12} />
                                </Link>
                            )}
                            {brand !== "all" && (
                                <Link href={getFilterUrl("brand", "all")} className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors">
                                    {brand} <X size={12} />
                                </Link>
                            )}
                            {price !== "all" && (
                                <Link href={getFilterUrl("price", "all")} className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors">
                                    Price: {price} <X size={12} />
                                </Link>
                            )}
                            <Link href="/search" className="text-[10px] font-bold text-red-500 underline ml-2 hover:text-red-700">Clear All</Link>
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl font-bold text-text-dark/30">No results found matching your criteria.</p>
                            <button className="mt-4 bg-primary text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                                View Latest Collection
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: Product) => (
                                <ProductItem key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            {[...Array(pages).keys()].map(x => (
                                <Link
                                    key={x + 1}
                                    href={getFilterUrl("page", (x + 1).toString())}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-black ${Number(page) === x + 1 ? 'bg-accent text-primary' : 'bg-secondary text-text-dark/50 hover:bg-gray-200'} transition-all`}
                                >
                                    {x + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
