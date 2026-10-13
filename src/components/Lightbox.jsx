import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// 全站图片放大查看（Lightbox）
// 用法：
//   const { openAt } = useLightbox()
//   openAt([{ src, alt, caption }], 0)
const LightboxContext = createContext(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox 必须在 <LightboxProvider> 内使用')
  return ctx
}

export function LightboxProvider({ children }) {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const open = items.length > 0

  const openAt = useCallback((list, start = 0) => {
    const arr = (Array.isArray(list) ? list : [list])
      .filter((it) => it && it.src)
      .map((it) => (typeof it === 'string' ? { src: it } : it))
    if (!arr.length) return
    setItems(arr)
    setIndex(Math.min(Math.max(start, 0), arr.length - 1))
  }, [])

  const close = useCallback(() => setItems([]), [])

  return (
    <LightboxContext.Provider value={{ openAt, close }}>
      {children}
      {open && (
        <LightboxView
          items={items}
          index={index}
          onIndex={setIndex}
          onClose={close}
        />
      )}
    </LightboxContext.Provider>
  )
}

function LightboxView({ items, index, onIndex, onClose }) {
  const total = items.length
  const current = items[index]

  const [zoomed, setZoomed] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)

  const drag = useRef(null)
  const swipe = useRef(null)

  const go = useCallback(
    (delta) => {
      if (total < 2) return
      setZoomed(false)
      setOffset({ x: 0, y: 0 })
      setLoaded(false)
      onIndex((index + delta + total) % total)
    },
    [index, total, onIndex],
  )

  // 打开时锁背景滚动（退出时还原，避免关掉弹窗后页面被解锁）
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // 键盘：Esc 关闭、左右切换、+/- 缩放
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '0') {
        setZoomed(false)
        setOffset({ x: 0, y: 0 })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // 预加载相邻图，切换时不闪
  useEffect(() => {
    if (total < 2) return
    ;[1, -1].forEach((d) => {
      const it = items[(index + d + total) % total]
      if (it) {
        const img = new Image()
        img.src = it.src
      }
    })
  }, [index, items, total])

  const toggleZoom = (e) => {
    e.stopPropagation()
    const next = !zoomed
    setZoomed(next)
    if (!next) setOffset({ x: 0, y: 0 })
  }

  // 缩放后拖拽平移
  const onPointerDown = (e) => {
    if (!zoomed) return
    drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y })
  }
  const onPointerUp = () => {
    drag.current = null
  }

  // 未缩放时左右滑动切图
  const onTouchStart = (e) => {
    if (zoomed || total < 2) return
    const t = e.touches[0]
    swipe.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const s = swipe.current
    swipe.current = null
    if (!s || zoomed || total < 2) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="图片查看"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox__count">
          {total > 1 ? `${index + 1} / ${total}` : ''}
        </span>
        <button className="lightbox__btn" onClick={onClose} aria-label="关闭">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </div>

      <div className="lightbox__stage">
        <img
          key={current.src}
          className={`lightbox__img ${zoomed ? 'is-zoomed' : ''} ${loaded ? 'is-loaded' : ''}`}
          src={current.src}
          alt={current.alt || ''}
          draggable="false"
          decoding="async"
          style={zoomed ? { transform: `translate(${offset.x}px, ${offset.y}px) scale(2.2)` } : undefined}
          onClick={toggleZoom}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLoad={() => setLoaded(true)}
        />

        {!loaded && <span className="lightbox__spinner" aria-hidden="true" />}

        {total > 1 && (
          <>
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              aria-label="上一张"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              aria-label="下一张"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          </>
        )}
      </div>

      {(current.caption || total > 1) && (
        <div className="lightbox__foot" onClick={(e) => e.stopPropagation()}>
          {current.caption && <p className="lightbox__caption">{current.caption}</p>}
          <p className="lightbox__hint">
            {total > 1 ? '左右滑动切换 · ' : ''}
            点击图片放大，再点还原
          </p>
        </div>
      )}
    </div>
  )
}
