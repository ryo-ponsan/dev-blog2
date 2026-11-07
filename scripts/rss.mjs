import { mkdir, writeFile } from 'node:fs/promises'
import { slug } from 'github-slugger'
import siteMetadata from '../data/siteMetadata.js'
import { publishedPosts, publicUrl, xml } from './feed-data.mjs'

function feed(posts, pathname) {
  const items = posts.map((post) => {
    const url = xml(publicUrl(siteMetadata.siteUrl, `/blog/${post.slug}`))
    return `<item><guid>${url}</guid><title>${xml(post.title)}</title><link>${url}</link><description>${xml(post.summary || '')}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate>${(post.tags || []).map((tag) => `<category>${xml(tag)}</category>`).join('')}</item>`
  })
  return `<?xml version="1.0" encoding="utf-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(siteMetadata.title)}</title><link>${xml(publicUrl(siteMetadata.siteUrl, '/blog'))}</link><description>${xml(siteMetadata.description)}</description><language>${xml(siteMetadata.language)}</language><atom:link href="${xml(publicUrl(siteMetadata.siteUrl, pathname))}" rel="self" type="application/rss+xml"/>${items.join('')}</channel></rss>`
}

export default async function rss() {
  const posts = publishedPosts()
  await writeFile('public/feed.xml', feed(posts, '/feed.xml'))
  const tags = new Set(posts.flatMap((post) => (post.tags || []).map((tag) => slug(tag))))
  for (const tag of tags) {
    await mkdir(`public/tags/${tag}`, { recursive: true })
    await writeFile(
      `public/tags/${tag}/feed.xml`,
      feed(
        posts.filter((post) => (post.tags || []).some((value) => slug(value) === tag)),
        `/tags/${tag}/feed.xml`
      )
    )
  }
  console.log('RSS feeds generated from published posts')
}
