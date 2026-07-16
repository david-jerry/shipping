"use client"

import { useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type MarketingAnimatorProps = {
  children: React.ReactNode
}

export function MarketingAnimator({ children }: MarketingAnimatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const getNumberAttr = (
    element: HTMLElement,
    attr: string,
    fallback: number
  ) => {
    const raw = element.getAttribute(attr)
    if (!raw) return fallback
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  useGSAP(
    () => {
      if (!containerRef.current) {
        return
      }

      let raf1 = 0
      let raf2 = 0

      const setupAnimations = () => {
        if (!containerRef.current) {
          return
        }

        const explicitTargets = gsap.utils.toArray<HTMLElement>(
          "section, article, [data-gsap-reveal]",
          containerRef.current
        )

        // Some legal/utility pages do not use semantic section/article wrappers.
        // If no explicit reveal targets are present, reveal meaningful top-level blocks.
        const fallbackTargets =
          explicitTargets.length === 0
            ? Array.from(
                containerRef.current.querySelectorAll<HTMLElement>(
                  ":scope > *, :scope > * > *"
                )
              ).filter(
                (element) =>
                  element.clientHeight >= 56 &&
                  !element.hasAttribute("data-gsap-skip") &&
                  element.tagName !== "SCRIPT" &&
                  element.tagName !== "STYLE"
              )
            : []

        const revealTargets = Array.from(
          new Set([...explicitTargets, ...fallbackTargets])
        )

        revealTargets.forEach((target) => {
          const parentY = getNumberAttr(target, "data-gsap-parent-y", 26)
          const parentDuration = getNumberAttr(
            target,
            "data-gsap-parent-duration",
            0.8
          )

          gsap.from(target, {
            autoAlpha: 0,
            y: parentY,
            duration: parentDuration,
            immediateRender: false,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: target,
              start: "top 82%",
              once: true,
            },
          })

          const childTargets = gsap.utils
            .toArray<HTMLElement>(":scope > *", target)
            .filter(
              (child) =>
                child.clientHeight >= 24 &&
                !child.hasAttribute("data-gsap-skip")
            )

          if (childTargets.length > 1) {
            const childY = getNumberAttr(target, "data-gsap-y", 18)
            const childDuration = getNumberAttr(
              target,
              "data-gsap-duration",
              0.55
            )
            const childStagger = getNumberAttr(
              target,
              "data-gsap-stagger",
              0.08
            )

            gsap.from(childTargets, {
              autoAlpha: 0,
              y: childY,
              duration: childDuration,
              stagger: childStagger,
              immediateRender: false,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
              scrollTrigger: {
                trigger: target,
                start: "top 80%",
                once: true,
              },
            })
          }
        })

        ScrollTrigger.refresh()
      }

      // Delay animation setup until after initial hydration/paint.
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(setupAnimations)
      })

      return () => {
        window.cancelAnimationFrame(raf1)
        window.cancelAnimationFrame(raf2)
      }
    },
    {
      scope: containerRef,
      dependencies: [pathname],
      revertOnUpdate: true,
    }
  )

  return <div ref={containerRef}>{children}</div>
}
