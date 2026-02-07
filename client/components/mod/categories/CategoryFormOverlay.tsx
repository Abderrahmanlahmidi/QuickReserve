"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Tag } from "lucide-react";
import Modal from "../atoms/Modal";

interface CategoryFormData {
    name: string;
}

interface CategoryFormOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => void;
    initialData?: Partial<CategoryFormData> | null;
    title: string;
    isLoading?: boolean;
}

export default function CategoryFormOverlay({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
    isLoading,
}: CategoryFormOverlayProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({ name: "" });
        }
    }, [initialData, reset, isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">
                        Category Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Tag size={18} />
                        </div>
                        <input
                            {...register("name", { required: "Name is required" })}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-neutral-400 text-neutral-900"
                            placeholder="e.g. Workshop"
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500 ml-1">{errors.name.message}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? "Saving..." : "Save Category"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
