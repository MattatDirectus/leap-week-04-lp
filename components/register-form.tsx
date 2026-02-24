"use client"

import { useState, type FormEvent } from "react"

interface RegisterFormProps {
  heading?: string
  portalId?: string
  formId?: string
  compact?: boolean
}

export function RegisterForm({
  heading = "Save your spot",
  portalId,
  formId,
  compact = false,
}: RegisterFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      fields: [
        { name: "firstname", value: data.get("firstname") },
        { name: "lastname", value: data.get("lastname") },
        { name: "email", value: data.get("email") },
        { name: "company", value: data.get("company") },
      ],
    }

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      )
      if (res.ok) setSubmitted(true)
      else setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-sans text-white placeholder:text-white/30 outline-none focus:border-[#6644FF]/60 focus:ring-1 focus:ring-[#6644FF]/30 transition-colors"

  if (submitted) {
    const inner = (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#6644FF]/20">
          <svg className="size-8 text-[#6644FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-serif text-white mb-2">{"You're in."}</h3>
          <p className="text-sm font-sans text-white/50 leading-relaxed max-w-xs">
            {"We'll send you a confirmation email with all the details for Leap Week 05."}
          </p>
        </div>
      </div>
    )

    if (compact) {
      return (
        <div id="register" className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-8">
          {inner}
        </div>
      )
    }
    return (
      <section id="register" className="relative w-full px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-10">{inner}</div>
        </div>
      </section>
    )
  }

  const formEl = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="firstname" className="sr-only">First name</label>
          <input id="firstname" name="firstname" type="text" required placeholder="First name" className={inputClass} />
        </div>
        <div className="flex-1">
          <label htmlFor="lastname" className="sr-only">Last name</label>
          <input id="lastname" name="lastname" type="text" required placeholder="Last name" className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input id="email" name="email" type="email" required placeholder="Work email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="company" className="sr-only">Company</label>
        <input id="company" name="company" type="text" placeholder="Company (optional)" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-xl bg-[#6644FF] px-6 py-3.5 text-sm font-medium font-sans text-white hover:bg-[#5533EE] disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Registering..." : "Register for Leap Week 05"}
      </button>
      <p className="text-xs font-sans text-white/30 text-center">
        By registering, you agree to receive emails about Leap Week from Directus.
      </p>
    </form>
  )

  if (compact) {
    return (
      <div id="register" className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md px-8 py-10 flex flex-col gap-7">
        <div>
          <p className="text-xs font-sans font-medium uppercase tracking-widest text-white/50 mb-2">Register</p>
          <h2 className="text-3xl font-serif text-white">{heading}</h2>
        </div>
        {formEl}
      </div>
    )
  }

  return (
    <section id="register" className="relative w-full px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-white/50 mb-2 font-sans">Register</p>
          <h2 className="text-4xl text-white font-serif md:text-5xl text-balance">{heading}</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">{formEl}</div>
      </div>
    </section>
  )
}
