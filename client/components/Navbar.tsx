"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  Mail,
  Menu,
  X,
  Calendar,

} from "lucide-react";

import UserDropdown from "./mod/navbar/UserDropdown";
import MobileMenu from "./mod/navbar/MobileMenu";

type Props = Record<string, never>;

export default function Navbar({ }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName?: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Check for authenticated user
    const checkAuth = () => {
      // Check cookies first
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          setUser(JSON.parse(cookieUser));
          return;
        } catch (e) {
          console.error("Failed to parse user cookie", e);
        }
      }

      // Fallback or legacy check/cleanup could go here, but for now just check cookie
      setUser(null);
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);

    // Listen for custom storage event/window updates
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("access_token", { path: '/' });
    Cookies.remove("user", { path: '/' });

    // Also clear localStorage just in case
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
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-neutral-900/80 backdrop-blur-md border-neutral-800"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 border border-white/10 rounded-xl bg-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300">
                <Calendar size={20} className="text-white transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  QuickReserve
                </h1>
                <span className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase">
                  Smart Booking
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isActive(href)
                    ? "text-white bg-white/10 ring-1 ring-white/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={16} className={isActive(href) ? "text-white" : ""} />
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
                    className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors duration-200 hover:text-white"
                  >
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="group relative flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-full transition-all duration-300 hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    <span>Register</span>
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/30" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
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