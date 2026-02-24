"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Session } from "@/lib/directus"

const fallbackSessions: Session[] = [
  {
    id: "1", sort: 1, day: "Day 1", title: "Opening Keynote",
    description: "A look at everything new in Directus and where we're heading next.",
    time: "10:00 AM ET",
    speakers: [{ id: "s1", name: "Ben Haynes", role: "CEO, Directus", headshot_url: null }],
  },
  {
    id: "2", sort: 2, day: "Day 1", title: "Directus 12 Deep Dive",
    description: "Under the hood of the latest release: performance, new features, and developer experience improvements.",
    time: "11:30 AM ET",
    speakers: [{ id: "s2", name: "Rijk van Zanten", role: "CTO, Directus", headshot_url: null }],
  },
  {
    id: "3", sort: 3, day: "Day 2", title: "Building with AI & Directus",
    description: "How to integrate AI-powered workflows directly into your Directus projects.",
    time: "10:00 AM ET",
    speakers: [{ id: "s3", name: "Engineering Team", role: "Directus", headshot_url: null }],
  },
  {
    id: "4", sort: 4, day: "Day 3", title: "Extensions Marketplace",
    description: "Introducing the new extensions ecosystem and how to build, share, and monetize your extensions.",
    time: "10:00 AM ET",
    speakers: [{ id: "s4", name: "Developer Relations", role: "Directus", headshot_url: null }],
  },
  {
    id: "5", sort: 5, day: "Day 4", title: "Enterprise at Scale",
    description: "Real-world case studies from teams running Directus at enterprise scale.",
    time: "10:00 AM ET",
    speakers: [{ id: "s5", name: "Solutions Team", role: "Directus", headshot_url: null }],
  },
  {
    id: "6", sort: 6, day: "Day 5", title: "Community Showcase & Closing",
    description: "Celebrating the best community projects and a look at what's next for the Directus ecosystem.",
    time: "2:00 PM ET",
    speakers: [{ id: "s6", name: "Community Team", role: "Directus", headshot_url: null }],
  },
]

interface SessionsProps {
  sessions?: Session[]
  compact?: boolean
}

export function Sessions({ sessions = fallbackSessions, compact = false }: SessionsProps) {
  const [index, setIndex] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep mutable refs so event listener closures always see fresh values
  const indexRef = useRef(index)
  const exitingRef = useRef(exiting)
  const dragXRef = useRef(0)
  useEffect(() => { indexRef.current = index }, [index])
  useEffect(() => { exitingRef.current = exiting }, [exiting])

  const navigate = useCallback((dir: "prev" | "next") => {
    if (exitingRef.current) return
    const canGo = dir === "next"
      ? indexRef.current < sessions.length - 1
      : indexRef.current > 0
    if (!canGo) return
    setExiting(true)
    setTimeout(() => {
      setIndex(i => dir === "next" ? i + 1 : i - 1)
      setExiting(false)
    }, 260)
  }, [sessions.length])

  // Attach touch + mouse drag listeners directly on the DOM node so we can
  // call preventDefault() on touchmove (passive: false) to stop scroll interference
  useEffect(() => {
    if (!compact) return
    const el = containerRef.current
    if (!el) return

    let startX = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      dragXRef.current = 0
      setDragX(0)
      setIsDragging(true)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      dragXRef.current = e.touches[0].clientX - startX
      setDragX(dragXRef.current)
    }
    const onTouchEnd = () => {
      setIsDragging(false)
      if (dragXRef.current < -55) navigate("next")
      else if (dragXRef.current > 55) navigate("prev")
      dragXRef.current = 0
      setDragX(0)
    }

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX
      dragXRef.current = 0
      setDragX(0)
      setIsDragging(true)

      const onMouseMove = (e: MouseEvent) => {
        dragXRef.current = e.clientX - startX
        setDragX(dragXRef.current)
      }
      const onMouseUp = () => {
        setIsDragging(false)
        if (dragXRef.current < -55) navigate("next")
        else if (dragXRef.current > 55) navigate("prev")
        dragXRef.current = 0
        setDragX(0)
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("mouseup", onMouseUp)
      }
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    el.addEventListener("mousedown", onMouseDown)

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("mousedown", onMouseDown)
    }
  }, [compact, navigate])

  // If Directus hasn't had speakers linked yet (M2M not configured),
  // fall back to the hardcoded speaker for this slot.
  const speakersFor = (session: Session, i: number): Session["speakers"] => {
    if (session.speakers && session.speakers.length > 0) return session.speakers
    return fallbackSessions[i]?.speakers ?? []
  }

  const renderSpeakers = (session: Session, i: number) =>
    speakersFor(session, i).length ? (
      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
        {speakersFor(session, i).map((s) => (
          <div key={s.id} className="flex items-center gap-2.5">
            {s.headshot_url ? (
              <img src={s.headshot_url} alt={s.name} className="size-7 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="size-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-sans font-medium text-white/60 flex-shrink-0">
                {(s.name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-sans text-white/80 truncate">{s.name}</p>
              <p className="text-xs font-sans text-white/40 truncate">{s.role}</p>
            </div>
          </div>
        ))}
      </div>
    ) : null

  if (compact) {
    // While dragging: card follows finger + tilts. On exit: sinks behind the stack.
    const activeDrag = isDragging && Math.abs(dragX) > 3
    const frontStyle: React.CSSProperties = {
      zIndex: exiting ? 0 : 3,
      transform: activeDrag
        ? `translateX(${dragX * 0.75}px) rotate(${Math.max(-10, Math.min(10, dragX * 0.025))}deg)`
        : exiting
        ? "scale(0.88) translateY(6px)"
        : "translateX(0px) rotate(0deg) scale(1)",
      opacity: exiting ? 0 : 1,
      transition: activeDrag ? "none" : "transform 0.26s ease, opacity 0.22s ease",
    }

    return (
      <div className="flex flex-col gap-3">
        {/* Card stack — no header row, pure swipe */}
        <div
          ref={containerRef}
          className="relative h-[270px] cursor-grab active:cursor-grabbing select-none"
        >
          {sessions[index + 2] && (
            <div
              className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md"
              style={{ transform: "rotate(-2.5deg) translateY(7px) scale(0.965)", zIndex: 1, opacity: 0.4 }}
            />
          )}
          {sessions[index + 1] && (
            <div
              className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md"
              style={{ transform: "rotate(2deg) translateY(4px) scale(0.982)", zIndex: 2, opacity: 0.65 }}
            />
          )}
          <article
            className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md p-6 flex flex-col justify-between"
            style={frontStyle}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xs font-medium font-sans uppercase tracking-wider text-white bg-black/40 border border-white/15 px-2.5 py-1 rounded-full">
                  {sessions[index].day}
                </span>
                <span className="text-xs font-sans text-white/40">{sessions[index].time}</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-2">{sessions[index].title}</h3>
              <p className="text-sm font-sans text-white/50 leading-relaxed line-clamp-2">
                {sessions[index].description}
              </p>
            </div>
            {renderSpeakers(sessions[index], index)}
          </article>
        </div>

        {/* Dot indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {sessions.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 16 : 5,
                height: 5,
                background: i === index ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Full scrollable layout
  const scrollBy = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" })
  }

  return (
    <section className="relative w-full px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {sessions.map((session, i) => (
            <article key={i} className="group flex-shrink-0 w-[320px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between snap-start hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-xs font-medium font-sans uppercase tracking-wider text-white bg-black/40 border border-white/15 px-2.5 py-1 rounded-full">{session.day}</span>
                  <span className="text-xs font-sans text-white/40">{session.time}</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-2">{session.title}</h3>
                <p className="text-sm font-sans text-white/50 leading-relaxed line-clamp-3">{session.description}</p>
              </div>
              {renderSpeakers(session, i)}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
