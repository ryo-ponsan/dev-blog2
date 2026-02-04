import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

const skills = [
  { name: 'ROS / Python', category: 'robotics' },
  { name: '組み込みソフト (C)', category: 'embedded' },
  { name: 'C# / 業務ツール', category: 'tools' },
  { name: 'React / Next.js', category: 'frontend' },
  { name: 'Django REST', category: 'backend' },
  { name: 'TypeScript', category: 'frontend' },
]

const topics = [
  {
    title: 'AI / Robotics',
    items: ['OpenAI API', 'LangChain', 'World Model Motion Planning', 'Computer Vision'],
  },
  {
    title: 'Web Development',
    items: ['JavaScript', 'Django REST', 'PostgreSQL', 'Next.js', 'ICP'],
  },
]

const events = [
  {
    title: 'Web3 Hackathon【TOYOTA × KEY3】',
    link: 'https://prtimes.jp/main/html/rd/p/000000003.000114677.html',
    demo: 'https://youtu.be/9B54_ES4tOY',
    github: 'https://github.com/ourTeamDev/DAO-nextjs-thirdweb',
    blog: 'https://dev-blog-gypsyr.vercel.app/blog/post_230325',
  },
]

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-16">
        {/* Profile Section */}
        <div className="mb-12 flex flex-col items-center text-center">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={128}
              height={128}
              className="mb-6 h-32 w-32 rounded-full object-cover"
            />
          )}
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {name}
          </h1>
          {occupation && (
            <p className="mb-1 text-lg text-gray-500 dark:text-gray-400">{occupation}</p>
          )}
          {company && <p className="mb-4 text-gray-500 dark:text-gray-400">{company}</p>}
          <div className="flex gap-4">
            <SocialIcon kind="mail" href={`mailto:${email}`} size={6} />
            <SocialIcon kind="github" href={github} size={6} />
            <SocialIcon kind="linkedin" href={linkedin} size={6} />
            <SocialIcon kind="twitter" href={twitter} size={6} />
          </div>
        </div>

        {/* Bio */}
        <section className="mb-12">
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            関西のメーカーで研究開発しつつ、ロボットと戯れてます。
          </p>
          <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            もう少し手動かして個人でモノづくりしたかったので趣味で Web
            アプリ等の勉強始めました。
          </p>
        </section>

        <hr className="mb-12 border-gray-200 dark:border-gray-700" />

        {/* Skills */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Topics */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Blog Topics
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {topics.map((topic) => (
              <div key={topic.title}>
                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {topic.title}
                </h3>
                <ul className="space-y-1">
                  {topic.items.map((item) => (
                    <li key={item} className="text-gray-600 dark:text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr className="mb-12 border-gray-200 dark:border-gray-700" />

        {/* Events */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            参加イベント
          </h2>
          {events.map((event) => (
            <div key={event.title}>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                {event.title}
              </a>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                <a
                  href={event.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
                >
                  Demo
                </a>
                <a
                  href={event.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
                >
                  GitHub
                </a>
                <a
                  href={event.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
                >
                  感想ブログ
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Additional MDX Content */}
        {children && (
          <div className="prose max-w-none dark:prose-dark">{children}</div>
        )}
      </div>
    </>
  )
}
