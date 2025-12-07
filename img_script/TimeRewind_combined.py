
# ============================
import subprocess
import os
import shutil
import glob


# ============================
# 直接在这里修改三个路径即可
# ============================
video1 = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\HTML_Teaser_2_cropped.mp4"       # 左半边取自 video1
video2 = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\HTML_Teaser_2_cropped_ours.mp4"       # 右半边取自 video2
output = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\merged_output.gif"
target_height = None  # 例如 1080，或 None 自动匹配高度

# 临时文件名
v1_resized = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\_v1_resized.mp4"
v2_resized = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\_v2_resized.mp4"
v1_left = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\_v1_left.mp4"
v2_right = r"D:\Personal\Github_Homepage\HaomingCai.github.io\tn\videos\_v2_right.mp4"

# ================================
# 1. 获取两个视频的尺寸，统一到相同的正方形尺寸
# ================================
import cv2
print("Checking video dimensions...")
cap1 = cv2.VideoCapture(video1)
cap2 = cv2.VideoCapture(video2)

if not cap1.isOpened() or not cap2.isOpened():
    print("错误: 无法打开视频文件")
    exit(1)

w1 = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
h1 = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))
w2 = int(cap2.get(cv2.CAP_PROP_FRAME_WIDTH))
h2 = int(cap2.get(cv2.CAP_PROP_FRAME_HEIGHT))

cap1.release()
cap2.release()

print(f"Video1尺寸: {w1}x{h1}")
print(f"Video2尺寸: {w2}x{h2}")

# 使用较小的正方形边长，确保两个视频都能完整显示
target_size = min(w1, h1, w2, h2)
# 确保是偶数（H.264要求）
if target_size % 2 != 0:
    target_size -= 1

print(f"统一尺寸: {target_size}x{target_size} (正方形)")

# ================================
# 2. Resize 两个视频到相同的正方形尺寸
# ================================
print("Resizing video1 to square...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", video1,
    "-vf", f"scale={target_size}:{target_size}",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-an",
    v1_resized
])

print("Resizing video2 to square...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", video2,
    "-vf", f"scale={target_size}:{target_size}",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-an",
    v2_resized
])

# ================================
# 3. 裁切 video1 左半边
# ================================
print("Cropping left half of video1...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", v1_resized,
    "-filter:v", f"crop={target_size//2}:{target_size}:0:0",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-an",
    v1_left
])

# ================================
# 4. 裁切 video2 右半边
# ================================
print("Cropping right half of video2...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", v2_resized,
    "-filter:v", f"crop={target_size//2}:{target_size}:{target_size//2}:0",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-an",
    v2_right
])

# ================================
# 5. 左右合并（hstack）并生成GIF
# ================================
print("Concatenating left + right and generating GIF...")

# 临时文件：先合并成MP4，然后转换为GIF
temp_merged = output.replace('.gif', '_temp_merged.mp4')
temp_frames_dir = output.replace('.gif', '_temp_frames')
palette_file = output.replace('.gif', '_palette.png')

# 创建临时帧目录
os.makedirs(temp_frames_dir, exist_ok=True)

# 第一步：合并视频为MP4（保持原有操作，合并后应该是正方形）
print("Step 1: Merging videos...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", v1_left,
    "-i", v2_right,
    "-filter_complex", "hstack=inputs=2",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-an",
    temp_merged
])

# 第二步：提取所有帧
print("Step 2: Extracting frames...")
forward_frames_pattern = os.path.join(temp_frames_dir, "forward_%06d.png")
subprocess.run([
    "ffmpeg", "-y",
    "-i", temp_merged,
    "-vf", "fps=10",
    forward_frames_pattern
])

# 第三步：创建正向+倒放的帧序列
print("Step 3: Creating forward + reverse frame sequence...")
forward_frames = sorted(glob.glob(os.path.join(temp_frames_dir, "forward_*.png")))
frame_count = len(forward_frames)

if frame_count == 0:
    print("错误: 没有提取到帧")
    exit(1)

print(f"  找到 {frame_count} 帧")
print("  复制正向帧...")

# 复制正向帧
frame_idx = 0
for i, frame_path in enumerate(forward_frames):
    new_path = os.path.join(temp_frames_dir, f"frame_{frame_idx:06d}.png")
    shutil.copy2(frame_path, new_path)
    frame_idx += 1

# 复制倒放帧（从倒数第二帧开始，避免重复最后一帧）
print("  复制倒放帧...")
for i in range(frame_count - 2, -1, -1):
    frame_path = forward_frames[i]
    new_path = os.path.join(temp_frames_dir, f"frame_{frame_idx:06d}.png")
    shutil.copy2(frame_path, new_path)
    frame_idx += 1

total_frames = frame_idx
print(f"  总共 {total_frames} 帧（正向 {frame_count} 帧 + 倒放 {frame_count - 1} 帧）")

# 第四步：生成调色板（提高GIF质量）
print("Step 4: Generating palette...")
frames_pattern = os.path.join(temp_frames_dir, "frame_%06d.png")
subprocess.run([
    "ffmpeg", "-y",
    "-framerate", "10",
    "-i", frames_pattern,
    "-vf", "palettegen=max_colors=256:stats_mode=single",
    palette_file
])

# 第五步：使用调色板生成GIF（无限循环）
print("Step 5: Generating GIF with palette...")
subprocess.run([
    "ffmpeg", "-y",
    "-framerate", "10",
    "-i", frames_pattern,
    "-i", palette_file,
    "-filter_complex", "[0:v][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle",
    "-loop", "0",  # 无限循环
    output
])

# 清理临时文件
for temp_file in [temp_merged, palette_file]:
    if os.path.exists(temp_file):
        os.remove(temp_file)
if os.path.exists(temp_frames_dir):
    shutil.rmtree(temp_frames_dir)

print("Done! Combined GIF saved to:", output)
