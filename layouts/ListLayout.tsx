import { useState } from 'react'
import { useRouter } from 'next/router'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter()
  const basePath = router.pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul className="space-y-4">
          {!filteredBlogPosts.length && (
            <p className="text-gray-400">No posts found.</p>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path}>
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
                    <h3 className="text-lg font-semibold leading-tight sm:text-xl">
                      <Link
                        href={`/${path}`}
                        className="text-gray-900 hover:text-primary-500 transition-colors dark:text-gray-100 dark:hover:text-primary-400"
                      >
                        {title}
                      </Link>
                    </h3>
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
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
