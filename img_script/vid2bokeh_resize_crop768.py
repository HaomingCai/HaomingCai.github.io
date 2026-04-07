#!/usr/bin/env python3
"""
Resize: height -> 768 (width proportional). If width < 768, resize width -> 768 (height proportional).
Then center-crop 768x768. Save as <name>_crop<ext>

Usage:
  python vid2bokeh_resize_crop768.py path/to/a.jpg path/to/b.jpg
  python vid2bokeh_resize_crop768.py   # defaults to tn/images/vid2bokeh_image3.jpg and _image4.jpg
"""
from __future__ import annotations

import os
import sys

from PIL import Image

OUT = 768


def process(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size

    # 1) Height = 768, width scales
    new_h = OUT
    new_w = max(1, int(round(w * new_h / h)))
    im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)

    w, h = im.size
    # 2) If still too narrow, width = 768, height scales
    if w < OUT:
        new_w = OUT
        new_h = max(1, int(round(h * new_w / w)))
        im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)

    w, h = im.size
    if w < OUT or h < OUT:
        raise ValueError(f"After resize still smaller than {OUT}x{OUT}: got {w}x{h}")

    left = (w - OUT) // 2
    top = (h - OUT) // 2
    return im.crop((left, top, left + OUT, top + OUT))


def out_path(path: str) -> str:
    root, ext = os.path.splitext(path)
    return f"{root}_crop{ext}"


def main() -> None:
    repo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    defaults = [
        os.path.join(repo, "tn/images/vid2bokeh_image3.jpg"),
        os.path.join(repo, "tn/images/vid2bokeh_image4.jpg"),
    ]
    paths = sys.argv[1:] if len(sys.argv) > 1 else defaults

    for path in paths:
        path = os.path.abspath(path)
        if not os.path.isfile(path):
            print(f"skip (not found): {path}", file=sys.stderr)
            continue
        im = Image.open(path)
        cropped = process(im)
        dst = out_path(path)
        cropped.save(dst, quality=95)
        print(f"saved: {dst}")


if __name__ == "__main__":
    main()
