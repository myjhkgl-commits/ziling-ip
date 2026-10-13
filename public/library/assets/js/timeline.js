/* ============================================================
   历史篇 · 两千年时间轴组件
   双端同一份逻辑：桌面滚轮 / 箭头按钮 / 拖拽，手机原生滑动；
   触发方式不同，行为与信息完全一致（降级而非阉割）。
   ============================================================ */

import { TIMELINE } from '../../data/history.js'

const track = document.getElementById('tl')
if (track) init()

function init() {
  const rail = document.getElementById('tlRail')
  const num = document.getElementById('tlPos')

  track.innerHTML = TIMELINE.map((t, i) => `
    <article class="tlitem" id="ev-${t.id}" data-i="${i}" role="button" tabindex="0">
      <span class="yr">${t.year}</span>
      <h3>${t.title}</h3>
      <p>${t.teaser}</p>
      <span class="more">展开这条 →</span>
    </article>`).join('')

  rail.innerHTML = TIMELINE.map((t, i) =>
    `<b data-i="${i}" title="${t.yearLabel} ${t.title}"></b>`).join('') + '<i id="tlProg"></i>'

  const dots = [...rail.querySelectorAll('b')]
  const items = [...track.querySelectorAll('.tlitem')]
  const prog = document.getElementById('tlProg')

  const layoutRail = () => {
    dots.forEach((d, i) => { d.style.left = (items.length > 1 ? (i / (items.length - 1)) * 100 : 0) + '%' })
  }
  layoutRail()
  addEventListener('resize', layoutRail)

  function sync() {
    const max = track.scrollWidth - track.clientWidth
    const p = max > 0 ? track.scrollLeft / max : 0
    prog.style.width = (p * 100) + '%'
    const center = track.scrollLeft + track.clientWidth / 2
    let best = 0, bestD = Infinity
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center)
      if (d < bestD) { bestD = d; best = i }
      el.setAttribute('aria-current', 'false')
    })
    items[best]?.setAttribute('aria-current', 'true')
    dots.forEach((d, i) => d.classList.toggle('on', i <= best))
    if (num) num.textContent = `${String(best + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
  }
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true })
  sync()

  const step = (dir) => {
    const cur = items.findIndex((el) => el.getAttribute('aria-current') === 'true')
    const next = Math.min(items.length - 1, Math.max(0, cur + dir))
    items[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }
  document.getElementById('tlPrev')?.addEventListener('click', () => step(-1))
  document.getElementById('tlNext')?.addEventListener('click', () => step(1))
  dots.forEach((d) => d.addEventListener('click', () => {
    items[+d.dataset.i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }))

  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    if (e.shiftKey) return
    const max = track.scrollWidth - track.clientWidth
    const atStart = track.scrollLeft <= 0 && e.deltaY < 0
    const atEnd = track.scrollLeft >= max - 1 && e.deltaY > 0
    if (atStart || atEnd) return
    e.preventDefault()
    track.scrollLeft += e.deltaY
  }, { passive: false })

  /* ---------- 详情抽屉 ---------- */
  const drawer = document.createElement('div')
  drawer.className = 'drawer'
  drawer.innerHTML = `
    <div class="scrim" data-x></div>
    <div class="panel" role="dialog" aria-modal="true" aria-labelledby="dwTitle">
      <button class="iconbtn close" data-x aria-label="关闭">
        <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 2l8 8M10 2l-8 8"/></svg>
      </button>
      <div id="dwBody"></div>
    </div>`
  document.body.appendChild(drawer)

  let lastFocus = null
  const close = () => {
    drawer.classList.remove('open')
    document.body.style.overflow = ''
    lastFocus?.focus()
  }
  drawer.addEventListener('click', (e) => { if (e.target.closest('[data-x]')) close() })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close()
  })

  function open(i) {
    const t = TIMELINE[i]
    if (!t) return
    lastFocus = document.activeElement
    document.getElementById('dwBody').innerHTML = `
      <span class="yr">${t.yearLabel} · ${t.era}</span>
      <h3 id="dwTitle">${t.title}</h3>
      ${t.body.map((p) => `<p style="font-size:.95rem;line-height:1.85;margin:.9rem 0 0">${p}</p>`).join('')}
      ${t.quote ? `<blockquote class="quote">${t.quote.text}<cite>—— ${t.quote.cite}</cite></blockquote>` : ''}
      <div class="srcwrap">
        ${(t.src || []).map((k) => `<button class="srcchip" data-src="${k}" type="button">来源</button>`).join('')}
      </div>
      <p class="tiny" style="margin-top:1.2rem">本条编号：<span class="mono">ev-${t.id}</span>　可直接引用此页地址分享这一条。</p>`
    drawer.classList.add('open')
    document.body.style.overflow = 'hidden'
    if (location.hash !== '#ev-' + t.id) history.replaceState(null, '', '#ev-' + t.id)
    drawer.querySelector('.panel').scrollTop = 0
  }

  items.forEach((el) => {
    el.addEventListener('click', () => open(+el.dataset.i))
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+el.dataset.i) }
    })
  })

  const fromHash = location.hash.match(/^#ev-(.+)$/)
  if (fromHash) {
    const i = TIMELINE.findIndex((t) => t.id === fromHash[1])
    if (i >= 0) {
      setTimeout(() => {
        items[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        open(i)
      }, 300)
    }
  }
}
