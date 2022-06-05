---
pageClass: home-page
# some data for the components

name: Haoming CAI (Helmut Choy)
profile: /profile.jpg

socials:
  - title: github
    icon: "/icons/github.svg"
    link: https://github.com/HaomingCai
  - title: Scholar
    icon: "/icons/Scholar.png"
    link: https://github.com/HaomingCai


cv: /PDF/CV.pdf
bio: Feel free to call me Helmut or Haoming.
# emailcuhk : haomingcai@link.cuhk.edu.cn (Abandoned)
# emailumd :  hmcai@umd.edu (Univ of Maryland)
# emailmain : helmut.choy@gmail.com
---

<ProfileSection :frontmatter="$page.frontmatter" />


::: tip << Rick and Morty >>
**Sometimes Science Is More Art Than Science**
 -- <cite>Rick Sanchez</cite>
:::

## Contact Info
~~haomingcai@link.cuhk.edu.cn~~

(Main) hmcai@umd.edu

(Main) helmut.choy@gmail.com


## About Me

I am an incoming Ph.D. student in Computer Science at the [University of Maryland - College Park](https://www.cs.umd.edu) with Dean Fellowship Awards.

Currently, I am a Research Assistant supervised by Prof.[Chao DONG](https://scholar.google.com/citations?user=OSDCB0UAAAAJ&hl=en) from [XPixel](http://xpixel.group). I also work closely with Ph.D. cancidate [Jinjin GU](https://scholar.google.com/citations?user=uMQ-G-QAAAAJ&hl=en).

My previous research interests mainly lie in Computer Vision and its related explainations caused by Deep Learning, especially in:

* **Low-level Vision** : How to Design and Guide more efficient Image Restoration models to tackle multiple and tangled distortions in real-world scenario.

* **Explainable Artificial Intelligence** : How to observe/depict/measure the procedure that machine extracts and leverages information embeded in the image and video. 





## News

::: warning Newest
[May/20/2022] :yum: I will become a CS Ph.D. student at UMD with Dean Fellowship Award this fall.
:::

- [Apr-20-2022] Winner of Model Complexity Track in NTIRE 2022 Efficient Image Super-resolution Challenge (more than 30 teams).

- [Feb-20-2022] I became the co-organizer of 2nd Perceptual IQA Challenge in NTIRE 2022.

 <details>
  <summary> <b>Click to see Previous News</b> </summary>

  * [Apr/23/2021] [One paper](https://arxiv.org/abs/2105.03072) (The report of NTIRE IQA Challenge) got accepted to CVPR 2021 NTIRE workshop. More in [NTIRE 2021 Codalab](https://data.vision.ee.ethz.ch/cvl/ntire21/)

  * [Apr/22/2021] [One paper](https://arxiv.org/abs/2105.03085) got accepted to CVPR 2021 NTIRE workshop.

  * [Jan/07/2021] Host [CVPR 2021 NTIRE IQA Challenge](https://data.vision.ee.ethz.ch/cvl/ntire21/) as core co-organizer.

  * [Jul/05/2020] [One paper (Conference version of PIPAL dataset)](https://link.springer.com/chapter/10.1007/978-3-030-58621-8_37) was accepted by ECCV 2020.

</details>



## Selected Publications

[→ Full list in Goolge Scholar](https://scholar.google.com/citations?user=mePn76IAAAAJ&hl=en)


<ProjectCard image="/projects/CUGAN_Fig.png" hideBorder=true>

  **Toward Interactive Modulation for Photo-Realistic Image Restoration**

  **Haoming Cai**, Jingwen He, Yu Qiao, Chao Dong.

  **CVPR NTIRE 2021**
  
  [[PDF](https://openaccess.thecvf.com/content/CVPR2021W/NTIRE/papers/Cai_Toward_Interactive_Modulation_for_Photo-Realistic_Image_Restoration_CVPRW_2021_paper.pdf)] [[Code](https://github.com/HaomingCai/CUGAN)]

</ProjectCard>



<ProjectCard image="/projects/PIPAL_2.png" hideBorder=true>

  **Pipal: a large-scale image quality assessment dataset for perceptual image restoration**

  Gu Jinjin, **Haoming Cai**, Chen Haoyu, Ye Xiaoxing, Jimmy S Ren, Dong Chao.

  **ECCV 2020**
  
  [[PDF](https://link.springer.com/chapter/10.1007/978-3-030-58621-8_37)] [[Code](https://github.com/HaomingCai/PIPAL-dataset)] 


</ProjectCard>



## Education/Research Experience
![avartar](Research_Experience.png)


## Academic Service & Awards
#### Awards

- UMD Dean Fellowship Awards 2022-2024

#### Workshop Co-organizer

- Perceptual Image Quality Assessment Challenge in CVPR 2021&2022 NTIRE workshop

#### Academic Reviewer

- ICCV 2021, TPAMI, ACM TOMM, CVPR 2021&2022 NTIRE workshop



## Daily Blog
[→ Full Blog](https://scholar.google.com/citations?user=mePn76IAAAAJ&hl=en)

Coming Soon

## Photography
[→ Full Library](https://scholar.google.com/citations?user=mePn76IAAAAJ&hl=en)

Coming Soon









<!-- Custom style for this page -->

<style lang="stylus">

.theme-container.home-page .page
  font-size 16px
  font-family "lucida grande", "lucida sans unicode", lucida, "Helvetica Neue", Helvetica, Arial, sans-serif;
  p
    margin 0 0 0.5rem
  p, ul, ol
    line-height normal
  a
    font-weight normal
  .theme-default-content:not(.custom) > h2
    margin-bottom 0.5rem
  .theme-default-content:not(.custom) > h2:first-child + p
    margin-top 0.5rem
  .theme-default-content:not(.custom) > h3
    padding-top 4rem
  /* .theme-default-content:not(.custom) > {
      max-width: 200px;
  } */

  /* Override */
  .md-card
    margin-top 0.5em
    .card-image
      padding 0.2rem
      img
        max-width 150px
        max-height 120px
    .card-content p
      -webkit-margin-after 0.2em

@media (max-width: 419px)
  .theme-container.home-page .page
    p, ul, ol
      line-height 1.5

    .md-card
      .card-image
        img 
          width 100%
          max-width 500px

</style>
