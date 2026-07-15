import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const strategistProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required").max(80, "Title must be 80 characters or less"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(900, "Bio must be 900 characters or less"),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
  expertiseAreas: z.array(z.string()).min(1, "Select at least one expertise area"),
  yearsOfExperience: z.number().min(0).optional(),
  linkedIn: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  slug: z.string().min(2).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logo: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().min(1, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]).optional(),
  location: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  objectives: z.array(z.string()).min(1, "Add at least one objective"),
  innovationAreas: z.array(z.string()).min(1, "Select at least one innovation area"),
  status: z.enum(["draft", "active", "completed", "on-hold"]).default("draft"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  budget: z.number().positive().optional(),
  organizationId: z.string().min(1, "Organization is required"),
});
