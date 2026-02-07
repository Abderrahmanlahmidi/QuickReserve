"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";
import { User, Calendar, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Alert from "../atoms/Alert";
import Modal from "../atoms/Modal";
import Link from "next/link";
import Pagination from "../atoms/Pagination";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type ReservationUser = {
    firstName?: string;
    lastName?: string;
    email?: string;
};

type ReservationEvent = {
    title?: string;
};

type Reservation = {
    id: string;
    status: ReservationStatus;
    user?: ReservationUser;
    event?: ReservationEvent;
};

export default function ReservationManager() {
    const queryClient = useQueryClient();
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [actionType, setActionType] = useState<ReservationStatus | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { data: reservations = [], isLoading, isError } = useQuery<Reservation[]>({
        queryKey: ["all-reservations"],
        queryFn: async () => {
            const response = await axiosClient.get("/reservations");
            return response.data;
        },
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    });

    const mutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
            return axiosClient.patch(`/reservations/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
            setSelectedReservation(null);
            setActionType(null);
        },
    });

    const getStatusStyle = (status: ReservationStatus) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-success/10 text-success border-success/20";
            case "CANCELED":
                return "bg-danger/10 text-danger border-danger/20";
            default:
                return "bg-warning/10 text-warning border-warning/20";
        }
    };

    const totalPages = Math.max(1, Math.ceil(reservations.length / pageSize));

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const pagedReservations = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return reservations.slice(start, start + pageSize);
    }, [reservations, safeCurrentPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-neutral-500 font-medium">Loading reservations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Manage Reservations</h2>
                    <p className="text-neutral-500 mt-1">Approve or decline event booking requests</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to home page</span>
                </Link>
            </div>

            {isError && (
                <Alert type="error" title="Error" message="Failed to load reservations. Please try again later." />
            )}

            <div className="bg-white border border-neutral-200 rounded-[32px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-100">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">User</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Event</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                                        No reservations found in the system.
                                    </td>
                                </tr>
                            ) : (
                                pagedReservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-900">{res?.user?.firstName || "Unknown"} {res?.user?.lastName || "User"}</p>
                                                    <p className="text-xs text-neutral-500">{res?.user?.email || "No email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="font-semibold text-neutral-700">{res?.event?.title || "Deleted Event"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(res?.status || "PENDING")}`}>
                                                {res?.status || "PENDING"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end">
                                                <select
                                                    value={res.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value as ReservationStatus;
                                                        if (newStatus !== res.status) {
                                                            setSelectedReservation(res);
                                                            setActionType(newStatus);
                                                        }
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer ${res?.status === "CONFIRMED" ? "bg-success/5 border-success/20 text-success" :
                                                            res?.status === "CANCELED" ? "bg-danger/5 border-danger/20 text-danger" :
                                                                "bg-warning/5 border-warning/20 text-warning"
                                                        }`}
                                                >
                                                    <option value="PENDING" className="text-neutral-900">Pending</option>
                                                    <option value="CONFIRMED" className="text-neutral-900">Confirmed</option>
                                                    <option value="CANCELED" className="text-neutral-900">Canceled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <Modal
                isOpen={!!selectedReservation && !!actionType}
                onClose={() => {
                    setSelectedReservation(null);
                    setActionType(null);
                }}
                title={actionType === 'CONFIRMED' ? "Confirm Reservation" :
                    actionType === 'PENDING' ? "Reset to Pending" : "Decline Reservation"}
            >
                <div className="space-y-6">
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${(actionType === 'CONFIRMED') ? "bg-success/5 border-success/10" :
                            actionType === 'PENDING' ? "bg-warning/5 border-warning/10" : "bg-danger/5 border-danger/10"
                        }`}>
                        <div className={`p-2 rounded-full ${(actionType === 'CONFIRMED') ? "bg-success/10 text-success" :
                                actionType === 'PENDING' ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                            }`}>
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-neutral-600 text-sm">
                            Change status to <span className="font-bold text-neutral-900 uppercase">{actionType}</span> for
                            <span className="font-bold text-neutral-900 mx-1">
                                {selectedReservation?.user?.firstName} {selectedReservation?.user?.lastName}
                            </span>?
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setSelectedReservation(null);
                                setActionType(null);
                            }}
                            className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (selectedReservation?.id && actionType) {
                                    mutation.mutate({
                                        id: selectedReservation.id,
                                        status: actionType,
                                    });
                                }
                            }}
                            disabled={mutation.isPending || !selectedReservation?.id}
                            className={`px-6 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex items-center space-x-2 ${(actionType === 'CONFIRMED') ? "bg-success hover:bg-success/90" :
                                    actionType === 'PENDING' ? "bg-warning hover:bg-warning/90" : "bg-danger hover:bg-danger/90"
                                }`}
                        >
                            {mutation.isPending && <Loader2 size={18} className="animate-spin" />}
                            <span>Apply Change</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
