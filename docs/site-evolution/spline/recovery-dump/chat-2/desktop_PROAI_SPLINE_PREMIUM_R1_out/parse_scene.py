import json
import re

# Загружаем плоский список
with open("scene_full.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Функция для определения, является ли элемент списком ключей (все строки)
def is_keys_list(item):
    return isinstance(item, list) and all(isinstance(x, str) for x in item)

# Парсим список в последовательность объектов
objects = []  # будем хранить все собранные словари
i = 0
while i < len(data):
    item = data[i]
    if is_keys_list(item):
        # Это блок ключей
        keys = item
        # Следующие элементы — значения для этих ключей
        values = []
        i += 1
        for _ in range(len(keys)):
            if i < len(data):
                values.append(data[i])
                i += 1
            else:
                break
        # Создаем словарь, сопоставляя ключи и значения
        if len(keys) == len(values):
            obj = dict(zip(keys, values))
            # Обрабатываем ext-ссылки
            for k, v in obj.items():
                if isinstance(v, dict) and '_ext_114' in v:
                    # Заменяем на ссылку вида "@ref:XX"
                    obj[k] = f"@ref:{v['_ext_114']}"
                elif isinstance(v, dict) and '_ext_2' in v:
                    obj[k] = None  # пустое значение
                elif isinstance(v, dict) and '_ext_3' in v:
                    obj[k] = None
            objects.append(obj)
        else:
            # Если не совпало, просто пропускаем
            i -= len(values) + 1
            i += 1
    else:
        # Простое значение (не блок ключей)
        i += 1

print(f"Собрано объектов: {len(objects)}")

# Ищем объекты с полем 'id' (UUID) и строим карту
id_map = {}
for obj in objects:
    if 'id' in obj and isinstance(obj['id'], str) and '-' in obj['id']:
        id_map[obj['id']] = obj

print(f"Найдено объектов с ID: {len(id_map)}")

# Теперь разрешаем ссылки @ref:XX в 'children' и других полях
# Восстанавливаем иерархию: ищем корневой объект (без родителя)
# Но пока просто сохраняем все объекты с их ссылками

# Сохраняем результат
with open("scene_hierarchy.json", "w", encoding="utf-8") as f:
    json.dump(objects, f, indent=2, ensure_ascii=False)

print("Готово! Создан файл scene_hierarchy.json")
