import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth()

  if (loading) return null
  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin">
      <div className="admin-header">
        <Link to="/admin">Administration — Crèche Matous</Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/" target="_blank" style={{ fontWeight: 600 }}>Voir le site ↗</Link>
          <Link to="/admin/settings" style={{ fontWeight: 600 }}>Réglages</Link>
          <button className="btn small ghost" style={{ color: '#fff', borderColor: '#fff' }} onClick={signOut}>
            Se déconnecter
          </button>
        </div>
      </div>
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  )
}
