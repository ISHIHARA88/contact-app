import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // パスワードリセット用の状態
  const [resetMode, setResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError('')

    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo })

    setResetLoading(false)
    if (error) {
      setResetError('送信に失敗しました。メールアドレスを確認してください。')
    } else {
      setResetSent(true)
    }
  }

  const backToLogin = () => {
    setResetMode(false)
    setResetSent(false)
    setResetEmail('')
    setResetError('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
    >
      <div className="w-full max-w-sm bg-white/95 backdrop-blur rounded-2xl shadow-xl px-8 py-8">

        {!resetMode ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">管理者ログイン</h2>
              <p className="text-sm text-gray-400 mt-1">管理画面にアクセスするにはログインが必要です</p>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <button
              onClick={() => setResetMode(true)}
              className="mt-5 w-full text-center text-xs text-gray-400 hover:text-violet-500 transition-colors"
            >
              パスワードを忘れた方はこちら
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">パスワードをリセット</h2>
              <p className="text-sm text-gray-400 mt-1">登録済みのメールアドレスにリセットリンクを送ります</p>
            </div>

            {resetSent ? (
              <div className="text-center py-2">
                <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  メールを送信しました。受信ボックスをご確認ください。
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  メール内のリンクをクリックするとパスワードを変更できます。
                </p>
              </div>
            ) : (
              <>
                {resetError && (
                  <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {resetError}
                  </p>
                )}
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">メールアドレス</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 mt-2"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    {resetLoading ? '送信中...' : 'リセットメールを送る'}
                  </button>
                </form>
              </>
            )}

            <button
              onClick={backToLogin}
              className="mt-5 w-full text-center text-xs text-gray-400 hover:text-violet-500 transition-colors"
            >
              ログイン画面に戻る
            </button>
          </>
        )}
      </div>
    </div>
  )
}
