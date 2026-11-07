// Adapted from Pliny's Giscus wrapper; see LICENSE.pliny.
import { useTheme } from 'next-themes'
import Giscus, { type GiscusProps } from '@giscus/react'

interface GiscusConfig {
  repo?: string
  repositoryId?: string
  category?: string
  categoryId?: string
  mapping: string
  reactions?: string
  metadata?: string
  inputPosition?: string
  lang?: string
  themeURL?: string
  theme?: string
  darkTheme?: string
}

interface Props {
  commentsConfig: { provider: string; giscusConfig?: GiscusConfig }
  slug: string
}

export function Comments({ commentsConfig }: Props) {
  const { theme, resolvedTheme } = useTheme()
  const config = commentsConfig.giscusConfig
  if (
    commentsConfig.provider !== 'giscus' ||
    !config?.repo ||
    !config.repositoryId ||
    !config.categoryId
  )
    return null

  const commentsTheme = config.themeURL
    ? config.themeURL
    : theme === 'dark' || resolvedTheme === 'dark'
      ? config.darkTheme
      : config.theme

  return (
    <Giscus
      id="comments-container"
      repo={config.repo as GiscusProps['repo']}
      repoId={config.repositoryId}
      category={config.category}
      categoryId={config.categoryId}
      mapping={config.mapping as GiscusProps['mapping']}
      reactionsEnabled={config.reactions as GiscusProps['reactionsEnabled']}
      emitMetadata={config.metadata as GiscusProps['emitMetadata']}
      inputPosition={config.inputPosition as GiscusProps['inputPosition']}
      theme={commentsTheme}
      lang={config.lang}
      loading="lazy"
    />
  )
}
