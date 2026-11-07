// Adapted from Pliny; see LICENSE.pliny.
export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>

interface ContentDocument {
  body: unknown
  _raw: unknown
  _id: string
  draft?: boolean
}

export function coreContent<T extends ContentDocument>(content: T): CoreContent<T> {
  const result = { ...content }
  delete result.body
  delete result._raw
  delete result._id
  return result
}

export function allCoreContent<T extends ContentDocument>(contents: T[]): CoreContent<T>[] {
  return contents.filter((content) => !content.draft).map(coreContent)
}

export function sortedBlogPost<T extends { date: string }>(posts: T[]): T[] {
  return posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0))
}
