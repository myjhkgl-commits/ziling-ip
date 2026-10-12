import { useEffect } from 'react'
import { assetOf } from '../data/ethnics'

export default function EthnicModal({ item, posterMissing, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const pad = String(item.n).padStart(2, '0')

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="关闭">×</button>

        <div className="modal__left">
          <img
            className="modal__avatar"
            src={assetOf(item.n, 'avatar')}
            alt={`${item.name}籽灵形象`}
            draggable="false"
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
            <figure>
              <img
                src={assetOf(item.n, 'ref')}
                alt={`${item.name}参考形象`}
                loading="lazy"
                onError={(e) => { e.currentTarget.closest('figure').style.display = 'none' }}
              />
              <figcaption>参考形象</figcaption>
            </figure>
            {posterMissing ? (
              <figure>
                <img
                  src={assetOf(item.n, 'avatar')}
                  alt={`${item.name}籽灵形象`}
                  loading="lazy"
                  style={{ objectFit: 'contain', padding: '20px', boxSizing: 'border-box' }}
                />
                <figcaption>籽灵形象</figcaption>
              </figure>
            ) : (
              <figure>
                <img
                  src={assetOf(item.n, 'poster')}
                  alt={`${item.name}形象海报`}
                  loading="lazy"
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
