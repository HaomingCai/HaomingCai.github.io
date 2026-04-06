# updated website

This repo is built on a fork of **Jekyll Now** from [this repository](https://github.com/barryclark/jekyll-now). **Jekyll** is a static site generator that's perfect for GitHub hosted blogs ([Jekyll Repository](https://github.com/jekyll/jekyll))

The website design is just a modification of [Jon Barron's website](https://jonbarron.info/) and is converted for my own use, re-purposing my old markdown posts. **Feel free to use template for your own purposes**, but please respect copyright for all the images/content in my `images`, `pdfs`, `_posts` folders. 

## issues

- In general, jekyll will try to build a full page for every post. I skip that by forcing `permalink: /`. This creates multiple entries in sitemap.xml for index.html but is otherwise fine. 
- If you want multiple paragraphs, consider using `excerpt_separator: <!--more-->` in `_config.yml`, for my own use I didn't need this. 
- My own posts have lots of extra stuff left over from my old jekyll design ("author", long descriptions, etc.), feel free to ignore them
- I use thumbnails, so I can upload arbitrary sized images but then only display small ones. The `_make_thumbnails.sh` script generates them and the html template looks in `tn/` for all images. 
- I have three categories of post with slightly differerent formatting, so changing sizing requires edits in multiple paces.

## Local build (macOS / Linux)

Prerequisites: **Ruby 3.x** and **Bundler**. On macOS, [Homebrew Ruby](https://formulae.brew.sh/formula/ruby) is recommended; **do not** use the system Ruby at `/usr/bin/ruby` or `/usr/bin/bundle` for this project.

### Easiest: repo scripts (always pick Homebrew Ruby)

From the repo root:

```bash
./bin/jekyll-serve    # local preview → http://127.0.0.1:4000/
./bin/jekyll-build    # write static site to _site/
```

First time, install gems with **Homebrew’s** `bundle` (not `/usr/bin/bundle`):

```bash
cd /path/to/HaomingCai.github.io
/opt/homebrew/opt/ruby/bin/bundle install    # Apple Silicon
# /usr/local/opt/ruby/bin/bundle install     # Intel Homebrew
```

Then `./bin/jekyll-serve` works.

### Manual: `bundle exec` (only if `which bundle` is Homebrew)

1. **Install dependencies** (first time, or after changing `Gemfile`):

   ```bash
   cd /path/to/HaomingCai.github.io
   bundle install
   ```

   Gems go under `vendor/bundle/` (see `Gemfile`).

2. **Build only** (output goes to `_site/`):

   ```bash
   bundle exec jekyll build
   ```

3. **Serve locally** (with live reload):

   ```bash
   bundle exec jekyll serve
   ```

   Open **[http://127.0.0.1:4000/](http://127.0.0.1:4000/)** in your browser.

### “Could not find bundler (4.0.0)” / path shows `/System/Library/.../Ruby.framework`

Your shell is using **macOS system Ruby** (`/usr/bin/bundle`), but `Gemfile.lock` was generated with **Homebrew Ruby** and **Bundler 4.x**. Fix one of:

- Put Homebrew Ruby first in `PATH` (in `~/.zshrc`), then open a **new** terminal tab:

  ```bash
  export PATH="/opt/homebrew/opt/ruby/bin:$PATH"   # Apple Silicon
  # export PATH="/usr/local/opt/ruby/bin:$PATH"   # Intel Homebrew
  ```

  Check: `which ruby` should **not** be `/usr/bin/ruby`; `which bundle` should be under `/opt/homebrew` or `/usr/local/opt/ruby`.

- Or always use the full path: `/opt/homebrew/opt/ruby/bin/bundle exec jekyll serve`

- Or use **`./bin/jekyll-serve`** from this repo (prepends Homebrew Ruby for you).

**Note:** Always use `bundle exec` (or the scripts above) so Jekyll matches `Gemfile` / `Gemfile.lock`. Plain `jekyll serve` may use the wrong Ruby.

**Note:** Cursor’s integrated terminal sometimes does not load `~/.zshrc`, so it may behave differently from Terminal.app until `PATH` is fixed.

**Note:** With `permalink: /` in `_config.yml`, Jekyll may warn that many posts share the same destination `index.html`; that is expected for this site layout.

### Windows

Use [RubyInstaller](https://rubyinstaller.org/) (include MSYS2 dev tools), then run the same `bundle install` and `bundle exec jekyll serve` from a terminal in the repo root.