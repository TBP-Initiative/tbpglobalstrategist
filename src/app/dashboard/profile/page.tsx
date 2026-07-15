import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileClient } from "./profile-client"

export default async function ProfilePage() {
  try {
    const session = await auth()
    if (!session?.user) redirect("/login")
    return <ProfileClient />
  } catch {
    redirect("/login")
  }
}
