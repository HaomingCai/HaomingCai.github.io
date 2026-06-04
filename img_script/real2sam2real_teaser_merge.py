"""
Real2SAM2Real homepage teaser: merge two MP4s with a sliding vertical divider
(same idea as flash_splate_merge.py, but MP4 sources instead of GIF).

Usage:
  python real2sam2real_teaser_merge.py --left baseline.mp4 --right ours.mp4
  python real2sam2real_teaser_merge.py --left baseline.mp4 --right ours.mp4 \\
      -o ../tn/videos/real2sam2real_teaser.mp4 --fps 24 --max-frames 120

Left video (video1) fills the left of the divider; right video (video2) fills the right.
Divider sweeps left → right → left over the clip (sin envelope), loop-friendly at frame 0.

Square crop anchors (CLI):
  --crop-x left|center|right   horizontal alignment of the square window
  --crop-y top|center|bottom   vertical alignment
  --crop-by height|width|min   square side length (default: height)

Letterbox removal (before square crop, resize back to original frame size):
  --right-bar-top / --right-bar-bottom   ours only (or --bar-top/bottom for both)
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np


def find_ffmpeg():
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    local_ffmpeg = os.path.join(script_dir, "ffmpeg.exe")
    if os.path.exists(local_ffmpeg):
        return local_ffmpeg
    for path in (
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe",
        os.path.expanduser(r"~\ffmpeg\bin\ffmpeg.exe"),
    ):
        if os.path.exists(path):
            return path
    return None


def _anchor_start(full, crop_size, anchor):
    """Return start index along one axis for left/top/center/right/bottom."""
    slack = max(0, full - crop_size)
    if anchor in ("left", "top"):
        return 0
    if anchor in ("right", "bottom"):
        return slack
    return slack // 2


def crop_square(img, side="height", anchor_x="center", anchor_y="center"):
    """
    Crop to a square with configurable side length and anchor.

    side: 'height' | 'width' | 'min' — which dimension sets the square size
    anchor_x: 'left' | 'center' | 'right'
    anchor_y: 'top' | 'center' | 'bottom'
    """
    h, w = img.shape[:2]

    if side == "height":
        crop_size = h
        if w < crop_size:
            scale = crop_size / w
            img = cv2.resize(img, (crop_size, int(h * scale)))
            h, w = img.shape[:2]
    elif side == "width":
        crop_size = w
        if h < crop_size:
            scale = crop_size / h
            img = cv2.resize(img, (int(w * scale), crop_size))
            h, w = img.shape[:2]
    elif side == "min":
        crop_size = min(h, w)
    else:
        raise ValueError(f"Unknown crop side: {side}")

    start_x = _anchor_start(w, crop_size, anchor_x)
    start_y = _anchor_start(h, crop_size, anchor_y)
    return img[start_y : start_y + crop_size, start_x : start_x + crop_size]


def crop_vertical_bars_resize(img, top=0, bottom=0):
    """
    Remove top/bottom rows (e.g. letterbox bars), then resize back to original size.
    """
    if top <= 0 and bottom <= 0:
        return img
    h, w = img.shape[:2]
    if top + bottom >= h:
        raise ValueError(
            f"bar crop top+bottom ({top}+{bottom}) must be less than height ({h})"
        )
    end_y = h - bottom if bottom > 0 else h
    inner = img[top:end_y, :]
    return cv2.resize(inner, (w, h), interpolation=cv2.INTER_LINEAR)


def apply_bar_crop_to_frames(frames, top, bottom, label=""):
    if top <= 0 and bottom <= 0:
        return frames
    if not frames:
        return frames
    h, w = frames[0].shape[:2]
    print(f"{label}上下黑边裁切: top={top}px, bottom={bottom}px → resize 回 {w}x{h}")
    return [crop_vertical_bars_resize(f, top, bottom) for f in frames]


def extract_video_frames(video_path, max_frames=None, skip_frames=0):
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"错误: 无法打开视频 {video_path}")
        return None, None

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 120:
        fps = 24.0

    for _ in range(skip_frames):
        if not cap.read()[0]:
            break

    frames = []
    while True:
        if max_frames is not None and len(frames) >= max_frames:
            break
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)

    cap.release()
    if not frames:
        print(f"错误: 视频中没有帧 {video_path}")
        return None, None

    skip_note = f"，跳过前 {skip_frames} 帧" if skip_frames else ""
    print(f"从 {video_path} 读取 {len(frames)} 帧，fps≈{fps:.2f}{skip_note}")
    return frames, fps


def subsample_frames(frames, target_len):
    """Uniformly pick target_len frames across the full clip (same motion, lower fps)."""
    n = len(frames)
    if n == target_len:
        return frames
    if target_len <= 0:
        return []
    if target_len == 1:
        return [frames[0]]
    indices = np.linspace(0, n - 1, target_len, dtype=int)
    return [frames[i] for i in indices]


def pad_or_truncate_frames(frames, target_len, pad="hold"):
    if len(frames) >= target_len:
        return frames[:target_len]
    if pad == "hold":
        return frames + [frames[-1]] * (target_len - len(frames))
    if pad == "loop":
        out = []
        while len(out) < target_len:
            out.extend(frames)
        return out[:target_len]
    raise ValueError(f"Unknown pad mode: {pad}")


def fit_frames_to_length(frames, target_len, pad="hold", downsample="subsample"):
    """Match target length: subsample/truncate if longer, pad if shorter."""
    n = len(frames)
    if n == target_len:
        return frames
    if n > target_len:
        if downsample == "subsample":
            return subsample_frames(frames, target_len)
        if downsample == "truncate":
            return frames[:target_len]
        raise ValueError(f"Unknown downsample mode: {downsample}")
    return pad_or_truncate_frames(frames, target_len, pad)


def sync_frame_lists(
    frames_left, frames_right, sync_to="min", pad="hold", downsample="subsample"
):
    """
    Align two frame lists to the same length.

    sync_to:
      min   — 以较短一路的帧数为准（默认）
      max   — 以较长一路的帧数为准
      left  — 以左路帧数为准（wf 49 帧 → ours 81 帧均匀抽成 49）
      right — 以右路帧数为准
    downsample: subsample（均匀抽帧，同 motion 不同 fps）| truncate（只取前 N 帧）
    pad: hold | loop，仅在需要补帧时使用
    """
    nl, nr = len(frames_left), len(frames_right)
    if nl == nr:
        return frames_left, frames_right

    if sync_to == "min":
        n = min(nl, nr)
        return (
            fit_frames_to_length(frames_left, n, pad, downsample),
            fit_frames_to_length(frames_right, n, pad, downsample),
        )
    if sync_to == "max":
        n = max(nl, nr)
        return (
            fit_frames_to_length(frames_left, n, pad, downsample),
            fit_frames_to_length(frames_right, n, pad, downsample),
        )
    if sync_to == "left":
        return frames_left, fit_frames_to_length(frames_right, nl, pad, downsample)
    if sync_to == "right":
        return fit_frames_to_length(frames_left, nr, pad, downsample), frames_right
    raise ValueError(f"Unknown sync_to: {sync_to}")


def resample_by_time(frames_left, fps_left, frames_right, fps_right, num_frames, output_fps):
    """
    Pair frames by wall-clock time (handles different fps and different lengths).
    Uses timeline length = min(duration_left, duration_right).
    """
    dur = min(len(frames_left) / fps_left, len(frames_right) / fps_right)
    out_left, out_right = [], []
    for i in range(num_frames):
        t = i / output_fps if output_fps > 0 else 0
        if t > dur:
            break
        il = min(int(round(t * fps_left)), len(frames_left) - 1)
        ir = min(int(round(t * fps_right)), len(frames_right) - 1)
        out_left.append(frames_left[il])
        out_right.append(frames_right[ir])
    return out_left, out_right, dur


def even_size(width, height):
    if width % 2:
        width -= 1
    if height % 2:
        height -= 1
    return width, height


def compose_slider_frame(img1, img2, line_position, divider_line_width, output_width, output_height):
    img1_resized = cv2.resize(img1, (output_width, output_height))
    img2_resized = cv2.resize(img2, (output_width, output_height))

    merged = np.zeros((output_height, output_width, 3), dtype=np.uint8)

    if line_position > 0:
        merged[:, :line_position] = img1_resized[:, :line_position]

    merged[:, line_position : line_position + divider_line_width] = 0

    right_start = line_position + divider_line_width
    right_width = output_width - right_start
    if right_width > 0:
        img2_start_x = output_width - right_width
        merged[:, right_start:output_width] = img2_resized[:, img2_start_x:output_width]

    return merged


def combine_videos_to_teaser(
    left_path,
    right_path,
    output_path,
    fps=None,
    max_frames=None,
    ffmpeg_path=None,
    divider_line_width=2,
    crop_by="height",
    crop_x="center",
    crop_y="center",
    left_crop_x=None,
    left_crop_y=None,
    right_crop_x=None,
    right_crop_y=None,
    left_skip=0,
    right_skip=0,
    bar_top=0,
    bar_bottom=0,
    left_bar_top=None,
    left_bar_bottom=None,
    right_bar_top=None,
    right_bar_bottom=None,
    sync_to="min",
    pad="hold",
    downsample="subsample",
    resample_time=False,
):
    """
    Merge two MP4s into one teaser with a moving vertical divider.

    left_path:  shown on the left of the divider (e.g. baseline)
    right_path: shown on the right of the divider (e.g. ours)
    """
    if ffmpeg_path is None:
        ffmpeg_path = find_ffmpeg()
    if not ffmpeg_path:
        print("错误: 未找到 ffmpeg（请安装并加入 PATH）")
        return False

    left_path = Path(left_path)
    right_path = Path(right_path)
    output_path = Path(output_path)

    if not left_path.is_file():
        print(f"错误: 左侧视频不存在: {left_path}")
        return False
    if not right_path.is_file():
        print(f"错误: 右侧视频不存在: {right_path}")
        return False

    print("正在读取视频帧...")
    frames_left, fps_left = extract_video_frames(
        left_path, max_frames=max_frames, skip_frames=left_skip
    )
    frames_right, fps_right = extract_video_frames(
        right_path, max_frames=max_frames, skip_frames=right_skip
    )
    if frames_left is None or frames_right is None:
        return False

    lt = bar_top if left_bar_top is None else left_bar_top
    lb = bar_bottom if left_bar_bottom is None else left_bar_bottom
    rt = bar_top if right_bar_top is None else right_bar_top
    rb = bar_bottom if right_bar_bottom is None else right_bar_bottom
    frames_left = apply_bar_crop_to_frames(frames_left, lt, lb, label="左路 ")
    frames_right = apply_bar_crop_to_frames(frames_right, rt, rb, label="右路 ")

    dur_left = len(frames_left) / fps_left
    dur_right = len(frames_right) / fps_right
    print(
        f"时长: 左 {len(frames_left)} 帧 / {dur_left:.2f}s @ {fps_left:.2f}fps，"
        f"右 {len(frames_right)} 帧 / {dur_right:.2f}s @ {fps_right:.2f}fps"
    )

    if fps is None:
        fps = fps_left if fps_left > 0 else fps_right
    fps = float(fps)

    if resample_time:
        if max_frames is not None:
            num_out = max_frames
        else:
            num_out = int(min(dur_left, dur_right) * fps)
        num_out = max(1, num_out)
        print(
            f"按时间轴重采样: {num_out} 帧 @ {fps:.2f}fps "
            f"（覆盖 min(时长)={min(dur_left, dur_right):.2f}s）"
        )
        frames_left, frames_right, used_dur = resample_by_time(
            frames_left, fps_left, frames_right, fps_right, num_out, fps
        )
    else:
        if len(frames_left) != len(frames_right):
            print(
                f"帧数对齐 (--sync-to {sync_to}, --downsample {downsample}, --pad {pad}): "
                f"{len(frames_left)} vs {len(frames_right)}"
            )
        frames_left, frames_right = sync_frame_lists(
            frames_left,
            frames_right,
            sync_to=sync_to,
            pad=pad,
            downsample=downsample,
        )
        n = len(frames_left)
        motion_fps = n / min(dur_left, dur_right) if min(dur_left, dur_right) > 0 else fps
        print(
            f"对齐后 {n} 帧；若 motion 已覆盖完整时长，输出 fps≈{motion_fps:.2f} 可保持原速 "
            f"（当前输出 fps={fps:.2f}）"
        )

    frame_count = len(frames_left)
    if frame_count == 0:
        print("错误: 没有可用帧")
        return False

    if len(frames_left) != len(frames_right):
        print("错误: 对齐后帧数仍不一致")
        return False

    lx = left_crop_x if left_crop_x is not None else crop_x
    ly = left_crop_y if left_crop_y is not None else crop_y
    rx = right_crop_x if right_crop_x is not None else crop_x
    ry = right_crop_y if right_crop_y is not None else crop_y

    print(
        f"正在 square crop (by={crop_by}, "
        f"left=({lx},{ly}), right=({rx},{ry}))..."
    )
    frames_left = [
        crop_square(f, side=crop_by, anchor_x=lx, anchor_y=ly) for f in frames_left
    ]
    frames_right = [
        crop_square(f, side=crop_by, anchor_x=rx, anchor_y=ry) for f in frames_right
    ]

    h1, w1 = frames_left[0].shape[:2]
    h2, w2 = frames_right[0].shape[:2]
    output_width, output_height = even_size(max(w1, w2), min(h1, h2))

    print(f"左视频 crop 后: {w1}x{h1}")
    print(f"右视频 crop 后: {w2}x{h2}")
    print(f"输出: {output_width}x{output_height}, {frame_count} 帧 @ {fps:.2f} fps")
    print(f"分隔线宽度: {divider_line_width}px，滑窗 左→右→左（sin）")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_dir = output_path.parent / "temp_real2sam2real_teaser_frames"
    temp_dir.mkdir(parents=True, exist_ok=True)

    try:
        max_line_position = output_width - divider_line_width
        for i in range(frame_count):
            progress = i / (frame_count - 1) if frame_count > 1 else 0.0
            position_ratio = abs(np.sin(progress * np.pi))
            line_position = int(position_ratio * max_line_position)

            merged = compose_slider_frame(
                frames_left[i],
                frames_right[i],
                line_position,
                divider_line_width,
                output_width,
                output_height,
            )
            cv2.imwrite(str(temp_dir / f"frame_{i:06d}.png"), merged)

            if (i + 1) % 30 == 0 or i + 1 == frame_count:
                print(f"  已处理 {i + 1}/{frame_count} (divider x={line_position})")

        pattern = str(temp_dir / "frame_%06d.png")
        cmd = [
            ffmpeg_path,
            "-y",
            "-framerate",
            str(fps),
            "-i",
            pattern,
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-profile:v",
            "baseline",
            "-level",
            "3.0",
            "-movflags",
            "+faststart",
            str(output_path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print("错误: ffmpeg 编码失败")
            print(result.stderr)
            return False

        temp_out = str(output_path) + ".tmp"
        optimize = subprocess.run(
            [
                ffmpeg_path,
                "-i",
                str(output_path),
                "-c",
                "copy",
                "-movflags",
                "+faststart",
                "-y",
                temp_out,
            ],
            capture_output=True,
            text=True,
        )
        if optimize.returncode == 0:
            os.replace(temp_out, output_path)
        elif os.path.exists(temp_out):
            os.remove(temp_out)

        print(f"\n✓ 完成: {output_path}")
        return True

    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
            print("已清理临时帧目录")


def parse_args():
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent
    default_out = repo_root / "tn" / "videos" / "real2sam2real_teaser.mp4"

    p = argparse.ArgumentParser(
        description="Real2SAM2Real: two MP4s → sliding-divider teaser MP4"
    )
    p.add_argument(
        "--left",
        "-l",
        required=True,
        help="Left / baseline MP4 (left side of divider)",
    )
    p.add_argument(
        "--right",
        "-r",
        required=True,
        help="Right / ours MP4 (right side of divider)",
    )
    p.add_argument(
        "-o",
        "--output",
        default=str(default_out),
        help=f"Output MP4 (default: {default_out})",
    )
    p.add_argument(
        "--fps",
        type=float,
        default=None,
        help="Output fps (default: from left video)",
    )
    p.add_argument(
        "--max-frames",
        type=int,
        default=None,
        help="Use only first N frames from each video (good for short teasers)",
    )
    p.add_argument(
        "--divider",
        type=int,
        default=2,
        help="Divider line width in pixels (default: 2)",
    )
    crop = p.add_argument_group("square crop")
    crop.add_argument(
        "--crop-by",
        choices=("height", "width", "min"),
        default="height",
        help="Square side from frame height, width, or min(h,w) (default: height)",
    )
    crop.add_argument(
        "--crop-x",
        choices=("left", "center", "right"),
        default="center",
        help="Horizontal crop anchor for both videos (default: center)",
    )
    crop.add_argument(
        "--crop-y",
        choices=("top", "center", "bottom"),
        default="center",
        help="Vertical crop anchor for both videos (default: center)",
    )
    crop.add_argument(
        "--left-crop-x",
        choices=("left", "center", "right"),
        default=None,
        help="Override --crop-x for left video only",
    )
    crop.add_argument(
        "--left-crop-y",
        choices=("top", "center", "bottom"),
        default=None,
        help="Override --crop-y for left video only",
    )
    crop.add_argument(
        "--right-crop-x",
        choices=("left", "center", "right"),
        default=None,
        help="Override --crop-x for right video only",
    )
    crop.add_argument(
        "--right-crop-y",
        choices=("top", "center", "bottom"),
        default=None,
        help="Override --crop-y for right video only",
    )
    bars = p.add_argument_group("letterbox bar crop (before square crop)")
    bars.add_argument(
        "--bar-top",
        type=int,
        default=0,
        help="Pixels to crop from top of both videos, then resize back (default: 0)",
    )
    bars.add_argument(
        "--bar-bottom",
        type=int,
        default=0,
        help="Pixels to crop from bottom of both videos, then resize back (default: 0)",
    )
    bars.add_argument(
        "--left-bar-top",
        type=int,
        default=None,
        help="Override --bar-top for left video only",
    )
    bars.add_argument(
        "--left-bar-bottom",
        type=int,
        default=None,
        help="Override --bar-bottom for left video only",
    )
    bars.add_argument(
        "--right-bar-top",
        type=int,
        default=None,
        help="Override --bar-top for right / ours video only",
    )
    bars.add_argument(
        "--right-bar-bottom",
        type=int,
        default=None,
        help="Override --bar-bottom for right / ours video only",
    )
    sync = p.add_argument_group("frame sync (when lengths differ)")
    sync.add_argument(
        "--sync-to",
        choices=("min", "max", "left", "right"),
        default="min",
        help="Frame-count target: min/max/left/right (default: min). "
        "With --downsample subsample, min=left-count when wf is shorter.",
    )
    sync.add_argument(
        "--downsample",
        choices=("subsample", "truncate"),
        default="subsample",
        help="When shortening: subsample=uniform coarse sampling (same motion, "
        "different fps); truncate=first N frames only (default: subsample)",
    )
    sync.add_argument(
        "--pad",
        choices=("hold", "loop"),
        default="hold",
        help="Shorter stream: hold last frame or loop (default: hold)",
    )
    sync.add_argument(
        "--left-skip",
        type=int,
        default=0,
        help="Skip first N frames of left video before sync",
    )
    sync.add_argument(
        "--right-skip",
        type=int,
        default=0,
        help="Skip first N frames of right video before sync",
    )
    sync.add_argument(
        "--resample-time",
        action="store_true",
        help="Pair by wall-clock time (use if fps differ); ignores --sync-to",
    )
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    print("=" * 60)
    print("Real2SAM2Real teaser (MP4 + MP4, sliding divider)")
    print("=" * 60)
    print(f"Left (baseline):  {args.left}")
    print(f"Right (ours):     {args.right}")
    print(f"Output:           {args.output}")
    if args.max_frames:
        print(f"Max frames:       {args.max_frames}")
    print(
        f"Crop:             by={args.crop_by}, x={args.crop_x}, y={args.crop_y}"
    )
    print(
        f"Sync:             sync_to={args.sync_to}, downsample={args.downsample}, "
        f"pad={args.pad}, resample_time={args.resample_time}"
    )
    if args.left_skip or args.right_skip:
        print(f"Skip frames:      left={args.left_skip}, right={args.right_skip}")
    rt = args.bar_top if args.right_bar_top is None else args.right_bar_top
    rb = args.bar_bottom if args.right_bar_bottom is None else args.right_bar_bottom
    if rt or rb or args.bar_top or args.bar_bottom or args.left_bar_top or args.left_bar_bottom:
        print(
            f"Bar crop:         left top/bot="
            f"{args.left_bar_top if args.left_bar_top is not None else args.bar_top}/"
            f"{args.left_bar_bottom if args.left_bar_bottom is not None else args.bar_bottom}, "
            f"right top/bot={rt}/{rb}"
        )
    print("=" * 60)
    print()

    ok = combine_videos_to_teaser(
        args.left,
        args.right,
        args.output,
        fps=args.fps,
        max_frames=args.max_frames,
        divider_line_width=args.divider,
        crop_by=args.crop_by,
        crop_x=args.crop_x,
        crop_y=args.crop_y,
        left_crop_x=args.left_crop_x,
        left_crop_y=args.left_crop_y,
        right_crop_x=args.right_crop_x,
        right_crop_y=args.right_crop_y,
        left_skip=args.left_skip,
        right_skip=args.right_skip,
        bar_top=args.bar_top,
        bar_bottom=args.bar_bottom,
        left_bar_top=args.left_bar_top,
        left_bar_bottom=args.left_bar_bottom,
        right_bar_top=args.right_bar_top,
        right_bar_bottom=args.right_bar_bottom,
        sync_to=args.sync_to,
        pad=args.pad,
        downsample=args.downsample,
        resample_time=args.resample_time,
    )
    sys.exit(0 if ok else 1)
