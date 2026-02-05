"use client";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Calendar, MapPin, Users, Plus, Loader2 } from "lucide-react";
import EventFormOverlay from "./EventFormOverlay";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../../lib/axios-client";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    categoryId: string;
}

interface EventListProps {
    initialEvents: Event[];
    categories: { id: string; name: string }[];
}

export default function EventList({ initialEvents, categories }: EventListProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const queryClient = useQueryClient();

    // Sync state when props change (fixes reactivity issue)
    useEffect(() => {
        setEvents(initialEvents);
    }, [initialEvents]);

    const eventMutation = useMutation({
        mutationFn: async (data: any) => {
            if (selectedEvent) {
                return axiosClient.patch(`/events/${selectedEvent.id}`, data);
            }
            return axiosClient.post("/events", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-events"] });
            setIsFormOpen(false);
            setSelectedEvent(null);
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return axiosClient.delete(`/events/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-events"] });
            setIsDeleteOpen(false);
            setSelectedEvent(null);
        },
    });

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDeleteOpen(true);
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-[32px] border border-neutral-200 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Event Management</h2>
                    <p className="text-neutral-500 mt-1">Design, launch, and monitor your hosted experiences</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 px-6 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-colors"
                >
                    <Plus size={20} />
                    <span>Create New Event</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {events.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-50 border border-dashed border-neutral-200 rounded-[40px]">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">No events hosted yet</h3>
                        <p className="text-neutral-500 mt-2 max-w-xs mx-auto">Start sharing your experiences by creating your very first event today.</p>
                        <button
                            onClick={handleCreate}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Create Event Now &rarr;
                        </button>
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="group relative flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-neutral-200 rounded-[32px] hover:border-primary/30 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row items-center flex-1 space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">
                                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-2xl font-black leading-none">
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>

                                <div className="space-y-2 text-center sm:text-left flex-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h3 className="text-xl font-black text-neutral-900 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${event.status === 'DRAFT' ? 'bg-amber-100/50 text-amber-700 border-amber-200' : event.status === 'PUBLISHED' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' : 'bg-rose-100/50 text-rose-700 border-rose-200'
                                            }`}>
                                            {event.status}
                                        </span>
                                        {categories.find(c => c.id === event.categoryId) && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 border border-neutral-200">
                                                {categories.find(c => c.id === event.categoryId)?.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-neutral-500 font-medium">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar size={14} className="text-primary/60" />
                                            <span>{new Date(event.date).toLocaleString(undefined, {
                                                timeStyle: 'short'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <MapPin size={14} className="text-primary/60" />
                                            <span>{event.location || "Online"}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5">
                                            <Users size={14} className="text-primary/60" />
                                            <span>{event.capacity} seats</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-0 border-neutral-100 w-full sm:w-auto justify-center">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="px-4 py-2 text-neutral-600 hover:text-primary hover:bg-primary/5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2"
                                >
                                    <Edit2 size={16} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(event)}
                                    className="px-4 py-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all flex items-center space-x-2"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <EventFormOverlay
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(data) => eventMutation.mutate(data)}
                initialData={selectedEvent}
                categories={categories}
                title={selectedEvent ? "Edit Event Details" : "Create New Event"}
                isLoading={eventMutation.isPending}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => selectedEvent && deleteMutation.mutate(selectedEvent.id)}
                title="Delete Event"
                itemTitle={selectedEvent?.title}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

