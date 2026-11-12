import { useMemo, useState } from 'react'
import { AppStateContext } from './appStateContext.js'
import useLocalStorage from '../hooks/useLocalStorage.js'

// Shared state for the whole app: who's logged in, their diet, saved recipes,
// ratings, and the current search.
// TODO: once auth and the user endpoints exist, load and save this from the backend
// instead of localStorage.

const EMPTY_SEARCH = { ingredients: [], meal: null, tools: [], maxMinutes: null }

export function AppStateProvider({ children }) {
  const [user, setUser] = useLocalStorage('pv.user', null)
  const [prefs, setPrefs] = useLocalStorage('pv.prefs', { diets: [], allergies: [], done: false })
  const [saved, setSaved] = useLocalStorage('pv.saved', [])
  const [ratings, setRatings] = useLocalStorage('pv.ratings', {})
  const [search, setSearch] = useState(EMPTY_SEARCH)
  // true right after you log out, so we send you home instead of to the login page
  const [loggedOut, setLoggedOut] = useState(false)

  const value = useMemo(
    () => ({
      user,
      loggedOut,
      logIn: (email) => {
        setUser((old) => ({ email, joined: old?.joined ?? new Date().toISOString() }))
        setLoggedOut(false)
      },
      logOut: () => {
        setUser(null)
        setSearch(EMPTY_SEARCH)
        setLoggedOut(true)
      },
      deleteAccount: () => {
        setUser(null)
        setSearch(EMPTY_SEARCH)
        setLoggedOut(true)
        setPrefs({ diets: [], allergies: [], done: false })
        setSaved([])
        setRatings({})
      },

      prefs,
      setPrefs,

      saved,
      isSaved: (id) => saved.some((s) => s.id === id),
      toggleSaved: (recipe) =>
        setSaved((list) =>
          list.some((s) => s.id === recipe.id)
            ? list.filter((s) => s.id !== recipe.id)
            : [...list, { id: recipe.id, meal: recipe.meal, savedAt: new Date().toISOString() }],
        ),

      ratings,
      rate: (id, stars) => setRatings((r) => ({ ...r, [id]: stars })),

      search,
      setSearch,
    }),
    [user, prefs, saved, ratings, search, loggedOut, setUser, setPrefs, setSaved, setRatings],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
