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

export default function MainIP() {
  return (
    <section className="section mainip" id="ziling">
      <div className="container">
        <header className="section__head reveal">
          <span className="section__index">02</span>
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
            她一声呼唤，55 个身着各民族华服的籽灵伙伴破土而出，手拉手、肩并肩，
            围成紧实的圆——光芒交汇处，一颗饱满的石榴缓缓凝成。
          </p>
          <footer>籽籽同心，多元一体</footer>
        </div>

        <div className="mainip__grid">
          {CARDS.map((c) => (
            <figure key={c.src} className={`mcard reveal ${c.tall ? 'mcard--tall' : ''} ${c.fit ? 'mcard--fit' : ''}`}>
              <img src={c.src} alt={c.title} loading="lazy" draggable="false" />
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
