'use client'

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router"
import { useEffect } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      router.push("/");
    }
  }, [params, router]);

  return <p>Logging in...</p>
}
