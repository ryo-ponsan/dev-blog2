import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const LIKES_FILE = path.join(process.cwd(), 'public', 'likes.json')

function getLikes(): Record<string, number> {
  try {
    const data = fs.readFileSync(LIKES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function saveLikes(likes: Record<string, number>): void {
  try {
    fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2))
  } catch {
    // Vercel等のサーバーレス環境ではファイル書き込みが失敗する場合があります
    // 本番環境ではUpstash Redis等の外部ストレージへの移行を推奨します
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug is required' })
  }

  if (req.method === 'GET') {
    const likes = getLikes()
    return res.status(200).json({ count: likes[slug] || 0 })
  }

  if (req.method === 'POST') {
    const likes = getLikes()
    likes[slug] = (likes[slug] || 0) + 1
    saveLikes(likes)
    return res.status(200).json({ count: likes[slug] })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
