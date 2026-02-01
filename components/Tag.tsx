import Link from 'next/link'
import { kebabCase } from 'pliny/utils/kebabCase'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="rounded-full bg-gray-700/50 px-2.5 py-0.5 text-xs font-medium text-primary-400 transition-colors hover:bg-gray-700 hover:text-primary-300"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
