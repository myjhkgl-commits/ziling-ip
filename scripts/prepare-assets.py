# -*- coding: utf-8 -*-
"""将石榴IP素材压缩整理到 ziling-website/public 目录"""
import os, re, shutil, json
from PIL import Image

BASE = r"C:\Users\Administrator\Desktop\260311石榴项目\260804石榴IP"
SITE = os.path.join(BASE, "ziling-website", "public")
report = []

def ensure(d):
    os.makedirs(d, exist_ok=True)
    return d

def convert(src, dst, max_side=1200, quality=85, keep_alpha=False, to_jpg=False):
    img = Image.open(src)
    w, h = img.size
    scale = max_side / max(w, h)
    if scale < 1:
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    if to_jpg:
        if img.mode != "RGB":
            img = img.convert("RGB")
        img.save(dst, "JPEG", quality=quality, optimize=True)
    else:
        if keep_alpha and img.mode not in ("RGBA", "LA"):
            img = img.convert("RGBA")
        img.save(dst, "WEBP", quality=quality, method=6)
    report.append(f"{os.path.basename(src)} -> {os.path.relpath(dst, SITE)}  {img.size[0]}x{img.size[1]}")

def leading_num(name):
    m = re.match(r"^(\d+)", name)
    return int(m.group(1)) if m else None

# ---------- 1. 56 民族形象（透明底） ----------
av_src = os.path.join(BASE, "260821-单独民族形象")
av_out = ensure(os.path.join(SITE, "img", "ethnics", "avatar"))
found = {}
for f in os.listdir(av_src):
    n = leading_num(f)
    if n is not None and n not in found:
        found[n] = f
assert len(found) == 56, f"avatar count {len(found)}"
for n in sorted(found):
    convert(os.path.join(av_src, found[n]), os.path.join(av_out, f"{n}.webp"),
            max_side=900, quality=88, keep_alpha=True)

# ---------- 1b. 网格卡小图（thumb）----------
# 民族网格里 56 张图同屏，原图单张约 90KB、合计 5.2MB，是列表"慢"的主因。
# 网格单元最大仅约 250px 宽，缩到 300px 足够清晰，单张降到约 15KB。
# 弹窗与放大查看仍用 900px 原图，不受影响。
th_out = ensure(os.path.join(SITE, "img", "ethnics", "thumb"))
for n in sorted(found):
    convert(os.path.join(av_src, found[n]), os.path.join(th_out, f"{n}.webp"),
            max_side=300, quality=82, keep_alpha=True)

# ---------- 2. 原型参考图（编号修正：41-46 错位） ----------
ref_src = os.path.join(BASE, "260814一期民族形象")
ref_out = ensure(os.path.join(SITE, "img", "ethnics", "ref"))
# 目标编号 -> 源文件名
ref_map = {
    9: "9朝鲜族.webp",
    35: "35.png",
    41: "41怒族原型.webp",
    42: "41乌孜别克族原型.jpg",
    43: "42俄罗斯族原型.jpg",
    44: "43鄂温克族原型.webp",
    45: "44德昂族原型.jpg",
    46: "45保安族原型.jpg",
    56: "56汉朝原型.webp",
}
files_by_prefix = {}
for f in os.listdir(ref_src):
    n = leading_num(f)
    if n is None:
        continue
    files_by_prefix.setdefault(n, []).append(f)
for n in range(1, 57):
    if n in ref_map:
        src_name = ref_map[n]
    else:
        cands = [f for f in files_by_prefix.get(n, []) if "原型" in f]
        if not cands:
            report.append(f"!! ref missing {n}")
            continue
        src_name = cands[0]
    ext = os.path.splitext(src_name)[1].lower()
    convert(os.path.join(ref_src, src_name),
            os.path.join(ref_out, f"{n}.webp"),
            max_side=1000, quality=80, to_jpg=False)

# ---------- 3. 民族海报（压缩为 webp：比 jpg 小约 1/3，弹窗/放大查看更快） ----------
# 一步到位出两档：poster/ 供放大查看，poster-thumb/ 供弹窗预览（浏览器实际只显示约 600px 宽）
po_src = os.path.join(BASE, "260921-二期民族海报")
po_out = ensure(os.path.join(SITE, "img", "ethnics", "poster"))
po_th_out = ensure(os.path.join(SITE, "img", "ethnics", "poster-thumb"))
po_found = {}
for f in os.listdir(po_src):
    n = leading_num(f)
    if n is not None and n not in po_found:
        po_found[n] = f
for n in sorted(po_found):
    convert(os.path.join(po_src, po_found[n]), os.path.join(po_out, f"{n}.webp"),
            max_side=1400, quality=82, to_jpg=False)
    convert(os.path.join(po_src, po_found[n]), os.path.join(po_th_out, f"{n}.webp"),
            max_side=640, quality=78, to_jpg=False)

# ---------- 4. 主 IP 素材 ----------
main_out = ensure(os.path.join(SITE, "img", "main"))
main_assets = [
    (os.path.join(BASE, "260821-挑", "籽灵.jpg"), "ziling.jpg", 1400, 88, False, True),
    (os.path.join(BASE, "260821-a三视图", "三视图无背景.png"), "sanshi.webp", 1600, 88, True, False),
    (os.path.join(BASE, "260821-a三视图", "石榴IP三视图.png"), "three-view.webp", 1600, 88, False, False),
    (os.path.join(BASE, "260823-场景延展", "动作延展1.png"), "scene-cart.webp", 1400, 85, True, False),
    (os.path.join(BASE, "260823-场景延展", "动作延展2.png"), "scene-2.webp", 1400, 85, True, False),
    (os.path.join(BASE, "260823-场景延展", "动作延展3.png"), "scene-3.webp", 1400, 85, True, False),
    (os.path.join(BASE, "260823-文创延展", "盲盒.png"), "blindbox.webp", 1400, 85, False, False),
    (os.path.join(BASE, "260823-文创延展", "石榴IP周边产品展示.png"), "merch.webp", 1400, 85, False, False),
    (os.path.join(BASE, "260823-表情包", "表情包.png"), "emoji.webp", 1400, 85, False, False),
]
for src, dst, ms, q, alpha, jpg in main_assets:
    convert(src, os.path.join(main_out, dst), max_side=ms, quality=q, keep_alpha=alpha, to_jpg=jpg)

# ---------- 5. 视频 ----------
# 注意：这里【不再】直接把原始视频拷进 public/video。
# 原始片（1080p / 43MB / 无 faststart）必须先用 ffmpeg 转码，产出三档：
#   public/video/hero.mp4            1920x1080  桌面大屏
#   public/video/hero-720.mp4        1280x720   平板 / 小笔记本 / 手机横屏
#   public/video/hero-mobile.mp4     720x1280   手机竖屏
# 以及对应首帧海报 hero-poster.jpg / hero-720-poster.jpg / hero-mobile-poster.jpg
# 转码参数见 README「视频来源与再生成」。
vid_out = ensure(os.path.join(SITE, "video"))
report.append("video: 跳过（由 ffmpeg 单独转码，见 README）")

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets-report.txt"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(report))
print("done", len(report))
