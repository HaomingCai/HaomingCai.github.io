// CVPR_Mine_DataCapture_Compare.js
// Data Capture Comparison: Depth-Based Rendering vs. Ours
// File lists are embedded directly; JS parses filenames to build slider grids.

document.addEventListener("DOMContentLoaded", function () {

  // ─── Embedded file lists ───────────────────────────────────────────────────
  // Scene: IMG_5253
  //   ls static/Data_Capture/IMG_5253_Ours/view_000/jpg/
  //   ls static/Data_Capture/IMG_5253_BokehDiff/view_000/output/

  const OURS_FILES = [
    "bokeh_ap06.00_slope-1.400.jpg",
    "bokeh_ap06.00_slope-1.600.jpg", "bokeh_ap06.00_slope-1.700.jpg", "bokeh_ap06.00_slope-1.800.jpg",
    "bokeh_ap06.00_slope-1.900.jpg", "bokeh_ap06.00_slope-2.000.jpg", "bokeh_ap06.00_slope-2.100.jpg",
    "bokeh_ap06.00_slope-2.200.jpg", "bokeh_ap06.00_slope-2.300.jpg", "bokeh_ap06.00_slope-2.400.jpg",
    "bokeh_ap06.00_slope-2.500.jpg", "bokeh_ap06.00_slope-2.600.jpg",
    "bokeh_ap08.00_slope-1.400.jpg",
    "bokeh_ap08.00_slope-1.600.jpg", "bokeh_ap08.00_slope-1.700.jpg", "bokeh_ap08.00_slope-1.800.jpg",
    "bokeh_ap08.00_slope-1.900.jpg", "bokeh_ap08.00_slope-2.000.jpg", "bokeh_ap08.00_slope-2.100.jpg",
    "bokeh_ap08.00_slope-2.200.jpg", "bokeh_ap08.00_slope-2.300.jpg", "bokeh_ap08.00_slope-2.400.jpg",
    "bokeh_ap08.00_slope-2.500.jpg", "bokeh_ap08.00_slope-2.600.jpg",
    "bokeh_ap10.00_slope-1.400.jpg",
    "bokeh_ap10.00_slope-1.600.jpg", "bokeh_ap10.00_slope-1.700.jpg", "bokeh_ap10.00_slope-1.800.jpg",
    "bokeh_ap10.00_slope-1.900.jpg", "bokeh_ap10.00_slope-2.000.jpg", "bokeh_ap10.00_slope-2.100.jpg",
    "bokeh_ap10.00_slope-2.200.jpg", "bokeh_ap10.00_slope-2.300.jpg", "bokeh_ap10.00_slope-2.400.jpg",
    "bokeh_ap10.00_slope-2.500.jpg", "bokeh_ap10.00_slope-2.600.jpg",
    "bokeh_ap12.00_slope-1.400.jpg",
    "bokeh_ap12.00_slope-1.600.jpg", "bokeh_ap12.00_slope-1.700.jpg", "bokeh_ap12.00_slope-1.800.jpg",
    "bokeh_ap12.00_slope-1.900.jpg", "bokeh_ap12.00_slope-2.000.jpg", "bokeh_ap12.00_slope-2.100.jpg",
    "bokeh_ap12.00_slope-2.200.jpg", "bokeh_ap12.00_slope-2.300.jpg", "bokeh_ap12.00_slope-2.400.jpg",
    "bokeh_ap12.00_slope-2.500.jpg", "bokeh_ap12.00_slope-2.600.jpg",
    "bokeh_ap14.00_slope-1.400.jpg",
    "bokeh_ap14.00_slope-1.600.jpg", "bokeh_ap14.00_slope-1.700.jpg", "bokeh_ap14.00_slope-1.800.jpg",
    "bokeh_ap14.00_slope-1.900.jpg", "bokeh_ap14.00_slope-2.000.jpg", "bokeh_ap14.00_slope-2.100.jpg",
    "bokeh_ap14.00_slope-2.200.jpg", "bokeh_ap14.00_slope-2.300.jpg", "bokeh_ap14.00_slope-2.400.jpg",
    "bokeh_ap14.00_slope-2.500.jpg", "bokeh_ap14.00_slope-2.600.jpg",
    "bokeh_ap16.00_slope-1.400.jpg",
    "bokeh_ap16.00_slope-1.600.jpg", "bokeh_ap16.00_slope-1.700.jpg", "bokeh_ap16.00_slope-1.800.jpg",
    "bokeh_ap16.00_slope-1.900.jpg", "bokeh_ap16.00_slope-2.000.jpg", "bokeh_ap16.00_slope-2.100.jpg",
    "bokeh_ap16.00_slope-2.200.jpg", "bokeh_ap16.00_slope-2.300.jpg", "bokeh_ap16.00_slope-2.400.jpg",
    "bokeh_ap16.00_slope-2.500.jpg", "bokeh_ap16.00_slope-2.600.jpg",
    "bokeh_ap18.00_slope-1.400.jpg",
    "bokeh_ap18.00_slope-1.600.jpg", "bokeh_ap18.00_slope-1.700.jpg", "bokeh_ap18.00_slope-1.800.jpg",
    "bokeh_ap18.00_slope-1.900.jpg", "bokeh_ap18.00_slope-2.000.jpg", "bokeh_ap18.00_slope-2.100.jpg",
    "bokeh_ap18.00_slope-2.200.jpg", "bokeh_ap18.00_slope-2.300.jpg", "bokeh_ap18.00_slope-2.400.jpg",
    "bokeh_ap18.00_slope-2.500.jpg", "bokeh_ap18.00_slope-2.600.jpg",
    "bokeh_ap20.00_slope-1.400.jpg",
    "bokeh_ap20.00_slope-1.600.jpg", "bokeh_ap20.00_slope-1.700.jpg", "bokeh_ap20.00_slope-1.800.jpg",
    "bokeh_ap20.00_slope-1.900.jpg", "bokeh_ap20.00_slope-2.000.jpg", "bokeh_ap20.00_slope-2.100.jpg",
    "bokeh_ap20.00_slope-2.200.jpg", "bokeh_ap20.00_slope-2.300.jpg", "bokeh_ap20.00_slope-2.400.jpg",
    "bokeh_ap20.00_slope-2.500.jpg", "bokeh_ap20.00_slope-2.600.jpg"
  ];

  const DEPTH_FILES = [
    "K10.0_var+0.000.jpg", "K10.0_var+0.050.jpg", "K10.0_var+0.100.jpg", "K10.0_var+0.150.jpg",
    "K10.0_var+0.200.jpg", "K10.0_var+0.250.jpg", "K10.0_var+0.300.jpg", "K10.0_var+0.350.jpg",
    "K10.0_var+0.400.jpg", "K10.0_var+0.450.jpg", "K10.0_var+0.500.jpg", "K10.0_var-0.050.jpg",
    "K10.0_var-0.100.jpg", "K10.0_var-0.150.jpg", "K10.0_var-0.200.jpg", "K10.0_var-0.250.jpg",
    "K10.0_var-0.300.jpg", "K10.0_var-0.350.jpg", "K10.0_var-0.400.jpg", "K10.0_var-0.450.jpg",
    "K10.0_var-0.500.jpg", "K10.0_var-0.550.jpg", "K10.0_var-0.600.jpg", "K10.0_var-0.650.jpg",
    "K12.0_var+0.000.jpg", "K12.0_var+0.050.jpg", "K12.0_var+0.100.jpg", "K12.0_var+0.150.jpg",
    "K12.0_var+0.200.jpg", "K12.0_var+0.250.jpg", "K12.0_var+0.300.jpg", "K12.0_var+0.350.jpg",
    "K12.0_var+0.400.jpg", "K12.0_var+0.450.jpg", "K12.0_var+0.500.jpg", "K12.0_var-0.050.jpg",
    "K12.0_var-0.100.jpg", "K12.0_var-0.150.jpg", "K12.0_var-0.200.jpg", "K12.0_var-0.250.jpg",
    "K12.0_var-0.300.jpg", "K12.0_var-0.350.jpg", "K12.0_var-0.400.jpg", "K12.0_var-0.450.jpg",
    "K12.0_var-0.500.jpg", "K12.0_var-0.550.jpg", "K12.0_var-0.600.jpg", "K12.0_var-0.650.jpg",
    "K14.0_var+0.000.jpg", "K14.0_var+0.050.jpg", "K14.0_var+0.100.jpg", "K14.0_var+0.150.jpg",
    "K14.0_var+0.200.jpg", "K14.0_var+0.250.jpg", "K14.0_var+0.300.jpg", "K14.0_var+0.350.jpg",
    "K14.0_var+0.400.jpg", "K14.0_var+0.450.jpg", "K14.0_var+0.500.jpg", "K14.0_var-0.050.jpg",
    "K14.0_var-0.100.jpg", "K14.0_var-0.150.jpg", "K14.0_var-0.200.jpg", "K14.0_var-0.250.jpg",
    "K14.0_var-0.300.jpg", "K14.0_var-0.350.jpg", "K14.0_var-0.400.jpg", "K14.0_var-0.450.jpg",
    "K14.0_var-0.500.jpg", "K14.0_var-0.550.jpg", "K14.0_var-0.600.jpg", "K14.0_var-0.650.jpg",
    "K15.0_var+0.000.jpg", "K15.0_var+0.100.jpg", "K15.0_var+0.250.jpg", "K15.0_var+0.500.jpg",
    "K15.0_var-0.100.jpg", "K15.0_var-0.250.jpg", "K15.0_var-0.500.jpg",
    "K16.0_var+0.000.jpg", "K16.0_var+0.050.jpg", "K16.0_var+0.100.jpg", "K16.0_var+0.150.jpg",
    "K16.0_var+0.200.jpg", "K16.0_var+0.250.jpg", "K16.0_var+0.300.jpg", "K16.0_var+0.350.jpg",
    "K16.0_var+0.400.jpg", "K16.0_var+0.450.jpg", "K16.0_var+0.500.jpg", "K16.0_var-0.050.jpg",
    "K16.0_var-0.100.jpg", "K16.0_var-0.150.jpg", "K16.0_var-0.200.jpg", "K16.0_var-0.250.jpg",
    "K16.0_var-0.300.jpg", "K16.0_var-0.350.jpg", "K16.0_var-0.400.jpg", "K16.0_var-0.450.jpg",
    "K16.0_var-0.500.jpg", "K16.0_var-0.550.jpg", "K16.0_var-0.600.jpg", "K16.0_var-0.650.jpg",
    "K18.0_var+0.000.jpg", "K18.0_var+0.050.jpg", "K18.0_var+0.100.jpg", "K18.0_var+0.150.jpg",
    "K18.0_var+0.200.jpg", "K18.0_var+0.250.jpg", "K18.0_var+0.300.jpg", "K18.0_var+0.350.jpg",
    "K18.0_var+0.400.jpg", "K18.0_var+0.450.jpg", "K18.0_var+0.500.jpg", "K18.0_var-0.050.jpg",
    "K18.0_var-0.100.jpg", "K18.0_var-0.150.jpg", "K18.0_var-0.200.jpg", "K18.0_var-0.250.jpg",
    "K18.0_var-0.300.jpg", "K18.0_var-0.350.jpg", "K18.0_var-0.400.jpg", "K18.0_var-0.450.jpg",
    "K18.0_var-0.500.jpg", "K18.0_var-0.550.jpg", "K18.0_var-0.600.jpg", "K18.0_var-0.650.jpg",
    "K20.0_var+0.000.jpg", "K20.0_var+0.050.jpg", "K20.0_var+0.100.jpg", "K20.0_var+0.150.jpg",
    "K20.0_var+0.200.jpg", "K20.0_var+0.250.jpg", "K20.0_var+0.300.jpg", "K20.0_var+0.350.jpg",
    "K20.0_var+0.400.jpg", "K20.0_var+0.450.jpg", "K20.0_var+0.500.jpg", "K20.0_var-0.050.jpg",
    "K20.0_var-0.100.jpg", "K20.0_var-0.150.jpg", "K20.0_var-0.200.jpg", "K20.0_var-0.250.jpg",
    "K20.0_var-0.300.jpg", "K20.0_var-0.350.jpg", "K20.0_var-0.400.jpg", "K20.0_var-0.450.jpg",
    "K20.0_var-0.500.jpg", "K20.0_var-0.550.jpg", "K20.0_var-0.600.jpg", "K20.0_var-0.650.jpg",
    "K22.0_var+0.000.jpg", "K22.0_var+0.050.jpg", "K22.0_var+0.100.jpg", "K22.0_var+0.150.jpg",
    "K22.0_var+0.200.jpg", "K22.0_var+0.250.jpg", "K22.0_var+0.300.jpg", "K22.0_var+0.350.jpg",
    "K22.0_var+0.400.jpg", "K22.0_var+0.450.jpg", "K22.0_var+0.500.jpg", "K22.0_var-0.050.jpg",
    "K22.0_var-0.100.jpg", "K22.0_var-0.150.jpg", "K22.0_var-0.200.jpg", "K22.0_var-0.250.jpg",
    "K22.0_var-0.300.jpg", "K22.0_var-0.350.jpg", "K22.0_var-0.400.jpg", "K22.0_var-0.450.jpg",
    "K22.0_var-0.500.jpg", "K22.0_var-0.550.jpg", "K22.0_var-0.600.jpg", "K22.0_var-0.650.jpg",
    "K24.0_var+0.000.jpg", "K24.0_var+0.050.jpg", "K24.0_var+0.100.jpg", "K24.0_var+0.150.jpg",
    "K24.0_var+0.200.jpg", "K24.0_var+0.250.jpg", "K24.0_var+0.300.jpg", "K24.0_var+0.350.jpg",
    "K24.0_var+0.400.jpg", "K24.0_var+0.450.jpg", "K24.0_var+0.500.jpg", "K24.0_var-0.050.jpg",
    "K24.0_var-0.100.jpg", "K24.0_var-0.150.jpg", "K24.0_var-0.200.jpg", "K24.0_var-0.250.jpg",
    "K24.0_var-0.300.jpg", "K24.0_var-0.350.jpg", "K24.0_var-0.400.jpg", "K24.0_var-0.450.jpg",
    "K24.0_var-0.500.jpg", "K24.0_var-0.550.jpg", "K24.0_var-0.600.jpg", "K24.0_var-0.650.jpg"
  ];

  // ─── Parse filenames to build sorted unique-value axes ────────────────────

  // ─── Build lookup: sort axis keys as strings, indexed by float value ────────
  // This avoids float→string reconstruction entirely; original filenames are used.

  function buildAxisKeys(files, reAxis1, reAxis2) {
    var ax1 = {}, ax2 = {}, table = {};
    files.forEach(function (fname) {
      var m1 = fname.match(reAxis1);
      var m2 = fname.match(reAxis2);
      if (!m1 || !m2) { console.warn("[DataCapture] no match:", fname); return; }
      var k1 = m1[1], k2 = m2[1];
      ax1[k1] = parseFloat(k1);
      ax2[k2] = parseFloat(k2);
      if (!table[k1]) table[k1] = {};
      table[k1][k2] = fname;
    });
    var keys1 = Object.keys(ax1).sort(function (a, b) { return ax1[a] - ax1[b]; });
    var keys2 = Object.keys(ax2).sort(function (a, b) { return ax2[a] - ax2[b]; });
    return { keys1: keys1, keys2: keys2, table: table };
  }

  var oursData = buildAxisKeys(OURS_FILES,
    /bokeh_ap(\d+\.\d+)_slope/,
    /_slope([+-]?\d+\.\d+)\.jpg$/);

  var depthData = buildAxisKeys(DEPTH_FILES,
    /^K(\d+\.\d+)_var/,
    /_var([+-]?\d+\.\d+)\.jpg$/);

  console.log("[DataCapture] ours ap keys:", oursData.keys1);
  console.log("[DataCapture] ours slope keys:", oursData.keys2);
  console.log("[DataCapture] depth K keys:", depthData.keys1);
  console.log("[DataCapture] depth var keys:", depthData.keys2);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function sliderToIdx(sliderVal, keys) {
    var t = parseFloat(sliderVal) / 100;
    var idx = Math.round(t * (keys.length - 1));
    return Math.min(keys.length - 1, Math.max(0, idx));
  }

  // ─── DOM references ───────────────────────────────────────────────────────

  var oursImg = document.getElementById("dc-ours-img");
  var depthImg = document.getElementById("dc-depth-img");
  var oursApSlider = document.getElementById("dc-ours-ap-slider");
  var oursSlopeSlider = document.getElementById("dc-ours-slope-slider");
  var depthKSlider = document.getElementById("dc-depth-k-slider");
  var depthVarSlider = document.getElementById("dc-depth-var-slider");
  var oursApLabel = document.getElementById("dc-ours-ap-label");
  var oursSlopeLabel = document.getElementById("dc-ours-slope-label");
  var depthKLabel = document.getElementById("dc-depth-k-label");
  var depthVarLabel = document.getElementById("dc-depth-var-label");

  if (!oursImg || !depthImg || !oursApSlider || !oursSlopeSlider || !depthKSlider || !depthVarSlider) {
    console.warn("[DataCapture] Missing DOM elements. Check IDs in HTML.");
    return;
  }

  var OURS_BASE = "./static/Data_Capture/IMG_5253_Ours/view_000/jpg/";
  var DEPTH_BASE = "./static/Data_Capture/IMG_5253_BokehDiff/view_000/output/";

  // ─── Render functions ─────────────────────────────────────────────────────

  function updateOurs() {
    var apIdx = sliderToIdx(oursApSlider.value, oursData.keys1);
    var slopeIdx = sliderToIdx(oursSlopeSlider.value, oursData.keys2);
    var apKey = oursData.keys1[apIdx];
    var slopeKey = oursData.keys2[slopeIdx];
    var fname = oursData.table[apKey] && oursData.table[apKey][slopeKey];
    if (!fname) { console.warn("[DataCapture] ours: no file for", apKey, slopeKey); return; }
    console.log("[DataCapture] ours →", OURS_BASE + fname);
    oursImg.src = OURS_BASE + fname;
    if (oursApLabel) oursApLabel.textContent = apKey;
    if (oursSlopeLabel) oursSlopeLabel.textContent = slopeKey;
  }

  function updateDepth() {
    var kIdx = sliderToIdx(depthKSlider.value, depthData.keys1);
    var varIdx = sliderToIdx(depthVarSlider.value, depthData.keys2);
    var kKey = depthData.keys1[kIdx];
    var varKey = depthData.keys2[varIdx];
    var fname = depthData.table[kKey] && depthData.table[kKey][varKey];
    if (!fname) { console.warn("[DataCapture] depth: no file for", kKey, varKey); return; }
    depthImg.src = DEPTH_BASE + fname;
    if (depthKLabel) depthKLabel.textContent = kKey;
    if (depthVarLabel) depthVarLabel.textContent = varKey;
  }

  // ─── Events ───────────────────────────────────────────────────────────────

  oursApSlider.addEventListener("input", updateOurs);
  oursSlopeSlider.addEventListener("input", updateOurs);
  depthKSlider.addEventListener("input", updateDepth);
  depthVarSlider.addEventListener("input", updateDepth);

  // ─── Initial state ────────────────────────────────────────────────────────

  oursApSlider.value = "100";
  oursSlopeSlider.value = "100";
  depthKSlider.value = "100";
  depthVarSlider.value = "75";

  updateOurs();
  updateDepth();
});
