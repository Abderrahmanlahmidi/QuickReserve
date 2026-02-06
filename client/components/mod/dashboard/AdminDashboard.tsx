import { CalendarClock, CalendarDays, MapPin, TrendingUp, Users } from "lucide-react";
import { Event } from "../../../types/events";

type EventWithStats = Event & {
    reservationsCount?: number;
    reservedSeats?: number;
    bookedSeats?: number;
    attendees?: number;
    attendeesCount?: number;
    ticketsSold?: number;
    bookings?: number;
    currentBookings?: number;
    reservations?: unknown[];
};

const bookingFields = [
    "reservationsCount",
    "reservedSeats",
    "bookedSeats",
    "attendees",
    "attendeesCount",
    "ticketsSold",
    "bookings",
    "currentBookings",
] as const;

const getBookingCount = (event: EventWithStats): number | null => {
    for (const field of bookingFields) {
        const value = event[field];
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }
    }

    if (Array.isArray(event.reservations)) {
        return event.reservations.length;
    }

    return null;
};

const getStatusClasses = (status: string) => {
    if (status === "DRAFT") return "bg-amber-100 text-amber-700";
    if (status === "PUBLISHED") return "bg-green-100 text-green-700";
    if (status === "CANCELLED" || status === "CANCELED") return "bg-red-100 text-red-700";
    return "bg-neutral-100 text-neutral-600";
};

const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Date TBD";
    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const getOccupancyBarClass = (rate: number | null) => {
    if (rate === null) return "bg-neutral-200";
    if (rate >= 0.8) return "bg-success";
    if (rate >= 0.5) return "bg-primary";
    return "bg-warning";
};

interface AdminDashboardProps {
    events: EventWithStats[];
}

export default function AdminDashboard({ events }: AdminDashboardProps) {
    const now = new Date();
    const validEvents = Array.isArray(events) ? events : [];

    const upcomingEvents = validEvents
        .map((event) => ({ event, date: new Date(event.date) }))
        .filter(({ date }) => !Number.isNaN(date.getTime()) && date >= now)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ event }) => event);

    const occupancySamples = validEvents
        .map((event) => {
            const booked = getBookingCount(event);
            const capacity = typeof event.capacity === "number" && event.capacity > 0 ? event.capacity : 0;
            return { booked, capacity };
        })
        .filter((sample) => sample.booked !== null && sample.capacity > 0) as Array<{ booked: number; capacity: number }>;

    const totalBooked = occupancySamples.reduce((sum, sample) => sum + sample.booked, 0);
    const totalCapacity = occupancySamples.reduce((sum, sample) => sum + sample.capacity, 0);
    const avgOccupancy = totalCapacity > 0 ? totalBooked / totalCapacity : null;

    const displayedUpcoming = upcomingEvents.slice(0, 6);

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">Admin Dashboard</h1>
                    <p className="text-neutral-500 mt-2 max-w-2xl">
                        Track occupancy performance and keep an eye on upcoming events.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    <CalendarClock size={16} className="text-primary" />
                    Updated {now.toLocaleDateString(undefined, { dateStyle: "medium" })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-500">Total Events</p>
                        <CalendarDays size={18} className="text-primary" />
                    </div>
                    <p className="text-3xl font-black text-neutral-900 mt-4">{validEvents.length}</p>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-500">Upcoming Events</p>
                        <CalendarClock size={18} className="text-primary" />
                    </div>
                    <p className="text-3xl font-black text-neutral-900 mt-4">{upcomingEvents.length}</p>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-500">Avg Occupancy</p>
                        <TrendingUp size={18} className="text-primary" />
                    </div>
                    <p className="text-3xl font-black text-neutral-900 mt-4">
                        {avgOccupancy === null ? "N/A" : `${Math.round(avgOccupancy * 100)}%`}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                        {occupancySamples.length > 0
                            ? `Based on ${occupancySamples.length} event${occupancySamples.length === 1 ? "" : "s"} with booking data`
                            : "No booking data available yet"}
                    </p>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-500">Seats Booked</p>
                        <Users size={18} className="text-primary" />
                    </div>
                    <p className="text-3xl font-black text-neutral-900 mt-4">
                        {avgOccupancy === null ? "N/A" : totalBooked}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                        {avgOccupancy === null ? "Waiting for booking metrics" : `Out of ${totalCapacity} total capacity`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900">Upcoming Events</h2>
                        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                            Next {displayedUpcoming.length} events
                        </span>
                    </div>

                    {displayedUpcoming.length === 0 ? (
                        <div className="text-center py-16 bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl">
                            <CalendarDays size={48} className="mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-lg font-bold text-neutral-900">No upcoming events</h3>
                            <p className="text-neutral-500 mt-1">Create events to start filling your calendar.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayedUpcoming.map((event) => {
                                const booked = getBookingCount(event);
                                const capacity = typeof event.capacity === "number" && event.capacity > 0 ? event.capacity : 0;
                                const occupancyRate = booked !== null && capacity > 0 ? booked / capacity : null;
                                const occupancyPercent = occupancyRate === null ? 0 : Math.min(100, Math.round(occupancyRate * 100));
                                const occupancyLabel =
                                    booked === null || capacity === 0 ? "No booking data" : `${booked}/${capacity} seats`;

                                return (
                                    <div
                                        key={event.id}
                                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white border border-neutral-200 rounded-3xl"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-bold text-neutral-900">{event.title}</h3>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClasses(
                                                        event.status
                                                    )}`}
                                                >
                                                    {event.status || "DRAFT"}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={14} className="text-primary" />
                                                    <span>{formatEventDate(event.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-primary" />
                                                    <span>{event.location || "Online"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-primary" />
                                                    <span>{capacity} capacity</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-56 space-y-2">
                                            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                                                <span>Occupancy</span>
                                                <span>{occupancyLabel}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                                                <div
                                                    className={`h-full ${getOccupancyBarClass(occupancyRate)}`}
                                                    style={{ width: `${occupancyPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4">
                        <h2 className="text-xl font-bold text-neutral-900">Occupancy Insights</h2>
                        <p className="text-sm text-neutral-500">
                            Monitor booking velocity and capacity utilization for better staffing and planning.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Total Capacity</span>
                                <span className="font-semibold text-neutral-900">
                                    {occupancySamples.length === 0 ? "N/A" : totalCapacity}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Seats Booked</span>
                                <span className="font-semibold text-neutral-900">
                                    {occupancySamples.length === 0 ? "N/A" : totalBooked}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Occupancy Rate</span>
                                <span className="font-semibold text-neutral-900">
                                    {avgOccupancy === null ? "N/A" : `${Math.round(avgOccupancy * 100)}%`}
                                </span>
                            </div>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                                className={`h-full ${getOccupancyBarClass(avgOccupancy)}`}
                                style={{ width: `${avgOccupancy === null ? 0 : Math.round(avgOccupancy * 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-neutral-500">
                            {occupancySamples.length === 0
                                ? "Connect booking metrics to see occupancy trends."
                                : "Use occupancy trends to plan marketing and staffing."}
                        </p>
                    </div>

                    <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-3xl p-6 space-y-3">
                        <h3 className="text-lg font-bold text-neutral-900">Quick Actions</h3>
                        <p className="text-sm text-neutral-500">Stay on top of event performance with admin tools.</p>
                        <div className="flex flex-col gap-2 text-sm text-neutral-600">
                            <span>Review upcoming events for capacity risks.</span>
                            <span>Publish drafts to increase occupancy.</span>
                            <span>Promote low-occupancy events.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
