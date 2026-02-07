import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
    googleTranslateElementInit: () => void
  }
}

/**
 * Trigger Google Translate to translate the page to English
 * by programmatically setting the hidden select dropdown.
 */
const triggerTranslate = (onSuccess: () => void, retries = 20) => {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
  if (select) {
    select.value = 'en'
    select.dispatchEvent(new Event('change'))
    onSuccess()
  } else if (retries > 0) {
    setTimeout(() => triggerTranslate(onSuccess, retries - 1), 300)
  }
}

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState<'ja' | 'en'>('ja')
  const router = useRouter()
  const initRef = useRef(false)

  // Load Google Translate widget once
  useEffect(() => {
    setMounted(true)

    // Detect existing translation state from cookie
    if (document.cookie.includes('googtrans=/ja/en')) {
      setCurrentLang('en')
    }

    if (initRef.current) return
    initRef.current = true

    // Define callback for Google Translate initialization
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'ja',
          includedLanguages: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      )
    }

    // Load Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Re-apply translation after SPA navigation when English is active
  useEffect(() => {
    const handleRouteChange = () => {
      if (document.cookie.includes('googtrans=/ja/en')) {
        // Wait for new page content to render, then re-trigger translation
        setTimeout(() => {
          triggerTranslate(() => setCurrentLang('en'))
        }, 500)
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const switchToEnglish = useCallback(() => {
    triggerTranslate(() => setCurrentLang('en'))
  }, [])

  const switchToJapanese = useCallback(() => {
    // Clear googtrans cookies
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie =
      'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' +
      window.location.hostname

    // Try to use Google Translate's restore-original function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const frame = document.querySelector('.goog-te-banner-frame') as any
    if (frame) {
      try {
        const innerDoc = frame.contentDocument || frame.contentWindow?.document
        const restoreBtn = innerDoc?.querySelector('.goog-close-link') as HTMLElement
        if (restoreBtn) {
          restoreBtn.click()
          setCurrentLang('ja')
          return
        }
      } catch {
        // Cross-origin frame access may fail, fall through to reload
      }
    }

    // Fallback: reload page to restore original language
    setCurrentLang('ja')
    window.location.reload()
  }, [])

  const handleClick = useCallback(
    (lang: 'ja' | 'en') => {
      if (lang === currentLang) return
      if (lang === 'en') {
        switchToEnglish()
      } else {
        switchToJapanese()
      }
    },
    [currentLang, switchToEnglish, switchToJapanese]
  )

  if (!mounted) return null

  return (
    <>
      <div id="google_translate_element" />
      <div
        className="ml-1 mr-1 flex items-center rounded p-1 text-sm font-medium sm:ml-4"
        role="radiogroup"
        aria-label="Language switcher"
      >
        <button
          role="radio"
          aria-checked={currentLang === 'ja'}
          className={`rounded px-1.5 py-0.5 transition-colors ${
            currentLang === 'ja'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => handleClick('ja')}
        >
          JA
        </button>
        <span className="mx-0.5 text-gray-500">/</span>
        <button
          role="radio"
          aria-checked={currentLang === 'en'}
          className={`rounded px-1.5 py-0.5 transition-colors ${
            currentLang === 'en'
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => handleClick('en')}
        >
          EN
        </button>
      </div>
    </>
  )
}

export default LanguageSwitcher
