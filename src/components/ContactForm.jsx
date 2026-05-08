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
    <div className="w-full bg-[#faf9f6] rounded-[48px] shadow-[0_16px_48px_rgba(0,0,0,0.02)] border border-[#e5e4e7] px-10 py-12">

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
          <label className="block text-[14px] font-[500] text-[#58534e] mb-2 tracking-wider">お名前</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-[#e5e4e7] rounded-xl px-4 py-3 text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-1 focus:ring-[#f8b500] focus:border-[#f8b500] bg-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            placeholder="山田 太郎"
          />
        </div>

        <div className="text-left">
          <label className="block text-[14px] font-[500] text-[#58534e] mb-2 tracking-wider">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-[#e5e4e7] rounded-xl px-4 py-3 text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-1 focus:ring-[#f8b500] focus:border-[#f8b500] bg-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            placeholder="example@mail.com"
          />
        </div>

        <div className="text-left">
          <label className="block text-[14px] font-[500] text-[#58534e] mb-2 tracking-wider">お問い合わせ内容</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-[#e5e4e7] rounded-xl px-4 py-3 text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-1 focus:ring-[#f8b500] focus:border-[#f8b500] bg-white resize-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            placeholder="ご質問・ご要望をご記入ください"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full font-bold py-4 rounded-[50px] text-[16px] tracking-widest transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(248,181,0,0.3)] cursor-pointer"
          style={{ 
            background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 50%, #fceabb 100%)',
            color: '#3b2a24',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          {status === 'loading' ? '送信中...' : '送 信 す る'}
        </button>
      </form>
    </div>
  )
}
