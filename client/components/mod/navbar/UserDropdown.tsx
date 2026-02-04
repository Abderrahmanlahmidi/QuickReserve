"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    ChevronDown,
} from "lucide-react";

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
    return (
        <div className="relative">
            <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-2 py-1.5 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200 focus:outline-none group"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-medium shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                    {user.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-medium text-white leading-none">{user.firstName}</p>
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
                        initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 ring-1 ring-white/5"
                    >
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <p className="text-sm font-semibold text-white truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                            {user.role === 'ADMIN' && (
                                <Link
                                    href="/my-events"
                                    className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-neutral-300 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200 group"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <ChevronDown size={18} className="text-neutral-400 group-hover:text-white transition-colors rotate-90" />
                                    <span>My Events</span>
                                </Link>
                            )}
                        </div>
                        <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
                            >
                                <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
