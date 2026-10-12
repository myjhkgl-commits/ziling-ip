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
  video/hero.mp4                    首页视频背景《籽灵·一颗籽的千年之约》
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

## 后续优化待办

- 民族 IP 名称为首个版本命名方案，可按品牌要求替换（`src/data/ethnics.js` 中 `ip` 字段）。
- 弹窗内 8 号（布依族）海报源图仅 87x115，需替换高清图后移除 `POSTER_MISSING`。
- 首页视频 45MB，上线前建议转码为 1080p H.264 + faststart，并提供 poster 首帧图。
