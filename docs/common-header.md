# Kaisa header (kaisa-fo)

Headers are no longer shared across the kaisa sites. kaisa-blog and kaisa-game each show only their own menu; kaisa-fo shows POST / TOOL / WORK.

The former kaisa-tool project has been migrated into kaisa-fo (src/app/(tools)), so the TOOL menu is a same-site link to /image/compress/. The tool routes keep their old paths (/image, /pdf, /format, /edit, /util, /photo).

Local URLs are configured in .env.local:

- NEXT_PUBLIC_NAV_HOME_URL: http://localhost:5551/
- NEXT_PUBLIC_NAV_POSTS_URL: http://localhost:5551/
- NEXT_PUBLIC_NAV_WORKS_URL: http://localhost:5551/works/

Restart development servers after changing environment variables. Public environment values are baked into Next.js builds. Production builds ignore localhost and 127.0.0.1 navigation values and use the public domains.

Header source: src/components/layout/header.tsx, kaisa-header.css and src/config/kaisa-navigation.ts.

Tool navigation has three levels: site header, category navigation (tool-category-nav.tsx), category-specific tool links (category-subnav.tsx). Photo opens the fullscreen editor and its own application menu.

Tool pages load their own global styles (src/app/(tools)/tool-styles.ts → assets/css/tool/reset.css, tool/styles.css). The fo reset/styles are loaded by src/app/site-styles.ts from the (site) and (example) layouts and not-found only, because the fo reset styles native buttons/inputs that the tools rely on. The header TOOL link is a plain <a>, so moving between tools and the rest of the site is a full page load and the two style sets never mix.

The header uses the fo layout: 72px desktop height, 64px mobile height, 1100px inner width, 100x42 logo and 44x24 theme toggle. Works starts with a transparent header; scrolling more than 8px adds the same blurred background, border and shadow. Mobile navigation closes on outside click or Escape.

Theme uses kaisa-shared-theme on domain kaisa.co.kr for 30 days. Visible tabs check for changes every second and on focus.

Language also uses the shared domain cookie kaisa-shared-locale (30 days). It takes priority over legacy per-site session choices. First entry uses the browser language, with IP country as a fallback when the browser language is unsupported. Changes synchronize in visible tabs every second and on focus. Locale bootstrap and client detection use the same cookie; server and initial React rendering remain deterministic.

Shared page/footer dimensions are in src/components/layout/kaisa-layout.css, imported after other root styles. Inner width is 1100px, gutters clamp(24px, 5vw, 64px) with 24px on mobile, footer vertical padding 40px, footer columns gap 16px (20px stacked below 480px), and content bottom padding 64px.
