"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";
import { Loader2 } from "lucide-react";
import EventList from "../my-events/EventList";
import Alert from "../atoms/Alert";

export default function EventManager() {
    // 1. Fetch categories (required for EventList)
    const { data: categories, isLoading: isCatLoading } = useQuery({
        queryKey: ["all-categories"],
        queryFn: async () => {
            const response = await axiosClient.get("/categories");
            return response.data;
        },
    });

    // 2. Fetch my events
    const { data: myEvents, isLoading: isEventsLoading, isError } = useQuery({
        queryKey: ["my-events"],
        queryFn: async () => {
            const response = await axiosClient.get("/events/my-events");
            return response.data;
        },
    });

    const isLoading = isCatLoading || isEventsLoading;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
                <p className="text-neutral-500 font-medium animate-pulse">Synchronizing your dashboard...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <Alert
                    type="error"
                    title="Dashboard Error"
                    message="We couldn't load your event history. Please check your connection and try again."
                />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <EventList
                initialEvents={myEvents || []}
                categories={categories || []}
            />
        </div>
    );
}

