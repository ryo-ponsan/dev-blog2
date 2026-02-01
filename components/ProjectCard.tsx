import Image from './Image'
import Link from './Link'
import { categories, type Project } from '@/data/projectsData'

type ProjectCardProps = Project

const ProjectCard = ({ title, description, imgSrc, href, category }: ProjectCardProps) => {
  const categoryInfo = categories.find((c) => c.id === category)
  const categoryLabel = categoryInfo?.labelJa || category

  return (
    <div className="group w-full">
      <div className="h-full overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/30 transition-all duration-300 hover:border-primary-500/50 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-primary-500/10">
        {/* モバイル: 横型レイアウト / PC: 縦型レイアウト */}
        <div className="flex flex-row sm:flex-col">
          {/* 画像部分 */}
          {imgSrc && (
            <div className="relative w-28 flex-shrink-0 sm:w-full">
              {href ? (
                <Link href={href} aria-label={`Link to ${title}`} className="block">
                  <div className="relative aspect-square overflow-hidden sm:aspect-video">
                    <Image
                      alt={title}
                      src={imgSrc}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={400}
                      height={225}
                    />
                    {/* オーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </Link>
              ) : (
                <div className="relative aspect-square overflow-hidden sm:aspect-video">
                  <Image
                    alt={title}
                    src={imgSrc}
                    className="h-full w-full object-cover"
                    width={400}
                    height={225}
                  />
                </div>
              )}
              {/* カテゴリバッジ（PC表示時のみ画像上に表示） */}
              <div className="absolute left-2 top-2 hidden sm:block">
                <span className="rounded-full bg-primary-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {categoryLabel}
                </span>
              </div>
            </div>
          )}

          {/* コンテンツ部分 */}
          <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
            {/* カテゴリバッジ（モバイル表示時） */}
            <div className="mb-1.5 sm:hidden">
              <span className="rounded-full bg-primary-500/90 px-2 py-0.5 text-xs font-medium text-white">
                {categoryLabel}
              </span>
            </div>

            {/* タイトル */}
            <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-gray-100 sm:mb-2 sm:text-lg">
              {href ? (
                <Link
                  href={href}
                  aria-label={`Link to ${title}`}
                  className="transition-colors hover:text-primary-400"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>

            {/* 説明文 */}
            <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-400 sm:mb-3 sm:line-clamp-3 sm:text-sm">
              {description}
            </p>

            {/* リンク */}
            {href && (
              <div className="mt-auto">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary-400 transition-colors hover:text-primary-300 sm:text-sm"
                  aria-label={`Link to ${title}`}
                >
                  詳細を見る
                  <svg
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
