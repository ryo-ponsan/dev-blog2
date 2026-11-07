import { writeFile } from 'node:fs/promises'
import { slug } from 'github-slugger'
import siteMetadata from '../data/siteMetadata.js'
import { publishedPosts, publicUrl, xml } from './feed-data.mjs'

export default async function sitemap() {
  const posts = publishedPosts()
  const routes = new Set(['/', '/blog', '/tags', '/about', '/projects'])
  for (const post of posts) routes.add(`/blog/${post.slug}`)
  for (const tag of posts.flatMap((post) => post.tags || [])) routes.add(`/tags/${slug(tag)}`)
  for (let page = 1; page <= Math.ceil(posts.length / 5); page++) routes.add(`/blog/page/${page}`)
  const urls = [...routes]
    .map((route) => `<url><loc>${xml(publicUrl(siteMetadata.siteUrl, route))}</loc></url>`)
    .join('')
  await writeFile(
    'public/sitemap.xml',
    `<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  )
  console.log('Sitemap generated from public routes')
}
