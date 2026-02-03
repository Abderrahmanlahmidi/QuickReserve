"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  Mail,
  LogIn,
  UserPlus,
  Menu,
  X,
  Calendar,

} from "lucide-react";

import UserDropdown from "./mod/navbar/UserDropdown";
import MobileMenu from "./mod/navbar/MobileMenu";

type Props = {};

export default function Navbar({ }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName?: string; email: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Check for authenticated user
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    setIsOpen(false);
    router.push("/auth/login");
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-neutral-900 border-b border-neutral-800"
          : "bg-neutral-900/95 backdrop-blur-sm"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 border border-neutral-700 rounded-lg group-hover:border-primary transition-colors duration-200">
                <Calendar size={20} className="text-white group-hover:text-primary transition-colors duration-200" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-white tracking-tight">
                  QuickReserve
                </h1>
                <span className="text-xs text-neutral-400 font-medium">
                  SMART BOOKING
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive(href)
                    ? "text-white bg-neutral-800"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <UserDropdown
                  user={user}
                  isProfileOpen={isProfileOpen}
                  setIsProfileOpen={setIsProfileOpen}
                  handleLogout={handleLogout}
                />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-neutral-300 rounded-lg border border-neutral-700 transition-colors duration-200 hover:text-white hover:border-neutral-600 hover:bg-neutral-800"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg transition-colors duration-200 hover:bg-primary-hover"
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        navLinks={navLinks}
        isActive={isActive}
        handleLogout={handleLogout}
      />
    </>
  );
}