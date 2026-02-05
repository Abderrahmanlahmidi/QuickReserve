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
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const checkAuth = () => {
      const cookieUser = Cookies.get("user");
      if (cookieUser) {
        try {
          setUser(JSON.parse(cookieUser));
        } catch (e) {
          console.error("Failed to parse user cookie", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsAuthChecked(true);
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
    { href: "/#about", label: "About", icon: Info },
    { href: "/#contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-white/80 backdrop-blur-md border-neutral-200"
          : "bg-white/0 border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 border border-neutral-200 rounded-full bg-white group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                <Calendar size={20} className="text-primary transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-primary tracking-tight">
                  quickreserve
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isActive(href)
                    ? "text-neutral-900 bg-neutral-100 font-semibold"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                >
                  <Icon size={16} className={isActive(href) ? "text-primary" : ""} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthChecked ? (
                user ? (
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
                      className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 hover:bg-neutral-50 rounded-full"
                    >
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="group relative flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-full transition-colors hover:bg-primary-hover"
                    >
                      <span>Register</span>
                      <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/30" />
                    </Link>
                  </>
                )
              ) : (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span>Loading...</span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors duration-200"
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
