import cv2
import os
import subprocess
import sys
import shutil
import numpy as np
from pathlib import Path

def find_ffmpeg():
    """
    尝试找到ffmpeg可执行文件
    返回ffmpeg的完整路径，如果找不到则返回None
    """
    # 首先尝试直接使用ffmpeg（如果已在PATH中）
    if shutil.which('ffmpeg'):
        return 'ffmpeg'
    
    # 检查脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    local_ffmpeg = os.path.join(script_dir, 'ffmpeg.exe')
    if os.path.exists(local_ffmpeg):
        return local_ffmpeg
    
    # Windows上常见的ffmpeg安装位置
    common_paths = [
        r'C:\ffmpeg\bin\ffmpeg.exe',
        r'C:\Program Files\ffmpeg\bin\ffmpeg.exe',
        r'C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe',
        os.path.expanduser(r'~\ffmpeg\bin\ffmpeg.exe'),
    ]
    
    for path in common_paths:
        if os.path.exists(path):
            return path
    
    return None


def center_crop_square_by_height(img):
    """
    以图片高度为边长，在中心进行正方形裁剪
    
    参数:
        img: 输入的图片（numpy array）
    
    返回:
        裁剪后的正方形图片（边长等于原图高度）
    """
    h, w = img.shape[:2]
    
    # 以高度为边长，进行中心裁剪
    crop_size = h  # 正方形边长等于高度
    
    # 如果宽度小于高度，先resize使宽度至少等于高度
    if w < crop_size:
        scale = crop_size / w
        new_w = crop_size
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h))
        h, w = img.shape[:2]
    
    # 中心裁剪正方形
    start_x = (w - crop_size) // 2
    start_y = (h - crop_size) // 2
    
    cropped = img[start_y:start_y + crop_size, start_x:start_x + crop_size]
    return cropped


def extract_gif_frames(gif_path):
    """
    从GIF文件中提取所有帧
    
    参数:
        gif_path: GIF文件路径
    
    返回:
        frames: 帧列表（numpy array列表）
        fps: 帧率（从GIF中提取，如果无法提取则返回默认值）
    """
    cap = cv2.VideoCapture(gif_path)
    frames = []
    
    if not cap.isOpened():
        print(f"错误: 无法打开GIF文件 {gif_path}")
        return None, None
    
    # 尝试获取帧率
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or fps > 60:  # 如果帧率不合理，使用默认值
        fps = 10  # GIF通常的帧率
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    
    cap.release()
    
    if len(frames) == 0:
        print(f"错误: GIF文件中没有找到帧")
        return None, None
    
    print(f"从 {gif_path} 提取了 {len(frames)} 帧，帧率: {fps:.2f} fps")
    return frames, fps


def gif_to_video_with_crop(gif_path, output_path, fps=None, ffmpeg_path=None):
    """
    将GIF文件转换为视频，对每一帧进行center crop（以高度为边长）
    
    参数:
        gif_path: GIF文件路径
        output_path: 输出视频路径
        fps: 视频帧率（如果为None则使用GIF的帧率）
        ffmpeg_path: ffmpeg可执行文件路径（如果为None则自动查找）
    """
    if ffmpeg_path is None:
        ffmpeg_path = find_ffmpeg()
    
    if not ffmpeg_path:
        print("错误: 未找到ffmpeg")
        print("\n请安装ffmpeg:")
        print("1. 下载: https://www.gyan.dev/ffmpeg/builds/ (Windows)")
        print("2. 解压到 C:\\ffmpeg")
        print("3. 将 C:\\ffmpeg\\bin 添加到系统PATH环境变量")
        print("   或者将ffmpeg.exe放在脚本同一目录下")
        return False
    
    # 检查文件是否存在
    if not os.path.exists(gif_path):
        print(f"错误: GIF文件不存在: {gif_path}")
        return False
    
    # 提取GIF帧
    print("正在提取GIF帧...")
    frames, gif_fps = extract_gif_frames(gif_path)
    
    if frames is None:
        return False
    
    if len(frames) == 0:
        print("错误: 没有可用的帧")
        return False
    
    # 使用GIF的帧率，或者用户指定的帧率
    if fps is None:
        fps = gif_fps if gif_fps > 0 else 10
    else:
        fps = fps
    
    print(f"使用 {len(frames)} 帧，帧率: {fps} fps")
    
    # 对每一帧进行center crop
    print("正在对帧进行center crop...")
    frames_cropped = []
    for i, frame in enumerate(frames):
        cropped_frame = center_crop_square_by_height(frame)
        frames_cropped.append(cropped_frame)
        
        if (i + 1) % 10 == 0:
            print(f"  已处理: {i + 1}/{len(frames)} 帧")
    
    # 获取裁剪后的尺寸
    h, w = frames_cropped[0].shape[:2]
    output_size = w  # 应该是正方形
    
    # H.264编码器要求尺寸必须是偶数
    if output_size % 2 != 0:
        output_size -= 1
        # 如果尺寸改变了，需要resize所有帧
        frames_cropped = [cv2.resize(frame, (output_size, output_size)) for frame in frames_cropped]
    
    print(f"裁剪后尺寸: {output_size}x{output_size} (正方形)")
    
    # 创建临时目录存储处理后的图片
    temp_dir = os.path.join(os.path.dirname(output_path), 'temp_gif_frames')
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        print(f"\n正在保存处理后的帧...")
        
        frame_idx = 0
        
        # 先保存正向帧
        print("  保存正向帧...")
        for i, frame in enumerate(frames_cropped):
            output_img_path = os.path.join(temp_dir, f'frame_{frame_idx:06d}.png')
            cv2.imwrite(output_img_path, frame)
            frame_idx += 1
        
        # 再保存倒放帧（从倒数第二帧开始，避免重复最后一帧）
        print("  保存倒放帧...")
        for i in range(len(frames_cropped) - 2, -1, -1):
            output_img_path = os.path.join(temp_dir, f'frame_{frame_idx:06d}.png')
            cv2.imwrite(output_img_path, frames_cropped[i])
            frame_idx += 1
        
        total_frames = frame_idx
        print(f"帧保存完成，总共 {total_frames} 帧（正向 {len(frames_cropped)} 帧 + 倒放 {len(frames_cropped) - 1} 帧），开始制作视频...")
        
        # 使用ffmpeg将图片序列制作成视频
        pattern = os.path.join(temp_dir, 'frame_%06d.png')
        
        cmd = [
            ffmpeg_path,
            '-y',  # 覆盖输出文件
            '-framerate', str(fps),
            '-i', pattern,
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-profile:v', 'baseline',
            '-level', '3.0',
            '-movflags', '+faststart',
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # 后处理：确保faststart正确应用
            print("优化视频元数据以确保自动播放...")
            temp_output = output_path + '.tmp'
            optimize_cmd = [
                ffmpeg_path,
                '-i', output_path,
                '-c', 'copy',
                '-movflags', '+faststart',
                '-y',
                temp_output
            ]
            optimize_result = subprocess.run(optimize_cmd, capture_output=True, text=True)
            
            if optimize_result.returncode == 0:
                os.replace(temp_output, output_path)
                print("视频元数据已优化")
            else:
                if os.path.exists(temp_output):
                    os.remove(temp_output)
                print("警告: 元数据优化失败，但视频已生成")
            
            print(f"\n✓ 成功! 视频已保存到: {output_path}")
            return True
        else:
            print(f"错误: ffmpeg制作视频失败")
            print(f"错误信息: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"处理出错: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # 清理临时文件
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            print(f"已清理临时文件")


if __name__ == "__main__":
    # GIF文件路径
    script_dir = Path(__file__).parent
    gif_path = script_dir / "tn" / "gifs" / "2.gif"
    output_path = script_dir / "tn" / "videos" / "snow_removal.mp4"
    
    print("=" * 60)
    print("GIF转视频工具 (Center Crop)")
    print("=" * 60)
    print(f"GIF文件: {gif_path}")
    print(f"输出文件: {output_path}")
    print("=" * 60)
    print()
    
    # 检查文件是否存在
    if not gif_path.exists():
        print(f"错误: GIF文件不存在: {gif_path}")
        sys.exit(1)
    
    # 执行转换
    success = gif_to_video_with_crop(str(gif_path), str(output_path), fps=None)
    
    if success:
        print("\n视频制作成功完成!")
    else:
        print("\n视频制作失败!")
        sys.exit(1)

