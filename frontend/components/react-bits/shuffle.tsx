"use client"

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"

type ShuffleDirection = "left" | "right"
type AnimationMode = "normal" | "evenodd"

export type ShuffleProps = {
  text: string
  tag?: React.ElementType
  shuffleDirection?: ShuffleDirection
  animationMode?: AnimationMode
  duration?: number
  stagger?: number
  shuffleTimes?: number
  scrambleCharset?: string
  triggerOnce?: boolean
  triggerOnHover?: boolean
  colorFrom?: string
  colorTo?: string
  textAlign?: React.CSSProperties["textAlign"]
  className?: string
  style?: React.CSSProperties
} & Omit<React.HTMLAttributes<HTMLElement>, "children">

function isWhitespaceChar(ch: string) {
  return ch === " " || ch === "\n" || ch === "\t"
}

function isWhitespaceToken(token: string) {
  return /^\s+$/.test(token)
}

function isBreakToken(token: string) {
  return token === "-" || token === "–" || token === "—"
}

export const Shuffle = forwardRef<HTMLElement, ShuffleProps>(function Shuffle(
  {
    text,
    tag = "span",
    shuffleDirection = "left",
    animationMode = "normal",
    duration = 0.4,
    stagger = 0.025,
    shuffleTimes = 2,
    scrambleCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    triggerOnce = true,
    triggerOnHover = true,
    colorFrom = "#888888",
    colorTo = "#ffffff",
    textAlign = "left",
    className,
    style,
    onMouseEnter,
    ...rest
  }: ShuffleProps,
  ref
) {
  const sourceChars = useMemo(() => text.split(""), [text])
  const [displayChars, setDisplayChars] = useState<string[]>(sourceChars)
  const [settled, setSettled] = useState<boolean[]>(() => sourceChars.map(() => true))
  const segments = useMemo(() => {
    const tokens = text.match(/(\s+|[–—-]|[^\s–—-]+)/g) ?? []
    let cursor = 0
    return tokens.map((token) => {
      const start = cursor
      const end = cursor + token.length
      cursor = end
      return { token, start, end, whitespace: isWhitespaceToken(token), breakToken: isBreakToken(token) }
    })
  }, [text])

  useEffect(() => {
    setDisplayChars(sourceChars)
    setSettled(sourceChars.map(() => true))
  }, [sourceChars])

  const hasPlayedRef = useRef(false)
  const runningRef = useRef(false)
  const timeoutsRef = useRef<number[]>([])
  const intervalsRef = useRef<number[]>([])

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t))
    intervalsRef.current.forEach((i) => window.clearInterval(i))
    timeoutsRef.current = []
    intervalsRef.current = []
    runningRef.current = false
  }, [])

  useEffect(() => clearAllTimers, [clearAllTimers])

  const order = useMemo(() => {
    const indices = Array.from({ length: sourceChars.length }, (_, i) => i)

    const applyDirection = (arr: number[]) => (shuffleDirection === "right" ? [...arr].reverse() : arr)

    if (animationMode === "evenodd") {
      const evens = indices.filter((i) => i % 2 === 0)
      const odds = indices.filter((i) => i % 2 === 1)
      return [...applyDirection(evens), ...applyDirection(odds)]
    }

    return applyDirection(indices)
  }, [animationMode, shuffleDirection, sourceChars.length])

  const orderPosition = useMemo(() => {
    const map = new Map<number, number>()
    order.forEach((idx, pos) => map.set(idx, pos))
    return map
  }, [order])

  const start = useCallback(() => {
    if (runningRef.current) return
    if (triggerOnce && hasPlayedRef.current) return

    hasPlayedRef.current = true
    runningRef.current = true

    setSettled(sourceChars.map(() => false))

    const totalScrambleMs = Math.max(0, duration * 1000 * Math.max(1, shuffleTimes))
    const tickMs = 33

    sourceChars.forEach((originalChar, idx) => {
      const pos = orderPosition.get(idx) ?? idx
      const delayMs = Math.max(0, stagger * 1000 * pos)

      const timeoutId = window.setTimeout(() => {
        if (isWhitespaceChar(originalChar)) {
          setSettled((prev) => {
            const next = [...prev]
            next[idx] = true
            return next
          })
          return
        }

        const startTime = performance.now()
        const intervalId = window.setInterval(() => {
          const elapsed = performance.now() - startTime
          const done = elapsed >= totalScrambleMs

          if (done) {
            window.clearInterval(intervalId)
            setDisplayChars((prev) => {
              const next = [...prev]
              next[idx] = originalChar
              return next
            })
            setSettled((prev) => {
              const next = [...prev]
              next[idx] = true
              return next
            })

            return
          }

          const r = Math.floor(Math.random() * scrambleCharset.length)
          const scrambledChar = scrambleCharset[r] ?? originalChar
          setDisplayChars((prev) => {
            const next = [...prev]
            next[idx] = scrambledChar
            return next
          })
        }, tickMs)

        intervalsRef.current.push(intervalId)
      }, delayMs)

      timeoutsRef.current.push(timeoutId)
    })

    const overallMs = (order.length - 1) * stagger * 1000 + totalScrambleMs + 50
    const endTimeoutId = window.setTimeout(() => {
      runningRef.current = false
    }, Math.max(0, overallMs))
    timeoutsRef.current.push(endTimeoutId)
  }, [duration, order.length, orderPosition, scrambleCharset, sourceChars, stagger, shuffleTimes, triggerOnce])

  const Tag = tag as unknown as React.ElementType

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (triggerOnHover) start()
    onMouseEnter?.(e as never)
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ textAlign, whiteSpace: "pre-wrap", ...style }}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      {segments.map((seg, segIdx) => {
        if (seg.whitespace) {
          return <React.Fragment key={`w-${segIdx}`}>{seg.token}</React.Fragment>
        }

        const wrapperStyle: React.CSSProperties | undefined = seg.breakToken ? undefined : { whiteSpace: "nowrap" }

        return (
          <span key={`s-${segIdx}`} style={wrapperStyle}>
            {Array.from({ length: seg.end - seg.start }, (_, offset) => {
              const idx = seg.start + offset
              const ch = displayChars[idx]
              return (
                <span
                  key={idx}
                  style={{
                    display: "inline-block",
                    color: settled[idx] ? colorTo : colorFrom,
                    transition: `color ${duration}s ease`,
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
})
