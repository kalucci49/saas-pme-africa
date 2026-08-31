'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A11 11 0 0 1 12 5c7 0 11 7 11 7a13.2 13.2 0 0 1-3.4 4.1M6.6 6.6C3.7 8.4 1 12 1 12s4 7 11 7a10.6 10.6 0 0 0 4.4-.9" />
      <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24Z" />
      <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.4l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
    </svg>
  )
}

export default function SignupPage() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: companyName },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleGoogleSignup() {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border border-[#E4DFD3] bg-white px-3.5 py-2.5 font-[family-name:var(--font-body)] text-[15px] text-[#12211D] outline-none transition focus:border-[#1B4B43] focus:ring-1 focus:ring-[#1B4B43]'

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#12211D] to-[#1B4B43] p-12 text-[#FAF7F2] lg:flex">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 400 800"
          fill="none"
        >
          <circle cx="60" cy="120" r="3" fill="#FAF7F2" />
          <circle cx="180" cy="220" r="3" fill="#FAF7F2" />
          <circle cx="90" cy="340" r="3" fill="#FAF7F2" />
          <circle cx="260" cy="140" r="3" fill="#FAF7F2" />
          <circle cx="320" cy="380" r="3" fill="#FAF7F2" />
          <circle cx="150" cy="520" r="3" fill="#FAF7F2" />
          <circle cx="60" cy="640" r="3" fill="#FAF7F2" />
          <circle cx="300" cy="700" r="3" fill="#FAF7F2" />
          <line x1="60" y1="120" x2="180" y2="220" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="180" y1="220" x2="90" y2="340" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="180" y1="220" x2="260" y2="140" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="90" y1="340" x2="320" y2="380" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="90" y1="340" x2="150" y2="520" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="150" y1="520" x2="60" y2="640" stroke="#FAF7F2" strokeWidth="1" />
          <line x1="150" y1="520" x2="300" y2="700" stroke="#FAF7F2" strokeWidth="1" />
        </svg>

        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A536] font-[family-name:var(--font-display)] text-sm font-semibold text-[#12211D]">
            P
          </div>
          <span className="font-[family-name:var(--font-body)] text-sm tracking-wide text-[#FAF7F2]/80">
            Pilotez votre PME
          </span>
        </div>

        <div className="relative max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.15] text-[#FAF7F2]">
            Vos factures, votre trésorerie et vos clients, réunis au même endroit.
          </h1>
          <p className="mt-5 font-[family-name:var(--font-body)] text-[15px] leading-relaxed text-[#FAF7F2]/70">
            Créez votre espace en quelques secondes et gardez une vision claire de votre activité, où que vous soyez.
          </p>
        </div>

        <p className="relative font-[family-name:var(--font-body)] text-xs text-[#FAF7F2]/50">
          Vos données restent isolées et privées à votre entreprise.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-[58%]">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#12211D] font-[family-name:var(--font-display)] text-sm font-semibold text-[#FAF7F2] lg:hidden">
            P
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-[#12211D]">
            Créer votre compte
          </h2>
          <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#12211D]/60">
            Déjà utilisateur ?{' '}
            <Link href="/login" className="text-[#1B4B43] underline underline-offset-2">
              Connectez-vous
            </Link>
          </p>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#E4DFD3] bg-white py-2.5 font-[family-name:var(--font-body)] text-[15px] font-medium text-[#12211D] transition hover:bg-[#F4F1EA]"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E4DFD3]" />
            <span className="font-[family-name:var(--font-body)] text-xs text-[#12211D]/40">ou</span>
            <div className="h-px flex-1 bg-[#E4DFD3]" />
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="companyName" className="font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D]">
                Nom de votre entreprise
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Ex. Boutique Awa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D]">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D]">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="6 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12211D]/40 transition hover:text-[#12211D]"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="font-[family-name:var(--font-body)] text-sm font-medium text-[#12211D]">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Retapez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#12211D]/40 transition hover:text-[#12211D]"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[#B3431E]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#12211D] py-3 font-[family-name:var(--font-body)] text-[15px] font-medium text-[#FAF7F2] transition-all active:scale-[0.98] hover:bg-[#1B4B43] disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              )}
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
