import { useState, useEffect } from 'react'

interface LikeButtonProps {
  slug: string
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // localStorageからいいね済みかチェック
    try {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
      if (likedPosts[slug]) {
        setLiked(true)
      }
    } catch (e) {
      console.error('Failed to read likedPosts from localStorage:', e)
    }

    // サーバーからいいね数を取得
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((e) => console.error('Failed to fetch likes:', e))
  }, [slug])

  const handleLike = async () => {
    if (liked) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)

    try {
      const res = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`, {
        method: 'POST',
      })
      const data = await res.json()
      setCount(data.count)
      setLiked(true)

      // localStorageにいいね済みを保存
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
      likedPosts[slug] = true
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    } catch {
      // フォールバック: APIが失敗してもUIは更新
      setCount((prev) => prev + 1)
      setLiked(true)
    }
  }

  return (
    <div className="flex items-center gap-3 py-4">
      <button
        onClick={handleLike}
        disabled={liked}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
          liked
            ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
            : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-pink-900/20 dark:hover:text-pink-400'
        }`}
        aria-label={liked ? 'いいね済み' : 'いいね'}
      >
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${
            isAnimating ? 'scale-125' : ''
          }`}
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={liked ? 0 : 2}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{liked ? 'いいね済み' : 'いいね'}</span>
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">{count}</span>
    </div>
  )
}
