// Adapted from Pliny; see LICENSE.pliny.
import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import * as jsxRuntime from 'react/jsx-runtime'
import type { MDXComponents } from 'mdx/types'

interface Props {
  code: string
  components: MDXComponents
  [key: string]: unknown
}

export default function RenderMDX({ code, components, ...rest }: Props) {
  // Only evaluate the repository's build-generated MDX, never visitor input.
  const Component = useMemo(
    () =>
      new Function('React', 'ReactDOM', '_jsx_runtime', code)(React, ReactDOM, jsxRuntime).default,
    [code]
  )
  return <Component components={components} {...rest} />
}
