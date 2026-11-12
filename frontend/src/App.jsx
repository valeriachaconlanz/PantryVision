import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Profile from './pages/Profile.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import Recipes from './pages/Recipes.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login mode="login" />} />
      <Route path="/signup" element={<Login mode="signup" />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* these need you to be logged in */}
      <Route element={<AppLayout />}>
        <Route path="/search" element={<Search />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
