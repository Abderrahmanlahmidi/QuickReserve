"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosClient from "../../../lib/axios-client";
import Alert from "../atoms/Alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ReservationFormProps {
    eventId: string;
    capacity: number;
}

export default function ReservationForm({ eventId, capacity }: ReservationFormProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAlreadyReserved, setIsAlreadyReserved] = useState(false);

    useEffect(() => {
        const userData = Cookies.get("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Fetch user's reservations to check if already reserved
    const { data: myReservations, isLoading: isChecking } = useQuery({
        queryKey: ["my-reservations"],
        queryFn: async () => {
            const token = Cookies.get("access_token");
            if (!token) return [];
            const response = await axiosClient.get("/reservations/my-reservations");
            return response.data;
        },
        enabled: !!user,
    });

    useEffect(() => {
        if (myReservations) {
            const hasReserved = myReservations.some(
                (res: any) => (res.event?.id === eventId || res.eventId === eventId) && res.status !== 'CANCELED'
            );
            setIsAlreadyReserved(hasReserved);
        }
    }, [myReservations, eventId]);

    const mutation = useMutation({
        mutationFn: async () => {
            return axiosClient.post("/reservations", { eventId });
        },
        onSuccess: () => {
            setIsAlreadyReserved(true);
            router.refresh();
        },
    });

    const handleReserve = () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        mutation.mutate();
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center p-6 bg-neutral-50 rounded-3xl border border-neutral-200">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (isAlreadyReserved) {
        return (
            <div className="p-6 bg-success/5 border border-success/20 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-success">
                    <CheckCircle size={24} />
                    <span className="font-bold">Reservation Confirmed</span>
                </div>
                <p className="text-neutral-600 text-sm">
                    You have successfully reserved your spot for this event.
                    Check your email or dashboard for more details.
                </p>
                <button
                    onClick={() => router.push('/my-events')} // Assuming there's a place to see reservations
                    className="w-full py-3 bg-white border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all"
                >
                    View My Reservations
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white border border-neutral-200 rounded-3xl space-y-6">
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-neutral-900">Free</span>
                <span className="text-neutral-500 text-sm">per person</span>
            </div>

            {mutation.isError && (
                <Alert
                    type="error"
                    title="Reservation Failed"
                    message={(mutation.error as any)?.response?.data?.message || "Something went wrong"}
                />
            )}

            <button
                onClick={handleReserve}
                disabled={mutation.isPending}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
                {mutation.isPending ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <span>Reserve Spot</span>
                )}
            </button>

            <p className="text-center text-xs text-neutral-400">
                Limit 1 reservation per user. By clicking "Reserve Spot" you agree to our terms of service.
            </p>
        </div>
    );
}
