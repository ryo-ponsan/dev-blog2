// Adapted from Pliny; see LICENSE.pliny.
import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function Pre({ children }: { children: ReactNode }) {
  const code = useRef<HTMLPreElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.current?.textContent || '')
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={copied ? 'Code copied' : 'Copy code'}
        className={`absolute right-2 top-2 h-8 w-8 rounded border-2 bg-gray-700 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 dark:bg-gray-800 ${
          copied ? 'border-green-400 focus:border-green-400 focus:outline-none' : 'border-gray-300'
        }`}
        onClick={copy}
        onMouseLeave={() => setCopied(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className={copied ? 'text-green-400' : 'text-gray-300'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              copied
                ? 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                : 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            }
          />
        </svg>
      </button>
      <pre ref={code}>{children}</pre>
    </div>
  )
}
