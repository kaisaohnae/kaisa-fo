export type PortfolioSection = 'home' | 'works' | 'illustrator';

const SECTION_IDS: Record<PortfolioSection, string> = {
  home: 'home',
  works: 'works',
  illustrator: 'illustrator',
};

export const PORTFOLIO_PATHS = ['/', '/works', '/works/', '/illustrator', '/illustrator/'];

export function scrollToSection(section: PortfolioSection, behavior: ScrollBehavior = 'smooth') {
  const id = SECTION_IDS[section];
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({behavior, block: 'start'});
}

export function isPortfolioPath(pathname: string | null) {
  if (!pathname) return false;
  return PORTFOLIO_PATHS.includes(pathname);
}
