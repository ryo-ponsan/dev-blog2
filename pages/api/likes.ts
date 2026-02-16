import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug is required' })
  }

  const key = `likes:${slug}`

  if (req.method === 'GET') {
    const count = (await redis.get<number>(key)) || 0
    return res.status(200).json({ count })
  }

  if (req.method === 'POST') {
    const count = await redis.incr(key)
    return res.status(200).json({ count })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
