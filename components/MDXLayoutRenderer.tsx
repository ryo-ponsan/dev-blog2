import type { ComponentProps } from 'react'
import type { MDXComponents as ComponentMap } from 'mdx/types'
import RenderMDX from './RenderMDX'
import type { Authors, Blog } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'

interface Props {
  layout: string
  content: Authors | Blog
  MDXComponents: ComponentMap
  [key: string]: unknown
}

// Layouts are selected from a fixed set, rather than a user-controlled require path.
export function MDXLayoutRenderer({ layout, content, MDXComponents, ...rest }: Props) {
  const body = <RenderMDX code={content.body.code} components={MDXComponents} {...rest} />
  if (layout === 'AuthorLayout') {
    return <AuthorLayout content={content as Authors}>{body}</AuthorLayout>
  }
  if (layout === 'PostSimple') {
    return (
      <PostSimple
        {...(rest as Omit<ComponentProps<typeof PostSimple>, 'content' | 'children'>)}
        content={content as Blog}
      >
        {body}
      </PostSimple>
    )
  }
  if (layout !== 'PostLayout') throw new Error('Unsupported content layout')
  return (
    <PostLayout
      {...(rest as Omit<ComponentProps<typeof PostLayout>, 'content' | 'children'>)}
      content={content as Blog}
    >
      {body}
    </PostLayout>
  )
}
