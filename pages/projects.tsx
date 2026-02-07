import { useState, useMemo } from 'react'
import siteMetadata from '@/data/siteMetadata'
import projectsData, { categories } from '@/data/projectsData'
import ProjectCard from '@/components/ProjectCard'
import { PageSEO } from '@/components/SEO'

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projectsData
    }
    return projectsData.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  // カテゴリごとのプロジェクト数をカウント
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projectsData.length }
    projectsData.forEach((project) => {
      counts[project.category] = (counts[project.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* ヘッダー */}
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-300">
            ポートフォリオ一覧
          </p>
        </div>

        <div className="py-8">
          {/* フィルターボタン */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                    ${
                      activeCategory === category.id
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-gray-200/50 text-gray-600 hover:bg-gray-300/50 hover:text-gray-900 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {category.labelJa}
                    <span
                      className={`
                        rounded-full px-1.5 py-0.5 text-xs
                        ${
                          activeCategory === category.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        }
                      `}
                    >
                      {categoryCounts[category.id] || 0}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* プロジェクト一覧 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
                category={project.category}
              />
            ))}
          </div>

          {/* プロジェクトがない場合 */}
          {filteredProjects.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-400">このカテゴリにはプロジェクトがありません</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
