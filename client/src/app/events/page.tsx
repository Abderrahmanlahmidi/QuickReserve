import EventExplore from "../../../components/mod/events/EventExplore";
import { getCategories } from "../../../lib/categories/categories";
import { getEvents } from "../../../lib/events/event";
import { Event } from "../../../types/events";



export default async function EventsPage() {
    const [allEvents, categories] = await Promise.all([getEvents(), getCategories()]);
    const events = (allEvents as Event[]).filter((event: Event) => event.status === 'PUBLISHED');

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
                        Explore <span className="text-primary italic">Events</span>
                    </h1>
                    <p className="text-neutral-500 max-w-2xl mx-auto">
                        Discover and book the most exciting workshops, conferences, and festivals happening around you.
                    </p>
                </div>

                <EventExplore initialEvents={events} categories={categories} />
            </div>
        </div>
    );
}
