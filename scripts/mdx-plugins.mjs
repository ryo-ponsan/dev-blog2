// Adapted from Pliny's MIT-licensed MDX plugins; see LICENSE.pliny.
import fs from 'node:fs'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import GithubSlugger from 'github-slugger'
import yaml from 'js-yaml'
import { sync as imageSize } from 'probe-image-size'

export function remarkExtractFrontmatter() {
  return (tree, file) => {
    visit(tree, 'yaml', (node) => {
      file.data.frontmatter = yaml.load(node.value)
    })
  }
}

export function remarkCodeTitles() {
  return (tree) =>
    visit(tree, 'code', (node, index, parent) => {
      const nodeLang = node.lang || ''
      const separator = nodeLang.indexOf(':')
      if (separator < 0) return
      const title = nodeLang.slice(separator + 1)
      if (!title) return
      parent.children.splice(index, 0, {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [{ type: 'mdxJsxAttribute', name: 'className', value: 'remark-code-title' }],
        children: [{ type: 'text', value: title }],
        data: { _xdmExplicitJsx: true },
      })
      node.lang = nodeLang.slice(0, separator)
    })
}

export function remarkImgToJsx({ root = process.cwd() } = {}) {
  return (tree) => {
    visit(
      tree,
      (node) => node.type === 'paragraph' && node.children.some((child) => child.type === 'image'),
      (node) => {
        const index = node.children.findIndex((child) => child.type === 'image')
        const image = node.children[index]
        const imagePath = `${root}/public${image.url}`
        if (!fs.existsSync(imagePath)) return
        const dimensions = imageSize(fs.readFileSync(imagePath))
        image.type = 'mdxJsxFlowElement'
        image.name = 'Image'
        image.attributes = [
          { type: 'mdxJsxAttribute', name: 'alt', value: image.alt },
          { type: 'mdxJsxAttribute', name: 'src', value: image.url },
          { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
          { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
        ]
        node.type = 'div'
        node.children[index] = image
      }
    )
  }
}

export function remarkTocHeadings() {
  const slugger = new GithubSlugger()
  return (tree, file) => {
    const toc = []
    visit(tree, 'heading', (node) => {
      const value = toString(node)
      toc.push({ value, url: `#${slugger.slug(value)}`, depth: node.depth })
    })
    file.data.toc = toc
  }
}

export async function extractTocHeadings(markdown) {
  const file = await remark().use(remarkTocHeadings).process(markdown)
  return file.data.toc
}
