"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react"
import { authClient } from "@/lib/auth-client"
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
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/tracking", label: "Tracking", icon: Search },
  { href: "/about", label: "About", icon: Info },
]

export function Navbar() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [scrolled, setScrolled] = useState(false)
  const [desktopAccountOpen, setDesktopAccountOpen] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const pathname = usePathname()

  const headerRef = useRef<HTMLElement>(null)
  const desktopAccountMenuRef = useRef<HTMLDivElement>(null)
  const desktopPopupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!desktopAccountOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const isInsideDesktop = desktopAccountMenuRef.current?.contains(target)

      if (!isInsideDesktop) {
        setDesktopAccountOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopAccountOpen(false)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [desktopAccountOpen])

  // Process links for the balanced cradle layout
  const activeLink = navLinks.find((link) => link.href === pathname)

  useLayoutEffect(() => {
    if (!headerRef.current) return

    gsap.fromTo(
      headerRef.current,
      { y: -12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" }
    )
  }, [])

  useLayoutEffect(() => {
    if (!desktopAccountOpen || !desktopPopupRef.current) return

    gsap.fromTo(
      desktopPopupRef.current,
      { y: -8, autoAlpha: 0, scale: 0.97 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.2, ease: "power2.out" }
    )
  }, [desktopAccountOpen])

  const displayName =
    session?.user?.name?.trim() || session?.user?.email || "Account"

  const handleSignOut = async () => {
    setDesktopAccountOpen(false)
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Top Desktop Header */}
      <header
        ref={headerRef}
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
                  activeLink?.href === link.href
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground/90"
                )}
              >
                {link.label}
                {activeLink?.href === link.href && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Utility Theme Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const activeTheme = resolvedTheme ?? "light"
                setTheme(activeTheme === "dark" ? "light" : "dark")
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Toggle theme (D)"
            >
              {!mounted ? (
                <span className="h-4 w-4" aria-hidden="true" />
              ) : resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!isSessionPending ? (
              session ? (
                <div
                  ref={desktopAccountMenuRef}
                  className="relative hidden md:block"
                >
                  <button
                    type="button"
                    onClick={() => setDesktopAccountOpen((prev) => !prev)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                    aria-haspopup="menu"
                    aria-expanded={desktopAccountOpen}
                  >
                    <span className="max-w-36 truncate">{displayName}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        desktopAccountOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {desktopAccountOpen ? (
                    <div
                      ref={desktopPopupRef}
                      role="menu"
                      className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md will-change-transform"
                    >
                      <Link
                        href="/accounts"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        role="menuitem"
                        onClick={() => setDesktopAccountOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Accounts Overview
                      </Link>
                      <Link
                        href="/accounts/profile"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        role="menuitem"
                        onClick={() => setDesktopAccountOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile & Settings
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:inline-flex"
                >
                  Sign In
                </Link>
              )
            ) : (
              <div className="hidden h-9 w-24 animate-pulse rounded-lg border border-border bg-card/60 md:block" />
            )}
          </div>
        </div>
      </header>
    </>
  )
}
