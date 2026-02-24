import { GradientBackground } from "@/components/gradient-background"
import { Sessions } from "@/components/sessions"
import { RegisterForm } from "@/components/register-form"
import { SpeakerBar } from "@/components/speaker-bar"
import { getLandingPage, getSessions } from "@/lib/directus"

export default async function Page() {
  const [page, sessions] = await Promise.all([getLandingPage(), getSessions()])

  return (
    // Mobile: natural scroll. Desktop: locked single-page.
    <main className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      {/* Background + watermark */}
      <div className="fixed inset-0 -z-10">
        <GradientBackground />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/directus-logo.svg"
            alt=""
            style={{
              width: "160%",
              maxWidth: "1100px",
              transform: "rotate(-30deg)",
              mixBlendMode: "overlay",
              opacity: 0.35,
            }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-shrink-0 px-6 lg:px-16 py-5 flex items-center">
        <a href="https://directus.io?ref=leapweek04" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
          <img src="/directus-wordmark.svg" alt="Directus" className="h-6 w-auto" />
          <span className="hidden sm:block text-xs font-sans text-white/30 border-l border-white/10 pl-3 leading-tight">
            the collaborative backend for applications and ai
          </span>
        </a>
      </nav>

      {/* Content — scrolls on mobile, vertically centered on desktop */}
      <div className="flex-1 lg:flex lg:items-center px-6 lg:px-16 py-8 lg:py-6 lg:min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 w-full max-w-[980px] mx-auto lg:items-center">

          {/* Left: hero + sessions */}
          <div className="flex flex-col gap-8 lg:gap-12">
            <div className="flex flex-col gap-3">
              <span className="inline-block w-fit text-xs font-sans font-medium uppercase tracking-[0.25em] text-white/50 border border-white/10 rounded-full px-4 py-1.5">
                {page?.hero_badge ?? "Leap Week 05"}
              </span>
              <h1 className="text-white font-serif font-normal tracking-tight text-4xl sm:text-5xl xl:text-6xl leading-[0.95]">
                {page?.hero_title ?? "Leap Week"}
              </h1>
              <p className="text-sm font-sans text-white/50 leading-relaxed w-full">
                {page?.hero_subtitle ?? "Five days of announcements, deep dives, and live sessions from the Directus team. Join us for our biggest Leap Week yet."}
              </p>
            </div>

            <Sessions sessions={sessions.length > 0 ? sessions : undefined} compact />
          </div>

          {/* Right: form */}
          <div id="register">
            <RegisterForm
              heading={page?.form_heading}
              portalId={page?.hubspot_portal_id}
              formId={page?.form?.hubspot_form_id}
              compact
            />
          </div>

        </div>
      </div>

      {/* Speaker bar */}
      <SpeakerBar />
    </main>
  )
}
