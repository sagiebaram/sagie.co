export function GridBackground({ parallax }: { parallax?: boolean } = {}) {
  return (
    <div
      aria-hidden="true"
      className={`grid-bg absolute inset-0 z-0 pointer-events-none${parallax ? ' grid-bg-parallax' : ''}`}
    />
  )
}
