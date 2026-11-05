"""Three Seaweed-style trees stacked in one SVG: Generative Media (fixed), Computational Imaging, Perceptual Evaluation."""
from pathlib import Path
from html import escape

SLOT_GAP, GROUP_GAP, BOX_H, R, MARGIN = 20, 54, 90, 16, 24
TIERS = [
    {'root': 'Generate Visual Media', 'box_w': 172, 'groups': [
        ('AI for Science', [(['What If?', 'Tropical cyclones'], None, 236)]),
        ('Efficiency', [(['Fast local', 'editing'], 'ongoing')]),
        ('Controllability', [(['Parametric', 'Shadow Control'], "ICCV'25"), (['Vid2Bokeh'], "ECCV'26"), (['Real2SAM2Real'], "arXiv'26")]),
        ('Reconstruction', [(['Event-based Video', 'Interpolation'], "CVPR'25"), (['Flash-Split'], "CVPR'25")]),
    ], 'shared': {'Parametric': 'Efficiency', 'Real2SAM2Real': 'Reconstruction', 'What If?': ('Efficiency', 106)},
     'high': [('Controllability', 'What If?', 86)], 'extra_gap': 18},
]
ROOT_W, ROOT_H = 350, 64

TAGS = {  # first title line -> up to two technique / data tags
    'BSRN': ['Edge devices'], 'VapSR': ['Attention'], 'SR by Predicting': ['Real-time', 'Gaming'],
    'Video Snow': ['Video'], 'Turbulence': ['Video'], 'CodedEvents': ['Event cam', 'PSF'],
    'Flash-Splat': ['3DGS'], 'PIPAL +': ['Human preference'], 'Assessor360': ['360° VR'], 'VLM robustness': ['VQA'],
    # Generated Visual Media
    'What If?': ['Climate AI'], 'Pixel-perfect': ['DiT'], 'Parametric': ['Lighting'], 'Vid2Bokeh': ['Camera'],
    'Real2SAM2Real': ['3D', 'Camera', 'Video'], 'Event-based Video': ['Event cam', 'Video'], 'Flash-Split': ['Transparent surfaces'],
}
BOX_H_TAG = 112

def paper_box(lines, venue, bx, top, bw, h):
    """Box with fixed rows so every box in a row lines up:
    title centred on one line (1 or 2 lines), venue on a fixed baseline, tags on a fixed row."""
    tags = TAGS.get(lines[0], [])
    ws = [11 + 6.6 * len(t) for t in tags]
    s.append(f'<rect class="box" x="{bx - bw / 2:.1f}" y="{top}" width="{bw}" height="{h}" rx="4"/>')
    title_c, venue_b, tag_y = top + 33, top + 67, top + 79
    n = len(lines)
    for j, ln in enumerate(lines):
        yb = title_c + (j - (n - 1) / 2) * 20 + 5
        s.append(f'<text class="t-title" x="{bx:.1f}" y="{yb:.1f}" text-anchor="middle">{escape(ln)}</text>')
    if venue:
        s.append(f'<text class="t-venue" x="{bx:.1f}" y="{venue_b:.1f}" text-anchor="middle">{escape(venue)}</text>')
    if tags:
        total = sum(ws) + 5 * (len(ws) - 1)
        x = bx - total / 2
        for t, w in zip(tags, ws):
            s.append(f'<rect class="tag" x="{x:.1f}" y="{tag_y:.1f}" width="{w:.1f}" height="21" rx="10.5"/>')
            s.append(f'<text class="t-tag" x="{x + w / 2:.1f}" y="{tag_y + 14.5:.1f}" text-anchor="middle">{escape(t)}</text>')
            x += w + 5

def P(lines, venue): return {'k': 'p', 'lines': lines, 'venue': venue}
def C(text, *kids): return {'k': 'c', 'text': text, 'kids': list(kids)}
TREES = [
    {'k': 'r', 'text': 'Captured Media', 'kids': [
        C('Restoration',
          C('On-device efficiency', P(['BSRN'], "NTIRE'22 winner"), P(['VapSR'], "ECCVW'22"), P(['SR by Predicting', 'Offsets'], "ECCV'22")),
          C('Unified model', P(['Interactive', 'Modulation'], "CVPRW'21")),
          C('Adverse imaging conditions', P(['Video Snow', 'Removal'], "ICCV'23"), P(['Turbulence', 'Mitigation'], "NeurIPS'24"), P(['Flash-Splat'], "ECCV'24"))),
        C('Optical design', P(['CodedEvents'], "CVPR'24")),
    ]},
]
NBW = 160
EVAL = {'root': 'Evaluation & Benchmarks', 'box_w': 172, 'groups': [
    ('Benchmark', [(['PIPAL +', 'NTIRE IQA'], "ECCV'20 · 2021–22")]),
    ('Quality assessment', [(['Assessor360'], "NeurIPS'23")]),
    ('VLM', [(['VLM robustness'], "COLM'26")]),
], 'shared': {'PIPAL +': 'Quality assessment'}, 'tagged': True,
    'group_gap': 150}   # 2026-11-05 站主：三个分支之间拉开一点，整棵树舒展些（原来 54）
def nwidth(n):
    if n['k'] == 'p':
        return NBW
    kids = n['kids']
    gap = lambda a, b: SLOT_GAP if (a['k'] == 'p' and b['k'] == 'p') else GROUP_GAP
    w = sum(nwidth(k) for k in kids) + sum(gap(a, b) for a, b in zip(kids, kids[1:]))
    own = ROOT_W if n['k'] == 'r' else 26 + 9.6 * len(n['text'])
    return max(w, own)

def tier_width(t):
    w = 0
    for _, boxes in t['groups']:
        n = len(boxes)
        w += sum(b[2] if len(b) > 2 else t['box_w'] for b in boxes) + (n - 1) * SLOT_GAP
    return w + (len(t['groups']) - 1) * t.get('group_gap', GROUP_GAP)

W = max([tier_width(t) for t in [EVAL]] + [1560]) + 2 * MARGIN
s = []

def path(d, arrow=False):
    s.append(f'<path class="ln" d="{d}"' + (' marker-end="url(#ah)"' if arrow else '') + '/>')

VERT = []   # (x, y_from, y_to) of the last vertical leg of every connector, for hop detection
def drop(x0, y0, ybus, x1, y1, arrow=True):
    VERT.append((x1, ybus if abs(x1 - x0) >= 1 else y0, y1))
    if abs(x1 - x0) < 1:
        path(f'M{x0:.1f},{y0:.1f} L{x1:.1f},{y1 - 2:.1f}', arrow); return
    g = 1 if x1 > x0 else -1
    path(f'M{x0:.1f},{y0:.1f} L{x0:.1f},{ybus - R:.1f} Q{x0:.1f},{ybus:.1f} {x0 + g * R:.1f},{ybus:.1f} '
         f'L{x1 - g * R:.1f},{ybus:.1f} Q{x1:.1f},{ybus:.1f} {x1:.1f},{ybus + R:.1f} L{x1:.1f},{y1 - 2:.1f}', arrow)

def draw(t, top):
    bw = t['box_w']
    root_top = top
    bus1 = root_top + ROOT_H + 58
    label_y = bus1 + 80
    bus2 = label_y + 15 + 42 + t.get('extra_gap', 0)
    box_top = bus2 + 48
    x = (W - tier_width(t)) / 2
    groups = []
    for label, boxes in t['groups']:
        ws = [b[2] if len(b) > 2 else bw for b in boxes]
        width = sum(ws) + (len(ws) - 1) * SLOT_GAP
        centers, cur = [], x
        for wb in ws:
            centers.append(cur + wb / 2); cur += wb + SLOT_GAP
        groups.append((label, boxes, centers, x + width / 2))
        x += width + t.get('group_gap', GROUP_GAP)
    cx = W / 2
    s.append(f'<rect class="box root" x="{cx - ROOT_W / 2:.1f}" y="{root_top}" width="{ROOT_W}" height="{ROOT_H}" rx="4"/>')
    s.append(f'<text class="t-root" x="{cx:.1f}" y="{root_top + ROOT_H / 2 + 8}" text-anchor="middle">{escape(t["root"])}</text>')
    shared = t.get('shared', {})
    gxs = {g[0]: g[3] for g in groups}
    extra = []
    for label, boxes, centers, gx in groups:
        drop(cx, root_top + ROOT_H, bus1, gx, label_y - 16, arrow=False)
        lw = 26 + 9.6 * len(label)
        s.append(f'<rect class="chip" x="{gx - lw / 2:.1f}" y="{label_y - 16}" width="{lw:.1f}" height="32" rx="3"/>')
        s.append(f'<text class="t-chip" x="{gx:.1f}" y="{label_y + 6}" text-anchor="middle">{escape(label)}</text>')
        for box_t, bx in zip(boxes, centers):
            lines, venue = box_t[0], box_t[1]
            wb = box_t[2] if len(box_t) > 2 else bw
            src = shared.get(lines[0])
            off = 34
            if isinstance(src, tuple):
                src, off = src
            if src:
                side = -1 if gxs[src] < bx else 1          # second arrow enters on the side facing its label
                straight = abs(gx - bx) < 1                # own label sits right above: keep its arrow straight
                drop(gx, label_y + 16, bus2, bx if straight else bx - side * off, box_top, arrow=True)
                extra.append((gxs[src], bx + side * off))
            else:
                drop(gx, label_y + 16, bus2, bx, box_top, arrow=True)
            paper_box(lines, venue, bx, box_top, wb, BOX_H_TAG if t.get('tagged') else BOX_H)
    for sx, ex in extra:
        drop(sx, label_y + 16, bus2, ex, box_top, arrow=True)
    # long cross links drawn last, with small hops over the vertical lines they cross
    pos = {b[0][0]: bx for label, boxes, centers, gx in groups for b, bx in zip(boxes, centers)}
    for src, target, off in t.get('high', []):
        x0 = gxs[src]; xe = pos[target] + off; yc = label_y + 16 + 28; hr = 11  # between the labels and the fork lines
        trunks = [g[3] for g in groups if min(xe, x0) + 2 < g[3] < max(xe, x0) - 2]
        d = f'M{x0:.1f},{yc:.1f}'
        for xc in sorted(trunks, reverse=True):
            d += f' L{xc + hr:.1f},{yc:.1f} A{hr},{hr} 0 0 0 {xc - hr:.1f},{yc:.1f}'
        d += f' L{xe + R:.1f},{yc:.1f} Q{xe:.1f},{yc:.1f} {xe:.1f},{yc + R:.1f} L{xe:.1f},{box_top - 2:.1f}'
        path(d, arrow=True)
    for src, target, off in t.get('hops', []):
        x0 = gxs[src]; xe = pos[target] + off; yc = bus2 + 20; hr = 7
        xs = sorted({round(vx, 1) for vx, ya, yb in VERT if min(xe, x0) + 2 < vx < max(xe, x0) - 2 and ya < yc < yb}, reverse=(xe < x0))
        g = -1 if xe < x0 else 1
        d = f'M{x0:.1f},{yc:.1f}'
        for xc in xs:
            d += f' L{xc - g * hr:.1f},{yc:.1f} A{hr},{hr} 0 0 {1 if g > 0 else 0} {xc + g * hr:.1f},{yc:.1f}'
        d += f' L{xe - g * R:.1f},{yc:.1f} Q{xe:.1f},{yc:.1f} {xe:.1f},{yc + R:.1f} L{xe:.1f},{box_top - 2:.1f}'
        path(d, arrow=True)
    return box_top + (BOX_H_TAG if t.get('tagged') else BOX_H)

def node_h(n): return ROOT_H if n['k'] == 'r' else (32 if n['k'] == 'c' else BOX_H)

def place(n, left, top):
    """Assign x (center) and y (top) recursively; children start below a bus."""
    n['w'] = nwidth(n); n['x'] = left + n['w'] / 2; n['y'] = top
    if n['k'] == 'p':
        return top + BOX_H
    kids = n['kids']
    inner = sum(nwidth(k) for k in kids) + sum((SLOT_GAP if (a['k'] == 'p' and b['k'] == 'p') else GROUP_GAP) for a, b in zip(kids, kids[1:]))
    x = left + (n['w'] - inner) / 2
    bottom = top + node_h(n)
    n['bus'] = bottom + (46 if n['k'] == 'r' else 34)
    child_top = n['bus'] + (54 if n['k'] == 'r' else 40)
    low = bottom
    for a, b in zip(kids, kids[1:] + [None]):
        low = max(low, place(a, x, child_top))
        x += nwidth(a) + ((SLOT_GAP if (a['k'] == 'p' and b['k'] == 'p') else GROUP_GAP) if b else 0)
    return low

def render(n):
    if n['k'] == 'r':
        s.append(f'<rect class="box root" x="{n["x"] - ROOT_W / 2:.1f}" y="{n["y"]}" width="{ROOT_W}" height="{ROOT_H}" rx="4"/>')
        s.append(f'<text class="t-root" x="{n["x"]:.1f}" y="{n["y"] + ROOT_H / 2 + 8}" text-anchor="middle">{escape(n["text"])}</text>')
    elif n['k'] == 'c':
        lw = 26 + 9.6 * len(n['text'])
        s.append(f'<rect class="chip" x="{n["x"] - lw / 2:.1f}" y="{n["y"]}" width="{lw:.1f}" height="32" rx="3"/>')
        s.append(f'<text class="t-chip" x="{n["x"]:.1f}" y="{n["y"] + 22}" text-anchor="middle">{escape(n["text"])}</text>')
    else:
        bx = n['x']; top = n['y']
        s.append(f'<rect class="box" x="{bx - NBW / 2:.1f}" y="{top}" width="{NBW}" height="{BOX_H}" rx="4"/>')
        lines, venue = n['lines'], n['venue']
        k = len(lines) + 1
        y0 = top + BOX_H / 2 - (k * 20) / 2 + 15
        for j, ln in enumerate(lines):
            s.append(f'<text class="t-title" x="{bx:.1f}" y="{y0 + j * 20:.1f}" text-anchor="middle">{escape(ln)}</text>')
        s.append(f'<text class="t-venue" x="{bx:.1f}" y="{y0 + len(lines) * 20 + 2:.1f}" text-anchor="middle">{escape(venue)}</text>')
        return
    for kid in n['kids']:
        drop(n['x'], n['y'] + node_h(n), n['bus'], kid['x'], kid['y'], arrow=(kid['k'] == 'p'))
        render(kid)

def draw_tree(t, top):
    w = nwidth(t)
    bottom = place(t, (W - w) / 2, top)
    render(t)
    return bottom

def draw_captured(top):
    """Captured Visual Media: two problem branches, each with two sub-topics; CodedEvents shared by the last two."""
    bw = 160
    # 2026-11-05 站主：Imperfect imaging conditions 放左边，Restoring imperfect captures 放右边（分支里面的顺序不变）
    L1 = [('Imperfect imaging conditions', ['Robust perception', 'Physical prior']),
          ('Restoring imperfect captures', ['Model efficiency', 'Model generalization'])]
    groups = [
        ('Robust perception', [(['Video Snow', 'Removal'], "ICCV'23"), (['Turbulence', 'Mitigation'], "NeurIPS'24"), (['CodedEvents'], "CVPR'24")]),
        ('Physical prior', [(['Flash-Splat'], "ECCV'24")]),
        ('Model efficiency', [(['BSRN'], "NTIRE'22 winner"), (['VapSR'], "ECCVW'22"), (['SR by Predicting', 'Offsets'], "ECCV'22")]),
        ('Model generalization', [(['Interactive', 'Modulation'], "CVPRW'21")]),
    ]
    total = sum(len(b) * bw + (len(b) - 1) * SLOT_GAP for _, b in groups) + (len(groups) - 1) * GROUP_GAP
    x = (W - total) / 2
    centers, gx = {}, {}
    for name, boxes in groups:
        xs = [x + bw / 2 + i * (bw + SLOT_GAP) for i in range(len(boxes))]
        centers[name] = xs
        gx[name] = (xs[0] + xs[-1]) / 2
        x = xs[-1] + bw / 2 + GROUP_GAP
    l1x = {a: (gx[kids[0]] + gx[kids[-1]]) / 2 for a, kids in L1}
    cx = W / 2
    bus1 = top + ROOT_H + 58
    y1 = bus1 + 80                      # first-level chips (center)
    busr = y1 + 16 + 40
    y2 = busr + 62                      # second-level chips (center)
    bus2 = y2 + 16 + 42
    box_top = bus2 + 48
    def chip(text, xc, yc):
        lw = 26 + 9.6 * len(text)
        s.append(f'<rect class="chip" x="{xc - lw / 2:.1f}" y="{yc - 16:.1f}" width="{lw:.1f}" height="32" rx="3"/>')
        s.append(f'<text class="t-chip" x="{xc:.1f}" y="{yc + 6:.1f}" text-anchor="middle">{escape(text)}</text>')
    def box(lines, venue, bx):
        paper_box(lines, venue, bx, box_top, bw, BOX_H_TAG)
    s.append(f'<rect class="box root" x="{cx - ROOT_W / 2:.1f}" y="{top}" width="{ROOT_W}" height="{ROOT_H}" rx="4"/>')
    s.append(f'<text class="t-root" x="{cx:.1f}" y="{top + ROOT_H / 2 + 8}" text-anchor="middle">Captured Visual Media</text>')
    for a, kids in L1:
        drop(cx, top + ROOT_H, bus1, l1x[a], y1 - 16, arrow=False)
        chip(a, l1x[a], y1)
        for k in kids:
            drop(l1x[a], y1 + 16, busr, gx[k], y2 - 16, arrow=False)
    for name, boxes in groups:
        chip(name, gx[name], y2)
    shared_x = centers['Robust perception'][-1]
    for name, boxes in groups:
        if name == 'Physical prior':
            continue
        for (lines, venue), bx in zip(boxes, centers[name]):
            tx = bx - 34 if lines == ['CodedEvents'] else bx
            drop(gx[name], y2 + 16, bus2, tx, box_top, arrow=True)
            box(lines, venue, bx)
    # Physical prior: straight down to Flash-Splat, and a second arrow into CodedEvents (right side)
    phys_x = gx['Physical prior']
    (fl_lines, fl_venue), = dict(groups)['Physical prior']
    drop(phys_x, y2 + 16, bus2, phys_x, box_top, arrow=True)
    drop(phys_x, y2 + 16, bus2, shared_x + 34, box_top, arrow=True)
    box(fl_lines, fl_venue, phys_x)
    return box_top + BOX_H_TAG

def draw_generated(top):
    """Generate Visual Media: two problem branches -> keyword sub-topics -> papers; shared papers get extra arrows."""
    bw, gg = 164, 48
    L1 = [('Real-world fidelity', ['Generative scene completion', 'Physically grounded control']),
          ('Fast & precise control', ['Physically grounded control', 'Data & compute efficiency', 'AI for Science'])]
    groups = [
        ('Generative scene completion', [(['Flash-Split'], "CVPR'25"), (['Event-based Video', 'Interpolation'], "CVPR'25")]),
        ('Physically grounded control', [(['Real2SAM2Real'], "arXiv'26"), (['Vid2Bokeh'], "ECCV'26"), (['Parametric', 'Shadow Control'], "ICCV'25")]),
        ('Data & compute efficiency', [(['Pixel-perfect', 'editing'], 'ongoing')]),
        ('AI for Science', [(['What If?', 'Tropical cyclones'], None)]),
    ]
    EMPTY_W = 110
    spans = [(len(b) * bw + (len(b) - 1) * SLOT_GAP) if b else EMPTY_W for _, b in groups]
    widths = [max(sp, 26 + 9.6 * len(name) + 8) for (name, _), sp in zip(groups, spans)]   # room for the label chip
    total = sum(widths) + (len(groups) - 1) * gg
    x = (W - total) / 2
    centers, gx = {}, {}
    for (name, boxes), wd, sp in zip(groups, widths, spans):
        xs = [x + (wd - sp) / 2 + bw / 2 + i * (bw + SLOT_GAP) for i in range(len(boxes))]
        centers[name] = xs
        gx[name] = x + wd / 2
        x += wd + gg
    l1x = {a: (gx[k[0]] + gx[k[-1]]) / 2 for a, k in L1}
    cx = W / 2
    bus1 = top + ROOT_H + 58
    y1 = bus1 + 80
    busr = y1 + 16 + 40
    y2 = busr + 62
    bus2 = y2 + 16 + 42
    box_top = bus2 + 48
    def chip(text, xc, yc):
        lw = 26 + 9.6 * len(text)
        s.append(f'<rect class="chip" x="{xc - lw / 2:.1f}" y="{yc - 16:.1f}" width="{lw:.1f}" height="32" rx="3"/>')
        s.append(f'<text class="t-chip" x="{xc:.1f}" y="{yc + 6:.1f}" text-anchor="middle">{escape(text)}</text>')
    def box(lines, venue, bx):
        paper_box(lines, venue, bx, box_top, bw, BOX_H_TAG)
    s.append(f'<rect class="box root" x="{cx - ROOT_W / 2:.1f}" y="{top}" width="{ROOT_W}" height="{ROOT_H}" rx="4"/>')
    s.append(f'<text class="t-root" x="{cx:.1f}" y="{top + ROOT_H / 2 + 8}" text-anchor="middle">Generated Visual Media</text>')
    shared_l2 = 'Physically grounded control'
    for a, kids in L1:
        drop(cx, top + ROOT_H, bus1, l1x[a], y1 - 16, arrow=False)
        chip(a, l1x[a], y1)
        for k in kids:
            ex = gx[k] + (26 if l1x[a] > gx[k] else -26) if k == shared_l2 else gx[k]
            drop(l1x[a], y1 + 16, busr, ex, y2 - 16, arrow=False)
    for name, _ in groups:
        chip(name, gx[name], y2)
    c = {name: centers[name] for name, _ in groups}
    fs, ev = c['Generative scene completion']
    rs, vb, sh = c['Physically grounded control']
    fl, wi = c['Data & compute efficiency'][0], c['AI for Science'][0]
    arrows = [
        ('Generative scene completion', ev), ('Generative scene completion', fs), ('Generative scene completion', rs - 34),
        ('Physically grounded control', rs + 34), ('Physically grounded control', vb), ('Physically grounded control', sh - 34),
        ('Data & compute efficiency', sh + 34), ('Data & compute efficiency', fl), ('Data & compute efficiency', wi - 40),
        ('AI for Science', wi),
    ]
    for src, tx in arrows:
        drop(gx[src], y2 + 16, bus2, tx, box_top, arrow=True)
    for name, boxes in groups:
        for (lines, venue), bx in zip(boxes, c[name]):
            box(lines, venue, bx)
    return box_top + BOX_H_TAG

y = 20
parts = [('gen', None), ('cap', None), ('gm', EVAL)]
for i, (kind, t) in enumerate(parts):
    bottom = draw(t, y) if kind == 'gm' else (draw_captured(y) if kind == 'cap' else (draw_generated(y) if kind == 'gen' else draw_tree(t, y)))
    last = i == len(parts) - 1
    y = bottom + (28 if last else 130)
H = y

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Research Map Draft</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
/* Layout: three stacked Seaweed-style trees in one SVG; rounded orthogonal connectors; monochrome with gray label chips. */
:root {{ --bg: #ffffff; --ink: #1d1b2e; --muted: #555b66; --chip: #dcdcdc; --sep: #e6e6e6; --font: "IBM Plex Sans", Arial, sans-serif; color-scheme: light; }}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{ --bg: #14161b; --ink: #e8e9ee; --muted: #a3a9b5; --chip: #383d47; --sep: #2a2e36; color-scheme: dark; }}
}}
:root[data-theme="dark"] {{ --bg: #14161b; --ink: #e8e9ee; --muted: #a3a9b5; --chip: #383d47; --sep: #2a2e36; color-scheme: dark; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; }}
body {{ background: var(--bg); color: var(--ink); font: 16px/1.5 var(--font); }}
.wrap {{ max-width: 1640px; margin: 0 auto; padding: 40px 24px 56px; }}
.scroll {{ overflow-x: auto; }}
svg {{ display: block; width: 100%; min-width: 960px; height: auto; }}
.ln {{ fill: none; stroke: var(--ink); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }}
.sep {{ stroke: var(--sep); stroke-width: 1.5; }}
#ah path {{ fill: var(--ink); }}
.box {{ fill: var(--bg); stroke: var(--ink); stroke-width: 2; }}
.box.root {{ stroke-width: 2.6; }}
.chip {{ fill: var(--chip); }}
.tag {{ fill: none; stroke: var(--muted); stroke-width: 1.2; }}
.t-tag {{ fill: var(--muted); font: 500 12.5px var(--font); }}
.t-root {{ fill: var(--ink); font: 600 24px var(--font); letter-spacing: .01em; }}
.t-chip {{ fill: var(--ink); font: 500 17px var(--font); }}
.t-title {{ fill: var(--ink); font: 600 16px var(--font); }}
.t-venue {{ fill: var(--muted); font: 400 14px var(--font); }}
</style>
</head>
<body>
<div class="wrap">
  <div class="scroll">
    <svg viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="Three research trees. Generated Visual Media: Real-world fidelity (Generative scene completion, Physically grounded control) and Fast and precise control (Physically grounded control, Data and compute efficiency, AI for Science); What If?, Parametric Shadow Control and Real2SAM2Real each receive two arrows. Captured Visual Media: Restoring imperfect captures (Model efficiency, Model generalization) and Imperfect imaging conditions (Robust perception, Physical prior); CodedEvents is reached from both Robust perception and Physical prior. Evaluation and Benchmarks: Benchmark, Quality assessment, VLM; PIPAL is reached from both Benchmark and Quality assessment.">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
      {''.join(s)}
    </svg>
  </div>
</div>
</body>
</html>
'''
Path(__file__).with_name('index.html').write_text(html)
print('ok', round(W), round(H))
