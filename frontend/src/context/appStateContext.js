import { createContext } from 'react'

export const AppStateContext = createContext(null)

// results: the 3 recipes we got back (null means we haven't asked yet)
// offset / nextOffset / total: for "show 3 more"
export const EMPTY_SEARCH = {
  ingredients: [],
  meal: null,
  tools: [],
  maxMinutes: null,
  results: null,
  offset: 0,
  nextOffset: 0,
  total: 0,
}
