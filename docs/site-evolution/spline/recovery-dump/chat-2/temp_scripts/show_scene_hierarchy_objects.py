import json
data = json.load(open('scene_hierarchy.json'))
# Покажем объекты с индексами 23, 24, 25, 26, 27, 29 (важные)
for idx in [23, 24, 25, 26, 27, 29]:
    print(f'=== Индекс {idx} ===')
    obj = data[idx]
    print(json.dumps(obj, indent=2, ensure_ascii=False)[:1000])
    print('---')
