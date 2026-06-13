"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { toast } from "sonner"
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  User,
  UserPlus,
} from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { INDUSTRY_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

const individualSchema = z
  .object({
    registrationType: z.literal("individual"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["STRATEGIST", "RESEARCHER", "PARTNER"]),
    inviteCode: z.string().optional(),
    acceptTerms: z.literal(true, { message: "You must accept the terms" }),
    organizationName: z.string().optional(),
    industry: z.string().optional(),
    organizationSize: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const corporateSchema = z
  .object({
    registrationType: z.literal("corporate"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["CORPORATE", "ORGANIZATION_ADMIN"]),
    inviteCode: z.string().optional(),
    acceptTerms: z.literal(true, { message: "You must accept the terms" }),
    organizationName: z.string().min(2, "Organization name is required"),
    industry: z.string().min(1, "Select an industry"),
    organizationSize: z.string().min(1, "Select organization size"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const combinedSchema = z.discriminatedUnion("registrationType", [
  individualSchema,
  corporateSchema,
])

type FormData = z.infer<typeof combinedSchema>
type RegistrationType = "individual" | "corporate"

const STRATEGIST_ROLES = [
  { value: "STRATEGIST", label: "Strategist" },
  { value: "RESEARCHER", label: "Researcher" },
  { value: "PARTNER", label: "Partner" },
]

const CORPORATE_ROLES = [
  { value: "CORPORATE", label: "Corporate Member" },
  { value: "ORGANIZATION_ADMIN", label: "Organization Admin" },
]

const ORG_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

interface FlatFormValues {
  registrationType: RegistrationType
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
  inviteCode: string
  acceptTerms: boolean
  organizationName: string
  industry: string
  organizationSize: string
}

const defaultValues: FlatFormValues = {
  registrationType: "individual",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  inviteCode: "",
  acceptTerms: false,
  organizationName: "",
  industry: "",
  organizationSize: "",
}

export default function RegisterPage() {
  const router = useRouter()
  const [regType, setRegType] = useState<RegistrationType>("individual")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isIndividual = regType === "individual"

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(combinedSchema) as any,
    defaultValues,
  })

  const watchRole = watch("role")
  const watchIndustry = watch("industry")
  const watchOrgSize = watch("organizationSize")

  function switchRegType(type: RegistrationType) {
    setRegType(type)
    setValue("registrationType", type)
    setValue("role", "")
  }

  async function onSubmit(data: any) {
    setIsLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "Registration failed")
        return
      }

      toast.success("Account created successfully! Please sign in.")
      router.push("/login")
    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join TBP Global Strategists today
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl text-white"
      >
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-white/5 p-1">
          <button
            type="button"
            onClick={() => switchRegType("individual")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all",
              regType === "individual"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Individual
          </button>
          <button
            type="button"
            onClick={() => switchRegType("corporate")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all",
              regType === "corporate"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="h-4 w-4" />
            Corporate
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={regType}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {regType === "corporate" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      Organization name
                    </Label>
                    <Input
                      id="organizationName"
                      placeholder="Acme Corp"
                      disabled={isLoading}
                      {...register("organizationName")}
                    />
                    {errors.organizationName && (
                      <p className="text-xs text-red-400">
                        {errors.organizationName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={watchIndustry || ""}
                        onValueChange={(val) =>
                          setValue("industry", val, { shouldValidate: true })
                        }
                      >
                        <SelectTrigger
                          id="industry"
                          placeholder={watchIndustry || "Select industry"}
                        />
                        <SelectContent>
                          {INDUSTRY_CATEGORIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-xs text-red-400">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationSize">Size</Label>
                      <Select
                        value={watchOrgSize || ""}
                        onValueChange={(val) =>
                          setValue("organizationSize", val, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger
                          id="organizationSize"
                          placeholder={watchOrgSize || "Select size"}
                        />
                        <SelectContent>
                          {ORG_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size} employees
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.organizationSize && (
                        <p className="text-xs text-red-400">
                          {errors.organizationSize.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 chars"
                      className="pr-10"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      className="pr-10"
                      disabled={isLoading}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={watchRole || ""}
                  onValueChange={(val) =>
                    setValue("role", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    id="role"
                    placeholder={watchRole || "Select your role"}
                  />
                  <SelectContent>
                    {(isIndividual ? STRATEGIST_ROLES : CORPORATE_ROLES).map(
                      (r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-red-400">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteCode">
                  Invite code{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="inviteCode"
                  placeholder="Enter invite code"
                  disabled={isLoading}
                  {...register("inviteCode")}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="acceptTerms"
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
              disabled={isLoading}
              {...register("acceptTerms")}
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm leading-relaxed text-white/60"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-red-400 -mt-2">
              {errors.acceptTerms.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full gap-2 mt-2"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {isLoading
              ? "Creating account..."
              : `Create ${isIndividual ? "individual" : "corporate"} account`}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
