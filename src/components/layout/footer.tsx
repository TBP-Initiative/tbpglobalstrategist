"use client";

import Link from "next/link";
import {
  Globe,
  MessageCircle,
  Code2,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

const quickLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Strategists", href: "/strategists" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Consulting", href: "/corporates" },
    { label: "Research", href: "/research" },
    { label: "Innovation Lab", href: "/innovation" },
    { label: "Summit", href: "/summit" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Projects", href: "/projects" },
    { label: "Publications", href: "/research" },
    { label: "Press Kit", href: "/press" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: Globe },
  { label: "Twitter", href: "#", icon: MessageCircle },
  { label: "GitHub", href: "#", icon: Code2 },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-8 py-16 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-lg shadow-primary/25">
                <span className="text-xs font-bold text-white">TBP</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                TBP Global Strategists
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-fg">
              Empowering global enterprises and visionary strategists to navigate
              complexity, drive innovation, and shape the future of business.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-fg transition-colors hover:border-primary/30 hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-fg">
              <MapPin size={14} />
              <span>Global Headquarters · London · New York · Singapore</span>
            </div>
          </div>

          {Object.entries(quickLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-fg transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-fg">
              &copy; {new Date().getFullYear()} TBP Global Strategists. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-muted-fg" />
              <a
                href="mailto:contact@tbpglobalstrategists.com"
                className="text-sm text-muted-fg transition-colors hover:text-primary"
              >
                contact@tbpglobalstrategists.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
