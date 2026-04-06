// CVPR_Mine_DataGen_Bokeh.js
// Bokeh Data Samples 交互：支持 2D (aperture × focal) 索引。

document.addEventListener("DOMContentLoaded", function () {
  console.log("[BokehData] CVPR_Mine_DataGen_Bokeh.js loaded");

  // ---------- 配置区：这里填你的数据规格 ----------

  const SCENES_CONFIG = {
    scene1: {
      label: "City Hall Scene",
      basePath: "./static/DataGen_Bokeh/CityHall_compress",
      numAperture: 14,
      numFocal: 9,
      indexOffset: 0,
      indexDigits: 3
    }
  };

  const DEFAULT_SCENE_ID = "scene1";

  // ---------- 状态 ----------

  let currentSceneId = DEFAULT_SCENE_ID;
  let currentApertureIdx = 0; // [0, numAperture)
  let currentFocalIdx = 0;    // [0, numFocal)

  // ---------- DOM ----------

  const imageWrapper = document.getElementById("bokehdata-viewer");
  const focalSlider = document.getElementById("bokehdata-focal-slider");
  const apertureSlider = document.getElementById("bokehdata-aperture-slider");

  if (!imageWrapper || !focalSlider || !apertureSlider) {
    console.warn("[BokehData] Missing DOM elements, please check IDs.");
    return;
  }

  const img = document.createElement("img");
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  img.alt = "Bokeh data sample preview";
  imageWrapper.innerHTML = "";
  imageWrapper.appendChild(img);

  // ---------- 工具 ----------

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function sliderToIndex(sliderValue, numSteps) {
    if (numSteps <= 1) return 0;
    const v = parseFloat(sliderValue);
    const idx = Math.round((v / 100) * (numSteps - 1));
    return clamp(idx, 0, numSteps - 1);
  }

  function buildFilename(globalIndex, digits) {
    const padded = String(globalIndex).padStart(digits, "0");
    return `img_${padded}.jpg`;
  }

  function getCurrentConfig() {
    const cfg = SCENES_CONFIG[currentSceneId];
    if (!cfg) {
      console.warn("[BokehData] No config for scene:", currentSceneId);
      return SCENES_CONFIG[DEFAULT_SCENE_ID];
    }
    return cfg;
  }

  // ---------- 渲染 ----------

  function updateImageFromState() {
    const cfg = getCurrentConfig();
    if (!cfg) return;

    const apIdx = clamp(currentApertureIdx, 0, cfg.numAperture - 1);
    const fpIdx = clamp(currentFocalIdx, 0, cfg.numFocal - 1);

    // 核心：2D → 1D 映射
    // 假设 img_000 ~ img_125 是：
    //   [ap=0, focal=0..F-1], [ap=1, focal=0..F-1], ...
    const globalIndex = cfg.indexOffset + apIdx * cfg.numFocal + fpIdx;

    const filename = buildFilename(globalIndex, cfg.indexDigits);
    const src = `${cfg.basePath}/${filename}`;

    console.log("[BokehData] updateImageFromState:", {
      scene: currentSceneId,
      apIdx,
      fpIdx,
      globalIndex,
      src
    });

    img.src = src;
    img.dataset.apertureIdx = String(apIdx);
    img.dataset.focalIdx = String(fpIdx);
    img.dataset.sceneId = currentSceneId;
  }

  // ---------- 事件 ----------

  focalSlider.addEventListener("input", function (e) {
    const cfg = getCurrentConfig();
    currentFocalIdx = sliderToIndex(e.target.value, cfg.numFocal);
    updateImageFromState();
  });

  apertureSlider.addEventListener("input", function (e) {
    const cfg = getCurrentConfig();
    currentApertureIdx = sliderToIndex(e.target.value, cfg.numAperture);
    updateImageFromState();
  });

  // ---------- 初始状态 ----------

  focalSlider.value = "5";
  apertureSlider.value = "90";
  currentSceneId = DEFAULT_SCENE_ID;

  // index 初始在中间
  {
    const cfg = getCurrentConfig();
    currentFocalIdx = sliderToIndex(focalSlider.value, cfg.numFocal);
    currentApertureIdx = sliderToIndex(apertureSlider.value, cfg.numAperture);
  }

  updateImageFromState();
});
