import json
import uuid

with open('places.json') as f:
    data = json.load(f)

for item in data:
    item['guid'] = str(uuid.uuid4())

with open('places.json', 'w') as f:
    json.dump(data, f, indent=4)