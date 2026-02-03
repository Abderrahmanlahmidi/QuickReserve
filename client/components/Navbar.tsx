"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

type Props = {};

export default function Navbar({ }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
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
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(href)
                      ? "text-white bg-neutral-800"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
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

      {/* Mobile Menu Backdrop (Full Screen Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="md:hidden fixed inset-0 z-40 bg-neutral-900/95 backdrop-blur-sm"
            onClick={handleBackdropClick}
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
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg transition-colors duration-200 ${
                        isActive(href)
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

                {/* Mobile Auth Buttons */}
                <motion.div
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4 mt-4 border-t border-neutral-800 space-y-3"
                >
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
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}