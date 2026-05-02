import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdminDashboard from '../components/AdminDashboard'

function PasswordModal({ onClose }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('確認用パスワードが一致しません')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (err) {
      setError('パスワードの変更に失敗しました。もう一度お試しください。')
    } else {
      setSuccess(true)
      setTimeout(onClose, 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-animate"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">パスワード変更</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center">
            <p className="text-emerald-600 font-semibold">パスワードを変更しました</p>
            <p className="text-sm text-gray-400 mt-1">このウィンドウは自動的に閉じます</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">新しいパスワード</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="6文字以上"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">確認用パスワード</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 transition-opacity hover:opacity-90 mt-1"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              {loading ? '変更中...' : 'パスワードを変更する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
    >
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">管理画面</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all"
            >
              パスワード変更
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all"
            >
              ログアウト
            </button>
          </div>
        </div>
        <AdminDashboard />
      </div>
    </div>
  )
}
