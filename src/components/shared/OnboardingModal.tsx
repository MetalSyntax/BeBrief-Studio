import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutTemplate, Palette, Download, ShieldCheck, ArrowRight, ArrowLeft, X } from 'lucide-react'

export const ONBOARDING_STORAGE_KEY = 'bbb_onboarding_completed'

interface Props {
  onClose: () => void
}

const STEP_ICONS = [LayoutTemplate, Palette, Download, ShieldCheck]

export function OnboardingModal({ onClose }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const steps = t('onboarding.steps', { returnObjects: true }) as Array<{ title: string; body: string }>
  const isLast = step === steps.length - 1
  const Icon = STEP_ICONS[step] || STEP_ICONS[0]

  const finish = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={finish}
    >
      <div
        className="w-full max-w-lg bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-8 pt-10 pb-8 flex flex-col items-center text-center">
          <button
            onClick={finish}
            aria-label={t('onboarding.skip')}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
            <Icon size={26} />
          </div>

          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {steps[step]?.title}
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            {steps[step]?.body}
          </p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-5">
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`${t('onboarding.stepIndicator')} ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-violet-500' : 'w-1.5 bg-white/15 hover:bg-white/25'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-all"
            >
              <ArrowLeft size={13} /> {t('onboarding.back')}
            </button>

            {isLast ? (
              <button
                onClick={finish}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {t('onboarding.start')}
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {t('onboarding.next')} <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
