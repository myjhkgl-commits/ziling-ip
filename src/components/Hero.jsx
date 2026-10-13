import { useEffect, useState } from 'react'

// 三档片源，按屏幕选最省的那一个：
//   ≥1025px        1920×1080  （桌面宽屏）
//   ≤1024px        1280×720   （平板 / 小笔记本 / 手机横屏）
//   ≤900px 且竖屏  720×1280   （手机竖屏，5MB → 3.3MB）
const WIDE = { src: 'video/hero.mp4', poster: 'video/hero-poster.jpg' }
const MID = { src: 'video/hero-720.mp4', poster: 'video/hero-720-poster.jpg' }
const PORTRAIT = { src: 'video/hero-mobile.mp4', poster: 'video/hero-mobile-poster.jpg' }

const MQ_PORTRAIT = '(max-width: 900px) and (orientation: portrait)'
const MQ_MID = '(max-width: 1024px)'

function pickAsset() {
  if (typeof window === 'undefined') return WIDE
  if (window.matchMedia(MQ_PORTRAIT).matches) return PORTRAIT
  if (window.matchMedia(MQ_MID).matches) return MID
  return WIDE
}

// 弱网 / 省流量模式：直接用首帧静图，不拉视频
function isSlowNetwork() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!conn) return false
  if (conn.saveData) return true
  return /(^|-)2g$/.test(conn.effectiveType || '')
}

export default function Hero() {
  const [asset, setAsset] = useState(pickAsset)
  const [withVideo, setWithVideo] = useState(false) // 弱网下始终为 false
  const [playing, setPlaying] = useState(false)

  // 屏幕方向 / 宽度变化时换片源
  useEffect(() => {
    const mqs = [MQ_PORTRAIT, MQ_MID].map((q) => window.matchMedia(q))
    const sync = () => setAsset(pickAsset())
    mqs.forEach((m) => m.addEventListener('change', sync))
    return () => mqs.forEach((m) => m.removeEventListener('change', sync))
  }, [])

  // 关键：先渲染首帧静态图（100 多 KB，立刻可见），
  // 等页面 load 完 + 空闲时段再挂 <video>，视频在后面慢慢缓冲。
  // 这样首屏绘制完全不被 3~5MB 的视频拖住。
  //
  // 两个额外的克制条件（都是"别和民族列表抢带宽"）：
  //   1) 用户如果立刻往下滑（说明对首屏动画没兴趣），就不挂视频了；
  //   2) 挂上后视频一旦播完一轮就暂停，省掉后台无意义的流量消耗。
  useEffect(() => {
    if (isSlowNetwork()) return
    let idleId = null
    let timer = null
    let cancelled = false

    const attach = () => {
      if (cancelled) return
      // 已经滑过首屏：用户在看别的内容，不必再拉 3MB 视频
      if (window.scrollY > window.innerHeight * 0.75) return
      setWithVideo(true)
    }
    const schedule = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(attach, { timeout: 2200 })
      else timer = setTimeout(attach, 400)
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
      if (idleId !== null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      {/* 首帧：始终渲染，充当视频未就绪时的背景 */}
      <img
        className="hero__video hero__poster"
        src={asset.poster}
        alt=""
        draggable="false"
        fetchpriority="high"
        decoding="async"
      />

      {withVideo && (
        <video
          key={asset.src}
          className={`hero__video hero__video--live ${playing ? 'is-playing' : ''}`}
          src={asset.src}
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          // 播完一轮就停：首屏动画已经交代清楚，不必持续占用带宽
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            if (v.duration && v.currentTime > v.duration - 0.35) {
              v.pause()
              v.currentTime = 0
            }
          }}
        />
      )}

      <div className="hero__veil" />
      <div className="hero__content container">
        <p className="hero__eyebrow">中华民族共同体 IP</p>
        <h1 className="hero__title">
          <span className="hero__title-cn">籽灵</span>
          <span className="hero__title-en">ZI&nbsp;LING</span>
        </h1>
        <p className="hero__tagline">一颗籽的千年之约</p>
        <p className="hero__desc">
          千年沃土，一颗石榴，56 粒籽。<br />
          一颗籽虽小，合在一起便是石榴；56 个民族各美其美，聚在一起便是中华。
        </p>
        <div className="hero__actions">
          <a className="btn btn--solid" href="#ziling">认识籽灵</a>
          <a className="btn btn--ghost" href="#ethnics">探索 56 个民族伙伴</a>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
