import cv2
import sys

def compress_video(input_path, output_path):
    print(f"Reading {input_path}...")
    cap = cv2.VideoCapture(input_path)
    
    # Get original properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Target 720p or keep original if smaller
    target_height = min(720, height)
    target_width = int(width * (target_height / height))
    
    # Define codec (H264 usually gives good compression in MP4)
    # Note: OpenCV's built-in writer might not give as small files as ffmpeg directly
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # or 'avc1'
    
    out = cv2.VideoWriter(output_path, fourcc, fps, (target_width, target_height))
    
    print(f"Compressing to {target_width}x{target_height} at {fps} FPS...")
    
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Resize frame
        if (target_width, target_height) != (width, height):
            frame = cv2.resize(frame, (target_width, target_height))
            
        # Write frame
        out.write(frame)
        
        count += 1
        if count % 100 == 0:
            print(f"Processed {count}/{total_frames} frames ({(count/total_frames)*100:.1f}%)")
            
    cap.release()
    out.release()
    print(f"Saved compressed video to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python compress_video.py <input> <output>")
        sys.exit(1)
    compress_video(sys.argv[1], sys.argv[2])
