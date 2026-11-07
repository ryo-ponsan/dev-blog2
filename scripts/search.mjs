import { writeFileSync } from 'fs'
import { createRequire } from 'module'
import siteMetadata from '../data/siteMetadata.js'

const require = createRequire(import.meta.url)
const allBlogs = require('../.contentlayer/generated/Blog/_index.json')

const search = () => {
  if (siteMetadata?.search?.kbarConfig?.searchDocumentsPath) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(
        allBlogs
          .filter((post) => !post.draft)
          .map((post) => {
            const content = { ...post }
            delete content.body
            delete content._raw
            delete content._id
            return content
          })
      )
    )
    console.log('Local search index generated...')
  }
}
export default search
