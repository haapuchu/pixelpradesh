import os
import math
from PIL import Image, ImageDraw

# Color definitions
BG_COLOR = "#FAFAF9"      # Warm stone / ivory
DARK_COLOR = "#1C1917"    # Deep obsidian / charcoal
AMBER_COLOR = "#D97706"   # Warm saffron / amber
BORDER_COLOR = "#E7E5E4"  # Subtle stone border for tab visibility

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def create_favicon_svg(simplified=True):
    """
    Generate clean, scalable SVG favicon.
    Includes warm stone container with subtle border for contrast on light and dark browser tabs.
    """
    svg = f'''<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Warm stone background tile for dark/light browser chrome legibility -->
  <rect width="128" height="128" rx="26" fill="{BG_COLOR}"/>
  <rect x="0.75" y="0.75" width="126.5" height="126.5" rx="25.25" stroke="{BORDER_COLOR}" stroke-width="1.5"/>

  <!-- Outer 9:16 Vertical Loop Tabs -->
  <!-- Top Tab -->
  <path d="M 50 44 L 50 26 C 50 22 54 18 59 18 L 69 18 C 74 18 78 22 78 26 L 78 44" stroke="{DARK_COLOR}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom Tab -->
  <path d="M 50 84 L 50 102 C 50 106 54 110 59 110 L 69 110 C 74 110 78 106 78 102 L 78 84" stroke="{DARK_COLOR}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Outer 16:9 Horizontal Loop Tabs -->
  <!-- Left Tab -->
  <path d="M 44 50 L 26 50 C 22 50 18 54 18 59 L 18 69 C 18 74 22 78 26 78 L 44 78" stroke="{DARK_COLOR}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right Tab -->
  <path d="M 84 50 L 102 50 C 106 50 110 54 110 59 L 110 69 C 110 74 106 78 102 78 L 84 78" stroke="{DARK_COLOR}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- 1:1 Central Frame Aperture Brackets -->
  <!-- Top-Left Corner -->
  <path d="M 40 56 L 40 40 L 56 40" stroke="{DARK_COLOR}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom-Left Corner -->
  <path d="M 40 72 L 40 88 L 56 88" stroke="{DARK_COLOR}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Bottom-Right Corner -->
  <path d="M 72 88 L 88 88 L 88 72" stroke="{DARK_COLOR}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Top-Right Accent Corner (Warm Saffron / Amber Focal Node) -->
  <path d="M 72 40 L 88 40 L 88 56" stroke="{AMBER_COLOR}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''
    return svg

def render_high_res_icon(size=1024):
    """
    Render ultra-high-resolution image using Pillow with anti-aliasing and supersampling.
    """
    # 2x supersampling for buttery smooth lines
    scale = size / 128.0
    super_size = int(size * 2)
    s = scale * 2

    img = Image.new("RGBA", (super_size, super_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded rect
    bg_rgb = hex_to_rgb(BG_COLOR)
    border_rgb = hex_to_rgb(BORDER_COLOR)
    dark_rgb = hex_to_rgb(DARK_COLOR)
    amber_rgb = hex_to_rgb(AMBER_COLOR)

    radius = 26 * s
    draw.rounded_rectangle([0, 0, super_size, super_size], radius=radius, fill=bg_rgb)
    draw.rounded_rectangle([1 * s, 1 * s, super_size - 1 * s, super_size - 1 * s], radius=radius - 1 * s, outline=border_rgb, width=int(1.5 * s))

    def draw_path(points, color, width):
        # Draw path using line segments
        for i in range(len(points) - 1):
            p1 = (points[i][0] * s, points[i][1] * s)
            p2 = (points[i+1][0] * s, points[i+1][1] * s)
            draw.line([p1, p2], fill=color, width=int(width * s))
        # Draw round caps at vertices
        r = int((width * s) / 2)
        for pt in points:
            px, py = pt[0] * s, pt[1] * s
            draw.ellipse([px - r, py - r, px + r, py + r], fill=color)

    # Top tab
    top_pts = [(50, 44), (50, 26), (51.5, 22), (54, 19), (59, 18), (69, 18), (74, 19), (76.5, 22), (78, 26), (78, 44)]
    draw_path(top_pts, dark_rgb, 8.5)

    # Bottom tab
    bottom_pts = [(50, 84), (50, 102), (51.5, 106), (54, 109), (59, 110), (69, 110), (74, 109), (76.5, 106), (78, 102), (78, 84)]
    draw_path(bottom_pts, dark_rgb, 8.5)

    # Left tab
    left_pts = [(44, 50), (26, 50), (22, 51.5), (19, 54), (18, 59), (18, 69), (19, 74), (22, 76.5), (26, 78), (44, 78)]
    draw_path(left_pts, dark_rgb, 8.5)

    # Right tab
    right_pts = [(84, 50), (102, 50), (106, 51.5), (109, 54), (110, 59), (110, 69), (109, 74), (106, 76.5), (102, 78), (84, 78)]
    draw_path(right_pts, dark_rgb, 8.5)

    # 1:1 Central frame aperture corners
    # Top-Left
    draw_path([(40, 56), (40, 40), (56, 40)], dark_rgb, 9.0)
    # Bottom-Left
    draw_path([(40, 72), (40, 88), (56, 88)], dark_rgb, 9.0)
    # Bottom-Right
    draw_path([(72, 88), (88, 88), (88, 72)], dark_rgb, 9.0)
    # Top-Right Saffron Accent
    draw_path([(72, 40), (88, 40), (88, 56)], amber_rgb, 10.0)

    # Downsample using high-quality Lanczos filter
    img_final = img.resize((size, size), Image.Resampling.LANCZOS)
    return img_final

def main():
    public_dir = os.path.abspath("public")
    app_dir = os.path.abspath("src/app")

    # 1. Generate SVG
    svg_content = create_favicon_svg()
    with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Created public/favicon.svg")

    # 2. Render master 512x512 image
    master_img = render_high_res_icon(512)

    # 3. Generate PNG sizes
    sizes = {
        "icon-16.png": 16,
        "icon-32.png": 32,
        "icon-48.png": 48,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
    }

    images_for_ico = []
    for filename, s in sizes.items():
        resized = master_img.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(os.path.join(public_dir, filename), "PNG", optimize=True)
        print(f"Created public/{filename} ({s}x{s})")
        if s in (16, 32, 48):
            images_for_ico.append(resized)

    # 4. Multi-resolution favicon.ico (16x16, 32x32, 48x48)
    ico_img_16 = master_img.resize((16, 16), Image.Resampling.LANCZOS)
    ico_img_32 = master_img.resize((32, 32), Image.Resampling.LANCZOS)
    ico_img_48 = master_img.resize((48, 48), Image.Resampling.LANCZOS)

    public_ico_path = os.path.join(public_dir, "favicon.ico")
    app_ico_path = os.path.join(app_dir, "favicon.ico")

    # Save to public/favicon.ico
    ico_img_48.save(
        public_ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[ico_img_16, ico_img_32]
    )
    print(f"Created {public_ico_path} with (16, 32, 48) sizes")

    # Overwrite the old Next.js development icon in src/app/favicon.ico
    ico_img_48.save(
        app_ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[ico_img_16, ico_img_32]
    )
    print(f"Updated {app_ico_path} with authoritative Adaptr mark")

if __name__ == "__main__":
    main()
