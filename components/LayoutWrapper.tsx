import { Inter } from '@next/font/google'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Header from './Header'
import { useTheme } from 'next-themes'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

const LayoutWrapper = ({ children }: Props) => {
  const canvasRef = useRef(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  useEffect(() => {
    if (!isDark || !canvasRef.current) return

    const s = window.screen
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = s.width
    canvas.height = s.height

    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789#$%^&*()*&^%'.split('')

    const font_size = 10
    const columns = canvas.width / font_size
    const drops = []
    for (let x = 0; x < columns; x++) drops[x] = 1

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0F0'
      ctx.font = font_size + 'px arial'
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * font_size, drops[i] * font_size)
        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    return () => clearInterval(interval)
  }, [isDark])

  return (
    <>
      <SectionContainer style={{ background: 'none' }}>
        {/* Dark mode: Matrix background */}
        {isDark && (
          <canvas ref={canvasRef} className="fixed left-0 top-0 h-screen w-screen bg-black" />
        )}

        {/* Light mode: Aurora gradient background */}
        {mounted && !isDark && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div
              className="absolute -top-40 -right-40 h-[500px] w-[500px] animate-blob rounded-full bg-sky-200 opacity-40 mix-blend-multiply blur-3xl"
            />
            <div
              className="absolute top-40 -left-20 h-[500px] w-[500px] animate-blob rounded-full bg-violet-200 opacity-40 mix-blend-multiply blur-3xl"
              style={{ animationDelay: '2s' }}
            />
            <div
              className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] animate-blob rounded-full bg-pink-200 opacity-30 mix-blend-multiply blur-3xl"
              style={{ animationDelay: '4s' }}
            />
            <div
              className="absolute top-1/2 right-1/4 h-[400px] w-[400px] animate-blob rounded-full bg-emerald-100 opacity-30 mix-blend-multiply blur-3xl"
              style={{ animationDelay: '6s' }}
            />
          </div>
        )}

        <div className={`${inter.className} relative flex h-screen flex-col justify-between font-sans`}>
          <Header />
          <main className="mb-auto">
            {children}
          </main>
          <Footer />
        </div>
      </SectionContainer>
    </>
  )
}

export default LayoutWrapper
