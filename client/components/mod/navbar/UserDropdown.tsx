"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    LogOut,
    LayoutDashboard,
    Settings,
    ChevronDown,
} from "lucide-react";

interface UserDropdownProps {
    user: {
        firstName: string;
        lastName?: string;
        email: string;
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
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors duration-200 focus:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-white font-medium">
                    {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-white">{user.firstName}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5"
                    >
                        <div className="p-3 border-b border-neutral-800">
                            <p className="text-sm font-medium text-white truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <LayoutDashboard size={16} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <User size={16} />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </Link>
                        </div>
                        <div className="p-1 border-t border-neutral-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside listener for dropdown */}
            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}
        </div>
    );
}
