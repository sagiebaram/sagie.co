interface PillarIconProps {
  name: string
}

function IconFounders() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <circle cx="16" cy="9" r="4" />
      <path d="M8 28v-2a8 8 0 0 1 16 0v2" />
      <circle cx="25" cy="20" r="2" />
      <line x1="21" y1="18" x2="25" y2="18" />
      <line x1="25" y1="18" x2="27" y2="14" />
    </svg>
  )
}

function IconInvestors() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <polygon points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5" />
      <polygon points="16,9 22,12.5 22,19.5 16,23 10,19.5 10,12.5" />
      <circle cx="16" cy="16" r="2" />
    </svg>
  )
}

function IconOperators() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <rect x="5" y="5" width="9" height="9" />
      <rect x="18" y="5" width="9" height="9" />
      <rect x="5" y="18" width="9" height="9" />
      <rect x="18" y="18" width="9" height="9" />
      <circle cx="16" cy="16" r="1.5" className="fill-ink-5 stroke-0" />
    </svg>
  )
}

function IconEcosystem() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <circle cx="16" cy="16" r="3" />
      <circle cx="16" cy="4" r="2" />
      <circle cx="28" cy="16" r="2" />
      <circle cx="16" cy="28" r="2" />
      <circle cx="4" cy="16" r="2" />
      <line x1="16" y1="6" x2="16" y2="13" />
      <line x1="26" y1="16" x2="19" y2="16" />
      <line x1="16" y1="26" x2="16" y2="19" />
      <line x1="6" y1="16" x2="13" y2="16" />
    </svg>
  )
}

function IconAcademics() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <rect x="8" y="3" width="18" height="23" rx="1" />
      <line x1="12" y1="9" x2="22" y2="9" />
      <line x1="12" y1="13" x2="22" y2="13" />
      <line x1="12" y1="17" x2="18" y2="17" />
      <line x1="4" y1="29" x2="28" y2="29" />
    </svg>
  )
}

function IconPartners() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stroke-ink-5" strokeWidth="1">
      <rect x="3" y="10" width="11" height="12" rx="1" />
      <rect x="18" y="10" width="11" height="12" rx="1" />
      <line x1="14" y1="16" x2="18" y2="16" />
      <circle cx="16" cy="16" r="1" className="fill-ink-5 stroke-0" />
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
