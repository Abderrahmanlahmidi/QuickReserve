import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CategoryList from "../../../components/mod/categories/CategoryList";

async function getCategories() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/categories`, {
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}

export default async function ManageCategoriesPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        redirect("/auth/login");
    }

    const user = JSON.parse(decodeURIComponent(userCookie));
    if (user.role !== 'ADMIN') {
        redirect("/");
    }

    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-neutral-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <CategoryList initialCategories={categories} />
            </div>
        </div>
    );
}
