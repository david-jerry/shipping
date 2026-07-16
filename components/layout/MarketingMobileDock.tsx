"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import {
  Home,
  Layers,
  Search,
  Info,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"

type NavLinkItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/tracking", label: "Tracking", icon: Search },
  { href: "/about", label: "About", icon: Info },
]

export function MarketingMobileDock() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false)

  const centerCradleRef = useRef<HTMLDivElement>(null)
  const mobileAccountMenuRef = useRef<HTMLDivElement>(null)
  const mobilePopupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileAccountOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const isInsideMenu = mobileAccountMenuRef.current?.contains(target)

      if (!isInsideMenu) {
        setMobileAccountOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileAccountOpen(false)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileAccountOpen])

  const activeLink =
    navLinks.find((link) => link.href === pathname) || navLinks[0]
  const inactiveLinks = navLinks.filter((link) => link.href !== activeLink.href)
  const leftLinks = inactiveLinks.slice(0, 2)
  const rightLink = inactiveLinks[2]
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

  useLayoutEffect(() => {
    if (!mobileAccountOpen || !mobilePopupRef.current) return

    const items = mobilePopupRef.current.querySelectorAll("a,button")
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

    tl.fromTo(
      mobilePopupRef.current,
      { y: 12, autoAlpha: 0, scale: 0.96 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.24 }
    ).fromTo(
      items,
      { y: 8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.18 },
      "-=0.14"
    )

    return () => {
      tl.kill()
    }
  }, [mobileAccountOpen])

  const accountInitials = (() => {
    const source = session?.user?.name?.trim() || session?.user?.email || "A"
    const parts = source.split(/\s+|@|\./).filter(Boolean)
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  })()

  const handleSignOut = async () => {
    setMobileAccountOpen(false)
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-4 pb-5 select-none md:hidden">
      <div className="relative h-[72px] w-full max-w-[400px]">
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

        <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
          <div className="flex w-[40%] justify-around">
            {leftLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
                >
                  <Icon className="h-5 w-5 stroke-[2]" />
                  <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

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

          <div className="flex w-[40%] items-center justify-around">
            {rightLink ? (
              <Link
                href={rightLink.href}
                className="flex flex-col items-center justify-center py-2 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
              >
                <rightLink.icon className="h-5 w-5 stroke-[2]" />
                <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                  {rightLink.label}
                </span>
              </Link>
            ) : null}

            {!isSessionPending ? (
              session ? (
                <div ref={mobileAccountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMobileAccountOpen((prev) => !prev)}
                    className="flex flex-col items-center justify-center py-2 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
                    aria-haspopup="menu"
                    aria-expanded={mobileAccountOpen}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary ring-1 ring-primary/20">
                      {accountInitials}
                    </div>
                    <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                      Account
                    </span>
                  </button>

                  {mobileAccountOpen ? (
                    <div
                      ref={mobilePopupRef}
                      role="menu"
                      className="absolute right-0 bottom-14 z-50 w-44 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg will-change-transform"
                    >
                      <Link
                        href="/accounts"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        role="menuitem"
                        onClick={() => setMobileAccountOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Accounts Overview
                      </Link>
                      <Link
                        href="/accounts/profile"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        role="menuitem"
                        onClick={() => setMobileAccountOpen(false)}
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
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
                >
                  <User className="h-5 w-5 stroke-[2]" />
                  <span className="mt-0.5 text-[10px] font-medium tracking-tight">
                    Sign In
                  </span>
                </Link>
              )
            ) : (
              <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
