import { slug } from 'github-slugger'
import type { Blog } from 'contentlayer/generated'

export const kebabCase = (value: string) => slug(value)

export function getAllTags(posts: Blog[]): Record<string, number> {
  const tags: Record<string, number> = Object.create(null)
  for (const post of posts) {
    if (post.draft) continue
    for (const tag of post.tags || []) {
      const key = kebabCase(tag)
      tags[key] = (tags[key] || 0) + 1
    }
  }
  return tags
}
