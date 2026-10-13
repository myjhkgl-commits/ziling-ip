/* ============================================================
   全站脚本：导航 / 页脚注入、字号、来源引用弹窗、全局检索
   注意：import 路径以本文件 URL 为基准解析，因此各页无论位于
        多深一层，都能用同一份 app.js。
   ============================================================ */

import { SITE, SOURCES, NUMS, SITES } from '../../data/site.js'
import { TIMELINE } from '../../data/history.js'
import { PAPERS } from '../../data/papers.js'

const ROOT = document.body.dataset.root || ''
const HERE = document.body.dataset.page || ''
const u = (p) => ROOT + p

/* ---------------- 导航 ---------------- */
function buildNav() {
  const host = document.querySelector('[data-nav]')
  if (!host) return
  const cur = document.body.dataset.page || 'home'
  host.innerHTML = `
    <nav class="topnav" aria-label="主导航">
      <div class="navbar">
        <a class="brand" href="${u('')}index.html">
          <b>${SITE.short}</b><span>信息库</span>
        </a>
        <div class="navlinks" id="navLinks">
          ${SITE.nav.map((n) => `
            <a href="${u(n.path)}index.html"${n.key === cur ? ' aria-current="page"' : ''}>${n.label}</a>
          `).join('')}
        </div>
        <div class="navtools">
          <a class="navout" href="${SITES[0].url}" target="_blank" rel="noopener">
            ${SITES[0].label}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.6 3.4H3.2a1 1 0 0 0-1 1v5.4a1 1 0 0 0 1 1h5.4a1 1 0 0 0 1-1V8.5"/><path d="M7.8 2.6h2.6v2.6"/><path d="M10.6 2.4 6.1 6.9"/></svg>
          </a>
          <button class="navsearch" id="searchOpen" aria-label="打开检索">
            检索全库 <kbd>/</kbd>
          </button>
          <button class="iconbtn" id="fsBtn" aria-label="切换正文字号" aria-pressed="false" title="正文字号">Aa</button>
          <button class="iconbtn" id="navToggle" aria-label="展开导航" aria-expanded="false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <path d="M2 4.5h12M2 8h12M2 11.5h12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>`

  const toggle = document.getElementById('navToggle')
  const links = document.getElementById('navLinks')
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open')
    toggle.setAttribute('aria-expanded', String(open))
  })
  links?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') links.classList.remove('open')
  })
}

/* ---------------- 页脚 ---------------- */
function buildFoot() {
  const host = document.querySelector('[data-foot]')
  if (!host) return
  host.innerHTML = `
    <footer class="sitefoot">
      <div class="wrap">
        <div class="grid">
          <div>
            <h4>${SITE.short}</h4>
            <p>${SITE.tagline}<br>${SITE.en}</p>
            <p class="tiny">本库所有数据均可溯源：页面上每一个 [来源] 标记都可点开查看完整引用。</p>
          </div>
          <div>
            <h4>目录</h4>
            <ul>${SITE.nav.map((n) => `<li><a href="${u(n.path)}index.html">${n.label} · ${n.sub}</a></li>`).join('')}</ul>
          </div>
          <div>
            <h4>相关站点</h4>
            <ul>${SITES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a><br><span class="tiny" style="color:var(--ink-3)">${s.desc}</span></li>`).join('')}</ul>
          </div>
          <div>
            <h4>更新与维护</h4>
            <ul>
              <li>最后整理：2026-10-13</li>
              <li>文献收录：${PAPERS.length} 条</li>
              <li>时间轴节点：${TIMELINE.length} 条</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>`
}

/* ---------------- 字号 ---------------- */
const FS_ORDER = ['', 's', 'l']
const FS_LABEL = { '': '标准', s: '小', l: '大' }
function initFontSize() {
  const btn = document.getElementById('fsBtn')
  if (!btn) return
  let cur = localStorage.getItem('glyz-fs') || ''
  const apply = () => {
    if (cur) document.documentElement.dataset.fs = cur
    else delete document.documentElement.dataset.fs
    btn.setAttribute('aria-pressed', String(!!cur))
    btn.title = `正文字号：${FS_LABEL[cur]}`
  }
  apply()
  btn.addEventListener('click', () => {
    cur = FS_ORDER[(FS_ORDER.indexOf(cur) + 1) % FS_ORDER.length]
    localStorage.setItem('glyz-fs', cur)
    apply()
  })
}

/* ---------------- 来源引用弹窗 ---------------- */
function initSourceDialog() {
  let dlg = document.getElementById('srcDlg')
  if (!dlg) {
    dlg = document.createElement('dialog')
    dlg.id = 'srcDlg'
    dlg.className = 'srcdlg'
    dlg.innerHTML = `
      <div class="dlghead"><h3 id="srcDlgTitle">来源</h3>
        <button class="iconbtn" data-close aria-label="关闭">
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>
        </button>
      </div>
      <div class="dlgbody" id="srcDlgBody"></div>`
    document.body.appendChild(dlg)
    dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close())
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close() })
  }
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.srcchip')
    if (!chip) return
    const keys = (chip.dataset.src || '').split(',').map((s) => s.trim()).filter(Boolean)
    const items = keys.map((k) => SOURCES[k]).filter(Boolean)
    if (!items.length) return
    document.getElementById('srcDlgTitle').textContent =
      items.length === 1 ? items[0].label : `来源（${items.length} 条）`
    document.getElementById('srcDlgBody').innerHTML = items.map((s) => `
      <p class="cite">${s.cite}</p>
      <p>${s.note || ''}</p>
      <p class="tiny">类型：${s.kind || '—'}</p>`).join('<hr style="border:none;border-top:1px solid var(--line);margin:1rem 0">')
    dlg.showModal()
  })
}

/* ---------------- 全局检索 ---------------- */
function buildIndex() {
  const idx = []
  const strip = (s) => (s || '').replace(/\[[^\]]*\]/g, '')
  TIMELINE.forEach((t) => idx.push({
    title: `${t.title}`,
    sub: `历史篇 · ${t.yearLabel}`,
    href: `${u('history/')}index.html#ev-${t.id}`,
    text: `${t.title} ${t.teaser} ${t.body.join(' ')} ${t.era}`,
    tag: '历史篇',
  }))
  PAPERS.forEach((p) => idx.push({
    title: p.cite.split('.')[0] || p.cite.slice(0, 24),
    sub: `文献库 · ${p.kind}${p.status === '出处待补' ? '（出处待补）' : ''}`,
    href: `${u('papers/')}index.html#${p.id}`,
    text: `${p.cite} ${(p.tags || []).join(' ')} ${p.note}`,
    tag: '文献库',
  }))
  NUMS.forEach((n) => idx.push({
    title: `${n.v}${n.u} —— ${n.t}`,
    sub: '数据 · 全库引用',
    href: `${u('')}index.html`,
    text: `${n.v} ${n.u} ${n.t}`,
    tag: '数据',
  }))
  SITE.nav.forEach((n) => idx.push({
    title: `${n.label} · ${n.sub}`,
    sub: '篇章',
    href: `${u(n.path)}index.html`,
    text: `${n.label} ${n.sub}`,
    tag: '导航',
  }))
  return idx.map((e) => ({ ...e, hay: (e.title + ' ' + e.text).toLowerCase() }))
}

function initSearch() {
  const box = document.createElement('div')
  box.className = 'searchbox'
  box.id = 'searchBox'
  box.innerHTML = `
    <div class="scrim" data-x></div>
    <div class="panel">
      <input id="searchInput" type="search" placeholder="检索全库：品种、年代、数字、文献……" aria-label="检索全库">
      <div class="hits" id="searchHits"><div class="empty">输入关键词，或试试「盆景」「523」「匡衡」「若榴」。</div></div>
    </div>`
  document.body.appendChild(box)

  const input = box.querySelector('#searchInput')
  const hits = box.querySelector('#searchHits')
  const index = buildIndex()

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const mark = (s, q) => {
    if (!q) return esc(s)
    const i = s.toLowerCase().indexOf(q)
    if (i < 0) return esc(s)
    return esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length))
  }
  const run = () => {
    const q = input.value.trim().toLowerCase()
    if (!q) {
      hits.innerHTML = '<div class="empty">输入关键词，或试试「盆景」「523」「匡衡」「若榴」。</div>'
      return
    }
    const found = index.filter((e) => e.hay.includes(q)).slice(0, 30)
    hits.innerHTML = found.length
      ? found.map((e) => `<a class="hit" href="${e.href}">
          <b>${mark(e.title, q)}</b><span>${esc(e.sub)}</span></a>`).join('')
      : `<div class="empty">没有匹配「${esc(input.value)}」的条目。可能是这篇还没写，也可能该补进库里。</div>`
  }
  const open = () => { box.classList.add('open'); input.value = ''; run(); input.focus() }
  const close = () => box.classList.remove('open')

  document.getElementById('searchOpen')?.addEventListener('click', open)
  box.querySelector('[data-x]').addEventListener('click', close)
  box.addEventListener('click', (e) => { if (e.target.closest('.hit')) close() })
  input.addEventListener('input', run)
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); open()
    } else if (e.key === 'Escape') close()
  })
}

/* ---------------- 滚动入场 ---------------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal')
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in')); return
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
  els.forEach((el) => io.observe(el))
}

buildNav()
buildFoot()
initFontSize()
initSourceDialog()
initSearch()
initReveal()
