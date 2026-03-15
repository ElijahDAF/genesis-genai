"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#contact", label: "Contact" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground font-heading">Everly</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const isPage = href.startsWith("/") && !href.startsWith("/#")
            const isActive = isPage && pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-foreground font-mono ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
