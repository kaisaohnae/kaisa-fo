import MdPostsHomePage from '@/components/blog/md-posts-home-page';
import JsonLd from '@/components/seo/json-ld';
import {getAllBlogPostSummaries, getBlogCategories} from '@/data/blog-posts';
import {buildPageMetadata, homeJsonLd} from '@/lib/seo';
import {absoluteUrl, SITE_NAME} from '@/config/site';

export const metadata = buildPageMetadata({
  title: 'Posts',
  description: `${SITE_NAME} 기술 포스트 (Markdown)`,
  path: '/posts/',
});
// /posts/ shows the same list as the home page — point search engines at the home page.
metadata.alternates = {canonical: absoluteUrl('/')};

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <MdPostsHomePage posts={getAllBlogPostSummaries()} categories={getBlogCategories()} />
    </>
  );
}
