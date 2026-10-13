import { useEffect } from 'react'
import { assetOf } from '../data/ethnics'
import { useLightbox } from './Lightbox'

export default function EthnicModal({ item, posterMissing, onClose }) {
  const { openAt } = useLightbox()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const pad = String(item.n).padStart(2, '0')

  const avatar = assetOf(item.n, 'avatar')
  const ref = assetOf(item.n, 'ref')
  const poster = posterMissing ? null : assetOf(item.n, 'poster')

  // 放大查看图集：形象 → 参考形象 → 海报
  const shots = [
    { src: avatar, alt: `${item.name}籽灵形象`, caption: `${item.name} · ${item.ip} 籽灵形象` },
    { src: ref, alt: `${item.name}参考形象`, caption: `${item.name} · 参考形象` },
  ]
  if (poster) shots.push({ src: poster, alt: `${item.name}形象海报`, caption: `${item.name} · 形象海报` })

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <span className="modal__grab" aria-hidden="true" />
        <button className="modal__close" onClick={onClose} aria-label="关闭">×</button>

        <div className="modal__left">
          <img
            className="modal__avatar zoomable"
            src={avatar}
            alt={`${item.name}籽灵形象`}
            draggable="false"
            decoding="async"
            onClick={() => openAt(shots, 0)}
          />
          <span className="modal__num">{pad}</span>
        </div>

        <div className="modal__right">
          <p className="modal__region">{item.region}</p>
          <h3 className="modal__name">
            {item.name}
            <span className="modal__ipname">「{item.ip}」</span>
          </h3>
          <p className="modal__tag">{item.tag}</p>

          <div className="modal__block">
            <h4>民族简介</h4>
            <p>{item.intro}</p>
          </div>

          <div className="modal__block">
            <h4>籽灵设计</h4>
            <p>{item.design}</p>
          </div>

          <div className="modal__gallery">
            <figure className="zoomable" onClick={() => openAt(shots, 1)}>
              <img
                src={ref}
                alt={`${item.name}参考形象`}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.closest('figure').style.display = 'none' }}
              />
              <figcaption>参考形象</figcaption>
            </figure>
            {posterMissing ? (
              <figure className="zoomable" onClick={() => openAt(shots, 0)}>
                <img
                  src={avatar}
                  alt={`${item.name}籽灵形象`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'contain', padding: '20px', boxSizing: 'border-box' }}
                />
                <figcaption>籽灵形象</figcaption>
              </figure>
            ) : (
              <figure className="zoomable" onClick={() => openAt(shots, 2)}>
                <img
                  src={poster}
                  alt={`${item.name}形象海报`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.closest('figure').style.display = 'none' }}
                />
                <figcaption>形象海报</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
