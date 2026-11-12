import { useMemo, useState } from 'react'
import { AppStateContext, EMPTY_SEARCH } from './appStateContext.js'
import useLocalStorage from '../hooks/useLocalStorage.js'

// Shared state for the whole app: who's logged in, their diet, saved recipes,
// ratings, and the current search.
// TODO: once auth and the user endpoints exist, load and save this from the backend
// instead of localStorage.


export function AppStateProvider({ children }) {
  const [user, setUser] = useLocalStorage('pv.user', null)
  const [prefs, setPrefs] = useLocalStorage('pv.prefs', { diets: [], allergies: [], done: false })
  const [saved, setSaved] = useLocalStorage('pv.saved', [])
  const [ratings, setRatings] = useLocalStorage('pv.ratings', {})
  // saved so a refresh doesn't use up another Spoonacular call
  const [search, setSearch] = useLocalStorage('pv.search', EMPTY_SEARCH)
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
      isSaved: (id) => saved.some((s) => s.id === String(id)),
      // we keep a little copy of the recipe so the library can show it without another API call
      toggleSaved: (recipe, meal) =>
        setSaved((list) =>
          list.some((s) => s.id === String(recipe.id))
            ? list.filter((s) => s.id !== String(recipe.id))
            : [
                ...list,
                {
                  id: String(recipe.id),
                  title: recipe.title,
                  image: recipe.image ?? null,
                  totalMinutes: recipe.totalMinutes ?? null,
                  score: recipe.score ?? null,
                  meal: meal ?? 'Dinner',
                  savedAt: new Date().toISOString(),
                },
              ],
        ),

      ratings,
      // TODO: send ratings to the backend (rating package) so everyone sees them
      rate: (id, stars) => setRatings((r) => ({ ...r, [String(id)]: stars })),

      search,
      setSearch,
    }),
    [user, prefs, saved, ratings, search, loggedOut, setUser, setPrefs, setSaved, setRatings, setSearch],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
