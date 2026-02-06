"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { EventExploreProps } from "../../../types/events";
import Pagination from "../atoms/Pagination";




export default function EventExplore({ initialEvents, categories }: EventExploreProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                event.description?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "all" || event.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialEvents, search, selectedCategory]);

    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));

    const pagedEvents = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredEvents.slice(start, start + pageSize);
    }, [filteredEvents, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-3xl border border-neutral-200">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900 placeholder:text-neutral-400"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900 appearance-none cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-neutral-900">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
                        <h3 className="text-xl font-bold text-neutral-900">No events found</h3>
                        <p className="text-neutral-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    pagedEvents.map((event) => (
                        <Link
                            href={`/events/${event.id}`}
                            key={event.id}
                            className="group bg-white border border-neutral-200 rounded-3xl overflow-hidden hover:border-primary/30 transition-colors flex flex-col"
                        >
                            <div className="p-6 space-y-4 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-primary/5 rounded-xl text-primary">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                        {categories.find(c => c.id === event.categoryId)?.name || "General"}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-neutral-900 group-hover:text-primary transition-colors line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-neutral-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
                                        {event.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center text-neutral-600 text-sm">
                                        <Calendar className="mr-2 text-primary" size={14} />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, {
                                            dateStyle: 'medium'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center text-neutral-600 text-sm">
                                        <MapPin className="mr-2 text-primary" size={14} />
                                        <span className="truncate">{event.location || "Location TBD"}</span>
                                    </div>
                                    <div className="flex items-center text-neutral-600 text-sm">
                                        <Users className="mr-2 text-primary" size={14} />
                                        <span>{event.capacity} seats available</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between group-hover:bg-neutral-50 transition-colors">
                                <span className="text-sm font-bold text-primary">View Details</span>
                                <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
