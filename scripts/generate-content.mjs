import {
  readFile,
  readdir,
  mkdir,
  writeFile,
  rm,
  rename,
  open,
  lstat,
  realpath,
  mkdtemp,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { bundleMDX } from 'mdx-bundler'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from './mdx-plugins.mjs'

const blogFields = {
  title: 'required',
  date: 'date-required',
  tags: 'list',
  lastmod: 'date',
  draft: 'boolean',
  summary: 'string',
  images: 'list',
  authors: 'list',
  layout: 'string',
  bibliography: 'string',
  canonicalUrl: 'string',
}
const authorFields = Object.fromEntries(
  [
    'name',
    'avatar',
    'occupation',
    'company',
    'email',
    'twitter',
    'giita',
    'linkedin',
    'github',
    'layout',
  ].map((field) => [field, field === 'name' ? 'required' : 'string'])
)

function fields(data, schema, filename) {
  const result = {}
  for (const [key, type] of Object.entries(schema)) {
    const value = data[key]
    const fail = () => {
      throw new Error(`Invalid ${key} field in ${filename}`)
    }
    if (value === undefined || value === null) {
      if (type.endsWith('required') || type === 'required') fail()
      continue
    }
    if (type.startsWith('date')) {
      if (
        !(typeof value === 'string' || value instanceof Date) ||
        !Number.isFinite(new Date(value).getTime())
      )
        fail()
      result[key] = new Date(value).toISOString()
    } else {
      if (
        type === 'list'
          ? !Array.isArray(value) || value.some((v) => typeof v !== 'string')
          : typeof value !== (type === 'boolean' ? 'boolean' : 'string')
      )
        fail()
      result[key] = value
    }
  }
  return result
}

async function sources(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
  const files = []
  for (const entry of entries) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await sources(filename)))
    else if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(filename)
  }
  return files.sort()
}

const types = `
export type MDX = { raw: string; code: string }
export type RawDocumentData = { sourceFilePath: string; sourceFileName: string; sourceFileDir: string; contentType: 'mdx'; flattenedPath: string }
export type TocHeading = { value: string; url: string; depth: number }
export type ReadingTime = { text: string; minutes: number; time: number; words: number }
type Common = { _id: string; _raw: RawDocumentData; body: MDX; readingTime: ReadingTime; slug: string; path: string; filePath: string; toc: TocHeading[] }
export type Blog = Common & { type: 'Blog'; title: string; date: string; tags?: string[]; lastmod?: string; draft?: boolean; summary?: string; images?: string[]; authors?: string[]; layout?: string; bibliography?: string; canonicalUrl?: string }
export type Authors = Common & { type: 'Authors'; name: string; avatar?: string; occupation?: string; company?: string; email?: string; twitter?: string; giita?: string; linkedin?: string; github?: string; layout?: string }
export type DocumentTypes = Blog | Authors
`

export async function generateContent({ root = process.cwd(), output } = {}) {
  root = path.resolve(root)
  output = path.resolve(output ?? path.join(root, '.contentlayer/generated'))
  if (output !== path.join(root, '.contentlayer/generated')) {
    throw new Error('Generated output must be the project .contentlayer/generated directory')
  }
  const parent = path.dirname(output)
  // Do not allow a generated-data junction to redirect cleanup outside this root.
  for (const filename of [parent, output]) {
    try {
      if ((await lstat(filename)).isSymbolicLink())
        throw new Error('Generated output cannot use symbolic links')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  await mkdir(parent, { recursive: true })
  const actualParent = await realpath(parent)
  const expectedParent = path.join(await realpath(root), '.contentlayer')
  if (actualParent.toLowerCase() !== expectedParent.toLowerCase())
    throw new Error('Generated output is outside the project root')
  const lockPath = `${output}.lock`
  const lock = await open(lockPath, 'wx')
  let staging
  try {
    staging = await mkdtemp(`${output}.staging-`)
    const allBlogs = []
    const allAuthors = []
    const seen = new Set()
    for (const [directory, type] of [
      ['blog', 'Blog'],
      ['old', 'Blog'],
      ['authors', 'Authors'],
    ]) {
      for (const filename of await sources(path.join(root, 'data', directory))) {
        const sourceFilePath = path
          .relative(path.join(root, 'data'), filename)
          .split(path.sep)
          .join('/')
        const flattenedPath = sourceFilePath.replace(/\.mdx$/, '')
        const slug = flattenedPath.replace(/^.+?\//, '')
        const key = `${type}/${slug.toLowerCase()}`
        if (seen.has(key)) throw new Error(`Duplicate document slug: ${type}/${slug}`)
        seen.add(key)
        const source = await readFile(filename, 'utf8')
        const language = source.replace(/^\uFEFF/, '').match(/^---([^\r\n]*)/)
        if (language && !['', 'yaml'].includes(language[1].trim())) {
          throw new Error(`Only YAML frontmatter is supported in ${sourceFilePath}`)
        }
        // Use a safe YAML loader; never evaluate JavaScript frontmatter.
        const parsed = matter(source, { engines: { yaml: (value) => yaml.load(value) ?? {} } })
        const data = fields(
          parsed.data,
          type === 'Blog' ? blogFields : authorFields,
          sourceFilePath
        )
        const raw = parsed.content
        const _raw = {
          sourceFilePath,
          sourceFileName: path.posix.basename(sourceFilePath),
          sourceFileDir: path.posix.dirname(sourceFilePath),
          contentType: 'mdx',
          flattenedPath,
        }
        const addRaw = () => (_, vfile) => {
          vfile.data.rawDocumentData = _raw
        }
        const compiled = raw.length
          ? await bundleMDX({
              source: raw,
              cwd: root,
              mdxOptions(options) {
                options.remarkPlugins = [
                  addRaw,
                  ...(options.remarkPlugins ?? []),
                  remarkExtractFrontmatter,
                  remarkGfm,
                  remarkCodeTitles,
                  remarkMath,
                  [remarkImgToJsx, { root }],
                ]
                options.rehypePlugins = [
                  ...(options.rehypePlugins ?? []),
                  rehypeSlug,
                  rehypeAutolinkHeadings,
                  rehypeKatex,
                  [rehypeCitation, { path: path.join(root, 'data') }],
                  [rehypePrismPlus, { ignoreMissing: true }],
                  rehypePresetMinify,
                ]
                return options
              },
              esbuildOptions(options) {
                options.target = 'es2020'
                return options
              },
            })
          : { code: '' }
        const document = {
          ...data,
          body: { raw, code: compiled.code },
          _id: sourceFilePath,
          _raw,
          type,
          readingTime: readingTime(raw),
          slug,
          path: flattenedPath,
          filePath: sourceFilePath,
          toc: await extractTocHeadings(raw),
        }
        ;(type === 'Blog' ? allBlogs : allAuthors).push(document)
      }
    }
    const allDocuments = [...allBlogs, ...allAuthors]
    await mkdir(staging, { recursive: true })
    for (const [type, documents] of [
      ['Blog', allBlogs],
      ['Authors', allAuthors],
    ]) {
      await mkdir(path.join(staging, type), { recursive: true })
      await writeFile(path.join(staging, type, '_index.json'), JSON.stringify(documents))
    }
    await writeFile(path.join(staging, 'types.d.ts'), types)
    await writeFile(
      path.join(staging, 'index.d.ts'),
      `export * from './types'\nimport type { Blog, Authors, DocumentTypes } from './types'\nexport declare const allBlogs: Blog[]\nexport declare const allAuthors: Authors[]\nexport declare const allDocuments: DocumentTypes[]\n`
    )
    await writeFile(
      path.join(staging, 'index.mjs'),
      `import allBlogs from './Blog/_index.json' with { type: 'json' }\nimport allAuthors from './Authors/_index.json' with { type: 'json' }\nexport { allBlogs, allAuthors }\nexport const allDocuments = [...allBlogs, ...allAuthors]\n`
    )
    await rm(output, { recursive: true, force: true })
    await rename(staging, output)
    return { allBlogs, allAuthors, allDocuments }
  } catch (error) {
    // Invalid sources must not leave usable data from a previous successful run.
    await rm(output, { recursive: true, force: true })
    throw error
  } finally {
    if (staging) await rm(staging, { recursive: true, force: true })
    await lock.close()
    await rm(lockPath, { force: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { allDocuments } = await generateContent()
  console.log(`Generated ${allDocuments.length} documents`)
}
