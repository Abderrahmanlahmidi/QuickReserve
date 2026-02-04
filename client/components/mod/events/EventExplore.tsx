"use client";
import React, { useState, useMemo } from "react";
import { Search, Filter, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
}

interface EventExploreProps {
    initialEvents: Event[];
    categories: Category[];
}

export default function EventExplore({ initialEvents, categories }: EventExploreProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                event.description?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "all" || event.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialEvents, search, selectedCategory]);

    return (
        <div className="space-y-8">
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white appearance-none cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-neutral-600 mb-4" />
                        <h3 className="text-xl font-bold text-white">No events found</h3>
                        <p className="text-neutral-400 mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <Link
                            href={`/events/${event.id}`}
                            key={event.id}
                            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] flex flex-col"
                        >
                            <div className="p-6 space-y-4 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                        {categories.find(c => c.id === event.categoryId)?.name || "General"}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                                        {event.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center text-neutral-400 text-sm">
                                        <Calendar className="mr-2 text-primary/60" size={14} />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, {
                                            dateStyle: 'medium'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center text-neutral-400 text-sm">
                                        <MapPin className="mr-2 text-primary/60" size={14} />
                                        <span className="truncate">{event.location || "Location TBD"}</span>
                                    </div>
                                    <div className="flex items-center text-neutral-400 text-sm">
                                        <Users className="mr-2 text-primary/60" size={14} />
                                        <span>{event.capacity} seats available</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between group-hover:bg-white/5 transition-colors">
                                <span className="text-sm font-semibold text-primary">View Details</span>
                                <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
