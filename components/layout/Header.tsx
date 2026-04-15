"use client";

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/EaseVoteLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Voting", href: "/events/voting" },
  { label: "Tickets", href: "/events/ticketing" },
  {
    label: "Resources",
    href: "#", // Dropdown trigger, keeping as hash or prevent default
    subLinks: [
      { label: "Blog", href: "/blogs" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="header sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <div
                  className={`flex items-center px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${
                    !link.subLinks && isActive(link.href)
                      ? "text-secondary-700 font-semibold"
                      : "text-neutral-600 hover:text-secondary-700"
                  }`}
                >
                  {link.subLinks ? (
                    <span className="flex items-center">
                      {link.label}
                      <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                    </span>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </div>

                {link.subLinks && (
                  <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-1">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={`block px-4 py-2 text-sm hover:bg-gray-100 hover:text-secondary-700 ${
                            isActive(sub.href)
                              ? "text-secondary-700 font-semibold"
                              : "text-gray-700!"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Area */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/sign-in"
              className={`font-medium hover:underline ${
                pathname === "/sign-in"
                  ? "text-secondary-700! font-semibold"
                  : "text-primary-700"
              }`}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="border-2 border-primary-700 text-primary-700 px-6 py-2 rounded-lg font-bold hover:bg-primary-700 hover:text-white! transition-colors"
            >
              Create Event
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-deep hover:text-brand-bright hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.label}>
                <div
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium hover:text-brand-bright hover:bg-gray-50 ${
                    !link.subLinks && isActive(link.href)
                      ? "text-brand-deep bg-gray-50"
                      : "text-text-main"
                  }`}
                >
                  {link.subLinks ? (
                    <div
                      className="flex justify-between items-center w-full"
                      onClick={() => toggleDropdown(link.label)}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`h-5 w-5 transform transition-transform ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
                {link.subLinks && activeDropdown === link.label && (
                  <div className="pl-6 space-y-1 bg-gray-50">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`block px-3 py-2 text-sm hover:text-brand-deep ${
                          isActive(sub.href)
                            ? "text-brand-deep font-semibold"
                            : "text-gray-600"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3 px-3">
              <Link
                href="/sign-in"
                className="text-brand-deep font-medium block"
                onClick={() => setIsOpen(false)}
              >
                Login / User Profile
              </Link>
              <Link
                href="/sign-up"
                className="w-full text-center border-2 border-primary-700 text-primary-700 px-4 py-2 rounded-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
