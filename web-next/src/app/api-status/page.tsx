'use client';

import Image from "next/image";
import { useProducts, useCategories } from "@/hooks/useApi";

export default function ApiStatusPage() {
    const { products, loading: productsLoading } = useProducts();
    const { categories, loading: categoriesLoading } = useCategories();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-8">
            <main className="max-w-4xl text-center space-y-8">
                <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent pb-2">
                    DesignWear API Status
                </h1>
                <p className="text-xl text-zinc-500 dark:text-zinc-400">
                    Connected to Flutter Dart Backend Services
                </p>

                {/* API Connection Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Products</h3>
                        {productsLoading ? (
                            <p className="text-zinc-500">Loading...</p>
                        ) : (
                            <p className="text-green-600 font-medium">
                                {products.length} products loaded from Sanity CMS
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Categories</h3>
                        {categoriesLoading ? (
                            <p className="text-zinc-500">Loading...</p>
                        ) : (
                            <p className="text-green-600 font-medium">
                                {categories.length} categories loaded from Sanity CMS
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-8">
                    <a
                        href="/api/health"
                        className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black px-8 py-3 font-medium hover:opacity-90 transition-opacity"
                    >
                        Check API Status
                    </a>
                    <a
                        href="/api/products"
                        className="rounded-full border border-zinc-300 dark:border-zinc-700 px-8 py-3 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        View Products API
                    </a>
                    <a
                        href="/api/categories"
                        className="rounded-full border border-zinc-300 dark:border-zinc-700 px-8 py-3 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        View Categories API
                    </a>
                    <a
                        href="/"
                        className="rounded-full bg-indigo-600 text-white px-8 py-3 font-medium hover:bg-indigo-700 transition-colors"
                    >
                        🏠 Home (Flutter App)
                    </a>
                </div>
            </main>
        </div>
    );
}
