import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

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

        {/* MDX Content from data/authors/default.mdx */}
        <div className="prose max-w-none dark:prose-dark">{children}</div>
      </div>
    </>
  )
}
