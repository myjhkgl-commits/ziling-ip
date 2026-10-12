# -*- coding: utf-8 -*-
"""把 vite build 产物内联成单文件 dist/单文件版.html
脚本与样式全部内联，图片/视频仍以相对路径引用 dist 目录内的资源，
这样既能在本地 http 服务下预览，也能直接双击打开。"""
import os, re, glob

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
DIST = os.path.abspath(DIST)

index = os.path.join(DIST, "index.html")
html = open(index, encoding="utf-8").read()

assets_dir = os.path.join(DIST, "assets")
js_files = sorted(glob.glob(os.path.join(assets_dir, "*.js")))
css_files = sorted(glob.glob(os.path.join(assets_dir, "*.css")))
assert len(js_files) == 1, js_files
assert len(css_files) == 1, css_files

js = open(js_files[0], encoding="utf-8").read()
css = open(css_files[0], encoding="utf-8").read()

# 处理 JS 中可能出现的 </script> 序列，避免提前闭合内联脚本
js = js.replace("</script", "<\\/script")

# 内联 CSS：替换 <link rel="stylesheet" ...>
html = re.sub(r'<link[^>]+rel="stylesheet"[^>]*>', "<style>\n" + css + "\n</style>", html)
# 内联 JS：替换 <script type="module" ...></script>
html = re.sub(r'<script[^>]*src="[^"]*index[^"]*\.js"[^>]*></script>',
              '<script type="module">\n' + js + '\n</script>', html)
# 去掉 favicon 引用（避免单文件移动后 404）
html = re.sub(r'<link[^>]+rel="icon"[^>]*>', "", html)

out = os.path.join(DIST, "籽灵IP官网-单文件版.html")
open(out, "w", encoding="utf-8").write(html)
print("written:", out, len(html), "chars")
print("css size:", len(css), "js size:", len(js))
