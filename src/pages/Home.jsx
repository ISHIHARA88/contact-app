import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <div className="relative min-h-screen px-4 py-20 flex items-center justify-center overflow-hidden">
      {/* Ambient Glow Backdrop system matches LP */}
      <div className="light-ambient-wrapper">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full mx-auto text-center">
        <h1 className="text-[32px] md:text-[36px] font-[200] mb-10 tracking-[0.35em] text-[#1a2522]" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          お問い合わせ
        </h1>
        <ContactForm />
        
        <p className="mt-12 text-sm text-[#58534e] tracking-widest opacity-60 font-serif">
          &copy; 2026 粋清 SUISEI
        </p>
      </div>
    </div>
  )
}
