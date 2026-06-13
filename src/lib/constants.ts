import type { NavItem } from "@/types";

export const MAIN_NAV: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Strategists", href: "/strategists" },
  { title: "Projects", href: "/projects" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const DASHBOARD_NAV: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Projects", href: "/dashboard/projects", icon: "FolderKanban" },
  { title: "Strategists", href: "/dashboard/strategists", icon: "Users" },
  { title: "Organizations", href: "/dashboard/organizations", icon: "Building2" },
  { title: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const ADMIN_NAV: NavItem[] = [
  { title: "Admin Overview", href: "/admin", icon: "Shield" },
  { title: "Users", href: "/admin/users", icon: "UserCog" },
  { title: "Content", href: "/admin/content", icon: "FileText" },
  { title: "Reports", href: "/admin/reports", icon: "Flag" },
];

export const EXPERTISE_AREAS = [
  "Digital Transformation",
  "Innovation Strategy",
  "Organizational Design",
  "Change Management",
  "Sustainability & ESG",
  "Market Expansion",
  "Operational Excellence",
  "Risk Management",
  "Mergers & Acquisitions",
  "Talent & Leadership",
  "Data & Analytics",
  "Supply Chain Optimization",
  "Customer Experience",
  "Financial Strategy",
  "Technology Adoption",
] as const;

export const INDUSTRY_CATEGORIES = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing & Industrial",
  "Energy & Utilities",
  "Consumer Goods & Retail",
  "Media & Telecommunications",
  "Transportation & Logistics",
  "Education & Research",
  "Government & Public Sector",
  "Real Estate & Construction",
  "Agriculture & Food",
  "Pharmaceuticals",
  "Aerospace & Defense",
  "Hospitality & Tourism",
] as const;

export const INNOVATION_AREAS = [
  "Artificial Intelligence & ML",
  "Blockchain & Web3",
  "Cloud Computing",
  "Cybersecurity",
  "Edge Computing & IoT",
  "Green Technology",
  "Robotics & Automation",
  "Augmented & Virtual Reality",
  "5G & Connectivity",
  "Biotechnology",
  "Quantum Computing",
  "Digital Twins",
  "Circular Economy",
  "Smart Infrastructure",
  "Space Technology",
] as const;
