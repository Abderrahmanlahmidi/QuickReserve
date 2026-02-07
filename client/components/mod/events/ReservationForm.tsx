"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosClient from "../../../lib/axios-client";
import Alert from "../atoms/Alert";
import { CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react";
import type { AxiosError, AxiosResponse } from "axios";

type User = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
};

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type ReservationEvent = {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    location?: string;
};

type Reservation = {
    id: string;
    status: ReservationStatus;
    eventId?: string;
    event?: ReservationEvent;
};

type ReservationResponse = {
    status: ReservationStatus;
};

type ErrorResponse = {
    message?: string;
};

const readUserFromCookie = (): User | null => {
    if (typeof window === "undefined") {
        return null;
    }
    const userData = Cookies.get("user");
    if (!userData) return null;
    try {
        return JSON.parse(userData) as User;
    } catch {
        return null;
    }
};

interface ReservationFormProps {
    eventId: string;
    capacity: number;
    creatorId?: string;
}

export default function ReservationForm({ eventId, capacity, creatorId }: ReservationFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [user] = useState<User | null>(() => readUserFromCookie());
    const [optimisticStatus, setOptimisticStatus] = useState<ReservationStatus | null>(null);

    // Fetch user's reservations to check if already reserved
    const { data: myReservations = [], isLoading: isChecking } = useQuery<Reservation[]>({
        queryKey: ["my-reservations"],
        queryFn: async () => {
            const token = Cookies.get("access_token");
            if (!token) return [];
            const response = await axiosClient.get("/reservations/my-reservations");
            return response.data;
        },
        enabled: !!user,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    });

    const activeReservation = useMemo(() => {
        return (
            myReservations.find(
                (res) => (res.event?.id === eventId || res.eventId === eventId) && res.status !== "CANCELED",
            ) || null
        );
    }, [myReservations, eventId]);

    const derivedStatus = activeReservation?.status ?? null;
    const effectiveStatus = derivedStatus ?? optimisticStatus;
    const isAlreadyReserved = !!effectiveStatus;

    const mutation = useMutation<
        AxiosResponse<ReservationResponse>,
        AxiosError<ErrorResponse>
    >({
        mutationFn: async () => axiosClient.post<ReservationResponse>("/reservations", { eventId }),
        onSuccess: (response) => {
            setOptimisticStatus(response.data.status);
            queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
            router.refresh();
        },
    });

    const isCreator = !!creatorId && user?.id === creatorId;

    const handleReserve = () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        mutation.mutate();
    };

    if (user && isChecking) {
        return (
            <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-[32px] border border-neutral-100 min-h-[200px]">
                <div className="flex flex-col items-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Checking status...</p>
                </div>
            </div>
        );
    }

    if (isCreator) {
        return (
            <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-[32px] space-y-4">
                <div className="flex items-center space-x-3 text-neutral-500">
                    <AlertCircle size={24} />
                    <span className="font-bold">Organizer Access</span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                    You are the organizer of this event. You cannot create a reservation for your own event.
                </p>
                <button
                    onClick={() => router.push('/manage-events')}
                    className="w-full py-3 bg-white border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all font-medium"
                >
                    Manage Event
                </button>
            </div>
        );
    }

    if (isAlreadyReserved) {
        return (
            <div className={`p-8 border rounded-[32px] space-y-4 ${effectiveStatus === 'CONFIRMED' ? "bg-success/5 border-success/10" : "bg-warning/5 border-warning/10"
                }`}>
                <div className={`flex items-center space-x-3 ${effectiveStatus === 'CONFIRMED' ? "text-success" : "text-warning"
                    }`}>
                    {effectiveStatus === 'CONFIRMED' ? <CheckCircle size={24} /> : <Clock size={24} />}
                    <span className="text-lg font-black tracking-tight">
                        {effectiveStatus === 'CONFIRMED' ? "Your reservation confirm" : "Pending wait confirm"}
                    </span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                    {effectiveStatus === 'CONFIRMED'
                        ? "Great news! Your spot has been confirmed. You're all set to attend this event."
                        : "Your request has been received. Please wait for an administrator to confirm your spot."}
                </p>
                <div className="pt-2">
                    <button
                        onClick={() => router.push('/my-bookings')}
                        className="w-full py-3 bg-white border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-colors font-medium"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="p-8 bg-white border border-neutral-200 rounded-[32px] space-y-6">
            <div className="flex items-baseline justify-between">
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-neutral-900">Free</span>
                </div>
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">per person</span>
            </div>
            <p className="text-xs text-neutral-500">Capacity: {capacity} seats</p>

            {mutation.isError && (
                <Alert
                    type="error"
                    title="Reservation Failed"
                    message={mutation.error?.response?.data?.message || "Something went wrong"}
                />
            )}

            <button
                onClick={handleReserve}
                disabled={mutation.isPending}
                className="w-full py-4 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
                {mutation.isPending ? (
                    <Loader2 size={24} className="animate-spin" />
                ) : (
                    <span>Reserve Spot</span>
                )}
            </button>

            <div className="pt-4 space-y-3">
                <div className="flex items-center text-[10px] text-neutral-400 font-medium space-x-2">
                    <CheckCircle size={12} className="text-success" />
                    <span>Instant application submission</span>
                </div>
                <div className="flex items-center text-[10px] text-neutral-400 font-medium space-x-2">
                    <CheckCircle size={12} className="text-success" />
                    <span>Confirmation after admin review</span>
                </div>
            </div>

            <p className="text-center text-[10px] text-neutral-400 font-medium leading-relaxed italic">
                Limit 1 reservation per user. By clicking &quot;Reserve Spot&quot; you agree to our terms of service and event policy.
            </p>
        </div>
    );
}
