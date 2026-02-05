"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";
import { Calendar, MapPin, Clock, Tag, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import Alert from "../atoms/Alert";

export default function MyReservations() {
    const { data: reservations, isLoading, isError } = useQuery({
        queryKey: ["my-reservations"],
        queryFn: async () => {
            const response = await axiosClient.get("/reservations/my-reservations");
            return response.data;
        },
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
            <div>
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight">My Bookings</h2>
                <p className="text-neutral-500 mt-1">Track your event reservations and status</p>
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
                        className="inline-block mt-6 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Explore Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations?.map((res: any) => (
                        <div
                            key={res.id}
                            className="group bg-white border border-neutral-200 rounded-[32px] overflow-hidden hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] flex flex-col"
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
