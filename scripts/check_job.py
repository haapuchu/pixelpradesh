import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:3000/api/jobs',
    headers={'Content-Type': 'application/json'},
    data=b'{"productName":"Haldiram","masterPublicId":"samples/food_sweets","masterUrl":"https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800"}'
)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        if data.get('success'):
            variants = data['job']['variants']
            print('Variant count:', len(variants))
            for v in variants[:4]:
                print(v['ratioId'], v['metadata']['festival'], 'finalUrl:', v.get('finalUrl'))
except Exception as e:
    print('Error:', e)
