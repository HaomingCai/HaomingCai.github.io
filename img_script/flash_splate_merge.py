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


def combine_gifs_to_video(gif1_path, gif2_path, output_path, fps=None, ffmpeg_path=None, divider_line_width=2):
    """
    将两个GIF文件合并成视频，中间有一条垂直黑线从左到右再从右到左循环移动
    
    参数:
        gif1_path: 第一个GIF文件路径（左侧）
        gif2_path: 第二个GIF文件路径（右侧）
        output_path: 输出视频路径
        fps: 视频帧率（如果为None则使用GIF的帧率）
        ffmpeg_path: ffmpeg可执行文件路径（如果为None则自动查找）
        divider_line_width: 分隔黑线的宽度（像素，默认2）
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
    if not os.path.exists(gif1_path):
        print(f"错误: 第一个GIF文件不存在: {gif1_path}")
        return False
    
    if not os.path.exists(gif2_path):
        print(f"错误: 第二个GIF文件不存在: {gif2_path}")
        return False
    
    # 提取GIF帧
    print("正在提取GIF帧...")
    frames1, fps1 = extract_gif_frames(gif1_path)
    frames2, fps2 = extract_gif_frames(gif2_path)
    
    if frames1 is None or frames2 is None:
        return False
    
    # 对两个GIF的所有帧进行center crop（以高度为边长）
    print("正在对GIF帧进行center crop...")
    frames1_cropped = [center_crop_square_by_height(frame) for frame in frames1]
    frames2_cropped = [center_crop_square_by_height(frame) for frame in frames2]
    
    # 确定帧数和帧率
    frame_count = min(len(frames1_cropped), len(frames2_cropped))
    if frame_count == 0:
        print("错误: 没有可用的帧")
        return False
    
    # 使用第一个GIF的帧率，或者用户指定的帧率
    if fps is None:
        fps = fps1 if fps1 > 0 else 10
    else:
        fps = fps
    
    print(f"使用 {frame_count} 帧，帧率: {fps} fps")
    
    # 获取第一帧的尺寸来确定输出尺寸（使用裁剪后的帧）
    h1, w1 = frames1_cropped[0].shape[:2]
    h2, w2 = frames2_cropped[0].shape[:2]
    
    # 使用较大的宽度和较小的高度（确保两个GIF都能完整显示）
    output_width = max(w1, w2)
    output_height = min(h1, h2)
    
    # H.264编码器要求尺寸必须是偶数
    if output_width % 2 != 0:
        output_width -= 1
    if output_height % 2 != 0:
        output_height -= 1
    
    print(f"GIF1尺寸: {w1}x{h1}")
    print(f"GIF2尺寸: {w2}x{h2}")
    print(f"输出视频尺寸: {output_width}x{output_height}")
    print(f"分隔线宽度: {divider_line_width} 像素")
    print(f"黑线将从左到右再从右到左完成一个完整来回")
    
    # 创建临时目录存储拼接后的图片
    temp_dir = os.path.join(os.path.dirname(output_path), 'temp_merged_gif_frames')
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        print(f"\n开始处理帧...")
        
        # 处理每一帧
        for i in range(frame_count):
            img1 = frames1_cropped[i]
            img2 = frames2_cropped[i]
            
            # 调整尺寸到统一大小
            img1_resized = cv2.resize(img1, (output_width, output_height))
            img2_resized = cv2.resize(img2, (output_width, output_height))
            
            # 计算当前帧黑线的位置（黑线左边缘的位置）
            # 使用正弦波实现从左到右再从右到左的移动：0 -> 1 -> 0
            progress = i / (frame_count - 1) if frame_count > 1 else 0  # 0 到 1
            # 使用 sin(progress * 2π) 的绝对值，实现 0 -> 1 -> 0 的移动
            # 或者使用更简单的方法：abs(sin(progress * π)) 实现 0 -> 1 -> 0
            position_ratio = abs(np.sin(progress * np.pi))  # 0 -> 1 -> 0
            
            # 黑线位置：从0移动到max再回到0
            max_line_position = output_width - divider_line_width
            line_position = int(position_ratio * max_line_position)
            
            # 创建画布
            merged = np.zeros((output_height, output_width, 3), dtype=np.uint8)
            
            # 根据黑线位置放置图片
            # 黑线左边：显示img1的左边部分
            if line_position > 0:
                merged[:, :line_position] = img1_resized[:, :line_position]
            
            # 放置黑线（遮罩）
            merged[:, line_position:line_position + divider_line_width] = 0
            
            # 黑线右边：显示img2的右边部分
            right_start = line_position + divider_line_width
            right_width = output_width - right_start
            if right_width > 0:
                img2_start_x = output_width - right_width
                merged[:, right_start:output_width] = img2_resized[:, img2_start_x:output_width]
            
            # 保存拼接后的图片
            output_img_path = os.path.join(temp_dir, f'frame_{i:06d}.png')
            cv2.imwrite(output_img_path, merged)
            
            if (i + 1) % 10 == 0:
                print(f"  已处理: {i + 1}/{frame_count} 帧 (黑线位置: {line_position}/{max_line_position})")
        
        print(f"帧处理完成，开始制作视频...")
        
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
    # gif2_path = script_dir / "tn" / "gifs" / "Crap2_composite.gif"
    # gif1_path = script_dir / "tn" / "gifs" / "Crap2_trans_ours.gif"
    # output_path = script_dir / "tn" / "videos" / "merged_flashsplat.mp4"
    gif2_path = script_dir / "tn" / "gifs" / "Office_composite.gif"
    gif1_path = script_dir / "tn" / "gifs" / "Office_trans_ours.gif"
    output_path = script_dir / "tn" / "videos" / "merged_Office_flashsplat.mp4"
    
    print("=" * 60)
    print("GIF合并视频工具 (左右拼接 + 移动黑线)")
    print("=" * 60)
    print(f"GIF1 (左侧): {gif1_path}")
    print(f"GIF2 (右侧): {gif2_path}")
    print(f"输出文件: {output_path}")
    print("=" * 60)
    print()
    
    # 检查文件是否存在
    if not gif1_path.exists():
        print(f"错误: GIF1不存在: {gif1_path}")
        sys.exit(1)
    
    if not gif2_path.exists():
        print(f"错误: GIF2不存在: {gif2_path}")
        sys.exit(1)
    
    # 执行合并（可以调整divider_line_width参数来改变黑线宽度）
    success = combine_gifs_to_video(str(gif1_path), str(gif2_path), str(output_path), fps=None, divider_line_width=2)
    
    if success:
        print("\n视频制作成功完成!")
    else:
        print("\n视频制作失败!")
        sys.exit(1)

