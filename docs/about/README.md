---
pageClass: about-page
description: 'The biography and information about me.'
avatar: /profile.jpg
head: 'Haoming Cai (Helmut Choy)'
info: 'Incoming CS PhD Student @ UMD'
interests: 'Interests: Photography, Dive, Formula One Racing, Parachuting.'
socials:
- title: github
  link: https://github.com/HaomingCai
actions:
- text: Blog
  link: https://github.com/mtobeiyf
- text: CV
  link: /PDF/CV.pdf
footer: Made with ♥ by Fing. Powered by VuePress
---

<AboutCard :frontmatter="$page.frontmatter" >

I love road trips, photography, and motorcycle. They inspire my careful and patient observation of this beautiful and vital world. Ashes to Ashes, Dust to Dust. With limited life, I wanna enjoy more things, and knowledge, and create more value. 

</AboutCard>

<style lang="stylus">

.theme-container.about-page .page
  background-color #e6ecf0
  min-height calc(100vh)
  
  .last-updated
    display none

</style>