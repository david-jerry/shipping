"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type AnimatedStatProps = {
  value: string
  className?: string
}

type ParsedStat = {
  prefix: string
  suffix: string
  target: number
  decimals: number
}

function parseStatValue(value: string): ParsedStat | null {
  if (value.includes("/") || value.includes("-")) {
    return null
  }

  const match = value.trim().match(/^([^\d]*)(\d[\d,.]*)([^\d]*)$/)
  if (!match) {
    return null
  }

  const [, prefix, numberPart, suffix] = match
  const normalized = numberPart.replace(/,/g, "")
  const parsed = Number.parseFloat(normalized)

  if (!Number.isFinite(parsed)) {
    return null
  }

  const decimalPart = normalized.split(".")[1]
  return {
    prefix,
    suffix,
    target: parsed,
    decimals: decimalPart ? decimalPart.length : 0,
  }
}

function formatValue(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function AnimatedStat({ value, className }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!ref.current) {
      return
    }

    const parsed = parseStatValue(value)
    if (!parsed) {
      ref.current.textContent = value
      return
    }

    const state = { current: 0 }

    gsap.to(state, {
      current: parsed.target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        if (!ref.current) {
          return
        }

        ref.current.textContent = `${parsed.prefix}${formatValue(state.current, parsed.decimals)}${parsed.suffix}`
      },
      scrollTrigger: {
        trigger: ref.current,
        start: "top 88%",
        once: true,
      },
    })
  }, [value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
