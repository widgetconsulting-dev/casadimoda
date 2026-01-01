import db from "@/utils/db";
import ProductModel from "@/models/Product";
import { Layers, Package } from "lucide-react";

export default async function AdminSubcategoriesPage() {
    await db.connect();

    // Aggregate unique subcategories from the products collection
    const subCategories = await ProductModel.aggregate([
        { $match: { subCategory: { $exists: true, $ne: "" } } },
        {
            $group: {
                _id: "$subCategory",
                productCount: { $sum: 1 },
                categories: { $addToSet: "$category" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-primary tracking-tighter lowercase">
                    Subcategory Registry<span className="text-accent text-5xl">.</span>
                </h1>
                <p className="text-text-dark/40 font-bold uppercase tracking-widest text-[10px] mt-2">
                    Manage your hierarchical boutique lines
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCategories.length === 0 ? (
                    <div className="col-span-full bg-white p-20 rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-4">
                        <Layers size={48} className="text-gray-100" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/30">
                            No subcategories detected in registry.
                        </p>
                    </div>
                ) : (
                    subCategories.map((sub) => (
                        <div
                            key={sub._id}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <Layers size={20} className="text-primary group-hover:text-accent transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary px-3 py-1 rounded-full">
                                    {sub.productCount} Items
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-primary mb-2">
                                {sub._id}
                            </h3>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-dark/30 uppercase tracking-widest">
                                    Found in Collections:
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {sub.categories.map((cat: string) => (
                                        <span key={cat} className="text-[9px] font-black text-accent uppercase tracking-tighter">
                                            • {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
