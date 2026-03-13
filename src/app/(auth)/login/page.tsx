"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa6";
import { login } from "@/services/auth.service";
import { API_URL, setAccessToken } from "@/services/api-client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call API to login
      const result = await login({ email, password });
      setAccessToken(result.accessToken);

      toast.success("Login successful!");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      toast.error("Login failed!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-12">
      {/* Logo & Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="LMS logo"
            width={48}
            height={48}
            className="rounded-xl"
          />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-balance">
            Sign in to your account to continue
          </p>
        </div>
      </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg bg-background"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg bg-background"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="h-10 w-full rounded-lg">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full rounded-lg"
            type="button"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="size-4" />
            <span>Sign in with Google</span>
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <a
            href="#"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
  );
}
