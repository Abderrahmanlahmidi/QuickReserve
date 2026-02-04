"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Users, MapPin, AlignLeft, Tag } from "lucide-react";
import Modal from "../atoms/Modal";
import FormInput from "../../ui/FormInput";

interface EventFormData {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    categoryId: string;
}

interface EventFormOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData) => void;
    initialData?: any;
    categories: { id: string; name: string }[];
    title: string;
    isLoading?: boolean;
}

export default function EventFormOverlay({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    categories,
    title,
    isLoading,
}: EventFormOverlayProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EventFormData>();

    useEffect(() => {
        if (initialData) {
            // Format date for datetime-local input
            const date = new Date(initialData.date);
            const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);

            reset({
                ...initialData,
                date: formattedDate,
            });
        } else {
            reset({
                title: "",
                description: "",
                date: "",
                location: "",
                capacity: 0,
                status: "UPCOMING",
                categoryId: "",
            });
        }
    }, [initialData, reset, isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    label="Event Title"
                    icon={Tag}
                    {...register("title", { required: "Title is required" })}
                    error={errors.title?.message}
                    placeholder="e.g. Summer Music Festival"
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                        Description
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-neutral-500">
                            <AlignLeft size={18} />
                        </div>
                        <textarea
                            {...register("description")}
                            className="w-full pl-11 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-neutral-500 min-h-[100px] text-white"
                            placeholder="Tell us about the event..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Date & Time"
                        type="datetime-local"
                        icon={Calendar}
                        {...register("date", { required: "Date is required" })}
                        error={errors.date?.message}
                    />

                    <FormInput
                        label="Capacity"
                        type="number"
                        icon={Users}
                        {...register("capacity", {
                            required: "Capacity is required",
                            valueAsNumber: true,
                            min: { value: 1, message: "Minimum 1 seat" }
                        })}
                        error={errors.capacity?.message}
                        placeholder="50"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Location"
                        icon={MapPin}
                        {...register("location")}
                        placeholder="e.g. Central Park, NY"
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                            Category
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                <Tag size={18} />
                            </div>
                            <select
                                {...register("categoryId", { required: "Category is required" })}
                                className="w-full pl-11 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                        {isLoading ? "Saving..." : "Save Event"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
