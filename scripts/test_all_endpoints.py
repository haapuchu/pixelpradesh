import urllib.request
import json
import io

BASE_URL = "http://localhost:3000"

def test_api():
    print("--- 1. Testing POST /api/jobs ---")
    req = urllib.request.Request(
        f"{BASE_URL}/api/jobs",
        headers={"Content-Type": "application/json"},
        data=json.dumps({
            "productName": "Assam Orthodox Tea",
            "category": "Gourmet Beverages",
            "brief": "Rich authentic festive tea gift hamper",
            "masterPublicId": "adaptr_masters/assam_tea_master",
            "masterUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800"
        }).encode("utf-8")
    )
    with urllib.request.urlopen(req) as resp:
        job_data = json.loads(resp.read().decode())
        assert job_data["success"] is True
        job = job_data["job"]
        job_id = job["id"]
        variants = job["variants"]
        print(f"Job created: {job_id} with {len(variants)} variants.")

    print("\n--- 2. Testing GET /api/jobs/[id] ---")
    req = urllib.request.Request(f"{BASE_URL}/api/jobs/{job_id}")
    with urllib.request.urlopen(req) as resp:
        single_job_data = json.loads(resp.read().decode())
        assert single_job_data["success"] is True
        print(f"Fetched job status: {single_job_data['job']['status']}")

    print("\n--- 3. Testing POST /api/jobs/[id]/variants/[variantId]/regenerate ---")
    variant_id = variants[0]["id"]
    req = urllib.request.Request(
        f"{BASE_URL}/api/jobs/{job_id}/variants/{variant_id}/regenerate",
        headers={"Content-Type": "application/json"},
        data=b"{}"
    )
    with urllib.request.urlopen(req) as resp:
        regen_data = json.loads(resp.read().decode())
        assert regen_data["success"] is True
        print(f"Regenerated variant: {regen_data['variant']['id']}, status: {regen_data['variant']['status']}")

    print("\n--- 4. Testing GET /api/search ---")
    req = urllib.request.Request(f"{BASE_URL}/api/search?festival=diwali")
    with urllib.request.urlopen(req) as resp:
        search_data = json.loads(resp.read().decode())
        assert search_data["success"] is True
        print(f"Search results for 'diwali': {search_data['resultsCount']} variants found.")

    print("\n--- 5. Testing GET /api/jobs/[id]/export ---")
    req = urllib.request.Request(f"{BASE_URL}/api/jobs/{job_id}/export")
    with urllib.request.urlopen(req) as resp:
        export_content = resp.read()
        print(f"Export ZIP received: {len(export_content)} bytes, content-type: {resp.headers.get('Content-Type')}")

    print("\n--- 6. Testing POST /api/upload (sample selection) ---")
    req = urllib.request.Request(
        f"{BASE_URL}/api/upload",
        headers={"Content-Type": "application/json"},
        data=json.dumps({"sampleId": "kaju-katli"}).encode("utf-8")
    )
    with urllib.request.urlopen(req) as resp:
        upload_data = json.loads(resp.read().decode())
        assert upload_data["success"] is True
        print(f"Sample asset loaded: {upload_data['name']} (publicId: {upload_data['publicId']})")

    print("\nALL ENDPOINTS VERIFIED AND FUNCTIONAL!")

if __name__ == "__main__":
    test_api()
