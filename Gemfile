source "https://rubygems.org"

# 这个文件之前不存在（.gitignore 忽略了它，磁盘上也真的没有），
# 所以 MAINTENANCE.md 第 12 行的 `bundle exec jekyll serve` 实际上跑不起来 ——
# clone 下来的人没有任何东西可以 resolve。这里把它补回来。
#
# 为什么用 Jekyll 4 而不是 `github-pages` gem：
#   线上是 GitHub Pages 构建的，理论上 `github-pages` gem 最忠实。但它锁死
#   Jekyll 3.9.x，那套老依赖在 Ruby 3.4 上要额外打补丁（webrick 被移出标准库、
#   若干原生扩展编不过）。而本地和线上本来就已经不一致了 —— `_plugins/author_links.rb`
#   是自定义插件，GitHub Pages 根本不执行 `_plugins/`。
#   既然一致性已经破了，这里优先选"能干净地跑起来"。
gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-sitemap"   # 对应 _config.yml 里 plugins: 的唯一一项
end

# Ruby 3.x 把 webrick 移出了标准库，而 `jekyll serve` 要用它。
gem "webrick", "~> 1.8"
