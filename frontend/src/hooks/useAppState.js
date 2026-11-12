import { useContext } from 'react'
import { AppStateContext } from '../context/appStateContext.js'

export default function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) throw new Error('useAppState has to be used inside AppStateProvider')
  return value
}
