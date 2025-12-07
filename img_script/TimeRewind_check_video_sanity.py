# 在 combined.py 文件末尾添加以下代码，或者创建一个新文件 check_video.py

import subprocess
import os
from pathlib import Path

def check_video_info(video_path):
    """
    使用ffprobe检查视频文件的详细信息
    """
    if not os.path.exists(video_path):
        print(f"错误: 视频文件不存在: {video_path}")
        return
    
    print("=" * 60)
    print(f"检查视频: {video_path}")
    print("=" * 60)
    
    # 使用ffprobe获取详细信息
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries",
        "format=duration,size,bit_rate,format_name,format_long_name",
        "-show_entries",
        "stream=codec_name,codec_type,width,height,r_frame_rate,duration,nb_frames",
        "-of", "json",
        video_path
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            import json
            data = json.loads(result.stdout)
            
            print("\n【格式信息】")
            if 'format' in data:
                fmt = data['format']
                print(f"  格式: {fmt.get('format_long_name', 'N/A')}")
                print(f"  文件大小: {int(fmt.get('size', 0)) / (1024*1024):.2f} MB")
                print(f"  总时长: {float(fmt.get('duration', 0)):.2f} 秒 ({float(fmt.get('duration', 0))/60:.2f} 分钟)")
                print(f"  比特率: {int(fmt.get('bit_rate', 0)) / 1000:.0f} kbps")
            
            print("\n【视频流信息】")
            if 'streams' in data:
                for stream in data['streams']:
                    if stream.get('codec_type') == 'video':
                        print(f"  编码器: {stream.get('codec_name', 'N/A')}")
                        print(f"  分辨率: {stream.get('width', 'N/A')}x{stream.get('height', 'N/A')}")
                        print(f"  帧率: {stream.get('r_frame_rate', 'N/A')}")
                        print(f"  总帧数: {stream.get('nb_frames', 'N/A')}")
                        print(f"  流时长: {float(stream.get('duration', 0)):.2f} 秒")
        else:
            print(f"ffprobe错误: {result.stderr}")
    except Exception as e:
        print(f"检查出错: {e}")
    
    # 检查是否有faststart标志
    print("\n【元数据检查】")
    cmd2 = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=tags",
        "-of", "json",
        video_path
    ]
    
    try:
        result2 = subprocess.run(cmd2, capture_output=True, text=True, timeout=10)
        if result2.returncode == 0:
            import json
            data2 = json.loads(result2.stdout)
            if 'format' in data2 and 'tags' in data2['format']:
                tags = data2['format']['tags']
                print(f"  标签: {tags}")
    except:
        pass
    
    # 使用OpenCV检查基本属性
    print("\n【OpenCV检查】")
    try:
        import cv2
        cap = cv2.VideoCapture(video_path)
        if cap.isOpened():
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps if fps > 0 else 0
            
            print(f"  分辨率: {width}x{height}")
            print(f"  帧率: {fps:.2f} fps")
            print(f"  总帧数: {frame_count}")
            print(f"  计算时长: {duration:.2f} 秒 ({duration/60:.2f} 分钟)")
            
            # 尝试读取几帧，检查是否有问题
            print("\n【帧读取测试】")
            test_frames = [0, frame_count//4, frame_count//2, frame_count*3//4, frame_count-1]
            for frame_idx in test_frames:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if ret:
                    print(f"  帧 {frame_idx}: ✓ 可读")
                else:
                    print(f"  帧 {frame_idx}: ✗ 无法读取")
            
            cap.release()
        else:
            print("  ✗ 无法打开视频文件")
    except Exception as e:
        print(f"  OpenCV检查出错: {e}")
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    # 检查输出视频
    script_dir = Path(__file__).parent
    output_video = script_dir / "merged_output.mp4"
    
    if output_video.exists():
        check_video_info(str(output_video))
    else:
        print(f"视频文件不存在: {output_video}")