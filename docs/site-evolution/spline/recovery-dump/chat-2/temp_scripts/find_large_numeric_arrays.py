import json
data = json.load(open('scene_resolved.json'))

# Ищем объекты с любыми списками, длина которых > 10
found = []
for idx, obj in enumerate(data):
    if isinstance(obj, dict):
        for key, val in obj.items():
            if isinstance(val, list) and len(val) > 10:
                # Проверяем, что это числа (первые несколько элементов)
                if val and all(isinstance(x, (int, float)) for x in val[:5]):
                    found.append((idx, key, len(val), val[:3]))
                    break

print(f'Найдено объектов с большими числовыми массивами: {len(found)}')
for idx, key, length, sample in found[:5]:
    print(f'Индекс {idx}, ключ {key}, длина {length}, пример {sample}')
    # Также покажем все ключи этого объекта
    print(f'  Ключи объекта: {list(data[idx].keys())}')
