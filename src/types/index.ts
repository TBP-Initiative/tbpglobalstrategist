export enum UserRole {
  ADMIN = "ADMIN",
  STRATEGIST = "STRATEGIST",
  ORGANIZATION = "ORGANIZATION",
  USER = "USER",
}

export interface StrategistProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  bio: string;
  avatar: string | null;
  expertiseAreas: string[];
  yearsOfExperience: number | null;
  linkedIn: string | null;
  website: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  industry: string;
  size: string | null;
  location: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  innovationAreas: string[];
  status: "draft" | "active" | "completed" | "on-hold";
  startDate: Date;
  endDate: Date | null;
  budget: number | null;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalStrategists: number;
  totalOrganizations: number;
  recentProjects: Project[];
  projectsByStatus: { status: string; count: number }[];
  projectsByInnovationArea: { area: string; count: number }[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}
