// Adapted from Pliny; see LICENSE.pliny.
interface Heading {
  value: string
  url: string
  depth: number
  children?: Heading[]
}

interface Props {
  toc: Heading[]
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
}

export default function TOCInline({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = false,
  ulClassName = '',
  liClassName = '',
}: Props) {
  const pattern = Array.isArray(exclude) ? exclude.join('|') : exclude
  const excluded = new RegExp(`^(${pattern})$`, 'i')
  const headings = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !excluded.test(heading.value)
  )
  const nested: Heading[] = []
  const stack: Heading[] = []
  for (const heading of headings) {
    const item = { ...heading }
    while (stack.length && stack[stack.length - 1].depth >= item.depth) stack.pop()
    const parent = stack[stack.length - 1]
    if (parent) (parent.children ||= []).push(item)
    else nested.push(item)
    stack.push(item)
  }
  const list = (items?: Heading[]) =>
    !items?.length ? null : (
      <ul className={ulClassName}>
        {items.map((item, index) => (
          <li className={liClassName} key={index}>
            <a href={item.url}>{item.value}</a>
            {list(item.children)}
          </li>
        ))}
      </ul>
    )
  return asDisclosure ? (
    <details open={!collapse}>
      <summary className="ml-6 pb-2 pt-2 text-xl font-bold">Table of Contents</summary>
      <div className="ml-6">{list(nested)}</div>
    </details>
  ) : (
    list(nested)
  )
}
