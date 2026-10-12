export default function Hero() {
  return (
    <section className="hero" id="hero">
      <video
        className="hero__video"
        src="video/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
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
