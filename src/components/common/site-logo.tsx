import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Image
        src="/images/logo.jpg"
        alt="Logo"
        width={32}
        height={32}
        className="rounded-lg"
      />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        LMS
      </span>
    </Link>
  );
}
