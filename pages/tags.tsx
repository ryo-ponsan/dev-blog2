import { useState } from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { kebabCase } from 'pliny/utils/kebabCase'
import { getAllTags } from 'pliny/utils/contentlayer'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { allBlogs } from 'contentlayer/generated'

export const getStaticProps: GetStaticProps<{ tags: Record<string, number> }> = async () => {
  const tags = await getAllTags(allBlogs)

  return { props: { tags } }
}

export default function Tags({ tags }: InferGetStaticPropsType<typeof getStaticProps>) {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  const popularTags = sortedTags.filter((t) => tags[t] > 1)
  const hasHiddenTags = popularTags.length < sortedTags.length
  const [showAll, setShowAll] = useState(false)

  const displayedTags = showAll ? sortedTags : popularTags

  return (
    <>
      <PageSEO title={`Tags - ${siteMetadata.author}`} description="Things I blog about" />
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4 pt-6 pb-8 md:pt-12">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Tags
          </h1>
          <p className="text-gray-400">
            {sortedTags.length} タグ・{Object.values(tags).reduce((a, b) => a + b, 0)} 記事
          </p>
        </div>

        {Object.keys(tags).length === 0 && (
          <p className="text-gray-400">No tags found.</p>
        )}

        <div className="flex flex-wrap gap-3">
          {displayedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${kebabCase(t)}`}
              className="group flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-4 py-2.5 transition-all hover:border-primary-500/50 hover:bg-gray-800"
              aria-label={`View posts tagged ${t}`}
            >
              <span className="text-sm font-medium text-gray-200 transition-colors group-hover:text-primary-400">
                {t.split(' ').join('-')}
              </span>
              <span className="rounded-full bg-gray-700/80 px-2 py-0.5 text-xs font-semibold text-gray-300 transition-colors group-hover:bg-primary-500/20 group-hover:text-primary-300">
                {tags[t]}
              </span>
            </Link>
          ))}
        </div>

        {hasHiddenTags && (
          <div className="mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg border border-gray-700 bg-gray-800/50 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-gray-100"
            >
              {showAll
                ? 'メインタグのみ表示'
                : `すべて表示 (+${sortedTags.length - popularTags.length})`}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
