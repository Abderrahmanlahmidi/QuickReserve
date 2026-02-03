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
    } | null;
    navLinks: {
        href: string;
        label: string;
        icon: any;
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
                ease: "easeInOut",
            },
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
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
                    className="md:hidden fixed inset-0 z-40 bg-neutral-900/95 backdrop-blur-sm"
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
                        className="pt-20 pb-8 px-4 border-t border-neutral-800"
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
                                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg transition-colors duration-200 ${isActive(href)
                                                ? "text-white bg-neutral-800"
                                                : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{label}</span>
                                        {isActive(href) && (
                                            <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
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
                                className="pt-4 mt-4 border-t border-neutral-800 space-y-3"
                            >
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 flex items-center space-x-3 bg-neutral-800/50 rounded-lg mb-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-white font-medium">
                                                {user.firstName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-neutral-400">{user.email}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            className="flex items-center space-x-3 px-4 py-3.5 text-neutral-300 font-medium rounded-lg hover:text-white hover:bg-neutral-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard size={20} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-3 px-4 py-3.5 text-neutral-300 font-medium rounded-lg hover:text-white hover:bg-neutral-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User size={20} />
                                            <span>Profile</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-500 font-medium rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut size={20} />
                                            <span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth/login"
                                            className="flex items-center space-x-3 px-4 py-3.5 text-neutral-300 font-medium rounded-lg border border-neutral-700 transition-colors duration-200 hover:text-white hover:border-neutral-600 hover:bg-neutral-800"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LogIn size={20} />
                                            <span>Login</span>
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="flex items-center space-x-3 px-4 py-3.5 text-white font-medium bg-primary rounded-lg transition-colors duration-200 hover:bg-primary-hover"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <UserPlus size={20} />
                                            <span>Register</span>
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
