import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ShieldCheck, FileText } from 'lucide-react'

interface LegalSection {
  heading: string
  body: string
}

interface Props {
  initialTab: 'privacy' | 'terms'
  onClose: () => void
}

export function LegalModal({ initialTab, onClose }: Props) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'privacy' | 'terms'>(initialTab)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const sections = t(`legal.${tab}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#18181f] shrink-0">
          <div className="flex items-center gap-2 text-violet-400">
            {tab === 'privacy' ? <ShieldCheck size={18} /> : <FileText size={18} />}
            <h2 className="font-bold text-sm text-white tracking-tight uppercase">
              {t(`legal.${tab}.title`)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={t('legal.close')}
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex bg-[#18181f] px-6 py-2 border-b border-white/5 gap-5 shrink-0 select-none">
          <button
            onClick={() => setTab('privacy')}
            className={`pb-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border-b-2 tracking-wider ${
              tab === 'privacy'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t('legal.privacyLink')}
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`pb-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border-b-2 tracking-wider ${
              tab === 'terms'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t('legal.termsLink')}
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {sections.map((section, i) => (
            <section key={i}>
              <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-1.5">
                {section.heading}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="px-6 py-3 border-t border-white/5 bg-[#18181f] shrink-0">
          <p className="text-[10px] text-zinc-600">{t('legal.lastUpdated')}</p>
        </footer>
      </div>
    </div>
  )
}
