"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ArrowUp } from "lucide-react"

type ScrollToTopButtonProps = {
  threshold?: number
  className?: string
}

export function ScrollToTopButton({
  threshold = 200,
  className,
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  useLayoutEffect(() => {
    if (!visible || !buttonRef.current) return

    gsap.fromTo(
      buttonRef.current,
      { y: 12, autoAlpha: 0, scale: 0.92 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.24, ease: "power2.out" }
    )
  }, [visible])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) {
    return null
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      className={
        className ??
        "fixed right-4 bottom-24 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/95 text-foreground shadow-lg shadow-black/15 backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 md:right-6 md:bottom-6"
      }
    >
      <ArrowUp className="h-4.5 w-4.5" />
    </button>
  )
}
