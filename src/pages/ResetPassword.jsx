import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Supabase がメールリンクのトークンを検出すると PASSWORD_RECOVERY イベントを発火する
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

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
      setError('パスワードの変更に失敗しました。リンクの有効期限が切れている可能性があります。')
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
    >
      <div className="w-full max-w-sm bg-white/95 backdrop-blur rounded-2xl shadow-xl px-8 py-8">
        {success ? (
          <div className="text-center py-4">
            <p className="text-lg font-bold text-gray-800 mb-2">パスワードを変更しました</p>
            <p className="text-sm text-gray-400">ログイン画面に移動します...</p>
          </div>
        ) : !ready ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">リンクを確認中...</p>
            <p className="text-xs text-gray-300 mt-3">
              このページはパスワードリセットメールのリンクからのみアクセスできます。
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">新しいパスワードを設定</h2>
              <p className="text-sm text-gray-400 mt-1">6文字以上で入力してください</p>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
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
                className="w-full text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                {loading ? '変更中...' : 'パスワードを変更する'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
