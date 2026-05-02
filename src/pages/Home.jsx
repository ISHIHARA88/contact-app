import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-12" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-10 tracking-tight text-center" style={{ color: 'white' }}>
          お問い合わせ
        </h1>
        <ContactForm />
      </div>
    </div>
  )
}
