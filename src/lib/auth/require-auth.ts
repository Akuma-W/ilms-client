import { redirect } from "next/navigation";
import { getUser } from "./get-user";
import { User } from "@/types/user.type";

export async function requireAuth() {
  const user: User = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
