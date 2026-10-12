export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__brand">
          <h2>籽灵 <span>ZI LING</span></h2>
          <p>诞生于枣庄石榴文化沃土上的中华民族共同体 IP</p>
        </div>
        <div className="footer__contact">
          <p className="footer__label">IP 授权 · 联合开发 · 文创合作</p>
          <a className="btn btn--solid" href="mailto:myjhkgl@163.com">联系我们</a>
          <p className="footer__mail">myjhkgl@163.com</p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 籽灵 IP 工作室 · 枣庄</span>
        <span>籽籽同心 · 多元一体</span>
      </div>
    </footer>
  )
}
