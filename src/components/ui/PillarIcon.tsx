interface PillarIconProps {
  name: string
}

const ICON_CLASS = 'stroke-silver group-hover:stroke-silver-bright transition-[stroke] duration-200'

function IconFounders() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Lightbulb — ideas & creation */}
      <path d="M16 4a8 8 0 0 1 5 14.3V22H11v-3.7A8 8 0 0 1 16 4z" />
      <line x1="12" y1="25" x2="20" y2="25" />
      <line x1="13" y1="28" x2="19" y2="28" />
    </svg>
  )
}

function IconInvestors() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Growth chart — investment & returns */}
      <polyline points="4,26 12,16 18,20 28,6" />
      <polyline points="22,6 28,6 28,12" />
      <line x1="4" y1="28" x2="28" y2="28" />
    </svg>
  )
}

function IconOperators() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Gears — systems & operations */}
      <circle cx="12" cy="14" r="5" />
      <circle cx="22" cy="20" r="4" />
      <path d="M12 9V7M12 21v-2M7 14H5M19 14h-2M8.5 10.5L7 9M16 17.5l-1.5 1.5M8.5 17.5L7 19M15.5 10.5L17 9" />
    </svg>
  )
}

function IconEcosystem() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Network nodes — connecting people & resources */}
      <circle cx="16" cy="8" r="3" />
      <circle cx="6" cy="24" r="3" />
      <circle cx="26" cy="24" r="3" />
      <line x1="14" y1="10.5" x2="8" y2="21.5" />
      <line x1="18" y1="10.5" x2="24" y2="21.5" />
      <line x1="9" y1="24" x2="23" y2="24" />
    </svg>
  )
}

function IconAcademics() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Graduation cap — research & knowledge */}
      <polygon points="16,4 30,12 16,20 2,12" />
      <polyline points="6,14 6,24 16,28 26,24 26,14" />
      <line x1="30" y1="12" x2="30" y2="22" />
    </svg>
  )
}

function IconPartners() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={ICON_CLASS} strokeWidth="1.5">
      {/* Handshake — partnership & collaboration */}
      <path d="M4 18l6-6 4 2 6-6" />
      <path d="M28 18l-6-6-4 2" />
      <path d="M10 18l3 3 3-3 3 3 3-3" />
      <line x1="2" y1="14" x2="6" y2="14" />
      <line x1="26" y1="14" x2="30" y2="14" />
    </svg>
  )
}

const ICON_MAP: Record<string, React.FC> = {
  Founders: IconFounders,
  Investors: IconInvestors,
  Operators: IconOperators,
  'Ecosystem Builders': IconEcosystem,
  Academics: IconAcademics,
  Partners: IconPartners,
}

export function PillarIcon({ name }: PillarIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon />
}
