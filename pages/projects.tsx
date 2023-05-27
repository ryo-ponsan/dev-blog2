import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-700 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-100 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-200 dark:text-gray-300">
            開発したアプリです
          </p>
        </div>
        <div className="divide-y divide-gray-700 dark:divide-gray-700">
          {projectsData.map((d) => (
            <div className="space-y-2 pt-6 pb-8 md:space-y-5" key={d.id}>
              <h3 className="mb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-100 dark:text-gray-200">
                {d.header}
              </h3>
              <div className="-m-4 flex flex-wrap">
                {d.contents.map((content) => {
                  return (
                    <Card
                      key={content.title}
                      title={content.title}
                      description={content.description}
                      imgSrc={content.imgSrc}
                      href={content.href}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
