import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export default function useMounted() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
}
