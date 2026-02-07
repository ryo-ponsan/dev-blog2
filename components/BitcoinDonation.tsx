import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import BitcoinSvg from '@/components/social-icons/bitcoin.svg'
import LightningSvg from '@/components/social-icons/lightning.svg'
import EthereumSvg from '@/components/social-icons/ethereum.svg'
import SolanaSvg from '@/components/social-icons/solana.svg'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      isMetaMask?: boolean
    }
  }
}

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
      className="shrink-0 rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function MetaMaskButton({ to }: { to: string }) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'error'>('idle')

  const handleSend = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    try {
      setStatus('connecting')
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to,
          },
        ],
      })
      setStatus('idle')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={status === 'connecting'}
      className="shrink-0 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
    >
      {status === 'connecting' && '接続中...'}
      {status === 'error' && 'エラー'}
      {status === 'idle' && 'MetaMask'}
    </button>
  )
}

export default function BitcoinDonation() {
  const [isOpen, setIsOpen] = useState(false)

  const btcAddress = siteMetadata.bitcoinAddress
  const lnAddress = siteMetadata.lightningAddress
  const evmAddress = siteMetadata.evmAddress
  const solAddress = siteMetadata.solanaAddress

  if (!btcAddress && !lnAddress && !evmAddress && !solAddress) return null

  return (
    <div className="py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-500/20 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
      >
        <BitcoinSvg className="h-5 w-5 fill-current" />
        暗号通貨で寄付する
        <span className="ml-1 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm p-4 dark:border-gray-700 dark:bg-gray-800/50">
          {/* Bitcoin On-chain */}
          {btcAddress && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-orange-400">
                <BitcoinSvg className="h-4 w-4 fill-current" />
                Bitcoin (On-chain)
              </div>
              <div className="flex items-center gap-2">
                <code className="min-w-0 overflow-x-auto rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {btcAddress}
                </code>
                <CopyButton text={btcAddress} />
                <a
                  href={`bitcoin:${btcAddress}`}
                  className="shrink-0 rounded bg-orange-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-orange-500"
                >
                  送金
                </a>
              </div>
            </div>
          )}

          {/* Lightning Network */}
          {lnAddress && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-yellow-400">
                <LightningSvg className="h-4 w-4 fill-current" />
                Lightning Network
              </div>
              <div className="flex items-center gap-2">
                <code className="min-w-0 overflow-x-auto rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {lnAddress}
                </code>
                <CopyButton text={lnAddress} />
                <a
                  href={`lightning:${lnAddress}`}
                  className="shrink-0 rounded bg-yellow-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-yellow-500"
                >
                  送金
                </a>
              </div>
            </div>
          )}

          {/* EVM: ETH, USDC, USDT, HYPE */}
          {evmAddress && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-400">
                <EthereumSvg className="h-4 w-4 fill-current" />
                ETH / USDC / USDT / HYPE
              </div>
              <p className="mb-1 text-xs text-gray-500">
                Ethereum / Polygon / Arbitrum / Base / Hyperliquid
              </p>
              <div className="flex items-center gap-2">
                <code className="min-w-0 overflow-x-auto rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {evmAddress}
                </code>
                <CopyButton text={evmAddress} />
                <MetaMaskButton to={evmAddress} />
              </div>
            </div>
          )}

          {/* Solana: SOL */}
          {solAddress && (
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-purple-400">
                <SolanaSvg className="h-4 w-4 fill-current" />
                SOL (Solana)
              </div>
              <div className="flex items-center gap-2">
                <code className="min-w-0 overflow-x-auto rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {solAddress}
                </code>
                <CopyButton text={solAddress} />
              </div>
            </div>
          )}

          <p className="border-t border-gray-200 pt-3 dark:border-gray-700 text-xs text-gray-500">
            これは任意の寄付であり、対価・見返りは発生しません。ご支援ありがとうございます。
          </p>
        </div>
      )}
    </div>
  )
}
