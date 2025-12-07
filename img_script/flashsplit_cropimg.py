import cv2
import os
from pathlib import Path

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

def process_images():
    # 脚本所在目录
    script_dir = Path(__file__).parent
    images_dir = script_dir / "_site" / "tn" / "images"
    
    # 图片路径
    img1_path = images_dir / "FlashSplit1.png"
    img2_path = images_dir / "FlashSplit2.png"
    
    # 输出路径
    output1_path = images_dir / "FlashSplit1_cropped.png"
    output2_path = images_dir / "FlashSplit2_cropped.png"
    
    # 检查文件是否存在
    if not img1_path.exists():
        print(f"错误: 找不到文件 {img1_path}")
        return
    
    if not img2_path.exists():
        print(f"错误: 找不到文件 {img2_path}")
        return
    
    # 读取图片
    print(f"正在处理 {img1_path.name}...")
    img1 = cv2.imread(str(img1_path))
    if img1 is None:
        print(f"错误: 无法读取图片 {img1_path}")
        return
    
    print(f"正在处理 {img2_path.name}...")
    img2 = cv2.imread(str(img2_path))
    if img2 is None:
        print(f"错误: 无法读取图片 {img2_path}")
        return
    
    # 获取原始尺寸
    h1, w1 = img1.shape[:2]
    h2, w2 = img2.shape[:2]
    print(f"图片1原始尺寸: {w1}x{h1}")
    print(f"图片2原始尺寸: {w2}x{h2}")
    
    # 进行正方形裁切（以高度为边长）
    img1_cropped = center_crop_square_by_height(img1)
    img2_cropped = center_crop_square_by_height(img2)
    
    # 获取裁切后尺寸
    h1_crop, w1_crop = img1_cropped.shape[:2]
    h2_crop, w2_crop = img2_cropped.shape[:2]
    print(f"图片1裁切后尺寸: {w1_crop}x{h1_crop}")
    print(f"图片2裁切后尺寸: {w2_crop}x{h2_crop}")
    
    # 保存裁切后的图片
    cv2.imwrite(str(output1_path), img1_cropped)
    cv2.imwrite(str(output2_path), img2_cropped)
    
    print(f"\n✓ 完成!")
    print(f"输出文件1: {output1_path}")
    print(f"输出文件2: {output2_path}")

if __name__ == "__main__":
    process_images()
