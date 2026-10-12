import { useEffect, useState, useCallback } from 'react'
import { ethnics, assetOf, POSTER_MISSING } from '../data/ethnics'
import EthnicModal from './EthnicModal'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function EthnicSection() {
  const [active, setActive] = useState(null)

  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    if (active == null) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close])

  const item = active != null ? ethnics.find((e) => e.n === active) : null

  return (
    <section className="section ethnics" id="ethnics">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index">02</span>
          <div>
            <h2 className="section__title">五十六粒籽 · 同心一颗榴</h2>
            <p className="section__sub">
              籽灵一声呼唤，56 位身着各民族华服的伙伴破土而出。
              每一粒籽都有自己的名字——点击卡片，认识它们。
            </p>
          </div>
        </header>

        <div className="ethnics__grid">
          {ethnics.map((e) => (
            <button
              key={e.n}
              type="button"
              className="ecard reveal"
              onClick={() => setActive(e.n)}
            >
              <span className="ecard__num">{pad(e.n)}</span>
              <div className="ecard__stage">
                <img
                  src={assetOf(e.n, 'avatar')}
                  alt={`${e.name}籽灵形象`}
                  loading="lazy"
                  draggable="false"
                />
              </div>
              <div className="ecard__meta">
                <span className="ecard__ip">{e.ip}</span>
                <span className="ecard__name">{e.name}</span>
              </div>
              <span className="ecard__tag">{e.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {item && (
        <EthnicModal
          item={item}
          posterMissing={POSTER_MISSING.has(item.n)}
          onClose={close}
        />
      )}
    </section>
  )
}
