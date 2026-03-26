'use client';

import { siteConfig } from "@/config";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";
import { useState } from "react";

export default function GoogleRegisterClient() {
  const router = useRouter();
  const { user, mutateUser } = useCurrentUser();
  const { name, logo } = siteConfig;

  // Local State
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>register-client</div>
  )
}
