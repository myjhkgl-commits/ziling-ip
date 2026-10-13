import { useLightbox } from './Lightbox'

const CARDS = [
  {
    src: 'img/main/sanshi.webp',
    title: '三视图设定',
    desc: '正视 / 侧视 / 背视 —— 头戴石榴冠、叶翼轻张，造型全维度定稿。',
    tall: true,
    fit: true,
  },
  {
    src: 'img/main/ziling.jpg',
    title: '主形象',
    desc: '石榴冠下的一粒籽，绿眸里的螺旋，是种子破土时的漩涡。',
  },
  {
    src: 'img/main/scene-cart.webp',
    title: '榴园奇遇',
    desc: '推着满车石榴走过千年果园，故事从这里开始。',
    fit: true,
  },
  {
    src: 'img/main/blindbox.webp',
    title: '盲盒 · 榴籽派对',
    desc: '56 款常规 + 5 款隐藏，盲盒系列设计延展。',
  },
  {
    src: 'img/main/merch.webp',
    title: '周边产品',
    desc: '从徽章到抱枕，籽灵走进日常。',
  },
  {
    src: 'img/main/emoji.webp',
    title: '表情包',
    desc: '小小籽灵，表情万千。',
  },
]

// 供放大查看的图集（顺序与卡片一致）
const SHOTS = CARDS.map((c) => ({ src: c.src, alt: c.title, caption: c.title }))

export default function MainIP() {
  const { openAt } = useLightbox()

  return (
    <section className="section mainip" id="ziling">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index">01</span>
          <div>
            <h2 className="section__title">主 IP · 籽灵</h2>
            <p className="section__sub">
              在枣庄古石榴园的晨光里，一颗晶莹的石榴籽悄然落入大地，
              汲取千年文化的记忆，破土化身为灵——她叫籽灵。
            </p>
          </div>
        </header>

        <div className="mainip__quote reveal">
          <p>
            她一声呼唤，56 个身着各民族华服的籽灵伙伴破土而出，手拉手、肩并肩，
            围成紧实的圆——光芒交汇处，一颗饱满的石榴缓缓凝成。
          </p>
          <footer>籽籽同心，多元一体</footer>
        </div>

        <p className="section__hint">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          点击任意图片可放大查看
        </p>

        <div className="mainip__grid">
          {CARDS.map((c, i) => (
            <figure
              key={c.src}
              className={`mcard reveal ${c.tall ? 'mcard--tall' : ''} ${c.fit ? 'mcard--fit' : ''} mcard--zoom`}
              role="button"
              tabIndex={0}
              aria-label={`放大查看：${c.title}`}
              onClick={() => openAt(SHOTS, i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openAt(SHOTS, i)
                }
              }}
            >
              <img src={c.src} alt={c.title} loading="lazy" decoding="async" draggable="false" />
              <span className="zoom-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path
                    d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
              <figcaption>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
