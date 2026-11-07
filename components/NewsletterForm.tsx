// Adapted from Pliny; see LICENSE.pliny.
import { useId, useRef, useState, type FormEvent } from 'react'

interface Props {
  title?: string
  apiUrl?: string
}

export default function NewsletterForm({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const [error, setError] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [pending, setPending] = useState(false)

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || subscribed) return
    setPending(true)
    setError(false)
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.current?.value }),
      })
      const result = await response.json()
      if (!response.ok || result.error) throw new Error('Subscription failed')
      if (input.current) input.current.value = ''
      setSubscribed(true)
    } catch {
      setError(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label htmlFor={id}>
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="w-72 max-w-full rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-black"
              id={id}
              name="email"
              placeholder={subscribed ? "You're subscribed !  🎉" : 'Enter your email'}
              ref={input}
              required
              maxLength={254}
              type="email"
              disabled={subscribed || pending}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0">
          <button
            className={`w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black sm:py-0 ${
              subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            }`}
            type="submit"
            disabled={subscribed || pending}
          >
            {subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
      {error && (
        <div
          role="alert"
          className="w-72 max-w-full pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96"
        >
          Your e-mail address is invalid or you are already subscribed!
        </div>
      )}
    </div>
  )
}

export function BlogNewsletterForm(props: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="min-w-0 max-w-full bg-gray-100 p-6 dark:bg-gray-800 sm:px-14 sm:py-8">
        <NewsletterForm {...props} />
      </div>
    </div>
  )
}
