import Link from 'next/link'
import { Button } from '../ui/button'

export function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* <SiteLogo /> */}

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item, index) => (
            <Link
            key={index}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Tool bar */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
