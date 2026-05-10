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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="light-ambient-wrapper">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(18,94,76,0.05)] border border-white/60 px-8 py-10">
        {success ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold tracking-widest text-[#125e4c] mb-2 font-serif">パスワードを変更しました</p>
            <p className="text-sm text-[#58534e] opacity-60 tracking-wider">ログイン画面に移動します...</p>
          </div>
        ) : !ready ? (
          <div className="text-center py-4">
            <p className="text-sm text-[#58534e] tracking-wider">リンクを確認中...</p>
            <p className="text-xs text-[#58534e] opacity-50 mt-3">
              このページはパスワードリセットメールのリンクからのみアクセスできます。
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold tracking-widest text-[#1d1d1f] font-serif">新しいパスワードを設定</h2>
              <p className="text-xs text-[#58534e] mt-2 opacity-70 tracking-wider">6文字以上で入力してください</p>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-widest text-[#58534e] mb-2">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-[#dcd6cd] rounded-xl px-4 py-3 text-sm bg-white/60 backdrop-blur-sm outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] transition-all duration-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-widest text-[#58534e] mb-2">確認用パスワード</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? '変更中...' : 'パスワードを変更する'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
