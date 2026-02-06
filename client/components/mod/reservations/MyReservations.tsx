"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";
import { Calendar, MapPin, Clock, Tag, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Alert from "../atoms/Alert";
import Pagination from "../atoms/Pagination";
import { downloadReservationTicket } from "../../../utils/pdf";

export default function MyReservations() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const { data: reservations, isLoading, isError } = useQuery({
        queryKey: ["my-reservations"],
        queryFn: async () => {
            const response = await axiosClient.get("/reservations/my-reservations");
            return response.data;
        },
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-success/10 text-success border-success/20";
            case "CANCELED":
                return "bg-danger/10 text-danger border-danger/20";
            default:
                return "bg-warning/10 text-warning border-warning/20";
        }
    };

    const totalPages = Math.max(1, Math.ceil((reservations?.length || 0) / pageSize));

    const pagedReservations = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return (reservations || []).slice(start, start + pageSize);
    }, [reservations, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-neutral-500 font-medium">Loading your bookings...</p>
            </div>
        );
    }

    if (isError) {
        return <Alert type="error" title="Error" message="Failed to load your reservations." />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">My Bookings</h2>
                    <p className="text-neutral-500 mt-1">Track your event reservations and status</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to home page</span>
                </Link>
            </div>

            {reservations?.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-[40px] border border-neutral-100 border-dashed">
                    <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-neutral-900">No bookings yet</h3>
                    <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                        You haven't made any reservations. Explore our events and find something exciting!
                    </p>
                    <Link
                        href="/events"
                        className="inline-block mt-6 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-colors"
                    >
                        Explore Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pagedReservations.map((res: any) => (
                        <div
                            key={res.id}
                            className="group bg-white border border-neutral-200 rounded-[32px] overflow-hidden hover:border-primary/30 transition-colors flex flex-col"
                        >
                            <div className="p-6 flex-grow space-y-4">
                                <div className="flex items-start justify-between">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(res.status)}`}>
                                        {res.status}
                                    </span>
                                    <Link href={`/events/${res.event.id}`} className="text-neutral-400 hover:text-primary transition-colors">
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-neutral-900 leading-tight group-hover:text-primary transition-colors">
                                        {res.event?.title || "Deleted Event"}
                                    </h3>
                                    <p className="text-neutral-500 text-sm mt-2 line-clamp-2">
                                        {res.event?.description || "No description available"}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-2 border-t border-neutral-50">
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <Calendar size={14} className="mr-2 text-primary" />
                                        <span>{res.event?.date ? new Date(res.event.date).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : "No date"}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <MapPin size={14} className="mr-2 text-primary" />
                                        <span className="truncate">{res.event?.location || "Online"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between group-hover:bg-neutral-100/50 transition-colors">
                                <div className="flex items-center space-x-2">
                                    <Tag size={14} className="text-primary" />
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Reserved Spot</span>
                                </div>
                                {res.status === 'PENDING' && (
                                    <div className="flex items-center space-x-1 text-warning">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold uppercase">Awaiting Admin</span>
                                    </div>
                                )}
                                {res.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => downloadReservationTicket(res)}
                                        className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary-hover transition-colors"
                                    >
                                        Download Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
