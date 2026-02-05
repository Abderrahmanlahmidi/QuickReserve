import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EventList from "../../../components/mod/my-events/EventList";

async function getMyEvents() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events/my-events`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}

async function getCategories() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/categories`, {
            cache: 'force-cache'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}

export default async function MyEventsPage() {
    const eventsData = getMyEvents();
    const categoriesData = getCategories();

    const [events, categories] = await Promise.all([eventsData, categoriesData]);

    if (events === null) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <EventList initialEvents={events} categories={categories} />
            </div>
        </div>
    );
}
