import { writeFileSync } from 'fs'
import { createRequire } from 'module'
import { allCoreContent } from 'pliny/utils/contentlayer.js'
import siteMetadata from '../data/siteMetadata.js'

const require = createRequire(import.meta.url)
const allBlogs = require('../.contentlayer/generated/Blog/_index.json')

const search = () => {
  if (siteMetadata?.search?.kbarConfig?.searchDocumentsPath) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(allBlogs))
    )
    console.log('Local search index generated...')
  }
}
export default search
