import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { NewsletterForm } from 'pliny/ui/NewsletterForm'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'

const MAX_DISPLAY = 7

export const getStaticProps = async () => {
  const sortedPosts = sortedBlogPost(allBlogs) as Blog[]
  const posts = allCoreContent(sortedPosts)

  return { props: { posts } }
}

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="space-y-4">
          {!posts.length && <p className="text-gray-400">No posts found.</p>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug}>
                <article className="rounded-lg border border-gray-200 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-gray-300 hover:bg-white/80 sm:p-5 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      {tags.length > 0 && (
                        <>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold leading-tight sm:text-xl">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-gray-900 hover:text-primary-500 transition-colors dark:text-gray-100 dark:hover:text-primary-400"
                      >
                        {title}
                      </Link>
                    </h2>
                    {summary && (
                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                        {summary}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
