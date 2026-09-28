import json
data = json.load(open('scene_resolved.json'))

# Ищем объекты с ключами, характерными для геометрии
geo_keys = {'vertices', 'indices', 'positions', 'normals', 'uvs', 'vertexPositions'}
mat_keys = {'color', 'roughness', 'metalness', 'emissive', 'map', 'normalMap'}

found_geo = []
found_mat = []

for i, obj in enumerate(data):
    if isinstance(obj, dict):
        keys = set(obj.keys())
        if keys & geo_keys:
            found_geo.append((i, obj))
        if keys & mat_keys:
            found_mat.append((i, obj))

print(f'Найдено объектов с геометрией: {len(found_geo)}')
print(f'Найдено объектов с материалами: {len(found_mat)}')

# Покажем первые 3 геометрии и первые 3 материала
print('\n=== Геометрия (первые 3) ===')
for idx, obj in found_geo[:3]:
    print(f'Индекс {idx}: ключи = {list(obj.keys())}')
    # Покажем размеры массивов, если есть
    for k in obj:
        if isinstance(obj[k], list) and len(obj[k]) > 0:
            print(f'  {k}: длина {len(obj[k])}, первые 3 значения {obj[k][:3]}')
        elif isinstance(obj[k], (int, float, str)):
            print(f'  {k}: {obj[k]}')
    print('---')

print('\n=== Материалы (первые 3) ===')
for idx, obj in found_mat[:3]:
    print(f'Индекс {idx}: ключи = {list(obj.keys())}')
    for k in obj:
        val = obj[k]
        if isinstance(val, (int, float, str)):
            print(f'  {k}: {val}')
        elif isinstance(val, dict):
            print(f'  {k}: dict с ключами {list(val.keys())}')
        elif isinstance(val, list):
            print(f'  {k}: list длиной {len(val)}')
    print('---')
