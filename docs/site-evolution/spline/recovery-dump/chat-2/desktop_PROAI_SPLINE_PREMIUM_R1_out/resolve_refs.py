import json
import copy

# Загружаем плоский список (оригинальный) и собранные объекты
with open("scene_full.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

with open("scene_hierarchy.json", "r", encoding="utf-8") as f:
    objects = json.load(f)

# Функция для разрешения ссылок _ext_114
def resolve_ext(item, raw_data):
    if isinstance(item, dict):
        if '_ext_114' in item:
            # Получаем hex-код
            hex_val = item['_ext_114']
            # Пытаемся найти объект по индексу (hex -> int)
            try:
                idx = int(hex_val, 16)
                if idx < len(raw_data):
                    # Рекурсивно разрешаем найденный объект
                    return resolve_ext(raw_data[idx], raw_data)
            except:
                pass
            # Если не удалось, возвращаем как есть
            return item
        else:
            # Рекурсивно проходим по значениям
            new_dict = {}
            for k, v in item.items():
                new_dict[k] = resolve_ext(v, raw_data)
            return new_dict
    elif isinstance(item, list):
        return [resolve_ext(x, raw_data) for x in item]
    else:
        return item

# Разрешаем ссылки во всех объектах
resolved_objects = []
for obj in objects:
    resolved = resolve_ext(obj, raw_data)
    resolved_objects.append(resolved)

# Сохраняем результат
with open("scene_resolved.json", "w", encoding="utf-8") as f:
    json.dump(resolved_objects, f, indent=2, ensure_ascii=False)

print("Готово! Создан файл scene_resolved.json")

# Дополнительно: найдём объект с geometry и материалом и выведем его структуру
for obj in resolved_objects:
    if isinstance(obj, dict) and 'geometry' in obj:
        print("Найден объект с геометрией:", obj.get('name', 'Без имени'))
        print(json.dumps(obj, indent=2, ensure_ascii=False)[:1500])
        break
