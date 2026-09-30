import os
import sys
import time
import math
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"C:\Users\singh\hackindia\public\recordings"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def smooth_scroll(page, target_y, duration_ms=1200, steps=30):
    start_y = page.evaluate("window.scrollY")
    diff = target_y - start_y
    for i in range(1, steps + 1):
        t = i / steps
        # easeInOutQuad
        ease = 2 * t * t if t < 0.5 else -1 + (4 - 2 * t) * t
        current_y = start_y + diff * ease
        page.evaluate(f"window.scrollTo(0, {current_y})")
        page.wait_for_timeout(duration_ms // steps)

def smooth_mouse_move(page, start_x, start_y, target_x, target_y, duration_ms=600, steps=20):
    for i in range(1, steps + 1):
        t = i / steps
        ease = 2 * t * t if t < 0.5 else -1 + (4 - 2 * t) * t
        cur_x = start_x + (target_x - start_x) * ease
        cur_y = start_y + (target_y - start_y) * ease
        page.mouse.move(cur_x, cur_y)
        page.wait_for_timeout(duration_ms // steps)

def inject_visual_cursor(page):
    js_code = """
    (() => {
        if (document.getElementById('demo-cursor')) return;
        const cursor = document.createElement('div');
        cursor.id = 'demo-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        cursor.style.border = '2px solid rgba(255, 255, 255, 0.95)';
        cursor.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '999999';
        cursor.style.transition = 'transform 0.12s ease-out, background-color 0.15s ease';
        cursor.style.transform = 'translate(-50%, -50%)';
        cursor.style.top = '100px';
        cursor.style.left = '100px';
        document.body.appendChild(cursor);

        const clickRing = document.createElement('div');
        clickRing.id = 'demo-click-ring';
        clickRing.style.position = 'fixed';
        clickRing.style.width = '38px';
        clickRing.style.height = '38px';
        clickRing.style.borderRadius = '50%';
        clickRing.style.border = '2px solid rgba(245, 158, 11, 0.85)';
        clickRing.style.pointerEvents = 'none';
        clickRing.style.zIndex = '999998';
        clickRing.style.transform = 'translate(-50%, -50%) scale(0)';
        clickRing.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.3s ease';
        clickRing.style.opacity = '0';
        document.body.appendChild(clickRing);

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            clickRing.style.left = e.clientX + 'px';
            clickRing.style.top = e.clientY + 'px';
        }, { passive: true });

        window.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.85)';
            cursor.style.backgroundColor = 'rgba(245, 158, 11, 0.85)';
            clickRing.style.opacity = '1';
            clickRing.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        window.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
            setTimeout(() => {
                clickRing.style.opacity = '0';
                clickRing.style.transform = 'translate(-50%, -50%) scale(1.4)';
            }, 80);
        });
    })();
    """
    page.evaluate(js_code)

def main():
    print("[*] Launching Playwright Chromium...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--font-render-hinting=none"
            ]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
            record_video_dir=OUTPUT_DIR,
            record_video_size={"width": 1920, "height": 1080}
        )

        page = context.new_page()
        start_time = time.time()
        print(f"[*] Navigating to http://localhost:3000/ at {time.strftime('%H:%M:%S')}")
        page.goto("http://localhost:3000/", wait_until="networkidle")
        page.wait_for_timeout(2000)
        inject_visual_cursor(page)

        # -------------------------------------------------------------
        # BEAT 1: HERO & ARCHITECTURAL OVERVIEW (0:00 - 0:22) ~22s
        # -------------------------------------------------------------
        print("[*] Beat 1: Hero & Value Proposition")
        page.mouse.move(960, 300)
        page.wait_for_timeout(3000)

        # Move to Header & Cloudinary badge
        page.mouse.move(1720, 35)
        page.wait_for_timeout(2500)

        # Hover over Hero headline & sub-headline
        page.mouse.move(500, 260)
        page.wait_for_timeout(3000)

        # Hover over live multiplier counters (01 -> 04 -> 03 -> 12)
        page.mouse.move(340, 520)
        page.wait_for_timeout(2000)
        page.mouse.move(440, 520)
        page.wait_for_timeout(2000)
        page.mouse.move(540, 520)
        page.wait_for_timeout(2000)

        # Hover over Contact Sheet Live Card on the right
        page.mouse.move(1480, 340)
        page.wait_for_timeout(3000)
        page.mouse.move(1480, 480)
        page.wait_for_timeout(3500)

        # -------------------------------------------------------------
        # BEAT 2: HOW IT WORKS SECTION (0:22 - 0:40) ~18s
        # -------------------------------------------------------------
        print("[*] Beat 2: How It Works & Autonomous Architecture")
        smooth_scroll(page, 720, duration_ms=1800)
        page.wait_for_timeout(2000)

        # Hover across Step 1 -> Step 2 -> Step 3
        page.mouse.move(450, 420)
        page.wait_for_timeout(3500)
        page.mouse.move(960, 420)
        page.wait_for_timeout(3500)
        page.mouse.move(1470, 420)
        page.wait_for_timeout(4500)

        # -------------------------------------------------------------
        # BEAT 3: MASTER ASSET INTAKE DOCK (0:40 - 1:12) ~32s
        # -------------------------------------------------------------
        print("[*] Beat 3: Master Asset Intake Dock & Preset Showcase")
        smooth_scroll(page, 1260, duration_ms=1800)
        page.wait_for_timeout(2500)

        # Click "Change product" to reveal presets
        print("[*] Expanding product presets...")
        change_btn = page.locator("button:has-text('Change product')")
        if change_btn.count() > 0:
            change_btn.click()
            page.wait_for_timeout(2000)

        # Click preset 2: Assam Orthodox Tea
        print("[*] Selecting Assam Orthodox Tea...")
        tea_btn = page.locator("button:has-text('Assam Orthodox')")
        if tea_btn.count() > 0:
            tea_btn.click()
            page.wait_for_timeout(4000)

        # Click preset 3: Kolkata Durga Puja
        print("[*] Selecting Kolkata Durga Puja Brass...")
        brass_btn = page.locator("button:has-text('Kolkata Durga')")
        if brass_btn.count() > 0:
            brass_btn.click()
            page.wait_for_timeout(4000)

        # Click preset 1: Varanasi Raw Silk Kurta
        print("[*] Selecting Varanasi Raw Silk Kurta...")
        kurta_btn = page.locator("button:has-text('Varanasi Raw')")
        if kurta_btn.count() > 0:
            kurta_btn.click()
            page.wait_for_timeout(4000)

        # Type additional regional direction in the brief textarea
        print("[*] Typing custom creative direction...")
        brief_textarea = page.locator("textarea[placeholder*='Provide festive context']")
        if brief_textarea.count() > 0:
            brief_textarea.click()
            page.wait_for_timeout(1000)
            page.keyboard.type(", dramatic warm golden ambient lighting, authentic regional cultural motifs", delay=40)
            page.wait_for_timeout(3500)

        # -------------------------------------------------------------
        # BEAT 4: AUTONOMOUS GENERATION & SMOOTH GLIDE (1:12 - 1:35) ~23s
        # -------------------------------------------------------------
        print("[*] Beat 4: Generating Campaign Matrix...")
        gen_btn = page.locator("button:has-text('Generate campaign')")
        if gen_btn.count() > 0:
            gen_btn.click()
            print("[*] Generate button clicked, waiting for smooth glide and loading cockpit...")
            page.wait_for_timeout(2500)

        # Inspect the 3-step editorial loading cockpit:
        # Step 1: Geometry Analysis
        page.mouse.move(720, 520)
        page.wait_for_timeout(3500)
        # Step 2: Scene Localization
        page.mouse.move(960, 520)
        page.wait_for_timeout(3500)
        # Step 3: Format Outpaint
        page.mouse.move(1200, 520)
        page.wait_for_timeout(4500)

        # Extra pause for final generation completion & render
        page.wait_for_timeout(4500)

        # -------------------------------------------------------------
        # BEAT 5: CAMPAIGN MATRIX & PERSPECTIVE SWITCHER (1:35 - 1:58) ~23s
        # -------------------------------------------------------------
        print("[*] Beat 5: Campaign Matrix & Perspective Switcher")
        page.wait_for_timeout(2000)

        # Hover over the 12-variant matrix cards
        page.mouse.move(450, 420)
        page.wait_for_timeout(2500)
        page.mouse.move(850, 420)
        page.wait_for_timeout(2500)

        # Toggle perspective to "By format"
        print("[*] Switching perspective to 'By format'...")
        format_tab = page.locator("button:has-text('By format')")
        if format_tab.count() > 0:
            format_tab.click()
            page.wait_for_timeout(3500)

        # Toggle perspective to "By region"
        print("[*] Switching perspective to 'By region'...")
        region_tab = page.locator("button:has-text('By region')")
        if region_tab.count() > 0:
            region_tab.click()
            page.wait_for_timeout(4000)

        # Return to Overview (4x3)
        print("[*] Returning to Overview (4x3)...")
        overview_tab = page.locator("button:has-text('Overview (4×3)')")
        if overview_tab.count() > 0:
            overview_tab.click()
            page.wait_for_timeout(3000)

        # -------------------------------------------------------------
        # BEAT 6: INTERACTIVE STUDIO LIGHTBOX & SLIDER (1:58 - 2:28) ~30s
        # -------------------------------------------------------------
        print("[*] Beat 6: Deep-Dive Studio Lightbox...")
        # Click on one of the variant cards (look for a 9:16 or card container)
        variant_cards = page.locator("div.group\\/card, div[class*='group/card']")
        if variant_cards.count() > 0:
            # Click the second card (usually 9:16 or prominent festival)
            variant_cards.nth(1).click()
            page.wait_for_timeout(3500)
        else:
            # Fallback click on any image inside matrix
            img_card = page.locator("#campaign-creatives img").first
            img_card.click()
            page.wait_for_timeout(3500)

        # Check Lightbox open
        print("[*] In Lightbox: Switching to Compare (Before/After Slider)...")
        compare_tab = page.locator("button:has-text('Compare')")
        if compare_tab.count() > 0:
            compare_tab.click()
            page.wait_for_timeout(2500)

            # Scrub Before/After slider
            slider_handle = page.locator("div[class*='cursor-ew-resize']")
            if slider_handle.count() > 0:
                box = slider_handle.bounding_box()
                if box:
                    start_x = box["x"] + box["width"] / 2
                    start_y = box["y"] + box["height"] / 2
                    page.mouse.move(start_x, start_y)
                    page.mouse.down()
                    smooth_mouse_move(page, start_x, start_y, start_x - 140, start_y, duration_ms=800)
                    page.wait_for_timeout(1000)
                    smooth_mouse_move(page, start_x - 140, start_y, start_x + 160, start_y, duration_ms=1000)
                    page.wait_for_timeout(1000)
                    smooth_mouse_move(page, start_x + 160, start_y, start_x, start_y, duration_ms=700)
                    page.mouse.up()
                    page.wait_for_timeout(2000)

        # Switch to Channel UI Mode
        print("[*] In Lightbox: Switching to Channel UI Simulation...")
        channel_tab = page.locator("button:has-text('Channel UI')")
        if channel_tab.count() > 0:
            channel_tab.click()
            page.wait_for_timeout(3500)

            # Toggle Safe Zone guides
            safe_zone_toggle = page.locator("button:has-text('Safe zone')")
            if safe_zone_toggle.count() > 0:
                safe_zone_toggle.click()
                page.wait_for_timeout(2000)
                safe_zone_toggle.click()
                page.wait_for_timeout(2000)

            # Click interactive Like heart in social frame
            heart_btn = page.locator("button:has(svg.lucide-heart)")
            if heart_btn.count() > 0:
                heart_btn.first.click()
                page.wait_for_timeout(2000)

        # Inspect Technical Details / Cloudinary Recipe in right panel
        print("[*] In Lightbox: Inspecting Technical Details...")
        tech_summary = page.locator("summary:has-text('Technical details')")
        if tech_summary.count() > 0:
            tech_summary.click()
            page.wait_for_timeout(2500)

            # Click Copy Recipe
            copy_btn = page.locator("button:has-text('Copy recipe')")
            if copy_btn.count() > 0:
                copy_btn.click()
                page.wait_for_timeout(2000)

        # Close Lightbox with Escape key cleanly
        print("[*] Closing Lightbox via Escape key...")
        page.keyboard.press("Escape")
        page.wait_for_timeout(2500)

        # -------------------------------------------------------------
        # BEAT 7: SEARCH / FILTER & BATCH EXPORT (2:10 - 2:25) ~15s
        # -------------------------------------------------------------
        print("[*] Beat 7: Filter Controls & Campaign Packaging...")
        smooth_scroll(page, 950, duration_ms=1200)
        page.wait_for_timeout(2000)

        # Search filter interaction
        search_input = page.locator("input[placeholder*='Search by festival']")
        if search_input.count() > 0:
            search_input.click()
            page.keyboard.type("Pongal", delay=60)
            page.wait_for_timeout(3000)
            search_input.fill("")
            page.wait_for_timeout(2000)

        # Hover Batch Export ZIP button
        export_btn = page.locator("button:has-text('Export')").first
        if export_btn.count() > 0:
            box = export_btn.bounding_box()
            if box:
                page.mouse.move(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
                page.wait_for_timeout(3500)

        # -------------------------------------------------------------
        # BEAT 8: POLISHED OUTRO RETURN TO HEADER (2:25 - 2:38) ~13s
        # -------------------------------------------------------------
        print("[*] Beat 8: Outro Frame Return to Top...")
        smooth_scroll(page, 0, duration_ms=2200)
        page.mouse.move(960, 240)
        page.wait_for_timeout(5000)

        elapsed = time.time() - start_time
        print(f"[✓] Recording complete! Total duration: {elapsed:.1f} seconds ({elapsed/60:.2f} minutes).")

        video_obj = page.video
        video_path = video_obj.path() if video_obj else None
        context.close()
        browser.close()

        if video_path and os.path.exists(video_path):
            print(f"[✓] Raw video saved to: {video_path}")
            return video_path
        return None

if __name__ == "__main__":
    vid = main()
    print("FINISHED_VIDEO_PATH:", vid)
