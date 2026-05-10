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
    <div className="w-full bg-[#faf9f6]/90 backdrop-blur-xl rounded-[40px] shadow-[0_32px_80px_rgba(18,94,76,0.05)] border border-white/80 px-8 py-12 transition-all">

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-left">
          <label className="block text-[12px] font-medium text-[#58534e] mb-2 tracking-[0.2em] uppercase">お名前</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-[#dcd6cd] rounded-xl px-5 py-4 text-[15px] text-[#1d1d1f] placeholder-[#b8b3aa] bg-white/50 outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] focus:bg-white transition-all duration-500"
            placeholder="山田 太郎"
          />
        </div>

        <div className="text-left">
          <label className="block text-[12px] font-medium text-[#58534e] mb-2 tracking-[0.2em] uppercase">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-[#dcd6cd] rounded-xl px-5 py-4 text-[15px] text-[#1d1d1f] placeholder-[#b8b3aa] bg-white/50 outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] focus:bg-white transition-all duration-500"
            placeholder="example@mail.com"
          />
        </div>

        <div className="text-left">
          <label className="block text-[12px] font-medium text-[#58534e] mb-2 tracking-[0.2em] uppercase">お問い合わせ内容</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-[#dcd6cd] rounded-xl px-5 py-4 text-[15px] text-[#1d1d1f] placeholder-[#b8b3aa] bg-white/50 outline-none focus:ring-1 focus:ring-[#125e4c] focus:border-[#125e4c] focus:bg-white transition-all duration-500 resize-none"
            placeholder="ご質問・ご要望をご記入ください"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full font-medium py-4 rounded-[100px] text-[15px] tracking-[0.3em] transition-all duration-500 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(18,94,76,0.1)] cursor-pointer active:scale-[0.99]"
          style={{ 
            background: 'rgba(18, 94, 76, 0.08)',
            color: '#1a2522',
            border: '1px solid rgba(18, 94, 76, 0.25)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {status === 'loading' ? '送信中...' : '送 信 す る'}
        </button>
      </form>
    </div>
  )
}
