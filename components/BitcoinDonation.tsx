import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import BitcoinSvg from '@/components/social-icons/bitcoin.svg'
import LightningSvg from '@/components/social-icons/lightning.svg'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 transition hover:bg-gray-600"
      title="Copy to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function BitcoinDonation() {
  const [isOpen, setIsOpen] = useState(false)

  const btcAddress = siteMetadata.bitcoinAddress
  const lnAddress = siteMetadata.lightningAddress

  if (!btcAddress && !lnAddress) return null

  return (
    <div className="py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20 hover:text-orange-300"
      >
        <BitcoinSvg className="h-5 w-5 fill-current" />
        Bitcoin で寄付する
        <span className="ml-1 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          {btcAddress && (
            <div className="mb-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-orange-400">
                <BitcoinSvg className="h-4 w-4 fill-current" />
                Bitcoin (On-chain)
              </div>
              <div className="flex items-center">
                <code className="block overflow-x-auto rounded bg-gray-900 px-3 py-2 text-xs text-gray-300">
                  {btcAddress}
                </code>
                <CopyButton text={btcAddress} />
              </div>
            </div>
          )}

          {lnAddress && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-yellow-400">
                <LightningSvg className="h-4 w-4 fill-current" />
                Lightning Network
              </div>
              <div className="flex items-center">
                <code className="block overflow-x-auto rounded bg-gray-900 px-3 py-2 text-xs text-gray-300">
                  {lnAddress}
                </code>
                <CopyButton text={lnAddress} />
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500">
            上記アドレスにBitcoinまたはLightning Networkで送金できます。ご支援ありがとうございます。
          </p>
        </div>
      )}
    </div>
  )
}
