"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogIn,
    UserPlus,
    LogOut,
    LayoutDashboard,
    User,
} from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: {
        firstName: string;
        lastName?: string;
        email: string;
        role: string;
    } | null;
    navLinks: {
        href: string;
        label: string;
        icon: React.ElementType;
    }[];
    isActive: (path: string) => boolean;
    handleLogout: () => void;
}

export default function MobileMenu({
    isOpen,
    setIsOpen,
    user,
    navLinks,
    isActive,
    handleLogout,
}: MobileMenuProps) {
    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut" as const,
            },
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            },
        },
    };

    const menuItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 },
    };

    const backdropVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={backdropVariants}
                    className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsOpen(false);
                    }}
                >
                    {/* Mobile Menu Content */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="pt-24 pb-8 px-6 border-t border-neutral-100 h-full overflow-y-auto"
                    >
                        <div className="max-w-md mx-auto space-y-2">
                            {/* Mobile Navigation Links */}
                            {navLinks.map(({ href, label, icon: Icon }, index) => (
                                <motion.div
                                    key={href}
                                    variants={menuItemVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={href}
                                        className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 ${isActive(href)
                                            ? "text-neutral-900 bg-neutral-100 border border-neutral-200"
                                            : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon size={22} className={isActive(href) ? "text-primary" : ""} />
                                        <span className="font-semibold text-lg">{label}</span>
                                        {isActive(href) && (
                                            <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Auth/User Menu */}
                            <motion.div
                                variants={menuItemVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                transition={{ delay: navLinks.length * 0.05 }}
                                className="pt-6 mt-6 border-t border-neutral-100 space-y-3"
                            >
                                {user ? (
                                    <>
                                        <div className="p-4 flex items-center space-x-4 bg-neutral-50 rounded-2xl mb-4 border border-neutral-100">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                                                {user.firstName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-neutral-900">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-sm text-neutral-500">{user.email}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 uppercase tracking-wider">
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            className="flex items-center space-x-4 px-5 py-4 text-neutral-600 font-medium rounded-2xl hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard size={22} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-4 px-5 py-4 text-neutral-600 font-medium rounded-2xl hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User size={22} />
                                            <span>Profile</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-4 px-5 py-4 text-danger font-medium rounded-2xl hover:bg-danger/5 transition-colors"
                                        >
                                            <LogOut size={22} />
                                            <span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/auth/login"
                                            className="flex items-center justify-center space-x-2 px-4 py-3.5 text-neutral-600 font-semibold rounded-xl border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LogIn size={20} />
                                            <span>Login</span>
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="flex items-center justify-center space-x-2 px-4 py-3.5 text-white font-semibold bg-primary rounded-xl hover:bg-primary-hover transition-all duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <UserPlus size={20} />
                                            <span>Register</span>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
