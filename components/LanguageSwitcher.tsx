import { useCallback, useEffect, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
    googleTranslateElementInit: () => void
  }
}

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState<'ja' | 'en'>('ja')

  useEffect(() => {
    setMounted(true)

    // Detect existing translation state from cookie
    if (document.cookie.includes('googtrans=/ja/en')) {
      setCurrentLang('en')
    }

    // Define callback for Google Translate initialization
    window.googleTranslateElementInit = () => {
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

  const switchToEnglish = useCallback(() => {
    const tryTranslate = (retries: number) => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.value = 'en'
        select.dispatchEvent(new Event('change'))
        setCurrentLang('en')
      } else if (retries > 0) {
        setTimeout(() => tryTranslate(retries - 1), 500)
      }
    }
    tryTranslate(10)
  }, [])

  const switchToJapanese = useCallback(() => {
    // Clear googtrans cookies
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie =
      'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' +
      window.location.hostname

    // Try to click the "Show original" button in the Google Translate banner
    const banner = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
    if (banner) {
      const innerDoc = banner.contentDocument || banner.contentWindow?.document
      if (innerDoc) {
        const restoreBtn = innerDoc.querySelector('.goog-close-link') as HTMLElement
        if (restoreBtn) {
          restoreBtn.click()
          setCurrentLang('ja')
          return
        }
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
