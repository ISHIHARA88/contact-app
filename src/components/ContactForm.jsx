import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 8000)
      )
      const { error } = await Promise.race([
        supabase.from('inquiries').insert([
          { name: form.name, email: form.email, message: form.message },
        ]),
        timeout,
      ])

      if (error) throw error

      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur rounded-2xl shadow-xl px-8 py-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">お問い合わせフォーム</h2>
        <p className="text-sm text-gray-400 mt-1">内容を入力して送信してください</p>
      </div>

      {status === 'success' && (
        <p className="mb-5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-left">
          送信が完了しました。ありがとうございます！
        </p>
      )}
      {status === 'error' && (
        <p className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
          送信に失敗しました。もう一度お試しください。
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">名前</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-gray-50"
            placeholder="山田 太郎"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-gray-50"
            placeholder="example@mail.com"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">お問い合わせ内容</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-gray-50 resize-none"
            placeholder="ご質問・ご要望をご記入ください"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
        >
          {status === 'loading' ? '送信中...' : '送信する'}
        </button>
      </form>
    </div>
  )
}
