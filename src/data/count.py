import json
import os

count_a = 0
with open(os.path.join(os.path.dirname(__file__), 'mintAmount.json')) as f:
    data = json.load(f)
    for p,l in data.items():
        count = 0
        if l:
            for k,v in l.items():
                count += v
        count_a += count
        print(p, count)

print(count_a)