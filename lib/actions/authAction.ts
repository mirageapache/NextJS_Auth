import { getServerSession } from "next-auth/next"
import { nextauthOptions } from "@/lib/nextauthOptions"

export async function getUserSession() {
  const session = await getServerSession(nextauthOptions)
  return ({ session })
}