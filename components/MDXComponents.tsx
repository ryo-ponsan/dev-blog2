import type { MDXComponents as ComponentMap } from 'mdx/types'
import TOCInline from 'pliny/ui/TOCInline.js'
import Pre from 'pliny/ui/Pre.js'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm.js'

import Image from './Image'
import CustomLink from './Link'

export const MDXComponents: ComponentMap = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
}
