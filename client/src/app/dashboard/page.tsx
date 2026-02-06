import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "../../../components/mod/dashboard/AdminDashboard";
import { Event } from "../../../types/events";

type Reservation = {
    id?: string;
    status?: string;
    eventId?: string;
    event?: { id?: string };
};

async function getEvents(token?: string): Promise<Event[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/events`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                cache: "no-store",
            }
        );
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}

async function getReservations(token?: string): Promise<Reservation[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/reservations`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                cache: "no-store",
            }
        );
        if (!response.ok) return [];
        return response.json();
    } catch (e) {
        return [];
    }
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    const token = cookieStore.get("access_token")?.value;

    if (!userCookie) {
        redirect("/auth/login");
    }

    const user = JSON.parse(decodeURIComponent(userCookie));
    if (user.role !== "ADMIN") {
        redirect("/");
    }

    const [events, reservations] = await Promise.all([getEvents(token), getReservations(token)]);

    const reservationCounts = new Map<string, number>();
    reservations
        .filter((res) => res?.status !== "CANCELED")
        .forEach((res) => {
            const eventId = res?.eventId || res?.event?.id;
            if (!eventId) return;
            reservationCounts.set(eventId, (reservationCounts.get(eventId) || 0) + 1);
        });

    const eventsWithStats = events.map((event) => ({
        ...event,
        reservationsCount: reservationCounts.get(event.id) || 0,
    }));

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <AdminDashboard events={eventsWithStats} />
            </div>
        </div>
    );
}
