import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#hero', label: '首页' },
  { href: '#ethnics', label: '五十六粒籽' },
  { href: '#ziling', label: '主 IP · 籽灵' },
  { href: '#contact', label: '联系我们' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#hero" className="nav__brand">
          <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
            <circle cx="16" cy="18" r="11" fill="var(--red)" />
            <path d="M16 7c1.5-3 4-4 6-4-1 2-2 3-3 4.5" fill="none" stroke="#7d9a6f" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className="nav__brand-cn">籽灵</span>
          <span className="nav__brand-en">ZI&nbsp;LING</span>
        </a>
        <nav className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="btn btn--outline nav__cta" href="#contact">合作洽谈</a>
      </div>
    </header>
  )
}
