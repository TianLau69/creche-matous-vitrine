import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PublicPage from './pages/PublicPage'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import PagesList from './pages/admin/PagesList'
import PageEditor from './pages/admin/PageEditor'
import SiteSettings from './pages/admin/SiteSettings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicPage homeSlug />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Admin, protégé dans AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<PagesList />} />
            <Route path="pages/:pageId" element={<PageEditor />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>

          {/* Pages publiques dynamiques (doit rester APRÈS /admin) */}
          <Route path="/:slug" element={<PublicPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
