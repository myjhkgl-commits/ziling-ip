import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#hero', label: '首页' },
  { href: '#ethnics', label: '五十六粒籽' },
  { href: '#ziling', label: '主 IP · 籽灵' },
  { href: '#contact', label: '联系我们' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 抽屉打开时锁定背景滚动 + Esc 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // 放大到桌面宽度时自动收起，避免状态残留
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner container">
        <a href="#hero" className="nav__brand" onClick={() => setOpen(false)}>
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

        <button
          type="button"
          className="nav__burger"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav__drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="nav__drawer-links">
          {LINKS.map((l) => (
            <a key={l.href} className="nav__drawer-link" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--solid" href="#contact" onClick={() => setOpen(false)}>合作洽谈</a>
      </div>
    </header>
  )
}
