from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1400, 'height': 900})
    page.goto('http://localhost:3000', wait_until='networkidle')
    page.wait_for_timeout(2000)
    
    # Click on the Ningol Chakouba button in hero aperture or card
    button = page.locator('button[title*="Ningol Chakouba"]').first
    if button.count() > 0:
        print("Found aperture button, clicking...")
        button.click()
    else:
        print("Looking for matrix card...")
        page.locator('.editorial-card').first.click()
        
    page.wait_for_timeout(1000)
    # Find filmstrip buttons inside modal and click 9:16
    filmstrip_btns = page.locator('div[role="dialog"] button[title*="9:16"]')
    if filmstrip_btns.count() > 0:
        print("Clicking 9:16 filmstrip button...")
        filmstrip_btns.first.click()
        page.wait_for_timeout(1000)
        
    page.screenshot(path='scripts/inspect_modal_916.png')
    browser.close()
    print("Screenshot saved to scripts/inspect_modal_916.png")
