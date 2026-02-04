"use client";
import React, { useState } from "react";
import { Edit2, Trash2, Calendar, MapPin, Users, Plus } from "lucide-react";
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
            window.location.reload();
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return axiosClient.delete(`/events/${id}`);
        },
        onSuccess: () => {
            setIsDeleteOpen(false);
            setSelectedEvent(null);
            window.location.reload();
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
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-bold text-white">Event Management</h2>
                    <p className="text-neutral-400 text-sm mt-1">Create and manage your hosted events</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>New Event</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {events.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-neutral-600 mb-4" />
                        <h3 className="text-lg font-medium text-white">No events found</h3>
                        <p className="text-neutral-400 mt-1">Get started by creating your first event</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all duration-300"
                        >
                            <div className="flex-1 space-y-4 sm:space-y-1">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-400' : event.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {event.status}
                                    </span>
                                    {categories.find(c => c.id === event.categoryId) && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-neutral-400">
                                            {categories.find(c => c.id === event.categoryId)?.name}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center space-x-1.5 text-neutral-400 text-sm">
                                        <Calendar size={14} className="text-primary" />
                                        <span>{new Date(event.date).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-neutral-400 text-sm">
                                        <MapPin size={14} className="text-primary" />
                                        <span>{event.location || "Online"}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-neutral-400 text-sm">
                                        <Users size={14} className="text-primary" />
                                        <span>{event.capacity} Capacity</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    title="Edit Event"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(event)}
                                    className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Delete Event"
                                >
                                    <Trash2 size={18} />
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
                title={selectedEvent ? "Edit Event" : "Create New Event"}
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
