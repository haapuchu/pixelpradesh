import urllib.request
import re

url = "http://localhost:3000"
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        print("HTTP Status:", resp.status)
        content = resp.read().decode("utf-8")
        print("HTML length:", len(content))

        checks = [
            "/favicon.ico",
            "/favicon.svg",
            "/apple-touch-icon.png",
            "/site.webmanifest",
            "Campaign workspace",
            "Campaign creatives",
            "12 creatives",
            "How Adaptr works",
            "Built with Cloudinary",
            "One product.",
            "Every market."
        ]

        for check in checks:
            found = check in content
            print(f"[{'PASS' if found else 'FAIL'}] {check}")

        # Check favicon URLs directly
        static_assets = [
            "/favicon.ico",
            "/favicon.svg",
            "/apple-touch-icon.png",
            "/icon-32.png",
            "/icon-48.png",
            "/site.webmanifest"
        ]
        print("\nVerifying static icon asset responses:")
        for asset in static_assets:
            try:
                with urllib.request.urlopen(f"{url}{asset}") as a_resp:
                    print(f"[{a_resp.status}] {asset} ({len(a_resp.read())} bytes)")
            except Exception as ae:
                print(f"[ERROR] {asset}: {ae}")

except Exception as e:
    print("Error connecting to live server:", e)
