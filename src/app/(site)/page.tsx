import MdPostsHomePage from '@/components/blog/md-posts-home-page';
import JsonLd from '@/components/seo/json-ld';
import {getAllBlogPosts, getBlogCategories} from '@/data/blog-posts';
import {homeJsonLd, homePageMetadata} from '@/lib/seo';

export const metadata = homePageMetadata();

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <MdPostsHomePage posts={getAllBlogPosts()} categories={getBlogCategories()} />
    </>
  );
}
