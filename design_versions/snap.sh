#!/bin/bash
# 构建 Jekyll → 起本地服务 → 桌面+手机双截图 → 存进 design_versions/vN/
# 用法: ./design_versions/snap.sh v1
set -e
V="${1:?用法: snap.sh <版本名，如 v1>}"
ROOT="/Users/haomingcai/Documents/Claude/Projects/HaomingCai.github.io"
OUT="$ROOT/design_versions/$V"
SHOT="/private/tmp/claude-501/-Users-haomingcai-Documents-Claude-Projects-HaomingCai-github-io/3f182f51-a355-4d24-888a-5294b5e877c1/scratchpad"
PORT=4321

export PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"
mkdir -p "$OUT"
cd "$ROOT"

# 构建
bundle exec jekyll build --quiet 2>&1 | grep -vE '^\s*$' | head -5 || true

# 起服务（先杀掉旧的）
pkill -f "jekyll serve" 2>/dev/null || true
sleep 1
nohup bundle exec jekyll serve --port $PORT --skip-initial-build --no-watch > /tmp/jekyll.log 2>&1 &
for i in $(seq 1 20); do
  sleep 1
  curl -s -o /dev/null http://localhost:$PORT/ && break
done

# 截图
cd "$SHOT"
node shot.mjs "http://localhost:$PORT/" "$OUT/desktop.png" 1280
node shot.mjs "http://localhost:$PORT/" "$OUT/mobile.png" 390

# 快照源码
cp "$ROOT/_layouts/default.html" "$OUT/default.html"
cp "$ROOT/style.scss" "$OUT/style.scss"
[ -f "$ROOT/_includes/publication.html" ] && cp "$ROOT/_includes/publication.html" "$OUT/publication.html"

pkill -f "jekyll serve" 2>/dev/null || true
echo "✅ $V 快照完成 -> design_versions/$V/"
