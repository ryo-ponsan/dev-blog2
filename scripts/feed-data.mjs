import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export function publishedPosts() {
  return require('../.contentlayer/generated/Blog/_index.json')
    .filter((post) => !post.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const xml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]
  )

export const publicUrl = (siteUrl, pathname) => new URL(pathname, siteUrl).href
