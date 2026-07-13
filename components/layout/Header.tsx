"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState, useLayoutEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import {
  Moon,
  Sun,
  Package,
  Home,
  Layers,
  Search,
  Info,
  Mail,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/tracking", label: "Tracking", icon: Search },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function Navbar() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const centerCradleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
          return
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme])

  const activeLink =
    navLinks.find((link) => link.href === pathname) || navLinks[0]
  const inactiveLinks = navLinks.filter((link) => link.href !== activeLink.href)

  const leftLinks = inactiveLinks.slice(0, 2)
  const rightLinks = inactiveLinks.slice(2, 4)
  const ActiveIcon = activeLink.icon

  useLayoutEffect(() => {
    if (!centerCradleRef.current) return

    const element = centerCradleRef.current
    const icon = element.querySelector(".cradle-icon")

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

    tl.fromTo(
      element,
      { yPercent: 10, scale: 0.85 },
      { yPercent: -40, scale: 1, duration: 0.4 }
    ).fromTo(
      icon,
      { rotation: -45, scale: 0.5, opacity: 0 },
      { rotation: 0, scale: 1, opacity: 1, duration: 0.3 },
      "-=0.25"
    )

    return () => {
      tl.kill()
    }
  }, [activeLink.href])

  return (
    <>
      {/* Top Desktop Header & Mobile Utility Bar */}
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          "border-b border-border/60",
          scrolled
            ? "bg-background/90 shadow-sm backdrop-blur-xl"
            : "bg-background/70 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-95">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Lyftberan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground/90"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Utility Theme Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Toggle theme (D)"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/auth/login"
              className="hidden h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:inline-flex"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Modern Curved Cradle Docker (Mobile Only) */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full justify-center px-4 pb-5 select-none md:hidden">
        <div className="relative h-[72px] w-full max-w-[400px]">
          {/* Masked SVG Background Shape with calibrated borders for white light themes */}
          <svg
            className="absolute inset-0 h-full w-full drop-shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_-8px_24px_rgba(0,0,0,0.4)]"
            viewBox="0 0 400 72"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 24C0 10.7452 10.7452 0 24 0H161.379C167.798 0 173.808 3.03713 177.586 8.18876L185.611 19.1352C192.703 28.8078 207 28.9198 214.241 19.3621L222.554 8.3855C226.335 3.39327 232.273 0.444336 238.622 0.444336H376C389.255 0.444336 400 11.1995 400 24.4547V72H0V24Z"
              className="fill-background/95 stroke-border/80 backdrop-blur-xl dark:stroke-border/40"
              strokeWidth="1"
            />
          </svg>

          {/* Foreground Navigation Layer */}
          <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
            {/* Left Hand Options */}
            <div className="flex w-[40%] justify-around">
              {leftLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col items-center justify-center py-2 text-muted-foreground transition-colors hover:text-foreground active:scale-90"
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                    <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Active Raised Dynamic Floating Action Slot */}
            <div
              ref={centerCradleRef}
              className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-[35%] flex-col items-center will-change-transform"
            >
              <Link
                href={activeLink.href}
                aria-label={activeLink.label}
                className="flex h-13 w-13 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-all duration-200 active:scale-95"
              >
                <ActiveIcon className="cradle-icon h-5 w-5 stroke-[2.2]" />
              </Link>
            </div>

            {/* Right Hand Options */}
            <div className="flex w-[40%] justify-around">
              {rightLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col items-center justify-center py-2 text-muted-foreground transition-colors hover:text-foreground active:scale-90"
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                    <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
