import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-16 flex items-center justify-center" style={{ background: '#e8e5df' }}>
      <div className="max-w-md w-full mx-auto text-center">
        <h1 className="text-4xl font-[400] mb-8 tracking-[0.25em] text-[#1d1d1f]" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          お問い合わせ
        </h1>
        <ContactForm />
      </div>
    </div>
  )
}
