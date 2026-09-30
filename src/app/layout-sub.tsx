'use client';

import {Suspense} from 'react';

/**
 * Page content is rendered directly so it is included in the static HTML
 * (crawlers / AdSense review see the real content, and the footer no longer
 * jumps up under the header while the page loads).
 *
 * The previous version hid children until SiteValidator (which only called onReady)
 * mounted, and wrapped everything in a Suspense boundary that bailed out of static
 * rendering — so every page was exported as an empty shell.
 */
export default function LayoutSub({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <Suspense fallback={<div id="content" className="content--pending" aria-busy="true" />}>
      <div id="content">{children}</div>
    </Suspense>
  );
}
