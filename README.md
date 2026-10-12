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
  img/ethnics/avatar/{1..56}.webp   56 个民族籽灵形象（透明底）
  img/ethnics/ref/{1..56}.(jpg|webp) 各民族参考形象照片
  img/ethnics/poster/{1..56}.jpg    二期民族形象海报（8 号源图过小已移除，弹窗降级显示形象图）
  img/main/*                        主 IP 素材：三视图、主形象、场景、盲盒、周边、表情包
  video/hero.mp4                    首页视频背景（H.264 High CRF26 / 无音轨 / faststart，裁掉了源片开头 0.25s 封面闪帧）
  video/hero-poster.jpg             视频首帧海报，加载完成前占位
src/
  data/ethnics.js   56 个民族数据（民族名、IP 名、slogan、地区、简介、设计说明）+ 资源路径 helper
  components/       Navbar / Hero / EthnicSection / EthnicModal / MainIP / Footer
  index.css         暗色设计系统（CSS 变量：--red 石榴红、--jade 叶绿、--gold 金）
scripts/
  prepare-assets.py 素材处理脚本：从项目素材目录压缩、重命名、输出到 public（含 41-46 号原型图编号修正）
```

## 素材编号约定

- 民族编号 1-56 与 `蒙古族.txt`、`260821-单独民族形象`、`260921-二期民族海报` 一致（1 苗族 … 55 基诺族、56 汉族）。
- `260814一期民族形象` 中 41-46 号原型图存在编号错位（41怒族 / 41乌孜别克族 / 42俄罗斯族 / 43鄂温克族 / 44德昂族 / 45保安族），已在处理脚本中重映射为 41-46；`35.png`=毛南族原型，`9朝鲜族.webp`、`56汉朝原型.webp` 为特例。
- 原型图扩展名不统一，`src/data/ethnics.js` 内 `REF_JPG` 集合标明哪些是 `.jpg`。

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
ffmpeg -i 原片.mp4 -ss 0.25 -c:v libx264 -profile:v high -level 4.1 \
  -preset slow -crf 26 -pix_fmt yuv420p -an -movflags +faststart hero.mp4
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

- `-ss 0.25`：源片开头有约 0.2s 的封面卡闪帧，循环播放时会突兀，裁掉。
- `-an`：Hero 本来就静音自动播放，去掉音轨省约 0.9MB。
- 成品 14.4MB，约为源片 1/3；源片保留在原目录未动。
