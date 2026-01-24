import { createRequire } from 'module'
import { generateSitemap } from 'pliny/utils/generate-sitemap.js'
import siteMetadata from '../data/siteMetadata.js'

const require = createRequire(import.meta.url)
const allBlogs = require('../.contentlayer/generated/Blog/_index.json')

const sitemap = () => {
  generateSitemap(siteMetadata.siteUrl, allBlogs)
  console.log('Sitemap generated...')
}
export default sitemap
