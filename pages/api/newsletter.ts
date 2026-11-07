import type { NextApiRequest, NextApiResponse } from 'next'
import siteMetadata from '../../data/siteMetadata.js'

export const config = { api: { bodyParser: { sizeLimit: '2kb' } } }

export default async function newsletter(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
    return res.status(415).json({ error: 'JSON body required' })
  }
  const origin = req.headers.origin
  if (origin) {
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
      const expectedOrigin = new URL(`${protocol}://${req.headers.host}`).origin
      if (new URL(origin).origin !== expectedOrigin) {
        return res.status(403).json({ error: 'Request not allowed' })
      }
    } catch {
      return res.status(403).json({ error: 'Request not allowed' })
    }
  }
  const email = req.body?.email
  if (
    typeof email !== 'string' ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({ error: 'Valid email required' })
  }
  if (siteMetadata.newsletter.provider !== 'buttondown' || !process.env.BUTTONDOWN_API_KEY) {
    return res.status(503).json({ error: 'Newsletter unavailable' })
  }
  try {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return res.status(502).json({ error: 'Subscription failed' })
    return res.status(201).json({ message: 'Successfully subscribed to the newsletter' })
  } catch {
    // Do not return provider errors, credentials, or subscriber data to the caller.
    return res.status(502).json({ error: 'Subscription failed' })
  }
}
