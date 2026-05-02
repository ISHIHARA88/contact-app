import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function DetailModal({ inquiry, onClose, onMarkDone, onDelete }) {
  if (!inquiry) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-animate"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">お問い合わせ詳細</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">名前</p>
            <p className="text-gray-800 font-semibold">{inquiry.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">メールアドレス</p>
            <p className="text-gray-600 break-all">{inquiry.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">内容</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">送信日時</p>
              <p className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleString('ja-JP')}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                inquiry.status === 'done'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {inquiry.status === 'done' ? '完了' : '未対応'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          {inquiry.status !== 'done' && (
            <button
              onClick={() => onMarkDone(inquiry.id)}
              className="flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              完了にする
            </button>
          )}
          <button
            onClick={() => onDelete(inquiry.id)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchInquiries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setInquiries(data)
    setLoading(false)
  }

  const markAsDone = async (id) => {
    await supabase.from('inquiries').update({ status: 'done' }).eq('id', id)
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'done' } : prev)
    fetchInquiries()
  }

  const deleteInquiry = async (id) => {
    if (!window.confirm('本当に削除しますか？')) return
    await supabase.from('inquiries').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    fetchInquiries()
  }

  useEffect(() => { fetchInquiries() }, [])

  return (
    <>
      <DetailModal
        inquiry={selected}
        onClose={() => setSelected(null)}
        onMarkDone={markAsDone}
        onDelete={deleteInquiry}
      />

      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">お問い合わせ一覧</h2>
          <p className="text-sm text-gray-400 mt-1">新しい順に表示しています</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-sm text-gray-400">お問い合わせはまだありません。</p>
        ) : (
          <>
            {/* デスクトップ: テーブル表示 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="pb-3 pr-4 font-semibold">名前</th>
                    <th className="pb-3 pr-4 font-semibold">メールアドレス</th>
                    <th className="pb-3 pr-4 font-semibold">内容</th>
                    <th className="pb-3 pr-4 font-semibold">ステータス</th>
                    <th className="pb-3 font-semibold">送信日時</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="border-b border-gray-50 hover:bg-violet-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 pr-4 font-semibold text-gray-800 whitespace-nowrap">{item.name}</td>
                      <td className="py-3.5 pr-4 text-gray-500 whitespace-nowrap">{item.email}</td>
                      <td className="py-3.5 pr-4 text-gray-500 max-w-xs truncate">{item.message}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'done'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status === 'done' ? '完了' : '未対応'}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-300 mt-3 text-center">行をクリックすると詳細が表示されます</p>
            </div>

            {/* スマホ: カード表示 */}
            <div className="md:hidden space-y-3">
              {inquiries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="border border-gray-100 rounded-xl p-4 hover:bg-violet-50/40 active:bg-violet-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-800 leading-snug">{item.name}</p>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'done'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status === 'done' ? '完了' : '未対応'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{item.email}</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(item.created_at).toLocaleString('ja-JP')}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
