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


def get_image_info(image_path):
    """获取图片信息"""
    img = cv2.imread(image_path)
    if img is None:
        return None
    height, width = img.shape[:2]
    return {'width': width, 'height': height}


def center_crop(img, crop_width, crop_height):
    """
    对图片进行中心裁剪
    
    参数:
        img: 输入的图片（numpy array）
        crop_width: 裁剪后的宽度
        crop_height: 裁剪后的高度
    
    返回:
        裁剪后的图片
    """
    h, w = img.shape[:2]
    
    # 计算裁剪的起始位置（中心裁剪）
    start_x = (w - crop_width) // 2
    start_y = (h - crop_height) // 2
    
    # 如果图片尺寸小于裁剪尺寸，先resize
    if w < crop_width or h < crop_height:
        # 计算缩放比例，确保能覆盖裁剪区域
        scale = max(crop_width / w, crop_height / h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h))
        h, w = img.shape[:2]
        start_x = (w - crop_width) // 2
        start_y = (h - crop_height) // 2
    
    # 执行裁剪
    cropped = img[start_y:start_y + crop_height, start_x:start_x + crop_width]
    return cropped


def center_crop_square_by_width(img):
    """
    以图片宽度为边长，在中心进行正方形裁剪
    
    参数:
        img: 输入的图片（numpy array）
    
    返回:
        裁剪后的正方形图片（边长等于原图宽度）
    """
    h, w = img.shape[:2]
    
    # 以宽度为边长，进行中心裁剪
    crop_size = w  # 正方形边长等于宽度
    
    # 如果高度小于宽度，先resize使高度至少等于宽度
    if h < crop_size:
        scale = crop_size / h
        new_w = int(w * scale)
        new_h = crop_size
        img = cv2.resize(img, (new_w, new_h))
        h, w = img.shape[:2]
    
    # 中心裁剪正方形
    start_x = (w - crop_size) // 2 - 445
    start_y = (h - crop_size) // 2
    
    cropped = img[start_y:start_y + crop_size, start_x:start_x + crop_size]
    return cropped


def combine_images_to_video(folder1_path, folder2_path, output_path, fps=30, ffmpeg_path=None, divider_line_width=2):
    """
    将两个文件夹中的图片左右拼接后制作成视频，中间有一条垂直黑线从左到右再从右到左循环移动
    
    参数:
        folder1_path: 第一个文件夹路径（左侧）
        folder2_path: 第二个文件夹路径（右侧）
        output_path: 输出视频路径
        fps: 视频帧率（默认30fps）
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
    
    # 检查文件夹是否存在
    if not os.path.exists(folder1_path):
        print(f"错误: 第一个文件夹不存在: {folder1_path}")
        return False
    
    if not os.path.exists(folder2_path):
        print(f"错误: 第二个文件夹不存在: {folder2_path}")
        return False
    
    # 支持的图片格式
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
    
    # 获取两个文件夹中的所有图片文件
    folder1_images = sorted([f for f in os.listdir(folder1_path) 
                            if os.path.splitext(f.lower())[1] in image_extensions])
    folder2_images = sorted([f for f in os.listdir(folder2_path) 
                            if os.path.splitext(f.lower())[1] in image_extensions])
    
    if len(folder1_images) == 0:
        print(f"错误: 第一个文件夹中没有找到图片文件")
        return False
    
    if len(folder2_images) == 0:
        print(f"错误: 第二个文件夹中没有找到图片文件")
        return False
    
    if len(folder1_images) != len(folder2_images):
        print(f"警告: 两个文件夹中的图片数量不一致")
        print(f"  文件夹1: {len(folder1_images)} 张图片")
        print(f"  文件夹2: {len(folder2_images)} 张图片")
        print(f"  将使用较少的数量: {min(len(folder1_images), len(folder2_images))}")
    
    # 使用较少的数量
    image_count = min(len(folder1_images), len(folder2_images))
    folder1_images = folder1_images[:image_count]
    folder2_images = folder2_images[:image_count]
    
    print(f"找到 {image_count} 对图片")
    
    # 先遍历所有图片，分析尺寸
    print("正在分析图片尺寸...")
    max_square_size = 0  # 找到所有正方形中的最大边长
    
    for img1_name, img2_name in zip(folder1_images[:image_count], folder2_images[:image_count]):
        img1_path = os.path.join(folder1_path, img1_name)
        img2_path = os.path.join(folder2_path, img2_name)
        
        img1 = cv2.imread(img1_path)
        img2 = cv2.imread(img2_path)
        
        if img1 is not None and img2 is not None:
            # 对folder1的图片进行正方形裁切（以宽度为边长）
            img1_cropped = center_crop_square_by_width(img1)
            h1, w1 = img1_cropped.shape[:2]
            # folder1裁切后应该是正方形，取宽度
            size1 = w1
            
            # folder2不裁切，假设已经是正方形，取宽度（或高度，应该一样）
            h2, w2 = img2.shape[:2]
            size2 = w2  # 假设是正方形
            
            max_square_size = max(max_square_size, size1, size2)
    
    if max_square_size == 0:
        print(f"错误: 无法读取图片文件")
        return False
    
    # 确定输出视频的尺寸（正方形）
    # H.264编码器要求尺寸必须是偶数
    output_size = int(max_square_size)
    if output_size % 2 != 0:
        output_size -= 1  # 如果是奇数，减1使其变成偶数
    
    output_width = output_size
    output_height = output_size
    
    print(f"分析完成:")
    print(f"  folder1: 正方形裁切（以宽度为边长）")
    print(f"  folder2: 不裁切（假设已经是正方形）")
    print(f"  最大正方形边长: {output_size}")
    print(f"输出视频尺寸: {output_size}x{output_size} (正方形)")
    print(f"分隔线宽度: {divider_line_width} 像素")
    print(f"帧率: {fps} fps")
    print(f"正放时：黑线从左到右；倒放时：黑线从右到左")
    
    # 创建临时目录存储拼接后的图片
    temp_dir = os.path.join(os.path.dirname(output_path), 'temp_merged_images')
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        print(f"\n开始处理图片...")
        
        # 处理每对图片
        for i, (img1_name, img2_name) in enumerate(zip(folder1_images, folder2_images)):
            img1_path = os.path.join(folder1_path, img1_name)
            img2_path = os.path.join(folder2_path, img2_name)
            
            # 读取图片
            img1 = cv2.imread(img1_path)
            img2 = cv2.imread(img2_path)
            
            if img1 is None or img2 is None:
                print(f"警告: 跳过无法读取的图片对: {img1_name} / {img2_name}")
                continue
            
            # 对folder1的图片进行正方形裁切（以宽度为边长）
            img1 = center_crop_square_by_width(img1)
            
            # folder2不裁切（假设已经是正方形）
            
            # 将所有图片调整到统一的正方形尺寸
            img1 = cv2.resize(img1, (output_size, output_size))
            img2 = cv2.resize(img2, (output_size, output_size))
            
            # 计算当前帧黑线的位置（黑线左边缘的位置）
            # 正放时：黑线从左到右（0 -> 1）
            # 倒放时：由于是倒序播放，黑线会从右到左（1 -> 0）
            progress = i / (image_count - 1) if image_count > 1 else 0  # 0 到 1
            position_ratio = progress  # 从左到右：0 -> 1
            # 黑线位置：从0移动到max
            # 当黑线在0时，只显示img2；当黑线在max时，只显示img1
            max_line_position = output_width - divider_line_width
            line_position = int(position_ratio * max_line_position)
            
            # 创建画布（宽度 = 单张图片宽度）
            merged = np.zeros((output_height, output_width, 3), dtype=np.uint8)
            
            # 根据黑线位置放置图片
            # 黑线左边：显示img1的左边部分（从img1的左边开始）
            # 黑线右边：显示img2的右边部分（从img2的右边开始）
            
            # 黑线左边：显示img1的左边部分
            if line_position > 0:
                merged[:, :line_position] = img1[:, :line_position]
            
            # 放置黑线（遮罩）
            merged[:, line_position:line_position + divider_line_width] = 0
            
            # 黑线右边：显示img2的右边部分
            right_start = line_position + divider_line_width
            right_width = output_width - right_start
            if right_width > 0:
                # 从img2的右边开始取，取right_width宽度
                img2_start_x = output_width - right_width
                merged[:, right_start:output_width] = img2[:, img2_start_x:output_width]
            
            # 保存拼接后的图片
            output_img_path = os.path.join(temp_dir, f'frame_{i:06d}.png')
            cv2.imwrite(output_img_path, merged)
            
            if (i + 1) % 10 == 0:
                print(f"  已处理: {i + 1}/{image_count} 张图片 (黑线位置: {line_position}/{max_line_position})")
        
        print(f"正向帧处理完成，开始生成倒放帧...")
        
        # 生成倒放帧（从倒数第二帧开始，避免重复最后一帧）
        # 这样视频播放完后倒放，形成无缝循环
        for reverse_idx in range(image_count - 2, -1, -1):
            # 读取正向帧
            forward_frame_path = os.path.join(temp_dir, f'frame_{reverse_idx:06d}.png')
            if os.path.exists(forward_frame_path):
                # 复制为新的倒放帧
                reverse_frame_idx = image_count + (image_count - 1 - reverse_idx) - 1
                reverse_frame_path = os.path.join(temp_dir, f'frame_{reverse_frame_idx:06d}.png')
                
                # 读取并保存
                forward_frame = cv2.imread(forward_frame_path)
                if forward_frame is not None:
                    cv2.imwrite(reverse_frame_path, forward_frame)
        
        total_frames = image_count * 2 - 1  # 正向帧数 + 倒放帧数（减去重复的最后一帧）
        print(f"倒放帧生成完成，总共 {total_frames} 帧")
        print(f"图片拼接完成，开始制作视频...")
        
        # 使用ffmpeg将图片序列制作成视频
        # 使用pattern匹配所有帧
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
            import shutil
            shutil.rmtree(temp_dir)
            print(f"已清理临时文件")


if __name__ == "__main__":
    # 文件夹路径
    base_dir = r"C:\Users\helmu\Downloads"
    
    # 请修改这两个文件夹路径
    folder1 = os.path.join(base_dir, "LQ")  # 左侧的图片文件夹
    folder2 = os.path.join(base_dir, "ConVRT_Ours")  # 右侧的图片文件夹
    output = os.path.join(base_dir, "merged_ConVRT_video.mp4")
    
    print("=" * 60)
    print("图片合并视频工具 (左右拼接 + 移动黑线)")
    print("=" * 60)
    print(f"文件夹1 (左侧): {folder1}")
    print(f"文件夹2 (右侧): {folder2}")
    print(f"输出文件: {output}")
    print("=" * 60)
    print()
    
    # 检查文件夹是否存在
    if not os.path.exists(folder1):
        print(f"错误: 文件夹1不存在: {folder1}")
        print("请修改脚本中的 folder1 路径")
        sys.exit(1)
    
    if not os.path.exists(folder2):
        print(f"错误: 文件夹2不存在: {folder2}")
        print("请修改脚本中的 folder2 路径")
        sys.exit(1)
    
    # 执行合并（可以调整divider_line_width参数来改变黑线宽度）
    success = combine_images_to_video(folder1, folder2, output, fps=24, divider_line_width=2)
    
    if success:
        print("\n视频制作成功完成!")
    else:
        print("\n视频制作失败!")
        sys.exit(1)

