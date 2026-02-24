interface SpeakerBarProps {
  logos?: { name: string; src?: string }[]
}

const placeholderLogos = [
  { name: "Company 1" },
  { name: "Company 2" },
  { name: "Company 3" },
  { name: "Company 4" },
  { name: "Company 5" },
]

export function SpeakerBar({ logos = placeholderLogos }: SpeakerBarProps) {
  return (
    <div className="flex-shrink-0 border-t border-white/10 px-6 lg:px-10 py-4">
      <div className="flex items-center gap-6">
        <p className="text-xs font-sans font-medium uppercase tracking-widest text-white/40 whitespace-nowrap flex-shrink-0">
          Featuring speakers from
        </p>
        <div className="flex items-center gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex-shrink-0 h-8 w-24 rounded-md border border-white/10 bg-white/5 flex items-center justify-center"
            >
              {logo.src ? (
                <img src={logo.src} alt={logo.name} className="max-h-5 max-w-[80px] object-contain opacity-60" />
              ) : (
                <span className="text-xs font-sans text-white/25 truncate px-2">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
