import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import BitcoinSvg from '@/components/social-icons/bitcoin.svg'
import LightningSvg from '@/components/social-icons/lightning.svg'
import EthereumSvg from '@/components/social-icons/ethereum.svg'

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
      className="ml-2 shrink-0 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 transition hover:bg-gray-600"
      title="Copy to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function AddressRow({
  icon,
  label,
  address,
  labelColor,
  networks,
}: {
  icon: React.ReactNode
  label: string
  address: string
  labelColor: string
  networks?: string
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className={`mb-1 flex items-center gap-2 text-sm font-medium ${labelColor}`}>
        {icon}
        {label}
      </div>
      {networks && <p className="mb-1 text-xs text-gray-500">{networks}</p>}
      <div className="flex items-center">
        <code className="block min-w-0 overflow-x-auto rounded bg-gray-900 px-3 py-2 text-xs text-gray-300">
          {address}
        </code>
        <CopyButton text={address} />
      </div>
    </div>
  )
}

export default function BitcoinDonation() {
  const [isOpen, setIsOpen] = useState(false)

  const btcAddress = siteMetadata.bitcoinAddress
  const lnAddress = siteMetadata.lightningAddress
  const evmAddress = siteMetadata.evmAddress

  if (!btcAddress && !lnAddress && !evmAddress) return null

  return (
    <div className="py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20 hover:text-orange-300"
      >
        <BitcoinSvg className="h-5 w-5 fill-current" />
        暗号通貨で寄付する
        <span className="ml-1 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          {btcAddress && (
            <AddressRow
              icon={<BitcoinSvg className="h-4 w-4 fill-current" />}
              label="Bitcoin (On-chain)"
              address={btcAddress}
              labelColor="text-orange-400"
            />
          )}

          {lnAddress && (
            <AddressRow
              icon={<LightningSvg className="h-4 w-4 fill-current" />}
              label="Lightning Network"
              address={lnAddress}
              labelColor="text-yellow-400"
            />
          )}

          {evmAddress && (
            <AddressRow
              icon={<EthereumSvg className="h-4 w-4 fill-current" />}
              label="Stablecoin (USDC / USDT / DAI)"
              address={evmAddress}
              labelColor="text-blue-400"
              networks="Ethereum / Polygon / Arbitrum / Base / Optimism"
            />
          )}

          <p className="mt-3 text-xs text-gray-500">
            上記アドレスに暗号通貨を送金できます。ステーブルコインはEVM互換チェーンに対応しています。ご支援ありがとうございます。
          </p>
        </div>
      )}
    </div>
  )
}
