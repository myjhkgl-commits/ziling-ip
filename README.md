# 籽灵 IP 官网

React + Vite 实现的「籽灵 · 一颗籽的千年之约」IP 展示站。暗色系，版心 1700px，PC 优先。

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build
```

## 结构

```
public/
  img/ethnics/avatar/{1..56}.webp   56 个民族籽灵形象（透明底，900px）
  img/ethnics/ref/{1..56}.webp      各民族参考形象（统一 webp，1000px）
  img/ethnics/poster/{1..55}.webp   二期民族形象海报（8 号源图过小已移除，弹窗降级显示形象图）
  img/main/*                        主 IP 素材：三视图、主形象、场景、盲盒、周边、表情包
  video/hero.mp4                    首页视频背景 · 桌面档 1920x1080
  video/hero-720.mp4                首页视频背景 · 中档 1280x720（平板/小笔记本/手机横屏）
  video/hero-mobile.mp4             首页视频背景 · 手机竖屏档 720x1280
  video/*-poster.jpg                各档首帧海报，首屏立即显示（视频随后在后台缓冲）
src/
  data/ethnics.js   56 个民族数据（民族名、IP 名、slogan、地区、简介、设计说明）+ 资源路径 helper
  components/       Navbar / Hero / EthnicSection / EthnicModal / MainIP / Footer / Lightbox
  index.css         暗色设计系统（CSS 变量：--red 石榴红、--jade 叶绿、--gold 金）
scripts/
  prepare-assets.py 素材处理脚本：从项目素材目录压缩、重命名、输出到 public（含 41-46 号原型图编号修正）
```

## 图片放大查看（Lightbox）

全站内容图都可点开看大图，由 `src/components/Lightbox.jsx` 统一提供：

- `LightboxProvider` 已在 `src/main.jsx` 包住整个 App；组件内 `const { openAt } = useLightbox()` 后调用 `openAt(图片数组, 起始下标)`。
- 已接入：主 IP 六张卡片、民族详情弹窗内的形象图 / 参考形象 / 海报。
- 交互：点击图片放大（再点还原，放大后可拖拽平移）、左右箭头或滑动切换、Esc 关闭、`←/→` 翻页、打开时锁背景滚动、切换前预加载相邻图。
- 56 民族网格卡片点击仍是打开详情弹窗，详情里的图可再放大。


## 素材编号约定

- 民族编号 1-56 与 `蒙古族.txt`、`260821-单独民族形象`、`260921-二期民族海报` 一致（1 苗族 … 55 基诺族、56 汉族）。
- `260814一期民族形象` 中 41-46 号原型图存在编号错位（41怒族 / 41乌孜别克族 / 42俄罗斯族 / 43鄂温克族 / 44德昂族 / 45保安族），已在处理脚本中重映射为 41-46；`35.png`=毛南族原型，`9朝鲜族.webp`、`56汉朝原型.webp` 为特例。
- 原型图扩展名不统一，但 `prepare-assets.py` 已统一输出为 `.webp`，因此 `src/data/ethnics.js` 里三种图都不再需要扩展名映射。

## 部署到 GitHub Pages

仓库已内置 `.github/workflows/deploy.yml`：推送到 `main` 分支后自动构建并发布。

1. 在 GitHub 上建一个空仓库（建议命名 `ziling-ip`），不要勾选 README。
2. 把本仓库推上去：

   ```bash
   git remote add origin https://github.com/<你的用户名>/ziling-ip.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**（只需设置一次）。
4. 等 Actions 跑完，访问 `https://<你的用户名>.github.io/ziling-ip/`。

`vite.config.js` 里 `base: './'` 已设为相对路径，所以站点放在任意子目录（如 `/ziling-ip/`）都能正常加载资源，无需改配置。

> 本机若用受管 Node 跑 `npm run build`，若 `dist/` 已存在可能被批量删除守卫拦截。先手动清掉 `dist/` 再构建即可；GitHub Actions 上不存在这个问题。

## 后续优化待办

- 民族 IP 名称为首个版本命名方案，可按品牌要求替换（`src/data/ethnics.js` 中 `ip` 字段）。
- 弹窗内 8 号（布依族）海报源图仅 87x115，需替换高清图后移除 `POSTER_MISSING`。

## 视频来源与再生成

背景视频来自 `C:\Users\Administrator\Desktop\201008-VR图标\《籽灵视频》\《籽灵视频》.mp4`（剪映导出，1920x1080 / 30fps / H.264 Main + AAC，43.6MB，无 faststart）。
本地转码命令（需 ffmpeg，可用 `npm i @ffmpeg-installer/ffmpeg` 取二进制，其包体走 npm 源不受 GitHub 网络影响）：

```bash
# 桌面档 1920x1080（14.4MB）
ffmpeg -i 原片.mp4 -ss 0.25 -c:v libx264 -profile:v high -level 4.0 \
  -preset slow -crf 26 -r 24 -pix_fmt yuv420p -an -movflags +faststart hero.mp4

# 中档 1280x720（4.35MB，平板 / 小笔记本 / 手机横屏）
ffmpeg -i hero.mp4 -vf "scale=1280:720:flags=lanczos" -r 24 -c:v libx264 \
  -profile:v high -level 4.0 -crf 31 -preset slow -pix_fmt yuv420p -an \
  -movflags +faststart hero-720.mp4

# 手机竖屏档 720x1280（3.3MB，中心裁 9:16）
ffmpeg -i hero.mp4 -vf "crop=608:1080:656:0,scale=720:1280:flags=lanczos,setsar=1" \
  -r 24 -c:v libx264 -profile:v high -level 4.0 -crf 31 -preset veryslow \
  -pix_fmt yuv420p -an -movflags +faststart hero-mobile.mp4

# 各档首帧海报
ffmpeg -ss 0.5 -i hero-mobile.mp4 -frames:v 1 -q:v 4 setsar=1 hero-mobile-poster.jpg
```

- `-ss 0.25`：源片开头有约 0.2s 的封面卡闪帧，循环播放时会突兀，裁掉。
- `-an`：Hero 本来就静音自动播放，去掉音轨省约 0.9MB。
- `-r 24`：源片 30fps 对背景循环没有收益，降到 24fps 省约 20%。
- 三档合计 22.4MB，但**每个设备只下载其中一档**：手机 3.3MB、平板 4.35MB、桌面 14.4MB。源片保留在原目录未动。

## 加载性能

首屏关键路径（手机竖屏）：HTML + CSS（gzip 5.9KB）+ JS（gzip 59KB）+ 首帧图 114KB ≈ **180KB**，视频在后台缓冲，不阻塞首屏绘制。

已做的优化，改动时可对照别破坏：

1. **Hero 先图后视频**（`Hero.jsx`）：`<img>` 首帧立即渲染，`window.load` 后经 `requestIdleCallback` 才挂 `<video>`，播放开始再淡入。这样 3~5MB 的视频不会拖住首屏。
2. **三档片源**，按屏幕选最省的一档（≥1025 / ≤1024 / ≤900 竖屏）。
3. **弱网降级**：`navigator.connection.saveData` 为真或 `effectiveType` 是 2g 时，只显示首帧静图，不拉视频。
4. **首帧预加载**：`index.html` 里三条 `<link rel="preload" as="image">` 带 media 条件 + `fetchpriority="high"`。
5. **图片全部 WebP**：海报 18.3MB→11.6MB、参考图 4.4MB→3.5MB。头像保持 900px（要支撑全屏放大查看）。
6. **懒加载**：网格与弹窗图片 `loading="lazy"` + `decoding="async"`。
7. **缓存友好**：Vite 产物带内容哈希，GitHub Pages 长缓存。

仍可继续优化的方向（按收益排序）：

- **换成国内可访问的托管/CDN**。GitHub Pages 服务器在境外，国内首字节常要 1–3 秒（实测首次打开约 8 秒）。这是目前「很多人说慢」的最大原因，站内再优化也救不了这一层。可选：腾讯云 COS + CDN、阿里云 OSS + CDN、Cloudflare Pages。
- **海报按需再分档**：现在弹窗/放大查看单张约 210KB，若做 `srcset` 可再省一半。
- 头像做 `srcset` 双尺寸（网格用小图、放大看用大图）。

