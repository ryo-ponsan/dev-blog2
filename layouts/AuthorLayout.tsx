import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

// スキルデータ
const skills = [
  { name: 'ROS / Python', level: 85, category: 'robotics' },
  { name: '組み込みソフト (C)', level: 75, category: 'embedded' },
  { name: 'C# / 業務ツール', level: 70, category: 'tools' },
  { name: 'React / Next.js', level: 60, category: 'frontend' },
  { name: 'Django REST', level: 55, category: 'backend' },
  { name: 'TypeScript', level: 50, category: 'frontend' },
]

// ブログトピック
const topics = [
  {
    title: 'AI / Robotics',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: ['OpenAI API', 'LangChain', 'World Model Motion Planning', 'Computer Vision'],
  },
  {
    title: 'Web Development',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    items: ['JavaScript', 'Django REST', 'PostgreSQL', 'Next.js', 'ICP'],
  },
]

// イベント
const events = [
  {
    title: 'Web3 Hackathon【TOYOTA × KEY3】',
    link: 'https://prtimes.jp/main/html/rd/p/000000003.000114677.html',
    demo: 'https://youtu.be/9B54_ES4tOY',
    github: 'https://github.com/ourTeamDev/DAO-nextjs-thirdweb',
    blog: 'https://dev-blog-gypsyr.vercel.app/blog/post_230325',
  },
]

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{level}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  )
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <Image
                src={avatar}
                alt="avatar"
                width={160}
                height={160}
                className="h-40 w-40 rounded-2xl border-4 border-white/30 shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-4xl font-bold text-white">{name}</h1>
              <p className="mb-4 text-lg text-white/90">{occupation}</p>
              {company && <p className="mb-4 text-white/80">{company}</p>}
              <div className="flex justify-center gap-4 md:justify-start">
                <SocialIcon kind="mail" href={`mailto:${email}`} size={6} />
                <SocialIcon kind="github" href={github} size={6} />
                <SocialIcon kind="linkedin" href={linkedin} size={6} />
                <SocialIcon kind="twitter" href={twitter} size={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <svg className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            About Me
          </h2>
          <div className="prose prose-base max-w-none text-gray-600 dark:prose-dark dark:text-gray-300">
            <p>関西のメーカーで研究開発しつつ、ロボットと戯れてます。</p>
            <p>もう少し手動かして個人でモノづくりしたかったので趣味で Web アプリ等の勉強始めました。</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <svg className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Skills
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {skills.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>
        </div>

        {/* Topics Section */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-xl bg-white p-6 shadow-lg transition-transform hover:scale-[1.02] dark:bg-gray-800"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-sky-500">{topic.icon}</span>
                {topic.title}
              </h3>
              <ul className="space-y-2">
                {topic.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Events Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <svg className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            参加イベント
          </h2>
          {events.map((event) => (
            <div key={event.title} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 block text-lg font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                {event.title}
              </a>
              <div className="flex flex-wrap gap-3">
                <a
                  href={event.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Demo
                </a>
                <a
                  href={event.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={event.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  感想ブログ
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional MDX Content (if any) */}
        {children && (
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="prose prose-base max-w-none dark:prose-dark">{children}</div>
          </div>
        )}
      </div>
    </>
  )
}
