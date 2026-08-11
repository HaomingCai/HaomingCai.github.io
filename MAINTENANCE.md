# 维护手册

这一页看起来简单，但有几处**碰了就会悄悄坏掉**的地方 —— 坏得不明显，构建照样通过，只是页面变糟。
先读第 4 节（陷阱），再动手。

---

## 1. 跑起来

```bash
export PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"   # 必须。系统自带 Ruby 2.6 太老，跑不动
bundle install                                       # 只有第一次 / 换机器时需要
bundle exec jekyll serve
```
→ http://localhost:4000/

**第一行不能省。** 忘了它会得到一堆 bundler 版本错误。

**全新机器还需要**（2026-08 实测顺序）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"            # 装完照它提示写进 ~/.zprofile
brew install ruby@3.4                                # 别装 ruby（默认已是 4.x，Jekyll 没验证过）
```

> `Gemfile` / `Gemfile.lock` 现在**在版本库里**。它们曾经被 `.gitignore` 忽略且磁盘上也不存在 ——
> 后果是上面这条 `bundle exec jekyll serve` 对任何 clone 这个仓库的人（包括换了新机器的自己）
> 都**根本跑不起来**，因为没有任何东西可以 resolve。别再把它们加回 `.gitignore`。
>
> `_config.yml` 的 `exclude` 里仍然列着这两个文件 —— 那是"不要发布到站点上"，
> 和"要不要进版本库"是两件事，别混淆。

---

## 2. 文件在哪

| 文件 | 管什么 |
|---|---|
| `_layouts/usha.html` | **整个页面结构 + 所有 JS**（光影、交互控件、News 折叠、作者链接）。改页面改这个 |
| `_layouts/default.html` | ⚠️ **死文件，没有任何页面在用它**。`index.html` / `usha.html` / `_layouts/post.html` 全部 `layout: usha`。它是 usha 的旧副本，改它不会有任何效果 |
| `_includes/publication.html` | 单条论文。三种形态：`featured`（大卡）/ `compact`（纯文字行）/ 默认（带缩略图） |
| `style.scss` | 全部样式。顶部四行是配色开关 |
| `_posts/*.markdown` | 论文数据。**加论文只需新建一个文件，不用碰代码** |
| `_data/authors.yml` | 作者 → 主页链接。页面上的作者名会自动变成链接 |
| `tn/playground/` | 两个交互控件的雪碧图 + JSON |
| `design_versions/` | 21 个历史版本的截图，可回溯 |

---

## 3. 常见操作

### 加一篇论文
在 `_posts/` 新建 `YYYY-MM-DD-名字.markdown`：

```yaml
---
layout: post
title:  "论文标题"
date:   2026-01-01 00:00:00 +00:00
image: /images/xxx.png        # 或 /videos/xxx.mp4
categories: GenAI             # GenAI | AdverseWeather | IQA | SR
authors: "<strong>Haoming Cai</strong>, Other Person"
venue: "<strongvenue>CVPR 2026</strongvenue>"
arxiv: https://...
website: https://...
dataset: https://...          # 可选
links:                        # 可选，任意多个额外链接
  - "标签|https://..."
---
一句话摘要（祈使句，说"这让你能做什么"）
```

分区由 `categories` 决定。**只有 `SR` 分区不显示缩略图**（在 `usha.html` 的 `compact_cats` 里改）。

### 加一条 News
`usha.html` 的 `.news__list` 里加一个 `<li>`。**`<time datetime="2026-01">` 必须写** —— 一年前的条目靠它自动折叠。

### 换 Selected Work 的两篇
`usha.html` 里改这一行（匹配 title 的片段）：
```liquid
{%- assign featured = "Parametric Shadow Control,Large-Scale Light Field Synthesis" | split: "," -%}
```

### 更新 CV

CV 自托管在仓库根目录，线上固定地址是 **`https://www.hm-cai.com/cv.pdf`**。

```bash
cp /path/to/新的/cv.pdf ./cv.pdf     # 覆盖，不要改名
git add cv.pdf && git commit -m "Update CV" && git push
# ↓ 这步别忘，见 4.9
# 去 Cloudflare 控制台 Purge Cache
```

顺手把两处 `Updated Aug 2026` 小字也改掉（`usha.html` 里搜 `cta__note`，共 2 处）。

> **文件名必须永远是 `cv.pdf`。** 不要 `cv_v2.pdf`、不要 `cv_2026.pdf`、不要任何版本号或日期后缀。
>
> 这个 URL 会被写进求职申请表和邮件里。**一旦改名，之前所有发出去的链接立刻全废。**
> 这正是当初抛弃 Google Drive 的原因 —— 它每次上传都换一个 file ID。
> 加后缀等于把刚扔掉的问题重新捡回来。

### 补作者链接
`_data/authors.yml` 里加 `"姓名": "链接"`。不用改任何代码。

### 换配色
`style.scss` 顶部四行。**改完必须跑对比度检查**（见第 4 节）。

---

## 4. ⚠️ 陷阱 —— 这些地方碰了会悄悄坏掉

### 4.1 对比度是硬上限，不是建议

页面上每一处颜色都卡在 WCAG 的边缘，**再亮一点点就读不清了**：

| 元素 | 当前值 | 对比度 | 余量 |
|---|---|---|---|
| 名字高光核心 | `#ab8259` | 3.26:1 | 大字要 **3:1** —— **几乎没有余量** |
| bio 正文高光 | `#7e6040` | 5.44:1 | 正文要 4.5:1 |
| `$muted`（摘要/元信息）| `#726b61` | 4.96:1 | **别再调浅** |
| 链接 `$accent` | `#b0503a` | 4.88:1 | **不能再亮** |
| 提示行的柔光底 | 染色 ≤ 5.5% | 4.54:1 | 染到 8% 就掉线 |

**每次改颜色，截图脚本会自动扫描页面上真实渲染的每一段文字并报警。** 别忽略它。

> 教训：我曾把 `$muted` 调浅一点点，肉眼看着更精致，实测掉到 **3.53:1**。而且回头一查，**原来的值（4.36:1）也一直不达标** —— 从第一版就错了，三轮都没发现，因为它"看起来没问题"。

### 4.2 `background-clip: text` 会裁掉字母的尾巴

名字和 bio 正文用了 `background-clip: text`（那道跟随鼠标的高光）。**它把行盒变成硬裁切边界** —— 装不下的部分**直接消失**。

- Space Grotesk 在 44px 下需要 **56px** 行高（Inter 只要 54px）
- 当前 `line-height: 1.32`，留了余量

**换字体或改字号 → 必须重新量**，否则 `Haoming` 的 `g` 会被砍头。

### 4.3 视频：三条铁律

**① 检查 `sample_aspect_ratio`**
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,sample_aspect_ratio -of csv=p=0 xxx.mp4
```
必须是 `1:1`。仓库里原来那个 `merged_output.mp4` 是 `960x540` + SAR `9:16` —— **垂直分辨率只有一半，画面发虚**，而肉眼很难看出来。

**② 同一主体的变化用溶，不同主体之间用切**
交叉淡化两张**不同的脸**会产生鬼影（两个人的五官叠在一起）。
- ShadowDirector：同一张脸的光变 → 溶；换人 → **硬切**
- Flash-Split：同一个场景的反射消失 → **溶**（原来是硬切，2 帧 1fps，眼睛跟不上）

**③ 别直接用 GIF**
GIF 压缩效率极差。页面上原本有 **16.2 MB** 的 GIF，其中一个 13.4 MB —— **而它的 1.5 MB MP4 版本早就躺在仓库里没被用**。全部转 MP4 后降到 1.76 MB。

转换命令：
```bash
ffmpeg -y -i in.gif -vf "scale=480:480:flags=lanczos,setsar=1:1,fps=25" \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
```
`-movflags +faststart` 不能省 —— 它把 `moov` atom 挪到文件头，否则浏览器要下完整个文件才能开始播。

### 4.4 换了媒体文件但页面没变？是缓存

视频 URL 带了构建时间戳（`?v=...`），所以**重新构建后 URL 会变，缓存必然失效**。
如果你手动改了图片（`.jpg`/`.png`），**图片没有这个保护** —— 需要硬刷新（Cmd+Shift+R）。

### 4.5 交互控件的节奏是可配置的，别写死

```html
<figure class="scrub" data-scrub
        data-atlas="/tn/playground/bokeh_atlas"
        data-mode="1d" data-fade="0"
        data-cycle="560" data-gap="30">
```
- `data-cycle` / `data-gap` 控制自动播放速度
- **两者不是线性关系**（`640/34` 实测比 `560/30` 还慢）—— 改完必须实测，别信直觉

### 4.6 雪碧图的显示尺寸不能超过图块尺寸

- bokeh 图块 400px，shadow 图块 420px
- 显示尺寸 165px → **只缩不放**，所以看不到 JPEG 压缩痕迹

**把卡片改大就会露出 artifact。** 要放大就得重新生成更大的雪碧图（体积会涨）。

### 4.7 CSS Grid 的列会被内容撑破

网格项默认 `min-width: auto` —— **内容可以把列撑得比 `1fr` 更宽**，然后整页出现横向滚动。

真实案例：给 PIPAL 加了 5 个链接（PDF / Dataset / 三个 NTIRE），
`.pub__links` 是不换行的 flex 行 → 在 390px 手机上把栅格撑破，**整页横向溢出 78px**。

已加的防护：
- `.pub__body { min-width: 0; }`
- `.pub__links { flex-wrap: wrap; }`

**任何时候往栅格里塞新内容（尤其是不换行的一排东西），都要在 320/360/390px 下测一遍。**

### 4.8 `text-wrap: pretty` 救不了孤行

Chrome 的实现很保守，遇到"末行只剩一个词"直接放弃。
**短文本用 `text-wrap: balance`**（6 行以内有效）。当前 `.pub__title` / `.pub__excerpt` / `.news__list p` / `.cvo__note` 都用的 balance。

### 4.9 站点在 Cloudflare 后面 —— 静态文件推上去了也未必看得到

**推送成功 ≠ 上线。** `www.hm-cai.com` 走的是 Cloudflare，它会缓存静态资源（PDF / 图片 / CSS），
`max-age=14400`，也就是**最长 4 小时**。

HTML 页面是 `cf-cache-status: DYNAMIC`（不缓存），所以**改页面不受影响**，推完就能看到。
**受影响的是 `cv.pdf` 这类静态文件。**

2026-08-10 真实踩坑：`cv.pdf` 第一次上线时，Cloudflare 在文件还没部署完的窗口里请求了一次，
把那个 **404 缓存了下来**。结果 GitHub Pages 那边文件完全正常，但线上访问：

```
https://www.hm-cai.com/cv.pdf          →  404   (cf-cache-status: HIT)
https://www.hm-cai.com/cv.pdf?x=123    →  200   (cf-cache-status: MISS，源站是好的)
```

**诊断方法** —— 带个随机查询参数再请求一次，绕开缓存键：

```bash
curl -sSI https://www.hm-cai.com/cv.pdf              # 看 cf-cache-status 和 age
curl -sSI "https://www.hm-cai.com/cv.pdf?x=$RANDOM"  # 这个是 200 就说明源站没问题，是缓存的锅
```

两者不一致 → 就是缓存。**解法：Cloudflare 控制台 → 域名 → Caching → Configuration → Purge Everything。**
清完约 10 秒内生效。

**每次更新 `cv.pdf` 之后都要清一次**，否则最多 4 小时内别人下到的还是旧版 CV ——
而且这种失败是静默的：你自己浏览器可能有本地缓存，看着"是新的"，别人看到的却是旧的。

---

## 5. 每次改完，跑这些检查

截图脚本在 `design_versions/snap.sh`，它会自动：
- Jekyll 构建
- 桌面（1280px）+ 手机（390px）双截图
- **扫描页面上每一段真实渲染的文字，检查 WCAG AA 对比度**
- 检查破图 / 横向溢出

```bash
./design_versions/snap.sh v22
```

**跨浏览器**（这一版重度依赖 `backdrop-filter` / `background-clip: text` / `mix-blend-mode`，Safari 有名的坑）：
三个引擎都实测通过（Chrome / Safari / Firefox），但**改了这些属性就要重测**。

**Lighthouse**（当前：性能 98 / 无障碍 100 / 最佳实践 96 / SEO 100）：
```bash
lighthouse http://localhost:4000/ --preset=desktop --view
```

---

## 6. 还没做的

1. **10 位合作者的链接**（填 `_data/authors.yml`）：
   - 优先：**Lin Zhou**（VapSR 共同一作）、**Yingqi Liu**（出现 2 篇）
   - 其余：Hongtao Wu、Xuequan Lu、Jing Xiao、Yinqiang Zheng、Chenyu Dong、Chun Yuan、Ruofan Zhang、Xiaoxing Ye

2. **GoatCounter 访客统计**（替代已删的 ClustrMaps）
   去 goatcounter.com 注册拿一个站点名，然后在 `usha.html` 的 `<head>` 加：
   ```html
   <script data-goatcounter="https://你的站点名.goatcounter.com/count"
           async src="//gc.zgo.at/count.js"></script>
   ```
   现有的 Google Analytics（`G-E00L9PT3V9`）还在跑，不冲突。

3. **头像**。毒舌评审的原话："一个研究光和相机的人，给你看的是一张打光很差的手机照 —— 这不是审美问题，是可信度问题。"
   换图只需覆盖 `images/profile.png`，然后重新生成 380px 版本。

---

## 7. 上线

**远端现在是接着的**（`origin` → `git@github.com:HaomingCai/HaomingCai.github.io.git`），
`git push` 会**直接改动线上真站**。推之前先本地看一眼。

```bash
git push origin master
```

推完到真正上线约 **2 分钟**（2026-08-10 实测 105 秒）。判断是否上线，别刷浏览器 —— 浏览器有本地缓存，
直接查线上：

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://www.hm-cai.com/cv.pdf?x=$RANDOM"
```

**如果动了 `cv.pdf` 之类的静态文件，推完还要去 Cloudflare 清缓存 —— 见 4.9。**

> 这份文档早期版本写的是"远端已被移除（`git remote remove origin`），物理上推不出去"，
> 理由是"规则会被违反，物理限制不会"。那个保护**现在已经不在了**，remote 是通的。
> 想恢复那种保护就 `git remote remove origin`，但记住：恢复之后这一节的命令也要跟着改回去。

### 提交身份

这个仓库的 git 身份已写进本地配置（`HaomingCai <helmut.choy@gmail.com>`）。
不设的话，git 会自动推断成 `haomingcai@<机器名>.local` —— **提交能成功，但 GitHub 认不出是你**，
贡献记录不会计入你的账号。换新机器 clone 之后记得设：

```bash
git config --local user.name "HaomingCai"
git config --local user.email "helmut.choy@gmail.com"
```
