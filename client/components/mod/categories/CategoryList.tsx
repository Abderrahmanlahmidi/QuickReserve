"use client";
import React, { useState } from "react";
import { Edit2, Trash2, Plus, Tag } from "lucide-react";
import CategoryFormOverlay from "./CategoryFormOverlay";
import DeleteConfirmModal from "../my-events/DeleteConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";

interface Category {
    id: string;
    name: string;
}

interface CategoryListProps {
    initialCategories: Category[];
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const queryClient = useQueryClient();

    // Create/Update Mutation
    const categoryMutation = useMutation({
        mutationFn: async (data: any) => {
            if (selectedCategory) {
                return axiosClient.patch(`/categories/${selectedCategory.id}`, data);
            }
            return axiosClient.post("/categories", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsFormOpen(false);
            setSelectedCategory(null);
            window.location.reload();
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return axiosClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            setIsDeleteOpen(false);
            setSelectedCategory(null);
            window.location.reload();
        },
    });

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-neutral-200">
                <div>
                    <h2 className="text-2xl font-black text-neutral-900">Category Management</h2>
                    <p className="text-neutral-500 text-sm mt-1">Manage categories for your platform</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all"
                >
                    <Plus size={20} />
                    <span>New Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl">
                        <Tag size={48} className="mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-lg font-bold text-neutral-900">No categories found</h3>
                        <p className="text-neutral-500 mt-1">Get started by creating your first category</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="group flex flex-col p-6 bg-white border border-neutral-200 rounded-3xl hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-primary/5 rounded-lg">
                                    <Tag size={20} className="text-primary" />
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(category)}
                                        className="p-2 text-danger/60 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 truncate">{category.name}</h3>
                        </div>
                    ))
                )}
            </div>

            <CategoryFormOverlay
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(data) => categoryMutation.mutate(data)}
                initialData={selectedCategory}
                title={selectedCategory ? "Edit Category" : "Create New Category"}
                isLoading={categoryMutation.isPending}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => selectedCategory && deleteMutation.mutate(selectedCategory.id)}
                title="Delete Category"
                itemTitle={selectedCategory?.name}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
