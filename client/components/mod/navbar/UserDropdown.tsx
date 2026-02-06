"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    ChevronDown,
    AlertCircle,
    LayoutDashboard,
} from "lucide-react";
import Modal from "../atoms/Modal";

interface UserDropdownProps {
    user: {
        firstName: string;
        lastName?: string;
        email: string;
        role: string;
    };
    isProfileOpen: boolean;
    setIsProfileOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
}

export default function UserDropdown({
    user,
    isProfileOpen,
    setIsProfileOpen,
    handleLogout,
}: UserDropdownProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const onLogoutClick = () => {
        setIsProfileOpen(false);
        setShowLogoutModal(true);
    };
    return (
        <div className="relative">
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-2 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 focus:outline-none group"
            >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {user.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-semibold text-neutral-700 leading-none">{user.firstName}</p>
                </div>
                <ChevronDown
                    size={14}
                    className={`text-neutral-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-neutral-200 overflow-hidden z-50 ring-1 ring-black/5"
                    >
                        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <Link
                                href="/my-bookings"
                                className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary transition-colors rotate-90" />
                                <span>My Bookings</span>
                            </Link>

                            {user.role === 'ADMIN' && (
                                <>
                                    <div className="mx-3 my-2 border-t border-neutral-100" />
                                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">Host Dashboard</p>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <LayoutDashboard size={18} className="text-neutral-400 group-hover:text-primary transition-colors" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/manage-events"
                                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary transition-colors rotate-90" />
                                        <span>Manage Events</span>
                                    </Link>
                                    <Link
                                        href="/manage-categories"
                                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary transition-colors rotate-90" />
                                        <span>Manage Categories</span>
                                    </Link>
                                    <Link
                                        href="/manage-reservations"
                                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200 group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary transition-colors rotate-90" />
                                        <span>Manage Reservations</span>
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="p-2 border-t border-neutral-100">
                            <button
                                onClick={onLogoutClick}
                                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-danger rounded-xl hover:bg-danger/5 transition-all duration-200 group"
                            >
                                <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Sign Out Confirmation"
            >
                <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-danger/5 border border-danger/10 rounded-2xl">
                        <div className="p-2 bg-danger/10 rounded-full text-danger">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-neutral-600 text-sm">
                            Are you sure you want to sign out? You will need to log in again to manage your events and reservations.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(false)}
                            className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 rounded-xl bg-danger text-white font-semibold hover:bg-danger-hover transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Click outside listener for dropdown */}
            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}
        </div>
    );
}
