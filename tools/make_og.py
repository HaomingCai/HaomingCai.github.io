#!/usr/bin/env python3
"""重新生成社交分享卡片 images/og.jpg (1200x630)。

改了 tagline 就跑一下这个 —— 卡片上的字是烤进图里的，光改 HTML 的
meta 标签没用，分享出去别人看到的还是旧口径。

    /usr/bin/python3 tools/make_og.py

依赖 Pillow。用 /usr/bin/python3（系统 Python 自带 PIL）。
"""

from PIL import Image, ImageDraw, ImageFont, ImageOps
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630

# ——— 这三行就是要维护的内容 ———
TAGLINE = "Generative Media · Computational Imaging"
SUBLINE = "CS PhD · University of Maryland"
# 名字是手绘的，直接用现成的 wordmark 图

CREAM = (245, 241, 232)
INK = (36, 33, 29)
RUST = (156, 68, 19)

F_SERIF = "/System/Library/Fonts/Supplemental/Times New Roman.ttf"
F_ITAL = "/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf"


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


card = Image.new("RGB", (W, H), CREAM)

# 极淡的猫壁纸，和站上同一张
tile_p = os.path.join(ROOT, "images/decor/cat_tile.png")
if os.path.exists(tile_p):
    tile = Image.open(tile_p).convert("RGBA")
    ts = 300
    tile = tile.resize((ts, int(tile.height * ts / tile.width)), Image.LANCZOS)
    # 站上的壁纸调得极淡是为了不挡正文；社交卡片上没有正文要保护，
    # 照搬那个透明度会让猫彻底消失。这里加回来一些。
    a = tile.getchannel("A").point(lambda v: min(255, int(v * 3.2)))
    tile.putalpha(a)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for y in range(0, H, tile.height):
        for x in range(0, W, tile.width):
            layer.paste(tile, (x, y), tile)
    card = Image.alpha_composite(card.convert("RGBA"), layer).convert("RGB")

d = ImageDraw.Draw(card)

# 手绘名字
name_p = os.path.join(ROOT, "images/decor/name_t.png")
LEFT, TOP = 78, 118
if os.path.exists(name_p):
    nm = Image.open(name_p).convert("RGBA")
    nw = 430
    nm = nm.resize((nw, int(nm.height * nw / nm.width)), Image.LANCZOS)
    card.paste(nm, (LEFT, TOP), nm)
    y = TOP + nm.height + 16
else:
    y = TOP + 200

# 分隔线 + 两行说明
d.line([(LEFT + 4, y), (LEFT + 300, y)], fill=RUST, width=3)
y += 22
d.text((LEFT + 2, y), TAGLINE, font=font(F_SERIF, 34), fill=INK)
y += 48
d.text((LEFT + 2, y), SUBLINE, font=font(F_ITAL, 27), fill=RUST)

# 右侧头像，圆角
ph_p = os.path.join(ROOT, "images/profile_380.jpg")
if os.path.exists(ph_p):
    S = 340
    ph = ImageOps.fit(Image.open(ph_p).convert("RGB"), (S, S), Image.LANCZOS)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=30, fill=255)
    card.paste(ph, (W - S - 78, (H - S) // 2), mask)

out = os.path.join(ROOT, "images/og.jpg")
card.save(out, quality=90, optimize=True)
print(f"wrote {out}  ({os.path.getsize(out)/1024:.0f} KB)")
print(f"  tagline: {TAGLINE}")
