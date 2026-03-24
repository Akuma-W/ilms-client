import { User } from "@/types/user.type";
import { redirect } from "next/navigation";

export function requireRole(user: User, role: string) {
  if (user.role !== role) {
    redirect("/403");
  }
}
