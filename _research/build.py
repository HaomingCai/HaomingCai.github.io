"""生成研究页 research/index.html（独立静态页，和 vid2bokeh/、convrt/ 一样不经 Liquid）。

整页就是站主定稿的三棵树（tree_src.py 画树；改树的文字 / 标签 / 论文改 tree_src.py。2026-11-05 起在这里直接改：
Captured 两个分支左右对调、Evaluation 拉宽、SR by Predicting Offsets 的标签改 Gaming），每个论文方框正下方放一个缩小的 teaser 视频（站主 2026-11-05）。
- 运行时给 tree_src.py 打三处补丁：方框包一层 <a>（点了打开项目页，没有就打开 /papers/<名字>/）；
  记下每个方框的位置；每棵树下面多留出视频的高度。
- 视频是叠在 SVG 上的 HTML <video>，位置用 viewBox 的百分比算，跟着整张图一起缩放。
  首帧海报（research/posters/）先铺着，滚到眼前才加载、播放，离开就暂停。

用法（站点根目录）：shotenv/bin/python _research/build.py
  → research/index.html、research/posters/*.jpg
下划线目录不会被 Jekyll 发布，所以这个脚本和 tree_src.py 不会出现在网站上。"""
import html, os, re, subprocess, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "research")
esc = html.escape

# ── 1. 论文资料：_posts 的 front matter + upcoming.yml（What If?）──
KEY = {  # 树上方框的第一行 → 论文
    'Flash-Split': 'flashsplit', 'Event-based Video': 'timerewind', 'Real2SAM2Real': 'real2sam2real', 'Vid2Bokeh': 'vid2bokeh',
    'Parametric': 'shadowdirector', 'Pixel-perfect': 'editing', 'What If?': 'whatif',
    'BSRN': 'bsrn', 'VapSR': 'vapsr', 'SR by Predicting': 'srpo', 'Interactive': 'cugan',
    'Video Snow': 'snow', 'Turbulence': 'convrt', 'CodedEvents': 'codedevent', 'Flash-Splat': 'flashsplat',
    'PIPAL +': 'pipal', 'Assessor360': 'assessor360', 'VLM robustness': 'allweathervlm',
}
ASSET_V = yaml.safe_load(open(os.path.join(ROOT, "_config.yml"), encoding="utf-8"))["asset_v"]
POST = {}
for f in sorted(os.listdir(os.path.join(ROOT, "_posts"))):
    s = open(os.path.join(ROOT, "_posts", f), encoding="utf-8").read()
    fm = yaml.safe_load(s.split("---")[1])
    slug = f[11:-9].lower()
    POST[slug] = dict(title=fm["title"], video=fm.get("image"), link=fm.get("website") or f"/papers/{slug}/")
up = yaml.safe_load(open(os.path.join(ROOT, "_data/upcoming.yml"), encoding="utf-8"))[0]
POST["whatif"] = dict(title=up["title"], video=up["image"], link=up["url"])
POST["editing"] = dict(title="Pixel-perfect local image editing (in preparation)", video=None, link=None)   # 还没发表：没有视频、不链
LINK = {k: v["link"] for k, v in POST.items()}
for p in POST.values():   # 视频的网址和本地文件（默认在 tn/videos/）
    if p["video"]:
        p["url"], p["file"] = "/tn" + p["video"], os.path.join(ROOT, "tn", p["video"].lstrip("/"))
# 研究页上换成 Selected work 的卡片视频（滑块在图下面那版），而且是 3 倍速（站主 2026-11-05：大家想多看点东西）。
# 用的是重新编码过的 3 倍速文件（时间压成 1/3、按 30 fps 均匀取帧），正常速度播放 ——
# 让浏览器 playbackRate=3 播原视频会一卡一卡的。源：HomepageTeasers-src 里两张卡片的 816 版，见 research/media/。
for k, name in {"vid2bokeh": "Vid2Bokeh_kitty_card_v3_3x.mp4", "shadowdirector": "ShadowDirector_card_v6c_3x.mp4"}.items():
    POST[k]["video"], POST[k]["url"], POST[k]["file"] = name, f"/research/media/{name}", os.path.join(OUT, "media", name)

# ── 2. 树：执行 tree_src.py（不让它写自己的 index.html），打补丁 ──
src = open(os.path.join(ROOT, "_research/tree_src.py"), encoding="utf-8").read()
def patch(old, new):
    global src
    assert src.count(old) == 1, f"tree_src.py changed, cannot find: {old[:60]!r}"
    src = src.replace(old, new)
rect = "    s.append(f'<rect class=\"box\" x=\"{bx - bw / 2:.1f}\" y=\"{top}\" width=\"{bw}\" height=\"{h}\" rx=\"4\"/>')\n"
patch(rect, "    _k = KEY[lines[0]]; BOXES.append((_k, bx, top, bw, h))\n"
            "    s.append('<a class=\"pbox\"' + (f' href=\"{LINK[_k]}\"' if LINK.get(_k) else '') + f' aria-label=\"{escape(\" \".join(lines))}\">')\n" + rect)
patch("            x += w + 5\n", "            x += w + 5\n    s.append('</a>')\n")
patch("    y = bottom + (28 if last else 130)\n", "    y = bottom + VGAP + (28 if last else 130)\n")   # 每棵树下面留出视频的高度
patch("Path(__file__).with_name('index.html').write_text(html)", "")
patch("print('ok', round(W), round(H))", "")
VGAP = 10 + round(172 * 3 / 4) + 6      # 视频顶离方框 10，4:3，最宽的方框 172
BOXES = []
ns = {"KEY": KEY, "LINK": LINK, "BOXES": BOXES, "VGAP": VGAP, "__file__": os.path.join(ROOT, "_research/tree_src.py")}
exec(compile(src, "tree_src.py", "exec"), ns)
W, H = ns["W"], ns["H"]
svg_label = re.search(r'aria-label="([^"]+)"', ns["html"]).group(1) + " Each paper box has its teaser video underneath."
SVG = (f'<svg class="map" viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="{esc(svg_label)}">'
       '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>'
       + "".join(ns["s"]) + "</svg>")

# ── 3. 海报：每个视频的第一帧（408 宽 JPG）──
os.makedirs(os.path.join(OUT, "posters"), exist_ok=True)
try:
    import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FF = "ffmpeg"
for slug, p in POST.items():
    if p["video"]:
        p["poster"] = os.path.basename(p["video"])[:-4] + ".jpg"   # 按视频文件名起名：换了视频海报跟着换
        dst, sv = os.path.join(OUT, "posters", p["poster"]), p["file"]
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(sv):
            subprocess.run([FF, "-v", "error", "-y", "-ss", "0", "-i", sv, "-frames:v", "1", "-vf", "scale=408:-2", "-q:v", "4", dst], check=True)

# ── 4. 方框下面的视频（叠在 SVG 上，用百分比定位）──
pct = lambda v, tot: f"{100 * v / tot:.4f}%"
tiles = []
for slug, bx, top, bw, h in BOXES:
    p = POST[slug]
    x, y, w, vh = bx - bw / 2, top + h + 10, bw, bw * 3 / 4
    style = f"left:{pct(x, W)};top:{pct(y, H)};width:{pct(w, W)};height:{pct(vh, H)}"
    if p["video"]:
        inner = (f'<video muted loop playsinline preload="none" poster="posters/{p["poster"]}" data-src="{p["url"]}?v={ASSET_V}" '
                 f'aria-hidden="true"></video>')
        tiles.append(f'<a class="vid" href="{esc(p["link"])}" style="{style}" aria-label="Teaser: {esc(p["title"])}">{inner}</a>')
    else:
        tiles.append(f'<div class="vid vid--soon" style="{style}"><span>Teaser coming soon</span></div>')

# 三棵树的根方框（tree_src.py 画的顺序：Generated、Captured、Evaluation）→ 锚点
ROOTS = [float(y) for y in re.findall(r'<rect class="box root" x="[^"]+" y="([^"]+)"', "".join(ns["s"]))]
assert len(ROOTS) == 3, ROOTS
AREAS = [("generated", "Generated Visual Media"), ("captured", "Captured Visual Media"), ("evaluation", "Evaluation & Benchmarks")]
anchors = "".join(f'<span class="anchor" id="tree-{aid}" style="top:{pct(max(0, y - 16), H)}"></span>' for (aid, _), y in zip(AREAS, ROOTS))
# 顶上的小树：Visual Media 下面三个分支（和下面的树同一套画法），点一个分支滚到那棵树。站主 2026-11-05：不要动画
HUB_NAMES = {"generated": "Controllable Visual Media Generation", "captured": "Imperfect Captured Media",
             "evaluation": "Human-Aligned Evaluation & Benchmarks"}
HUB = ('<nav class="hub" aria-label="Research areas: jump to a map">'
       '<div class="hub__root">Visual Media</div><ul class="hub__kids">'
       + "".join(f'<li><a href="#tree-{aid}"><span class="hub__box">{esc(HUB_NAMES[aid])}</span>'
                 f'<span class="hub__go" aria-hidden="true">Click to jump ↓</span></a></li>' for aid, _ in AREAS)
       + '</ul></nav>')
HUB_CSS = r"""
/* hub: "Visual Media" and its three areas as branches, drawn like the trees below; each branch jumps to its tree */
.hub { --drop: 30px; --g: clamp(16px, 2.4vw, 36px); max-width: 1240px; margin: 36px auto 120px; padding-inline: clamp(16px, 4vw, 40px);
  display: flex; flex-direction: column; align-items: center; }
.hub__root { position: relative; padding: 12px 40px; border-radius: 4px; background: var(--ink); color: var(--paper);
  font: 600 clamp(18px, 2.2vw, 24px)/1.2 var(--map); letter-spacing: .01em; }
.hub__root::after { content: ""; position: absolute; left: 50%; top: 100%; width: 2px; height: var(--drop); margin-left: -1px; background: var(--ink); }
.hub__kids { position: relative; list-style: none; margin: var(--drop) 0 0; padding: var(--drop) 0 0; width: 100%;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--g); }
/* bus from the first branch's centre to the last one's, turning down into them with rounded corners like the map */
.hub__kids::before { content: ""; position: absolute; top: 0; height: calc(var(--drop) - 8px);
  left: calc((100% - 2 * var(--g)) / 6 - 1px); right: calc((100% - 2 * var(--g)) / 6 - 1px);
  border: 2px solid var(--ink); border-bottom: 0; border-radius: 16px 16px 0 0; }
.hub__kids li { position: relative; display: flex; }
.hub__kids li:nth-child(2)::before { content: ""; position: absolute; left: 50%; top: calc(-1 * var(--drop)); width: 2px; height: calc(var(--drop) - 8px);
  margin-left: -1px; background: var(--ink); }
.hub__kids li::after { content: ""; position: absolute; left: 50%; bottom: 100%; margin-left: -6px;
  border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid var(--ink); }
.hub__kids a { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: stretch; gap: 10px; color: var(--ink); text-decoration: none; }
.hub__box { display: flex; align-items: center; justify-content: center; height: 54px; padding: 0 12px; white-space: nowrap;
  border: 2px solid var(--ink); border-radius: 4px; background: var(--paper); font: 600 clamp(13px, 1.12vw, 16px)/1 var(--map);
  transition: background .15s, color .15s, border-color .15s; }
.hub__kids a:hover .hub__box, .hub__kids a:focus-visible .hub__box { background: var(--accent); border-color: var(--accent); color: var(--paper); }
.hub__kids a:focus-visible { outline: none; }
.hub__kids a:focus-visible .hub__box { box-shadow: 0 0 0 3px var(--paper), 0 0 0 5px var(--accent); }
/* "Click to jump" breathes softly, the three branches one after another */
.hub__go { align-self: center; font: 500 12px/1 var(--map); letter-spacing: .04em; color: var(--accent); animation: hub-breathe 2.4s ease-in-out infinite; }
.hub__kids li:nth-child(2) .hub__go { animation-delay: .8s; }
.hub__kids li:nth-child(3) .hub__go { animation-delay: 1.6s; }
@keyframes hub-breathe { 0%, 100% { opacity: .45; transform: translateY(0); } 50% { opacity: 1; transform: translateY(2px); } }
@media (prefers-reduced-motion: reduce) { .hub__go { animation: none; opacity: .85; } }
/* narrow screens: three names don't fit side by side on one line, so the branches stack, hanging off a rail on the left */
@media (max-width: 1100px) {
  .hub { --rail: 22px; max-width: 600px; margin-bottom: 72px; align-items: stretch; }
  .hub__root { align-self: flex-start; padding: 10px 22px; }
  .hub__root::after { left: var(--rail); height: 14px; }
  .hub__kids { grid-template-columns: 1fr; gap: 6px; margin-top: 14px; padding: 0 0 0 calc(var(--rail) + 24px); }
  .hub__kids::before { left: calc(var(--rail) - 1px); right: auto; top: 0; bottom: 41px; height: auto; width: 2px;
    border: 0; border-radius: 0; background: var(--ink); }
  .hub__kids li:nth-child(n)::before { content: ""; position: absolute; left: -24px; top: 22px; width: 16px; height: 2px; margin: 0; background: var(--ink); }
  .hub__kids li::after { left: -8px; top: 23px; bottom: auto; margin: -6px 0 0; border-top: 6px solid transparent;
    border-bottom: 6px solid transparent; border-left: 8px solid var(--ink); border-right: 0; }
  .hub__kids a { gap: 6px; }
  .hub__box { height: 46px; justify-content: flex-start; padding: 0 12px; font-size: clamp(12.5px, 3.3vw, 15px); }
  .hub__go { align-self: flex-start; margin-left: 12px; font-size: 11px; height: 12px; }
}
"""

PAGE = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Research · Haoming Cai</title>
<meta name="description" content="A map of Haoming Cai's research in generated visual media, captured visual media, and evaluation, with a teaser video under each paper.">
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
<link rel="canonical" href="https://www.hm-cai.com/research/">
<script>
  // 和首页同一个开关：记住的选择 > 默认浅色
  (function () {{ var t = null; try {{ t = localStorage.getItem('theme'); }} catch (e) {{}}
    document.documentElement.dataset.theme = (t === 'dark' || t === 'light') ? t : 'light'; }})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">
<style>
/* Layout: one page = the owner's three-tree research map; each paper box has its teaser video directly underneath. */
:root {{
  --paper: #f4f0e8; --tint: #e9e4d9; --ink: #1c1a17; --ink-2: #3a3631; --muted: #6b655c; --line: #c9c1b3; --rule: #dcd5c8;
  --accent: #8f3a1f; --chip: #e2dccf;
  --serif: "Newsreader", Georgia, serif; --sans: "Inter", -apple-system, "Segoe UI", sans-serif; --map: "IBM Plex Sans", Arial, sans-serif;
  color-scheme: light;
}}
:root[data-theme="dark"] {{
  --paper: #12110f; --tint: #1b1a17; --ink: #ece6da; --ink-2: #cfc8ba; --muted: #9c9486; --line: #4a453e; --rule: #2a2723;
  --accent: #d27b57; --chip: #2e2b26; color-scheme: dark;
}}
* {{ box-sizing: border-box; }}
html {{ -webkit-text-size-adjust: 100%; }}
body {{ margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.6 var(--sans); }}
a {{ color: inherit; text-decoration-color: var(--line); text-underline-offset: .22em; }}
a:hover {{ color: var(--accent); text-decoration-color: currentColor; }}
.wrap {{ max-width: 1240px; margin: 0 auto; padding-inline: clamp(16px, 4vw, 40px); }}
.top {{ display: flex; align-items: center; gap: 24px; padding-block: 18px; border-bottom: 1px solid var(--rule); }}
.top__home {{ font: 500 18px var(--serif); text-decoration: none; }}
.theme {{ margin-left: auto; }}
.theme button {{ font: 400 13px var(--sans); background: none; border: 0; color: var(--muted); cursor: pointer; padding: 4px 0; }}
.theme button[aria-pressed="true"] {{ color: var(--ink); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--line); }}
.theme button + button::before {{ content: "/"; margin: 0 .45em; color: var(--line); }}
.intro {{ padding-block: 40px 0; }}
.intro h1 {{ font: 400 clamp(32px, 4vw, 44px)/1.1 var(--serif); letter-spacing: -.02em; margin: 0 0 10px; }}
.intro p {{ margin: 0; color: var(--ink-2); max-width: 62ch; }}
.intro .who {{ margin-top: 6px; font-size: 14px; color: var(--muted); }}
/* the map is wider than the text column; videos sit on top of the SVG, positioned in % of its viewBox */
.mapwrap {{ max-width: 1640px; margin: 16px auto 0; padding-inline: clamp(8px, 2vw, 24px); }}
.mapscroll {{ overflow-x: auto; -webkit-overflow-scrolling: touch; }}
.mapbox {{ position: relative; min-width: 1080px; }}
.map {{ display: block; width: 100%; height: auto; }}
.vid {{ position: absolute; display: block; border-radius: 4px; overflow: hidden; background: var(--tint); }}
.vid video {{ width: 100%; height: 100%; object-fit: cover; display: block; }}
a.vid:hover, a.vid:focus-visible {{ outline: 3px solid var(--accent); outline-offset: 2px; }}
.vid--soon {{ display: grid; place-items: center; border: 1.5px dashed var(--line); background: none; }}
.vid--soon span {{ font: 500 clamp(9px, .8vw, 12px) var(--map); color: var(--muted); }}
.hint {{ display: none; font-size: 13px; color: var(--muted); padding: 8px clamp(16px, 4vw, 40px) 0; }}
@media (max-width: 1080px) {{ .hint {{ display: block; }} }}
.map .ln {{ fill: none; stroke: var(--ink); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }}
.map #ah path {{ fill: var(--ink); }}
.map .box {{ fill: var(--paper); stroke: var(--ink); stroke-width: 2; transition: stroke .15s; }}
.map .box.root {{ stroke-width: 2.6; }}
.map .chip {{ fill: var(--chip); }}
.map .tag {{ fill: none; stroke: var(--muted); stroke-width: 1.2; }}
.map .t-tag {{ fill: var(--muted); font: 500 12.5px var(--map); }}
.map .t-root {{ fill: var(--ink); font: 600 24px var(--map); letter-spacing: .01em; }}
.map .t-chip {{ fill: var(--ink); font: 500 17px var(--map); }}
.map .t-title {{ fill: var(--ink); font: 600 16px var(--map); transition: fill .15s; }}
.map .t-venue {{ fill: var(--muted); font: 400 14px var(--map); }}
.map .pbox[href]:hover .box, .map .pbox[href]:focus-visible .box {{ stroke: var(--accent); stroke-width: 3; }}
.map .pbox[href]:hover .t-title, .map .pbox[href]:focus-visible .t-title {{ fill: var(--accent); }}
.map .pbox:focus {{ outline: none; }}
.foot {{ padding-block: 40px 48px; font-size: 14px; color: var(--muted); }}
{HUB_CSS}
.anchor {{ position: absolute; left: 0; width: 1px; height: 1px; scroll-margin-top: 16px; }}
:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 3px; }}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="top__home" href="/">&larr; Haoming Cai</a>
    <div class="theme" role="group" aria-label="Color theme"><button type="button" data-set-theme="dark">Dark</button><button type="button" data-set-theme="light">Light</button></div>
  </header>
  <section class="intro">
    <h1>Research map</h1>
    <p>How my papers fit together, with each paper's teaser right below it. Pick an area to jump to it, or click a paper to open it.</p>
    <p class="who">Haoming Cai · PhD student, University of Maryland · graduating Summer 2027</p>
  </section>
</div>
{HUB}
<div class="mapwrap"><div class="mapscroll"><div class="mapbox">{SVG}{anchors}
{chr(10).join(tiles)}
</div></div></div>
<p class="hint">Swipe sideways to see the whole map.</p>
<footer class="wrap foot"><a href="/">hm-cai.com</a> · <a href="/#publications">All publications</a></footer>
<script>
  // 视频：滚到眼前才加载并播放，离开就暂停；系统要求减少动态时不自动播放（只显示首帧海报）
  (function () {{
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {{
      const v = e.target;
      if (e.isIntersecting) {{ if (!v.src) v.src = v.dataset.src; v.play().catch(() => {{}}); }} else if (!v.paused) v.pause();
    }}), {{ rootMargin: '150px 0px' }});
    document.querySelectorAll('.vid video').forEach(v => io.observe(v));
  }})();
  // 点 Visual Media 下面的分支：平滑滚到那棵树
  document.querySelectorAll('.hub a').forEach(a => a.addEventListener('click', e => {{
    const t = document.querySelector(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); t.scrollIntoView({{ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }});
    history.replaceState(null, '', a.getAttribute('href'));
  }}));
  // 明暗切换（和首页同一套）
  (function () {{
    const d = document.documentElement, btns = [...document.querySelectorAll('[data-set-theme]')];
    const sync = () => btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setTheme === (d.dataset.theme || 'light'))));
    btns.forEach(b => b.addEventListener('click', () => {{ d.dataset.theme = b.dataset.setTheme; try {{ localStorage.setItem('theme', b.dataset.setTheme); }} catch (e) {{}} sync(); }}));
    sync();
  }})();
</script>
</body>
</html>
'''
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(PAGE)
print("wrote research/index.html", len(PAGE), "bytes | boxes", len(BOXES), "| videos", sum(1 for b in BOXES if POST[b[0]]["video"]), "| map", round(W), "x", round(H))
