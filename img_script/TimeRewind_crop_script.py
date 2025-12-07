import cv2
import os
import subprocess
import sys

def check_ffmpeg_available():
    """检查ffmpeg是否可用"""
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, 
                              text=True,
                              timeout=5)
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def crop_video_with_ffmpeg(input_path, output_path, x, y, width, height, fps=None):
    """
    使用ffmpeg裁切视频（推荐方法，兼容性更好）
    """
    try:
        # 使用临时文件，然后应用faststart以确保元数据正确
        temp_output = output_path + '.tmp'
        
        # 第一步：编码视频（不使用faststart，因为需要两遍处理）
        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-filter:v', f'crop={width}:{height}:{x}:{y}',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',  # 确保兼容性
            '-profile:v', 'baseline',  # 使用baseline profile确保最大兼容性
            '-level', '3.0',  # H.264 level
            '-an',  # 移除音频轨道（网页视频通常不需要音频，且有助于自动播放）
            '-y',  # 覆盖输出文件
            temp_output
        ]
        
        # 如果指定了fps，添加帧率参数
        if fps:
            # 在filter之后添加帧率参数
            cmd.insert(-2, '-r')
            cmd.insert(-2, str(fps))
        
        print("使用ffmpeg进行视频裁切...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"ffmpeg编码错误: {result.stderr}")
            if os.path.exists(temp_output):
                os.remove(temp_output)
            return False
        
        # 第二步：应用faststart，将moov atom移到文件开头
        print("优化视频元数据以确保自动播放...")
        optimize_cmd = [
            'ffmpeg',
            '-i', temp_output,
            '-c', 'copy',  # 只复制流，不重新编码（快速）
            '-movflags', '+faststart',
            '-y',
            output_path
        ]
        optimize_result = subprocess.run(optimize_cmd, capture_output=True, text=True)
        
        # 清理临时文件
        if os.path.exists(temp_output):
            os.remove(temp_output)
        
        if optimize_result.returncode == 0:
            print(f"\n完成! 已保存到: {output_path}")
            print("视频已优化，支持浏览器自动播放")
            return True
        else:
            print(f"警告: faststart优化失败: {optimize_result.stderr}")
            print("但视频已生成，可能仍可正常播放")
            # 如果优化失败，尝试将临时文件重命名
            if os.path.exists(temp_output):
                os.replace(temp_output, output_path)
            return True
    except FileNotFoundError:
        print("错误: 未找到ffmpeg，请确保已安装ffmpeg并添加到PATH")
        return False
    except Exception as e:
        print(f"ffmpeg处理出错: {str(e)}")
        return False


def crop_video(input_path, output_path, x, y, width, height):
    """
    裁切视频的指定区域
    
    参数:
        input_path: 输入视频路径
        output_path: 输出视频路径
        x: 裁切区域左上角x坐标
        y: 裁切区域左上角y坐标
        width: 裁切区域宽度
        height: 裁切区域高度
    """
    # 打开输入视频
    cap = cv2.VideoCapture(input_path)
    
    if not cap.isOpened():
        print(f"错误: 无法打开视频文件 {input_path}")
        return False
    
    # 获取视频属性
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    original_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    original_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"原始视频信息:")
    print(f"  分辨率: {original_width}x{original_height}")
    print(f"  帧率: {fps} fps")
    print(f"  总帧数: {total_frames}")
    print(f"裁切区域: x={x}, y={y}, width={width}, height={height}")
    
    # 验证裁切区域是否有效
    if x + width > original_width or y + height > original_height:
        print(f"错误: 裁切区域超出视频范围!")
        print(f"  视频范围: 0-{original_width} x 0-{original_height}")
        print(f"  裁切区域: {x}-{x+width} x {y}-{y+height}")
        cap.release()
        return False
    
    # 定义视频编码器和输出 - 使用H.264编码器以获得更好的兼容性
    # 尝试多种编码器，按兼容性排序
    codecs_to_try = [
        ('avc1', 'H.264 (avc1)'),  # 最兼容的H.264格式
        ('h264', 'H.264 (h264)'),  # 另一种H.264格式
        ('XVID', 'XVID'),          # 备选编码器
    ]
    
    out = None
    used_codec = None
    
    for codec, codec_name in codecs_to_try:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        if out.isOpened():
            used_codec = codec_name
            print(f"使用编码器: {codec_name}")
            break
        else:
            if out:
                out.release()
            out = None
    
    if out is None or not out.isOpened():
        print(f"警告: OpenCV无法创建输出视频文件")
        print("尝试使用ffmpeg作为备选方案...")
        cap.release()
        return crop_video_with_ffmpeg(input_path, output_path, x, y, width, height, fps)
    
    frame_count = 0
    print("\n开始处理视频...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # 裁切帧
        cropped_frame = frame[y:y+height, x:x+width]
        
        # 写入输出视频
        out.write(cropped_frame)
        
        frame_count += 1
        if frame_count % 30 == 0:
            progress = (frame_count / total_frames) * 100
            print(f"处理进度: {progress:.1f}% ({frame_count}/{total_frames} 帧)")
    
    # 释放资源
    cap.release()
    out.release()
    
    print(f"\n完成! 已保存到: {output_path}")
    print(f"处理了 {frame_count} 帧")
    return True


if __name__ == "__main__":
    # 输入和输出路径 - 使用os.path.join确保Windows路径正确
    base_dir = r"D:\Personal\Github_Homepage\HaomingCai.github.io"
    input_video = os.path.join(base_dir, "tn", "videos", "HTML_Teaser_2.mp4")
    output_video = os.path.join(base_dir, "tn", "videos", "HTML_Teaser_2_cropped_ours.mp4")
    
    # 检查输入文件是否存在
    if not os.path.exists(input_video):
        print(f"错误: 输入文件不存在: {input_video}")
        exit(1)
    
    # 裁切参数 - 请根据你的需求修改这些值
    # 格式: (x, y, width, height)
    # x, y: 裁切区域左上角坐标
    # width, height: 裁切区域的宽度和高度
    
    # 示例: 裁切中心区域 (假设视频是1920x1080，裁切中间960x540的区域)
    # x = 480  # 左边距
    # y = 270  # 上边距
    # width = 960   # 裁切宽度
    # height = 540  # 裁切高度
    
    # 如果你需要先查看视频尺寸，可以先运行一次获取视频信息
    # 或者使用以下代码预览第一帧来确定裁切区域
    print("提示: 如果需要确定裁切区域，可以先运行以下代码查看视频第一帧:")
    print("  cap = cv2.VideoCapture(input_video)")
    print("  ret, frame = cap.read()")
    print("  print(f'视频尺寸: {frame.shape[1]}x{frame.shape[0]}')")
    print("  cv2.imshow('First Frame', frame)")
    print("  cv2.waitKey(0)")
    print()
    
    # 请在这里设置你的裁切参数
    # 示例值 - 请根据实际需求修改
    x = 1535
    y = 545
    width = 480  # 请根据实际需求修改
    height = 480  # 请根据实际需求修改
    
    print("=" * 50)
    print("视频裁切工具")
    print("=" * 50)
    print(f"输入文件: {input_video}")
    print(f"输出文件: {output_video}")
    print()
    print("请确保已设置正确的裁切参数 (x, y, width, height)")
    print("=" * 50)
    print()
    
    # 优先使用ffmpeg（如果可用），因为兼容性更好
    use_ffmpeg = check_ffmpeg_available()
    
    if use_ffmpeg:
        print("检测到ffmpeg，使用ffmpeg进行裁切（推荐，兼容性更好）...")
        # 获取视频fps信息
        cap = cv2.VideoCapture(input_video)
        if cap.isOpened():
            fps = cap.get(cv2.CAP_PROP_FPS)
            cap.release()
        else:
            fps = None
        success = crop_video_with_ffmpeg(input_video, output_video, x, y, width, height, fps)
    else:
        print("未检测到ffmpeg，使用OpenCV进行裁切...")
        print("提示: 如果生成的视频无法播放，请安装ffmpeg以获得更好的兼容性")
        print()
        # 执行裁切
        success = crop_video(input_video, output_video, x, y, width, height)
    
    if success:
        print("\n视频裁切成功完成!")
    else:
        print("\n视频裁切失败!")

