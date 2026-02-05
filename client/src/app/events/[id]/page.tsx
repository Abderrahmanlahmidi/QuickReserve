import { getEventById } from "../../../../lib/events/event";
import { getCategories } from "../../../../lib/categories/categories";
import { Calendar, MapPin, Users, Info, ArrowLeft, Tag, Share2, Heart } from "lucide-react";
import Link from "next/link";
import ReservationForm from "../../../../components/mod/events/ReservationForm";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [event, categories] = await Promise.all([
        getEventById(id),
        getCategories()
    ]);

    if (!event) {
        notFound();
    }

    const category = categories.find((c: any) => c.id === event.categoryId);

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/events"
                        className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to all events</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <Share2 size={20} className="text-neutral-600" />
                        </button>
                        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <Heart size={20} className="text-neutral-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Event Details */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                                    {category?.name || "General"}
                                </span>
                                <span className="text-neutral-400">•</span>
                                <div className="flex items-center text-neutral-500 text-sm">
                                    <Calendar size={16} className="mr-2 text-primary" />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[1.1] tracking-tight">
                                {event.title}
                            </h1>
                        </div>

                        {/* Event Quick Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-neutral-50 rounded-[40px] border border-neutral-100">
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Date & Time</p>
                                <p className="text-neutral-900 font-bold">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Location</p>
                                <p className="text-neutral-900 font-bold truncate">{event.location || "Online Event"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Availability</p>
                                <p className="text-neutral-900 font-bold">{event.capacity} Spots Total</p>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-neutral-900 flex items-center">
                                <Info size={24} className="mr-3 text-primary" />
                                About this event
                            </h2>
                            <div className="prose prose-neutral max-w-none">
                                <p className="text-neutral-600 leading-relaxed text-lg whitespace-pre-line">
                                    {event.description || "No detailed description provided for this event. Please contact the organizer for more information."}
                                </p>
                            </div>
                        </div>

                        {/* More Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-neutral-100">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <MapPin size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">Venue Details</h4>
                                    <p className="text-neutral-500 text-sm mt-1">{event.location || "Online - Link will be provided after reservation"}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <Users size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">Community</h4>
                                    <p className="text-neutral-500 text-sm mt-1">Join up to {event.capacity} attendees for this session</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Reservation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <ReservationForm
                                eventId={event.id}
                                capacity={event.capacity}
                                creatorId={event.createdBy}
                            />

                            <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 border-dashed">
                                <h4 className="text-sm font-bold text-neutral-900 mb-2">Organizer Contact</h4>
                                <p className="text-neutral-500 text-xs leading-relaxed">
                                    If you have any questions regarding the event, please reach out to the support team or visit our help center.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
