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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="light-ambient-wrapper">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(18,94,76,0.05)] border border-white/60 px-8 py-10">

        {!resetMode ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold tracking-widest text-[#1d1d1f] font-serif">管理者ログイン</h2>
              <p className="text-xs text-[#58534e] mt-2 opacity-70 tracking-wider">管理画面にアクセスするにはログインが必要です</p>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-widest text-[#58534e] mb-2">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#dcd6cd] rounded-xl px-4 py-3 text-sm bg-white/60 backdrop-blur-sm outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] transition-all duration-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-widest text-[#58534e] mb-2">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-[#dcd6cd] rounded-xl px-4 py-3 text-sm bg-white/60 backdrop-blur-sm outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] transition-all duration-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-3.5 rounded-[50px] text-sm tracking-[0.2em] transition-all duration-700 hover:shadow-[0_12px_30px_rgba(18,94,76,0.15)] active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(18,94,76,0.1) 0%, rgba(18,94,76,0.2) 100%)',
                  color: '#125e4c',
                  border: '1.5px solid rgba(18, 94, 76, 0.35)'
                }}
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <button
              onClick={() => setResetMode(true)}
              className="mt-6 w-full text-center text-xs text-[#58534e] opacity-70 hover:opacity-100 hover:text-[#125e4c] transition-all tracking-widest"
            >
              パスワードを忘れた方はこちら
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold tracking-widest text-[#1d1d1f] font-serif">パスワードの再設定</h2>
              <p className="text-xs text-[#58534e] mt-2 opacity-70 tracking-wider">登録済みのメールアドレスにリセットリンクを送ります</p>
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
                    <label className="block text-xs font-medium tracking-widest text-[#58534e] mb-2">メールアドレス</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full border border-[#dcd6cd] rounded-xl px-4 py-3 text-sm bg-white/60 backdrop-blur-sm outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] transition-all duration-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full font-semibold py-3.5 rounded-[50px] text-sm tracking-[0.2em] transition-all duration-700 hover:shadow-[0_12px_30px_rgba(18,94,76,0.15)] active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(18,94,76,0.1) 0%, rgba(18,94,76,0.2) 100%)',
                      color: '#125e4c',
                      border: '1.5px solid rgba(18, 94, 76, 0.35)'
                    }}
                  >
                    {resetLoading ? '送信中...' : 'リセットメールを送る'}
                  </button>
                </form>
              </>
            )}

            <button
              onClick={backToLogin}
              className="mt-6 w-full text-center text-xs text-[#58534e] opacity-70 hover:opacity-100 hover:text-[#125e4c] transition-all tracking-widest"
            >
              ログイン画面に戻る
            </button>
          </>
        )}
      </div>
    </div>
  )
}
