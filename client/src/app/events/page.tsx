import React from "react";
import EventExplore from "../../../components/mod/events/EventExplore";

async function getEvents() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/events`, {
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

export default async function EventsPage() {
    const [events, categories] = await Promise.all([getEvents(), getCategories()]);

    return (
        <div className="min-h-screen bg-neutral-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Explore <span className="text-primary italic">Events</span>
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Discover and book the most exciting workshops, conferences, and festivals happening around you.
                    </p>
                </div>

                <EventExplore initialEvents={events} categories={categories} />
            </div>
        </div>
    );
}
