const DIRECTUS_URL = process.env.DIRECTUS_URL!
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!

function headers() {
  return {
    Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    "Content-Type": "application/json",
  }
}

export interface Speaker {
  id: string
  name: string
  role: string
  headshot_url: string | null
}

export interface Session {
  id: string
  sort: number
  day: string
  title: string
  description: string
  time: string
  speakers: Speaker[]
}

export interface LandingPage {
  hero_badge: string
  hero_title: string
  hero_subtitle: string
  cta_label: string
  form_heading: string
  hubspot_portal_id: string
  form: {
    hubspot_form_id: string
  } | null
}

export async function getLandingPage(): Promise<LandingPage | null> {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/leap_week_landing_page?fields=*,form.hubspot_form_id`,
      {
        headers: headers(),
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return null
    const { data } = await res.json()
    return data
  } catch {
    return null
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const fields = [
      "*",
      "speakers.leap_week_speakers_id.id",
      "speakers.leap_week_speakers_id.Name",
      "speakers.leap_week_speakers_id.Role",
      "speakers.leap_week_speakers_id.headshot",
    ].join(",")

    const res = await fetch(
      `${DIRECTUS_URL}/items/leap_week_sessions?sort=sort&filter[status][_eq]=published&fields=${fields}`,
      {
        headers: headers(),
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []
    const { data } = await res.json()

    // Normalize M2M junction rows into a flat speakers array.
    // If the M2M relation isn't configured yet, speakers comes back as
    // undefined/empty — in that case carry the field through as-is so the
    // component can fall back to its own hardcoded speaker data.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).map((session: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const junctions: any[] = session.speakers ?? []
      const normalized = junctions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((junction: any) => {
          const s = junction.leap_week_speakers_id
          if (!s) return null
          return {
            id: s.id,
            name: s.Name,
            role: s.Role,
            headshot_url: s.headshot
              ? `${DIRECTUS_URL}/assets/${s.headshot}`
              : null,
          }
        })
        .filter((s: unknown): s is Speaker => s !== null && (s as Speaker).name !== null)
      return { ...session, speakers: normalized }
    })
  } catch {
    return []
  }
}
