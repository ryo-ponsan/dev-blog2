import test from 'node:test'
import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, rm, symlink, unlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getMDXComponent } from 'mdx-bundler/client/index.js'
import { generateContent } from './generate-content.mjs'

const post = (frontmatter = '', body = '## Fixture heading\n\nFixture body.') => `---
title: Fixture article
date: '2026-11-07'
authors: []
${frontmatter}---
${body}
`

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'blog-content-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await Promise.all(
    ['data/blog', 'data/old', 'data/authors', 'public'].map((directory) =>
      mkdir(path.join(root, directory), { recursive: true })
    )
  )
  const output = path.join(root, '.contentlayer/generated')
  const write = async (relative, value) => {
    const filename = path.join(root, relative)
    await mkdir(path.dirname(filename), { recursive: true })
    await writeFile(filename, value)
  }
  await write('data/authors/fixture.mdx', '---\nname: Fixture author\n---\nFixture profile.\n')
  return { root, output, write }
}

test('generates the data contract for current posts, archives, drafts, and authors', async (t) => {
  const { root, output, write } = await fixture(t)
  await write('data/blog/nested/published.mdx', post("tags: ['fixture', '日本語']\n"))
  await write('data/old/archived.mdx', post("lastmod: '2026-11-08'\n"))
  await write('data/blog/draft.mdx', post('draft: true\n'))
  await write('data/unrelated.mdx', '# Outside the configured content collections')

  const { allBlogs, allAuthors, allDocuments } = await generateContent({ root })
  assert.equal(allBlogs.length, 3)
  assert.equal(allAuthors.length, 1)
  assert.equal(allDocuments.length, 4)
  const published = allBlogs.find((entry) => entry.slug === 'nested/published')
  assert.ok(published)
  assert.equal(published.type, 'Blog')
  assert.equal(published._id, 'blog/nested/published.mdx')
  assert.equal(published._raw.sourceFilePath, 'blog/nested/published.mdx')
  assert.equal(published._raw.flattenedPath, 'blog/nested/published')
  assert.equal(published.path, 'blog/nested/published')
  assert.equal(published.filePath, 'blog/nested/published.mdx')
  assert.equal(published.date, '2026-11-07T00:00:00.000Z')
  assert.deepEqual(published.authors, [])
  assert.deepEqual(published.tags, ['fixture', '日本語'])
  assert.match(published.body.raw, /Fixture body/)
  assert.ok(published.body.code.length > 0)
  assert.equal(allBlogs.find((entry) => entry.slug === 'draft').draft, true)
  assert.equal(
    allBlogs.find((entry) => entry.slug === 'archived').lastmod,
    '2026-11-08T00:00:00.000Z'
  )
  assert.equal(allAuthors[0].type, 'Authors')
  assert.equal(allAuthors[0].slug, 'fixture')
  assert.deepEqual(JSON.parse(await readFile(path.join(output, 'Blog/_index.json'))), allBlogs)
  assert.deepEqual(JSON.parse(await readFile(path.join(output, 'Authors/_index.json'))), allAuthors)
})

test('compiles headings, GFM tables, code titles, and math into renderable MDX', async (t) => {
  const { root, write } = await fixture(t)
  await write(
    'data/blog/features.mdx',
    post(
      '',
      [
        '## Fixture heading',
        '',
        '## Fixture heading',
        '',
        '| A | B |',
        '| - | - |',
        '| one | two |',
        '',
        '```js:example.js',
        'const value = 1',
        '```',
        '',
        'Inline math: $x^2$.',
      ].join('\n')
    )
  )
  const { allBlogs } = await generateContent({ root })
  const article = allBlogs[0]
  assert.deepEqual(
    article.toc.map(({ url }) => url),
    ['#fixture-heading', '#fixture-heading-1']
  )
  const MDX = getMDXComponent(article.body.code)
  const html = renderToStaticMarkup(React.createElement(MDX))
  assert.match(html, /id="fixture-heading"/)
  assert.match(html, /id="fixture-heading-1"/)
  assert.match(html, /<table/)
  assert.match(html, /example\.js/)
  assert.match(html, /language-js/)
  assert.match(html, /class="katex"/)
})

test('rejects invalid metadata and malformed MDX without publishing stale generated data', async (t) => {
  const cases = [
    ['missing title', '---\ndate: 2026-11-07\n---\nBody'],
    ['missing date', '---\ntitle: Fixture\n---\nBody'],
    ['invalid date', post('').replace("'2026-11-07'", "'not-a-date'")],
    ['invalid lastmod', post('lastmod: not-a-date\n')],
    ['tags must be a string list', post('tags: fixture\n')],
    ['list elements must be strings', post('tags: [42]\n')],
    ['authors must be a list', post('').replace('authors: []', 'authors: fixture')],
    ['draft must be boolean', post("draft: 'false'\n")],
    ['summary must be a string', post('summary: { unexpected: object }\n')],
    ['malformed MDX', post('', '<Unclosed>')],
  ]
  for (const [label, invalid] of cases) {
    await t.test(label, async (subtest) => {
      const { root, output, write } = await fixture(subtest)
      await write('data/blog/fixture.mdx', post())
      await generateContent({ root })
      await access(path.join(output, 'Blog/_index.json'))
      await write('data/blog/fixture.mdx', invalid)
      await assert.rejects(generateContent({ root }))
      await assert.rejects(access(output), { code: 'ENOENT' })
    })
  }
})

test('rejects colliding public slugs and invalid author metadata', async (t) => {
  await t.test('a post and archive cannot silently share a URL', async (subtest) => {
    const { root, write } = await fixture(subtest)
    await write('data/blog/same.mdx', post())
    await write('data/old/same.mdx', post())
    await assert.rejects(generateContent({ root }), /slug|collision|duplicate/i)
  })
  await t.test('author names are required by the existing schema', async (subtest) => {
    const { root, write } = await fixture(subtest)
    await write('data/blog/fixture.mdx', post())
    await write('data/authors/fixture.mdx', '---\nlayout: AuthorLayout\n---\nProfile')
    await assert.rejects(generateContent({ root }))
  })
})

test('regenerates additions, edits, and deletions without obsolete documents', async (t) => {
  const { root, output, write } = await fixture(t)
  await write('data/blog/retained.mdx', post())
  await write('data/blog/removed.mdx', post())
  await generateContent({ root })
  await writeFile(path.join(output, 'obsolete.json'), '{}')
  await write('data/blog/retained.mdx', post().replace('Fixture article', 'Updated fixture'))
  await write('data/blog/added.mdx', post('draft: true\n'))
  await rm(path.join(root, 'data/blog/removed.mdx'))
  const { allBlogs } = await generateContent({ root })
  assert.deepEqual(allBlogs.map(({ slug }) => slug).sort(), ['added', 'retained'])
  assert.equal(allBlogs.find(({ slug }) => slug === 'retained').title, 'Updated fixture')
  const emitted = JSON.parse(await readFile(path.join(output, 'Blog/_index.json')))
  assert.deepEqual(emitted, allBlogs)
  await assert.rejects(access(path.join(output, 'obsolete.json')), { code: 'ENOENT' })
})

test('refuses output paths outside the fixture root without deleting other files', async (t) => {
  const { root, write } = await fixture(t)
  await write('data/blog/fixture.mdx', post())
  const outside = await mkdtemp(path.join(os.tmpdir(), 'blog-content-outside-'))
  t.after(() => rm(outside, { recursive: true, force: true }))
  const sentinel = path.join(outside, 'sentinel.txt')
  await writeFile(sentinel, 'Keep this file')
  await assert.rejects(generateContent({ root, output: outside }))
  assert.equal(await readFile(sentinel, 'utf8'), 'Keep this file')
})

test('does not remove another generation output when its lock is already held', async (t) => {
  const { root, output, write } = await fixture(t)
  await write('data/blog/fixture.mdx', post())
  const { allBlogs } = await generateContent({ root })
  const filename = path.join(output, 'Blog/_index.json')
  await writeFile(`${output}.lock`, 'Fixture lock')
  await assert.rejects(generateContent({ root }), { code: 'EEXIST' })
  assert.deepEqual(JSON.parse(await readFile(filename)), allBlogs)
  assert.equal(await readFile(`${output}.lock`, 'utf8'), 'Fixture lock')
})

test('refuses a source directory as output without deleting its articles', async (t) => {
  const { root, write } = await fixture(t)
  const source = post()
  await write('data/blog/fixture.mdx', source)
  for (const directory of ['data', 'data/blog', 'public']) {
    await assert.rejects(generateContent({ root, output: path.join(root, directory) }))
    assert.equal(await readFile(path.join(root, 'data/blog/fixture.mdx'), 'utf8'), source)
  }
})

test('rejects executable frontmatter without evaluating it or retaining old output', async (t) => {
  const key = '__blogFixtureFrontmatterExecuted'
  const previous = globalThis[key]
  t.after(() => {
    if (previous === undefined) delete globalThis[key]
    else globalThis[key] = previous
  })
  for (const opening of ['---javascript', '---js', '\uFEFF---javascript']) {
    await t.test(JSON.stringify(opening), async (subtest) => {
      const { root, output, write } = await fixture(subtest)
      await write('data/blog/fixture.mdx', post())
      await generateContent({ root })
      globalThis[key] = false
      await write(
        'data/blog/fixture.mdx',
        `${opening}\n({title: 'Fixture', date: '2026-11-07', marker: (globalThis.${key} = true)})\n---\nBody`
      )
      await assert.rejects(generateContent({ root }), /YAML frontmatter/)
      assert.equal(globalThis[key], false, 'The JavaScript frontmatter was executed')
      await assert.rejects(access(output), { code: 'ENOENT' })
    })
  }
})

test('rejects generated directory junctions without altering their external targets', async (t) => {
  for (const linkedPart of ['.contentlayer', '.contentlayer/generated']) {
    await t.test(linkedPart, async (subtest) => {
      const { root, write } = await fixture(subtest)
      await write('data/blog/fixture.mdx', post())
      const outside = await mkdtemp(path.join(os.tmpdir(), 'blog-content-linked-'))
      subtest.after(() => rm(outside, { recursive: true, force: true }))
      const target = linkedPart === '.contentlayer' ? path.join(outside, 'generated') : outside
      await mkdir(target, { recursive: true })
      const sentinel = path.join(target, 'sentinel.txt')
      await writeFile(sentinel, 'Keep external generated data')
      const junction = path.join(root, linkedPart)
      await mkdir(path.dirname(junction), { recursive: true })
      await symlink(outside, junction, process.platform === 'win32' ? 'junction' : 'dir')
      try {
        await assert.rejects(generateContent({ root }))
        assert.equal(await readFile(sentinel, 'utf8'), 'Keep external generated data')
      } finally {
        await unlink(junction)
      }
    })
  }
})
