import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Search from './pages/Search.jsx'
import Recipes from './pages/Recipes.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import Library from './pages/Library.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">PantryVision</NavLink>
        <nav>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/login">Log in</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
