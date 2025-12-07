// CVPR_Mine_OurMethod_Playground.js
// Our Method Playground (离线可用版本)
// - 不再 fetch manifest.json，而是把 manifest 内容直接嵌进 JS 里
// - 每个 scene 对应一个 basePath + records 数组
// - records 内容直接从各自的 Case_X/manifest.json 复制过来

// =====================================================
// 1. 内嵌 manifest：在这里粘 Case_01 / Case_02 的内容
// =====================================================
//
// 说明：
// - Case_01: 打开 static/Our_Res_Playground/Case_01/manifest.json
//   - 如果文件是 { "records": [ ... ] }：复制 [ ... ] 这一整段，粘到 scene1.records 数组里面
//   - 如果文件就是 [ ... ]：直接复制整个数组，粘进去
// - Case_02 同理。
// - 我在下面用 EXAMPLE 包了一小段示例，你粘完真实内容之后，可以把示例删掉。


const INPUT_PATHS = {
  scene1: "./static/Our_Res_Playground/Case_01_Sparse/images/input.jpg",
  scene2: "./static/Our_Res_Playground/Case_02_Sparse/images/input.jpg",
  scene3: "./static/Our_Res_Playground/Case_03_Sparse/images/input.jpg",
  // scene4: "./static/Our_Res_Playground/Case_04_Sparse/images/input.jpg",
  scene5: "./static/Our_Res_Playground/Case_05/unmerged/input.jpg"
};


const OURMETHOD_MANIFESTS = {
  scene1: {
    basePath: "./static/Our_Res_Playground/Case_01_Sparse/images",
    records: [
    {
      "id": "ddminus1.80_dsminus1.20",
      "delta": {
        "dof": -1.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.80_dsminus1.00",
      "delta": {
        "dof": -1.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.80_dsminus0.80",
      "delta": {
        "dof": -1.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.80_dsminus0.60",
      "delta": {
        "dof": -1.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.80_dsminus0.40",
      "delta": {
        "dof": -1.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.80_dsminus0.20",
      "delta": {
        "dof": -1.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.80_dsplus0.00",
      "delta": {
        "dof": -1.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.80_dsplus0.20",
      "delta": {
        "dof": -1.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.80_dsplus0.40",
      "delta": {
        "dof": -1.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.80_dsplus0.60",
      "delta": {
        "dof": -1.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.80_dsplus0.80",
      "delta": {
        "dof": -1.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus0.80.jpg"
    },
    {
      "id": "ddminus1.80_dsplus1.00",
      "delta": {
        "dof": -1.8,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus1.00.jpg"
    },
    {
      "id": "ddminus1.80_dsplus1.20",
      "delta": {
        "dof": -1.8,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus1.20.jpg"
    },
    {
      "id": "ddminus1.80_dsplus1.40",
      "delta": {
        "dof": -1.8,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus1.40.jpg"
    },
    {
      "id": "ddminus1.80_dsplus1.60",
      "delta": {
        "dof": -1.8,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.80_dsplus1.60.jpg"
    },
    {
      "id": "ddminus1.60_dsminus1.20",
      "delta": {
        "dof": -1.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.60_dsminus1.00",
      "delta": {
        "dof": -1.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.60_dsminus0.80",
      "delta": {
        "dof": -1.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.60_dsminus0.60",
      "delta": {
        "dof": -1.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.60_dsminus0.40",
      "delta": {
        "dof": -1.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.60_dsminus0.20",
      "delta": {
        "dof": -1.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.60_dsplus0.00",
      "delta": {
        "dof": -1.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.60_dsplus0.20",
      "delta": {
        "dof": -1.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.60_dsplus0.40",
      "delta": {
        "dof": -1.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.60_dsplus0.60",
      "delta": {
        "dof": -1.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.60_dsplus0.80",
      "delta": {
        "dof": -1.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus0.80.jpg"
    },
    {
      "id": "ddminus1.60_dsplus1.00",
      "delta": {
        "dof": -1.6,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus1.00.jpg"
    },
    {
      "id": "ddminus1.60_dsplus1.20",
      "delta": {
        "dof": -1.6,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus1.20.jpg"
    },
    {
      "id": "ddminus1.60_dsplus1.40",
      "delta": {
        "dof": -1.6,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus1.40.jpg"
    },
    {
      "id": "ddminus1.60_dsplus1.60",
      "delta": {
        "dof": -1.6,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.60_dsplus1.60.jpg"
    },
    {
      "id": "ddminus1.40_dsminus1.20",
      "delta": {
        "dof": -1.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.40_dsminus1.00",
      "delta": {
        "dof": -1.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.40_dsminus0.80",
      "delta": {
        "dof": -1.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.40_dsminus0.60",
      "delta": {
        "dof": -1.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.40_dsminus0.40",
      "delta": {
        "dof": -1.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.40_dsminus0.20",
      "delta": {
        "dof": -1.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.40_dsplus0.00",
      "delta": {
        "dof": -1.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.40_dsplus0.20",
      "delta": {
        "dof": -1.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.40_dsplus0.40",
      "delta": {
        "dof": -1.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.40_dsplus0.60",
      "delta": {
        "dof": -1.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.40_dsplus0.80",
      "delta": {
        "dof": -1.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus0.80.jpg"
    },
    {
      "id": "ddminus1.40_dsplus1.00",
      "delta": {
        "dof": -1.4,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus1.00.jpg"
    },
    {
      "id": "ddminus1.40_dsplus1.20",
      "delta": {
        "dof": -1.4,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus1.20.jpg"
    },
    {
      "id": "ddminus1.40_dsplus1.40",
      "delta": {
        "dof": -1.4,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus1.40.jpg"
    },
    {
      "id": "ddminus1.40_dsplus1.60",
      "delta": {
        "dof": -1.4,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.40_dsplus1.60.jpg"
    },
    {
      "id": "ddminus1.20_dsminus1.20",
      "delta": {
        "dof": -1.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.20_dsminus1.00",
      "delta": {
        "dof": -1.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.20_dsminus0.80",
      "delta": {
        "dof": -1.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.20_dsminus0.60",
      "delta": {
        "dof": -1.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.20_dsminus0.40",
      "delta": {
        "dof": -1.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.20_dsminus0.20",
      "delta": {
        "dof": -1.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.20_dsplus0.00",
      "delta": {
        "dof": -1.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.20_dsplus0.20",
      "delta": {
        "dof": -1.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.20_dsplus0.40",
      "delta": {
        "dof": -1.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.20_dsplus0.60",
      "delta": {
        "dof": -1.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.20_dsplus0.80",
      "delta": {
        "dof": -1.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus0.80.jpg"
    },
    {
      "id": "ddminus1.20_dsplus1.00",
      "delta": {
        "dof": -1.2,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus1.00.jpg"
    },
    {
      "id": "ddminus1.20_dsplus1.20",
      "delta": {
        "dof": -1.2,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus1.20.jpg"
    },
    {
      "id": "ddminus1.20_dsplus1.40",
      "delta": {
        "dof": -1.2,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus1.40.jpg"
    },
    {
      "id": "ddminus1.20_dsplus1.60",
      "delta": {
        "dof": -1.2,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.20_dsplus1.60.jpg"
    },
    {
      "id": "ddminus1.00_dsminus1.20",
      "delta": {
        "dof": -1.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.00_dsminus1.00",
      "delta": {
        "dof": -1.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.80",
      "delta": {
        "dof": -1.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.60",
      "delta": {
        "dof": -1.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.40",
      "delta": {
        "dof": -1.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.20",
      "delta": {
        "dof": -1.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.00",
      "delta": {
        "dof": -1.0,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.20",
      "delta": {
        "dof": -1.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.40",
      "delta": {
        "dof": -1.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.60",
      "delta": {
        "dof": -1.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.80",
      "delta": {
        "dof": -1.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.80.jpg"
    },
    {
      "id": "ddminus1.00_dsplus1.00",
      "delta": {
        "dof": -1.0,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus1.00.jpg"
    },
    {
      "id": "ddminus1.00_dsplus1.20",
      "delta": {
        "dof": -1.0,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus1.20.jpg"
    },
    {
      "id": "ddminus1.00_dsplus1.40",
      "delta": {
        "dof": -1.0,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus1.40.jpg"
    },
    {
      "id": "ddminus1.00_dsplus1.60",
      "delta": {
        "dof": -1.0,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus1.60.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.20",
      "delta": {
        "dof": -0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.00",
      "delta": {
        "dof": -0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.80",
      "delta": {
        "dof": -0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.60",
      "delta": {
        "dof": -0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.40",
      "delta": {
        "dof": -0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.20",
      "delta": {
        "dof": -0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.00",
      "delta": {
        "dof": -0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.20",
      "delta": {
        "dof": -0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.40",
      "delta": {
        "dof": -0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.60",
      "delta": {
        "dof": -0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.80",
      "delta": {
        "dof": -0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.80_dsplus1.00",
      "delta": {
        "dof": -0.8,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus1.00.jpg"
    },
    {
      "id": "ddminus0.80_dsplus1.20",
      "delta": {
        "dof": -0.8,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus1.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus1.40",
      "delta": {
        "dof": -0.8,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus1.40.jpg"
    },
    {
      "id": "ddminus0.80_dsplus1.60",
      "delta": {
        "dof": -0.8,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus1.60.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.20",
      "delta": {
        "dof": -0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.00",
      "delta": {
        "dof": -0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.80",
      "delta": {
        "dof": -0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.60",
      "delta": {
        "dof": -0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.40",
      "delta": {
        "dof": -0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.20",
      "delta": {
        "dof": -0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.00",
      "delta": {
        "dof": -0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.20",
      "delta": {
        "dof": -0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.40",
      "delta": {
        "dof": -0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.60",
      "delta": {
        "dof": -0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.80",
      "delta": {
        "dof": -0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsplus1.00",
      "delta": {
        "dof": -0.6,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus1.00.jpg"
    },
    {
      "id": "ddminus0.60_dsplus1.20",
      "delta": {
        "dof": -0.6,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus1.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus1.40",
      "delta": {
        "dof": -0.6,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus1.40.jpg"
    },
    {
      "id": "ddminus0.60_dsplus1.60",
      "delta": {
        "dof": -0.6,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus1.60.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.20",
      "delta": {
        "dof": -0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.00",
      "delta": {
        "dof": -0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.80",
      "delta": {
        "dof": -0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.60",
      "delta": {
        "dof": -0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.40",
      "delta": {
        "dof": -0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.20",
      "delta": {
        "dof": -0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.00",
      "delta": {
        "dof": -0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.20",
      "delta": {
        "dof": -0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.40",
      "delta": {
        "dof": -0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.60",
      "delta": {
        "dof": -0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.80",
      "delta": {
        "dof": -0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsplus1.00",
      "delta": {
        "dof": -0.4,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus1.00.jpg"
    },
    {
      "id": "ddminus0.40_dsplus1.20",
      "delta": {
        "dof": -0.4,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus1.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus1.40",
      "delta": {
        "dof": -0.4,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus1.40.jpg"
    },
    {
      "id": "ddminus0.40_dsplus1.60",
      "delta": {
        "dof": -0.4,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus1.60.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.20",
      "delta": {
        "dof": -0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.00",
      "delta": {
        "dof": -0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.80",
      "delta": {
        "dof": -0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.60",
      "delta": {
        "dof": -0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.40",
      "delta": {
        "dof": -0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.20",
      "delta": {
        "dof": -0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.00",
      "delta": {
        "dof": -0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.20",
      "delta": {
        "dof": -0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.40",
      "delta": {
        "dof": -0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.60",
      "delta": {
        "dof": -0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.80",
      "delta": {
        "dof": -0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsplus1.00",
      "delta": {
        "dof": -0.2,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus1.00.jpg"
    },
    {
      "id": "ddminus0.20_dsplus1.20",
      "delta": {
        "dof": -0.2,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus1.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus1.40",
      "delta": {
        "dof": -0.2,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus1.40.jpg"
    },
    {
      "id": "ddminus0.20_dsplus1.60",
      "delta": {
        "dof": -0.2,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus1.60.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.20",
      "delta": {
        "dof": 0.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.00",
      "delta": {
        "dof": 0.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.80",
      "delta": {
        "dof": 0.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.60",
      "delta": {
        "dof": 0.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.40",
      "delta": {
        "dof": 0.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.20",
      "delta": {
        "dof": 0.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.20",
      "delta": {
        "dof": 0.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.40",
      "delta": {
        "dof": 0.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.60",
      "delta": {
        "dof": 0.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.80",
      "delta": {
        "dof": 0.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsplus1.00",
      "delta": {
        "dof": 0.0,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus1.00.jpg"
    },
    {
      "id": "ddplus0.00_dsplus1.20",
      "delta": {
        "dof": 0.0,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus1.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus1.40",
      "delta": {
        "dof": 0.0,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus1.40.jpg"
    },
    {
      "id": "ddplus0.00_dsplus1.60",
      "delta": {
        "dof": 0.0,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus1.60.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.20",
      "delta": {
        "dof": 0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.00",
      "delta": {
        "dof": 0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.80",
      "delta": {
        "dof": 0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.60",
      "delta": {
        "dof": 0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.40",
      "delta": {
        "dof": 0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.20",
      "delta": {
        "dof": 0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.00",
      "delta": {
        "dof": 0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.20",
      "delta": {
        "dof": 0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.40",
      "delta": {
        "dof": 0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.60",
      "delta": {
        "dof": 0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.80",
      "delta": {
        "dof": 0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsplus1.00",
      "delta": {
        "dof": 0.2,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus1.00.jpg"
    },
    {
      "id": "ddplus0.20_dsplus1.20",
      "delta": {
        "dof": 0.2,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus1.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus1.40",
      "delta": {
        "dof": 0.2,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus1.40.jpg"
    },
    {
      "id": "ddplus0.20_dsplus1.60",
      "delta": {
        "dof": 0.2,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus1.60.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.20",
      "delta": {
        "dof": 0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.00",
      "delta": {
        "dof": 0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.80",
      "delta": {
        "dof": 0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.60",
      "delta": {
        "dof": 0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.40",
      "delta": {
        "dof": 0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.20",
      "delta": {
        "dof": 0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.00",
      "delta": {
        "dof": 0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.20",
      "delta": {
        "dof": 0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.40",
      "delta": {
        "dof": 0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.60",
      "delta": {
        "dof": 0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.80",
      "delta": {
        "dof": 0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsplus1.00",
      "delta": {
        "dof": 0.4,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus1.00.jpg"
    },
    {
      "id": "ddplus0.40_dsplus1.20",
      "delta": {
        "dof": 0.4,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus1.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus1.40",
      "delta": {
        "dof": 0.4,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus1.40.jpg"
    },
    {
      "id": "ddplus0.40_dsplus1.60",
      "delta": {
        "dof": 0.4,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus1.60.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.20",
      "delta": {
        "dof": 0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.00",
      "delta": {
        "dof": 0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.80",
      "delta": {
        "dof": 0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.60",
      "delta": {
        "dof": 0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.40",
      "delta": {
        "dof": 0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.20",
      "delta": {
        "dof": 0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.00",
      "delta": {
        "dof": 0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.20",
      "delta": {
        "dof": 0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.40",
      "delta": {
        "dof": 0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.60",
      "delta": {
        "dof": 0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.80",
      "delta": {
        "dof": 0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsplus1.00",
      "delta": {
        "dof": 0.6,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus1.00.jpg"
    },
    {
      "id": "ddplus0.60_dsplus1.20",
      "delta": {
        "dof": 0.6,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus1.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus1.40",
      "delta": {
        "dof": 0.6,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus1.40.jpg"
    },
    {
      "id": "ddplus0.60_dsplus1.60",
      "delta": {
        "dof": 0.6,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus1.60.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.20",
      "delta": {
        "dof": 0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.00",
      "delta": {
        "dof": 0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.80",
      "delta": {
        "dof": 0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.60",
      "delta": {
        "dof": 0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.40",
      "delta": {
        "dof": 0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.20",
      "delta": {
        "dof": 0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.00",
      "delta": {
        "dof": 0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.20",
      "delta": {
        "dof": 0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.40",
      "delta": {
        "dof": 0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.60",
      "delta": {
        "dof": 0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.80",
      "delta": {
        "dof": 0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsplus1.00",
      "delta": {
        "dof": 0.8,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus1.00.jpg"
    },
    {
      "id": "ddplus0.80_dsplus1.20",
      "delta": {
        "dof": 0.8,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus1.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus1.40",
      "delta": {
        "dof": 0.8,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus1.40.jpg"
    },
    {
      "id": "ddplus0.80_dsplus1.60",
      "delta": {
        "dof": 0.8,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus1.60.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.20",
      "delta": {
        "dof": 1.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.00",
      "delta": {
        "dof": 1.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.80",
      "delta": {
        "dof": 1.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.60",
      "delta": {
        "dof": 1.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.40",
      "delta": {
        "dof": 1.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.20",
      "delta": {
        "dof": 1.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.00",
      "delta": {
        "dof": 1.0,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.20",
      "delta": {
        "dof": 1.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.40",
      "delta": {
        "dof": 1.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.60",
      "delta": {
        "dof": 1.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.80",
      "delta": {
        "dof": 1.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsplus1.00",
      "delta": {
        "dof": 1.0,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus1.00.jpg"
    },
    {
      "id": "ddplus1.00_dsplus1.20",
      "delta": {
        "dof": 1.0,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus1.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus1.40",
      "delta": {
        "dof": 1.0,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus1.40.jpg"
    },
    {
      "id": "ddplus1.00_dsplus1.60",
      "delta": {
        "dof": 1.0,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus1.60.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.20",
      "delta": {
        "dof": 1.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.00",
      "delta": {
        "dof": 1.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.80",
      "delta": {
        "dof": 1.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.60",
      "delta": {
        "dof": 1.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.40",
      "delta": {
        "dof": 1.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.20",
      "delta": {
        "dof": 1.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.00",
      "delta": {
        "dof": 1.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.20",
      "delta": {
        "dof": 1.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.40",
      "delta": {
        "dof": 1.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.60",
      "delta": {
        "dof": 1.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.80",
      "delta": {
        "dof": 1.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsplus1.00",
      "delta": {
        "dof": 1.2,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus1.00.jpg"
    },
    {
      "id": "ddplus1.20_dsplus1.20",
      "delta": {
        "dof": 1.2,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus1.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus1.40",
      "delta": {
        "dof": 1.2,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus1.40.jpg"
    },
    {
      "id": "ddplus1.20_dsplus1.60",
      "delta": {
        "dof": 1.2,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus1.60.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.20",
      "delta": {
        "dof": 1.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.00",
      "delta": {
        "dof": 1.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.80",
      "delta": {
        "dof": 1.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.60",
      "delta": {
        "dof": 1.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.40",
      "delta": {
        "dof": 1.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.20",
      "delta": {
        "dof": 1.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.00",
      "delta": {
        "dof": 1.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.20",
      "delta": {
        "dof": 1.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.40",
      "delta": {
        "dof": 1.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.60",
      "delta": {
        "dof": 1.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.80",
      "delta": {
        "dof": 1.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.40_dsplus1.00",
      "delta": {
        "dof": 1.4,
        "slope": 1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus1.00.jpg"
    },
    {
      "id": "ddplus1.40_dsplus1.20",
      "delta": {
        "dof": 1.4,
        "slope": 1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus1.20.jpg"
    },
    {
      "id": "ddplus1.40_dsplus1.40",
      "delta": {
        "dof": 1.4,
        "slope": 1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus1.40.jpg"
    },
    {
      "id": "ddplus1.40_dsplus1.60",
      "delta": {
        "dof": 1.4,
        "slope": 1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus1.60.jpg"
    }
    ]
  },

  scene2: {
    basePath: "./static/Our_Res_Playground/Case_02_Sparse/images",
    records: [
    {
      "id": "ddminus0.80_dsminus1.80",
      "delta": {
        "dof": -0.8,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.80.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.60",
      "delta": {
        "dof": -0.8,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.60.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.40",
      "delta": {
        "dof": -0.8,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.40.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.20",
      "delta": {
        "dof": -0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.00",
      "delta": {
        "dof": -0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.80",
      "delta": {
        "dof": -0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.60",
      "delta": {
        "dof": -0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.40",
      "delta": {
        "dof": -0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.20",
      "delta": {
        "dof": -0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.00",
      "delta": {
        "dof": -0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.20",
      "delta": {
        "dof": -0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.40",
      "delta": {
        "dof": -0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.60",
      "delta": {
        "dof": -0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.80",
      "delta": {
        "dof": -0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.80",
      "delta": {
        "dof": -0.6,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.60",
      "delta": {
        "dof": -0.6,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.60.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.40",
      "delta": {
        "dof": -0.6,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.40.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.20",
      "delta": {
        "dof": -0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.00",
      "delta": {
        "dof": -0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.80",
      "delta": {
        "dof": -0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.60",
      "delta": {
        "dof": -0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.40",
      "delta": {
        "dof": -0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.20",
      "delta": {
        "dof": -0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.00",
      "delta": {
        "dof": -0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.20",
      "delta": {
        "dof": -0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.40",
      "delta": {
        "dof": -0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.60",
      "delta": {
        "dof": -0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.80",
      "delta": {
        "dof": -0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.80",
      "delta": {
        "dof": -0.4,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.60",
      "delta": {
        "dof": -0.4,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.60.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.40",
      "delta": {
        "dof": -0.4,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.40.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.20",
      "delta": {
        "dof": -0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.00",
      "delta": {
        "dof": -0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.80",
      "delta": {
        "dof": -0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.60",
      "delta": {
        "dof": -0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.40",
      "delta": {
        "dof": -0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.20",
      "delta": {
        "dof": -0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.00",
      "delta": {
        "dof": -0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.20",
      "delta": {
        "dof": -0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.40",
      "delta": {
        "dof": -0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.60",
      "delta": {
        "dof": -0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.80",
      "delta": {
        "dof": -0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.80",
      "delta": {
        "dof": -0.2,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.60",
      "delta": {
        "dof": -0.2,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.60.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.40",
      "delta": {
        "dof": -0.2,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.40.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.20",
      "delta": {
        "dof": -0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.00",
      "delta": {
        "dof": -0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.80",
      "delta": {
        "dof": -0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.60",
      "delta": {
        "dof": -0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.40",
      "delta": {
        "dof": -0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.20",
      "delta": {
        "dof": -0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.00",
      "delta": {
        "dof": -0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.20",
      "delta": {
        "dof": -0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.40",
      "delta": {
        "dof": -0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.60",
      "delta": {
        "dof": -0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.80",
      "delta": {
        "dof": -0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.80",
      "delta": {
        "dof": 0.0,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.60",
      "delta": {
        "dof": 0.0,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.60.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.40",
      "delta": {
        "dof": 0.0,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.40.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.20",
      "delta": {
        "dof": 0.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.00",
      "delta": {
        "dof": 0.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.80",
      "delta": {
        "dof": 0.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.60",
      "delta": {
        "dof": 0.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.40",
      "delta": {
        "dof": 0.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.20",
      "delta": {
        "dof": 0.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.20",
      "delta": {
        "dof": 0.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.40",
      "delta": {
        "dof": 0.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.60",
      "delta": {
        "dof": 0.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.80",
      "delta": {
        "dof": 0.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.80",
      "delta": {
        "dof": 0.2,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.60",
      "delta": {
        "dof": 0.2,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.60.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.40",
      "delta": {
        "dof": 0.2,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.40.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.20",
      "delta": {
        "dof": 0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.00",
      "delta": {
        "dof": 0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.80",
      "delta": {
        "dof": 0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.60",
      "delta": {
        "dof": 0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.40",
      "delta": {
        "dof": 0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.20",
      "delta": {
        "dof": 0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.00",
      "delta": {
        "dof": 0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.20",
      "delta": {
        "dof": 0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.40",
      "delta": {
        "dof": 0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.60",
      "delta": {
        "dof": 0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.80",
      "delta": {
        "dof": 0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.80",
      "delta": {
        "dof": 0.4,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.60",
      "delta": {
        "dof": 0.4,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.60.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.40",
      "delta": {
        "dof": 0.4,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.40.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.20",
      "delta": {
        "dof": 0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.00",
      "delta": {
        "dof": 0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.80",
      "delta": {
        "dof": 0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.60",
      "delta": {
        "dof": 0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.40",
      "delta": {
        "dof": 0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.20",
      "delta": {
        "dof": 0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.00",
      "delta": {
        "dof": 0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.20",
      "delta": {
        "dof": 0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.40",
      "delta": {
        "dof": 0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.60",
      "delta": {
        "dof": 0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.80",
      "delta": {
        "dof": 0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.80",
      "delta": {
        "dof": 0.6,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.60",
      "delta": {
        "dof": 0.6,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.60.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.40",
      "delta": {
        "dof": 0.6,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.40.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.20",
      "delta": {
        "dof": 0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.00",
      "delta": {
        "dof": 0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.80",
      "delta": {
        "dof": 0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.60",
      "delta": {
        "dof": 0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.40",
      "delta": {
        "dof": 0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.20",
      "delta": {
        "dof": 0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.00",
      "delta": {
        "dof": 0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.20",
      "delta": {
        "dof": 0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.40",
      "delta": {
        "dof": 0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.60",
      "delta": {
        "dof": 0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.80",
      "delta": {
        "dof": 0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.80",
      "delta": {
        "dof": 0.8,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.60",
      "delta": {
        "dof": 0.8,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.60.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.40",
      "delta": {
        "dof": 0.8,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.40.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.20",
      "delta": {
        "dof": 0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.00",
      "delta": {
        "dof": 0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.80",
      "delta": {
        "dof": 0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.60",
      "delta": {
        "dof": 0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.40",
      "delta": {
        "dof": 0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.20",
      "delta": {
        "dof": 0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.00",
      "delta": {
        "dof": 0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.20",
      "delta": {
        "dof": 0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.40",
      "delta": {
        "dof": 0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.60",
      "delta": {
        "dof": 0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.80",
      "delta": {
        "dof": 0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.80",
      "delta": {
        "dof": 1.0,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.60",
      "delta": {
        "dof": 1.0,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.60.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.40",
      "delta": {
        "dof": 1.0,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.40.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.20",
      "delta": {
        "dof": 1.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.00",
      "delta": {
        "dof": 1.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.80",
      "delta": {
        "dof": 1.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.60",
      "delta": {
        "dof": 1.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.40",
      "delta": {
        "dof": 1.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.20",
      "delta": {
        "dof": 1.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.00",
      "delta": {
        "dof": 1.0,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.20",
      "delta": {
        "dof": 1.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.40",
      "delta": {
        "dof": 1.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.60",
      "delta": {
        "dof": 1.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.80",
      "delta": {
        "dof": 1.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.80",
      "delta": {
        "dof": 1.2,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.60",
      "delta": {
        "dof": 1.2,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.60.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.40",
      "delta": {
        "dof": 1.2,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.40.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.20",
      "delta": {
        "dof": 1.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.00",
      "delta": {
        "dof": 1.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.80",
      "delta": {
        "dof": 1.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.60",
      "delta": {
        "dof": 1.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.40",
      "delta": {
        "dof": 1.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.20",
      "delta": {
        "dof": 1.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.00",
      "delta": {
        "dof": 1.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.20",
      "delta": {
        "dof": 1.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.40",
      "delta": {
        "dof": 1.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.60",
      "delta": {
        "dof": 1.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.80",
      "delta": {
        "dof": 1.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.80",
      "delta": {
        "dof": 1.4,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.80.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.60",
      "delta": {
        "dof": 1.4,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.60.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.40",
      "delta": {
        "dof": 1.4,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.40.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.20",
      "delta": {
        "dof": 1.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.40_dsminus1.00",
      "delta": {
        "dof": 1.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.80",
      "delta": {
        "dof": 1.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.60",
      "delta": {
        "dof": 1.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.40",
      "delta": {
        "dof": 1.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.40_dsminus0.20",
      "delta": {
        "dof": 1.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.00",
      "delta": {
        "dof": 1.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.20",
      "delta": {
        "dof": 1.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.40",
      "delta": {
        "dof": 1.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.60",
      "delta": {
        "dof": 1.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.40_dsplus0.80",
      "delta": {
        "dof": 1.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.40_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.60_dsminus1.80",
      "delta": {
        "dof": 1.6,
        "slope": -1.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus1.80.jpg"
    },
    {
      "id": "ddplus1.60_dsminus1.60",
      "delta": {
        "dof": 1.6,
        "slope": -1.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus1.60.jpg"
    },
    {
      "id": "ddplus1.60_dsminus1.40",
      "delta": {
        "dof": 1.6,
        "slope": -1.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus1.40.jpg"
    },
    {
      "id": "ddplus1.60_dsminus1.20",
      "delta": {
        "dof": 1.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.60_dsminus1.00",
      "delta": {
        "dof": 1.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.60_dsminus0.80",
      "delta": {
        "dof": 1.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.60_dsminus0.60",
      "delta": {
        "dof": 1.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.60_dsminus0.40",
      "delta": {
        "dof": 1.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.60_dsminus0.20",
      "delta": {
        "dof": 1.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.60_dsplus0.00",
      "delta": {
        "dof": 1.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.60_dsplus0.20",
      "delta": {
        "dof": 1.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.60_dsplus0.40",
      "delta": {
        "dof": 1.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.60_dsplus0.60",
      "delta": {
        "dof": 1.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.60_dsplus0.80",
      "delta": {
        "dof": 1.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.60_dsplus0.80.jpg"
    }
    ]
  },

  // 如果暂时没有 Case_03/04/05，可以先让它们都指向 scene1
  scene3: {
    basePath: "./static/Our_Res_Playground/Case_03_Sparse/images",
    records: [
    {
      "id": "ddminus1.00_dsminus1.20",
      "delta": {
        "dof": -1.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus1.20.jpg"
    },
    {
      "id": "ddminus1.00_dsminus1.00",
      "delta": {
        "dof": -1.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus1.00.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.80",
      "delta": {
        "dof": -1.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.80.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.60",
      "delta": {
        "dof": -1.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.60.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.40",
      "delta": {
        "dof": -1.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.40.jpg"
    },
    {
      "id": "ddminus1.00_dsminus0.20",
      "delta": {
        "dof": -1.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsminus0.20.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.00",
      "delta": {
        "dof": -1.0,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.00.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.20",
      "delta": {
        "dof": -1.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.20.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.40",
      "delta": {
        "dof": -1.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.40.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.60",
      "delta": {
        "dof": -1.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.60.jpg"
    },
    {
      "id": "ddminus1.00_dsplus0.80",
      "delta": {
        "dof": -1.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus1.00_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.20",
      "delta": {
        "dof": -0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.80_dsminus1.00",
      "delta": {
        "dof": -0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.80",
      "delta": {
        "dof": -0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.60",
      "delta": {
        "dof": -0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.40",
      "delta": {
        "dof": -0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsminus0.20",
      "delta": {
        "dof": -0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.00",
      "delta": {
        "dof": -0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.20",
      "delta": {
        "dof": -0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.40",
      "delta": {
        "dof": -0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.60",
      "delta": {
        "dof": -0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.80_dsplus0.80",
      "delta": {
        "dof": -0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.20",
      "delta": {
        "dof": -0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.60_dsminus1.00",
      "delta": {
        "dof": -0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.80",
      "delta": {
        "dof": -0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.60",
      "delta": {
        "dof": -0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.40",
      "delta": {
        "dof": -0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsminus0.20",
      "delta": {
        "dof": -0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.00",
      "delta": {
        "dof": -0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.20",
      "delta": {
        "dof": -0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.40",
      "delta": {
        "dof": -0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.60",
      "delta": {
        "dof": -0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.60_dsplus0.80",
      "delta": {
        "dof": -0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.20",
      "delta": {
        "dof": -0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.40_dsminus1.00",
      "delta": {
        "dof": -0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.80",
      "delta": {
        "dof": -0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.60",
      "delta": {
        "dof": -0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.40",
      "delta": {
        "dof": -0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsminus0.20",
      "delta": {
        "dof": -0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.00",
      "delta": {
        "dof": -0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.20",
      "delta": {
        "dof": -0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.40",
      "delta": {
        "dof": -0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.60",
      "delta": {
        "dof": -0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.40_dsplus0.80",
      "delta": {
        "dof": -0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.20",
      "delta": {
        "dof": -0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddminus0.20_dsminus1.00",
      "delta": {
        "dof": -0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.80",
      "delta": {
        "dof": -0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.60",
      "delta": {
        "dof": -0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.40",
      "delta": {
        "dof": -0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsminus0.20",
      "delta": {
        "dof": -0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.00",
      "delta": {
        "dof": -0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.20",
      "delta": {
        "dof": -0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.40",
      "delta": {
        "dof": -0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.60",
      "delta": {
        "dof": -0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddminus0.20_dsplus0.80",
      "delta": {
        "dof": -0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddminus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.20",
      "delta": {
        "dof": 0.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.00_dsminus1.00",
      "delta": {
        "dof": 0.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.80",
      "delta": {
        "dof": 0.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.60",
      "delta": {
        "dof": 0.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.40",
      "delta": {
        "dof": 0.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsminus0.20",
      "delta": {
        "dof": 0.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.20",
      "delta": {
        "dof": 0.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.40",
      "delta": {
        "dof": 0.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.60",
      "delta": {
        "dof": 0.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.00_dsplus0.80",
      "delta": {
        "dof": 0.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.20",
      "delta": {
        "dof": 0.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.20_dsminus1.00",
      "delta": {
        "dof": 0.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.80",
      "delta": {
        "dof": 0.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.60",
      "delta": {
        "dof": 0.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.40",
      "delta": {
        "dof": 0.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsminus0.20",
      "delta": {
        "dof": 0.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.00",
      "delta": {
        "dof": 0.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.20",
      "delta": {
        "dof": 0.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.40",
      "delta": {
        "dof": 0.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.60",
      "delta": {
        "dof": 0.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.20_dsplus0.80",
      "delta": {
        "dof": 0.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.20_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.20",
      "delta": {
        "dof": 0.4,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.40_dsminus1.00",
      "delta": {
        "dof": 0.4,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.80",
      "delta": {
        "dof": 0.4,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.60",
      "delta": {
        "dof": 0.4,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.40",
      "delta": {
        "dof": 0.4,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsminus0.20",
      "delta": {
        "dof": 0.4,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.00",
      "delta": {
        "dof": 0.4,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.20",
      "delta": {
        "dof": 0.4,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.40",
      "delta": {
        "dof": 0.4,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.60",
      "delta": {
        "dof": 0.4,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.40_dsplus0.80",
      "delta": {
        "dof": 0.4,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.40_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.20",
      "delta": {
        "dof": 0.6,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.60_dsminus1.00",
      "delta": {
        "dof": 0.6,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.80",
      "delta": {
        "dof": 0.6,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.60",
      "delta": {
        "dof": 0.6,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.40",
      "delta": {
        "dof": 0.6,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsminus0.20",
      "delta": {
        "dof": 0.6,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.00",
      "delta": {
        "dof": 0.6,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.20",
      "delta": {
        "dof": 0.6,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.40",
      "delta": {
        "dof": 0.6,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.60",
      "delta": {
        "dof": 0.6,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.60_dsplus0.80",
      "delta": {
        "dof": 0.6,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.60_dsplus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.20",
      "delta": {
        "dof": 0.8,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.20.jpg"
    },
    {
      "id": "ddplus0.80_dsminus1.00",
      "delta": {
        "dof": 0.8,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus1.00.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.80",
      "delta": {
        "dof": 0.8,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.80.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.60",
      "delta": {
        "dof": 0.8,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.40",
      "delta": {
        "dof": 0.8,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsminus0.20",
      "delta": {
        "dof": 0.8,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsminus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.00",
      "delta": {
        "dof": 0.8,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.00.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.20",
      "delta": {
        "dof": 0.8,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.20.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.40",
      "delta": {
        "dof": 0.8,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.40.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.60",
      "delta": {
        "dof": 0.8,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.60.jpg"
    },
    {
      "id": "ddplus0.80_dsplus0.80",
      "delta": {
        "dof": 0.8,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus0.80_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.20",
      "delta": {
        "dof": 1.0,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.00_dsminus1.00",
      "delta": {
        "dof": 1.0,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.80",
      "delta": {
        "dof": 1.0,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.60",
      "delta": {
        "dof": 1.0,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.40",
      "delta": {
        "dof": 1.0,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsminus0.20",
      "delta": {
        "dof": 1.0,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.00",
      "delta": {
        "dof": 1.0,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.20",
      "delta": {
        "dof": 1.0,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.40",
      "delta": {
        "dof": 1.0,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.60",
      "delta": {
        "dof": 1.0,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.00_dsplus0.80",
      "delta": {
        "dof": 1.0,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.00_dsplus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.20",
      "delta": {
        "dof": 1.2,
        "slope": -1.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.20.jpg"
    },
    {
      "id": "ddplus1.20_dsminus1.00",
      "delta": {
        "dof": 1.2,
        "slope": -1.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus1.00.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.80",
      "delta": {
        "dof": 1.2,
        "slope": -0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.80.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.60",
      "delta": {
        "dof": 1.2,
        "slope": -0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.40",
      "delta": {
        "dof": 1.2,
        "slope": -0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsminus0.20",
      "delta": {
        "dof": 1.2,
        "slope": -0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsminus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.00",
      "delta": {
        "dof": 1.2,
        "slope": 0.0
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.00.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.20",
      "delta": {
        "dof": 1.2,
        "slope": 0.2
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.20.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.40",
      "delta": {
        "dof": 1.2,
        "slope": 0.4
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.40.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.60",
      "delta": {
        "dof": 1.2,
        "slope": 0.6
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.60.jpg"
    },
    {
      "id": "ddplus1.20_dsplus0.80",
      "delta": {
        "dof": 1.2,
        "slope": 0.8
      },
      "end": null,
      "panel_path": "panel_ddplus1.20_dsplus0.80.jpg"
    }

    ]
  },

  scene5: null
};

// 先把没定义的 scene alias 到 scene1，方便你调试
// OURMETHOD_MANIFESTS.scene3 = OURMETHOD_MANIFESTS.scene3 || OURMETHOD_MANIFESTS.scene1;
// OURMETHOD_MANIFESTS.scene4 = OURMETHOD_MANIFESTS.scene4 || OURMETHOD_MANIFESTS.scene1;
OURMETHOD_MANIFESTS.scene5 = OURMETHOD_MANIFESTS.scene5 || OURMETHOD_MANIFESTS.scene1;

// =====================================================
// 2. 主逻辑：用内嵌 manifest 构造 dd / ds 网格 + slider 映射
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("[OurMethod] CVPR_Mine_OurMethod_Playground.js loaded");

  // ---- 场景配置：现在只需要 label，用于日志 / 后续扩展 ----
  const SCENES_CONFIG = {
    scene1: { label: "Case 01" },
    scene2: { label: "Case 02" },
    scene3: { label: "Case 03" },
    scene4: { label: "Case 04" },
    scene5: { label: "Case 05" }
  };

  const DEFAULT_SCENE_ID = "scene1";

  // ---- 状态 & 缓存 ----
  let currentSceneId = DEFAULT_SCENE_ID;
  let currentApertureIdx = 0; // index in ddList
  let currentFocalIdx = 0;    // index in dsList

  // sceneDataCache[sceneId] = {
  //   basePath: string,
  //   ddList: number[],
  //   dsList: number[],
  //   combos: { "ddIdx_dsIdx": idString }
  // }
  const sceneDataCache = {};

  // ---- DOM 绑定 ----
  const imageWrapper   = document.getElementById("ourmethod-viewer");
  const focalSlider    = document.getElementById("ourmethod-focal-slider");
  const apertureSlider = document.getElementById("ourmethod-aperture-slider");
  const sceneButtons   = document.querySelectorAll(".ourmethod-scene-button");

  const imgOutput = document.getElementById("ourmethod-output-img");  // 右边输出图
  const imgInput  = document.getElementById("ourmethod-input-img");   // 左边输入图

  if (!imageWrapper || !focalSlider || !apertureSlider || !imgOutput || !imgInput) {
    console.warn("[OurMethod] Missing DOM elements, please check IDs.");
    return;
  }

  // 给输出图设置下样式（可选）
  imgOutput.style.maxWidth = "100%";
  imgOutput.style.height   = "auto";
  imgOutput.alt            = "Our method sample preview";

  imgOutput.addEventListener("error", function () {
    console.error("[OurMethod] image load error:", imgOutput.src);
  });

  // =====================================================
  // 工具函数
  // =====================================================

function findClosestIndex(list, target) {
  let bestIdx = 0;
  let bestDist = Infinity;
  list.forEach((v, i) => {
    const dist = Math.abs(v - target);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  return bestIdx;
}

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function sliderToIndex(sliderValue, numSteps) {
    if (!numSteps || numSteps <= 1) return 0;
    const v = parseFloat(sliderValue);
    const idx = Math.round((v / 100) * (numSteps - 1));
    return clamp(idx, 0, numSteps - 1);
  }

  function indexToSlider(idx, numSteps) {
    if (!numSteps || numSteps <= 1) return 0;
    if (idx <= 0) return 0;
    if (idx >= numSteps - 1) return 100;
    const v = (idx / (numSteps - 1)) * 100;
    return clamp(v, 0, 100);
  }

  function uniqueSorted(numbers) {
    const arr = Array.from(new Set(numbers.map(v => +Number(v).toFixed(4))));
    arr.sort((a, b) => a - b);
    return arr;
  }

  // =====================================================
  // 利用内嵌 manifest 构造 sceneData
  // =====================================================

  function ensureSceneDataLoaded(sceneId) {
    if (sceneDataCache[sceneId]) {
      return sceneDataCache[sceneId];
    }

    const manifest = OURMETHOD_MANIFESTS[sceneId];
    if (!manifest) {
      throw new Error("[OurMethod] No embedded manifest for scene: " + sceneId);
    }

    const basePath = manifest.basePath;
    const records = Array.isArray(manifest.records) ? manifest.records : [];

    const ddValues = [];
    const dsValues = [];

    records.forEach((rec) => {
      const delta = rec.delta || {};
      const dof = Number(delta.dof);
      const slope = Number(delta.slope);
      if (!Number.isFinite(dof) || !Number.isFinite(slope)) {
        console.warn("[OurMethod] Bad delta in record, skip:", rec);
        return;
      }
      ddValues.push(dof);
      dsValues.push(slope);
    });

    const ddList = uniqueSorted(ddValues);
    const dsList = uniqueSorted(dsValues);

    const ddIndexMap = {};
    ddList.forEach((v, i) => {
      ddIndexMap[v.toFixed(4)] = i;
    });
    const dsIndexMap = {};
    dsList.forEach((v, i) => {
      dsIndexMap[v.toFixed(4)] = i;
    });

    const combos = {};
    records.forEach((rec) => {
      const delta = rec.delta || {};
      const dof = Number(delta.dof);
      const slope = Number(delta.slope);
      if (!Number.isFinite(dof) || !Number.isFinite(slope)) {
        return;
      }
      const ddIdx = ddIndexMap[dof.toFixed(4)];
      const dsIdx = dsIndexMap[slope.toFixed(4)];
      if (ddIdx == null || dsIdx == null) return;
      const id = rec.id;
      if (!id) return;
      combos[`${ddIdx}_${dsIdx}`] = id;
    });

    const sceneData = {
      basePath,
      ddList,
      dsList,
      combos
    };
    sceneDataCache[sceneId] = sceneData;

    console.log("[OurMethod] Scene data loaded (embedded):", sceneId, {
      basePath,
      ddRange: ddList.length ? [ddList[0], ddList[ddList.length - 1]] : null,
      dsRange: dsList.length ? [dsList[0], dsList[dsList.length - 1]] : null,
      ddCount: ddList.length,
      dsCount: dsList.length
    });

    return sceneData;
  }

  // =====================================================
  // 渲染当前状态
  // =====================================================

  function updateImageFromState() {
    const sceneData = sceneDataCache[currentSceneId];
    if (!sceneData) {
      console.warn("[OurMethod] Scene data not loaded yet for:", currentSceneId);
      return;
    }
    const { basePath, ddList, dsList, combos } = sceneData;

    if (!ddList.length || !dsList.length) {
      console.warn("[OurMethod] Empty ddList/dsList for scene:", currentSceneId);
      return;
    }

    const apIdx = clamp(currentApertureIdx, 0, ddList.length - 1);
    const fpIdx = clamp(currentFocalIdx, 0, dsList.length - 1);

    const key = `${apIdx}_${fpIdx}`;
    const id = combos[key];

    if (!id) {
      console.warn("[OurMethod] No id for combo (ddIdx, dsIdx):", key, "scene:", currentSceneId);
      return;
    }

    const filename = `output_${id}.jpg`;
    const src = `${(basePath || "").replace(/\/$/, "")}/${filename}`;

    console.log("[OurMethod] updateImageFromState:", {
      scene: currentSceneId,
      apIdx,
      fpIdx,
      dd: ddList[apIdx],
      ds: dsList[fpIdx],
      id,
      filename,
      src
    });

    imgOutput.src = src;
    imgOutput.dataset.apertureIdx = String(apIdx);
    imgOutput.dataset.focalIdx    = String(fpIdx);
    imgOutput.dataset.sceneId     = currentSceneId;
  }


  // =====================================================
  // 事件绑定
  // =====================================================

  focalSlider.addEventListener("input", function (e) {
    const sceneData = sceneDataCache[currentSceneId];
    if (!sceneData) return;
    const dsList = sceneData.dsList || [];
    currentFocalIdx = sliderToIndex(e.target.value, dsList.length);
    updateImageFromState();
  });

  apertureSlider.addEventListener("input", function (e) {
    const sceneData = sceneDataCache[currentSceneId];
    if (!sceneData) return;
    const ddList = sceneData.ddList || [];
    currentApertureIdx = sliderToIndex(e.target.value, ddList.length);
    updateImageFromState();
  });

    sceneButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const sceneId = btn.getAttribute("data-scene");
        if (!sceneId || !SCENES_CONFIG[sceneId]) {
        console.warn("[OurMethod] Unknown scene id:", sceneId);
        return;
        }

        currentSceneId = sceneId;

        // ⭐ 场景切换时，控制左边的 input 图
        if (INPUT_PATHS[sceneId]) {
            imgInput.src = INPUT_PATHS[sceneId];
            imgInput.style.display = "block";
        } else {
            imgInput.style.display = "none";
        }

        // 按钮高亮切换
        sceneButtons.forEach(function (b) {
        b.classList.remove("is-active", "is-info");
        b.classList.add("is-light");
        });
        btn.classList.add("is-active", "is-info");
        btn.classList.remove("is-light");

        // 根据当前场景，重新计算 slider 对应的 index
        const sceneData = ensureSceneDataLoaded(currentSceneId);
        const ddList = sceneData.ddList || [];
        const dsList = sceneData.dsList || [];

        currentFocalIdx = sliderToIndex(focalSlider.value, dsList.length);
        currentApertureIdx = sliderToIndex(apertureSlider.value, ddList.length);

        // 用新的 scene + index 刷新右边的 output 图
        updateImageFromState();
    });
    });


  // =====================================================
  // 初始化
  // =====================================================

  (function init() {
    try {
      currentSceneId = DEFAULT_SCENE_ID;

      const sceneData = ensureSceneDataLoaded(currentSceneId);
      const ddList = sceneData.ddList || [];
      const dsList = sceneData.dsList || [];

    //   currentApertureIdx = ddList.length > 0 ? Math.floor(ddList.length / 2) : 0;
    //   currentFocalIdx = dsList.length > 0 ? Math.floor(dsList.length / 2) : 0;
      currentApertureIdx = 12;
      currentFocalIdx = 1;

      apertureSlider.value = String(indexToSlider(currentApertureIdx, ddList.length));
      focalSlider.value = String(indexToSlider(currentFocalIdx, dsList.length));

      // 初始就是 scene1：显示左边的 input 图
      imgInput.src = "./static/Our_Res_Playground/Case_01_Sparse/images/input.jpg";
      imgInput.style.display = "block";


      updateImageFromState();
    } catch (err) {
      console.error("[OurMethod] init failed:", err);
    }
  })();
});
























