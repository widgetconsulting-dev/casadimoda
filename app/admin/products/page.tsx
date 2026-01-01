import db, { MongoDocument } from "@/utils/db";
import ProductModel from "@/models/Product";
import ProductsTable from "./ProductsTable";
import { Product } from "@/types";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  await db.connect();
  const totalProducts = await ProductModel.countDocuments();
  const products = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  const serializedProducts: Product[] = products.map((doc: MongoDocument) => {
    return db.convertDocToObj(doc) as unknown as Product;
  });

  return (
    <ProductsTable
      initialProducts={serializedProducts}
      totalPages={Math.ceil(totalProducts / pageSize)}
    />
  );
}
