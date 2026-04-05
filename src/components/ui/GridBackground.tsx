import { GridParallaxWrapper } from './GridParallaxWrapper'

export function GridBackground({ parallax }: { parallax?: boolean } = {}) {
  const grid = <div aria-hidden="true" className="grid-bg absolute inset-0 z-0 pointer-events-none" />

  return parallax ? <GridParallaxWrapper>{grid}</GridParallaxWrapper> : grid
}
