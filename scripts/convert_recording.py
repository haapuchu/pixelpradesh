import os
import glob
import subprocess
import shutil

RECORDINGS_DIR = r"C:\Users\singh\hackindia\public\recordings"
ARTIFACTS_DIR = r"C:\Users\singh\.gemini\antigravity-ide\brain\533819cd-3740-4b71-93e0-55274b0c7cba"

def convert():
    webms = glob.glob(os.path.join(RECORDINGS_DIR, "*.webm"))
    if not webms:
        print("[!] No .webm files found in", RECORDINGS_DIR)
        return False
    
    # Sort by modification time, newest first
    latest_webm = max(webms, key=os.path.getmtime)
    print(f"[*] Found latest recording: {latest_webm} ({os.path.getsize(latest_webm) / 1024 / 1024:.2f} MB)")

    mp4_out = os.path.join(RECORDINGS_DIR, "pixelpradesh_product_demo.mp4")
    artifact_mp4 = os.path.join(ARTIFACTS_DIR, "pixelpradesh_product_demo.mp4")
    artifact_webm = os.path.join(ARTIFACTS_DIR, "pixelpradesh_product_demo.webm")

    # Probe duration
    probe_cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", latest_webm
    ]
    try:
        dur_res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
        dur = float(dur_res.stdout.strip())
        print(f"[OK] Raw video duration: {dur:.2f} seconds ({dur/60:.2f} minutes)")
    except Exception as e:
        print(f"[!] Could not probe duration: {e}")
        dur = 0.0

    print("[*] Encoding to high-quality Full HD MP4 (H.264 / yuv420p)...")
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", latest_webm,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        mp4_out
    ]
    
    res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(mp4_out):
        mp4_size = os.path.getsize(mp4_out) / 1024 / 1024
        print(f"[OK] Successfully encoded MP4: {mp4_out} ({mp4_size:.2f} MB)")
        
        # Copy to artifacts directory
        shutil.copy2(mp4_out, artifact_mp4)
        shutil.copy2(latest_webm, artifact_webm)
        print(f"[OK] Copied MP4 to artifacts: {artifact_mp4}")
        print(f"[OK] Copied WebM to artifacts: {artifact_webm}")
        return True
    else:
        print(f"[!] FFmpeg failed: {res.stderr}")
        return False

if __name__ == "__main__":
    convert()
