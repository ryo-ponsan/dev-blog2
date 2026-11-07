import assert from 'node:assert/strict'
import { readFile, access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { publishedPosts, publicUrl, xml } from './feed-data.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const allPosts = require('../.contentlayer/generated/Blog/_index.json')
const posts = publishedPosts()
const rss = await readFile('public/feed.xml', 'utf8')
const sitemap = await readFile('public/sitemap.xml', 'utf8')

async function sourceFiles(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
  const files = await Promise.all(
    entries.map((entry) => {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(filename)
      return entry.name.endsWith('.mdx')
        ? [path.relative('data', filename).split(path.sep).join('/')]
        : []
    })
  )
  return files.flat()
}
const expectedSources = [...(await sourceFiles('data/blog')), ...(await sourceFiles('data/old'))]
assert.deepEqual(
  allPosts.map((post) => post._raw.sourceFilePath).sort(),
  expectedSources.sort(),
  'A source post was skipped during content generation'
)

assert.equal(xml('<a x="1">&\'</a>'), '&lt;a x=&quot;1&quot;&gt;&amp;&apos;&lt;/a&gt;')
assert.equal((rss.match(/<item>/g) || []).length, posts.length)

for (const post of allPosts) {
  const filename = `.next/server/pages/blog/${post.slug}`
  if (post.draft) {
    await assert.rejects(access(`${filename}.json`), { code: 'ENOENT' })
    await assert.rejects(access(`${filename}.html`), { code: 'ENOENT' })
    assert.ok(!rss.includes(`/blog/${post.slug}</`), 'Draft leaked into RSS')
    assert.ok(!sitemap.includes(`/blog/${post.slug}</`), 'Draft leaked into sitemap')
    continue
  }
  const { pageProps } = JSON.parse(await readFile(`${filename}.json`, 'utf8'))
  assert.equal(pageProps.post.title, post.title)
  assert.ok(!pageProps.prev?.draft && !pageProps.next?.draft)
  const url = publicUrl(siteMetadata.siteUrl, `/blog/${post.slug}`)
  assert.ok(rss.includes(`<guid>${xml(url)}</guid>`))
  assert.ok(sitemap.includes(`<loc>${xml(url)}</loc>`))
}

const recent = JSON.parse(await readFile('.next/server/pages/blog/post_261107.json', 'utf8'))
assert.deepEqual(recent.pageProps.authorDetails, [])
assert.deepEqual(recent.pageProps.post.authors, [])
const articleHtml = await readFile('.next/server/pages/blog/post_261107.html', 'utf8')
assert.ok(!articleHtml.includes('/static/images/avatar1.png'))
assert.ok(!articleHtml.includes('twitter:site'))
assert.ok(!siteMetadata.github && !siteMetadata.twitter)

const routes = JSON.parse(await readFile('.next/routes-manifest.json', 'utf8'))
const headers = routes.headers.flatMap((entry) => entry.headers)
const csp = headers.find((header) => header.key.toLowerCase() === 'content-security-policy').value
assert.ok(csp.includes("object-src 'none'"))
assert.ok(csp.includes("frame-ancestors 'none'"))
assert.ok(!csp.includes('connect-src *'))
console.log(
  `Verified ${posts.length} published posts, ${allPosts.length - posts.length} hidden drafts, feeds, sitemap, privacy, and security headers`
)
