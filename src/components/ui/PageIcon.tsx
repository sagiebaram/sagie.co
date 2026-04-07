const ICON_MAP = {
  Community: {
    dark: '/icons/Dark/Community-icon-white.svg',
    light: '/icons/Light/Community-icon-black.svg',
  },
  Events: {
    dark: '/icons/Dark/Events-icon-white.svg',
    light: '/icons/Light/Events-icon-black.svg',
  },
  Resources: {
    dark: '/icons/Dark/Resources-icon-white.svg',
    light: '/icons/Light/Resources-icon-black.svg',
  },
  Ventures: {
    dark: '/icons/Dark/Ventures-icon-white.svg',
    light: '/icons/Light/Ventures-icon-black.svg',
  },
  Solutions: {
    dark: '/icons/Dark/Solutions-icon-white.svg',
    light: '/icons/Light/Solutions-icon-black.svg',
  },
} as const

export type PageIconName = keyof typeof ICON_MAP

interface PageIconProps {
  name: PageIconName
  size?: number
  className?: string
}

export function PageIcon({ name, className = '' }: PageIconProps) {
  const { dark, light } = ICON_MAP[name]

  return (
    <div className={`mb-4 md:mb-6 ${className}`} data-icon-name={name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt=""
        aria-hidden="true"
        data-light-src={light}
        className="w-12 h-12 md:w-16 md:h-16"
      />
    </div>
  )
}
