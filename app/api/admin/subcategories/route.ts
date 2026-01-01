import { NextResponse } from "next/server";
import db from "@/utils/db";
import SubCategory from "@/models/SubCategory";
import slugify from "slugify";

export async function GET() {
    await db.connect();
    const subCategories = await SubCategory.find({});
    await db.disconnect();
    return NextResponse.json(subCategories);
}

export async function POST(req: Request) {
    try {
        await db.connect();
        const body = await req.json();
        const { name, parentCategory, description } = body;

        const subCategory = await SubCategory.create({
            name,
            slug: slugify(name, { lower: true }),
            parentCategory,
            description,
        });

        await db.disconnect();
        return NextResponse.json(subCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating subcategory", error },
            { status: 500 }
        );
    }
}
