import json
from collections import defaultdict

# Загружаем плоский список
with open("scene_full.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Проходим по списку и ищем словари с ключами, характерными для узлов сцены
nodes = []
for i, item in enumerate(data):
    if isinstance(item, dict):
        # Проверяем наличие ключей, которые есть у узлов
        if "id" in item or "children" in item or "data" in item:
            nodes.append((i, item))
        # Также если есть "type" и это "Page" или что-то подобное
        if isinstance(item, dict) and "type" in item:
            nodes.append((i, item))

print(f"Найдено потенциальных узлов: {len(nodes)}")

# Выводим первые 5 для проверки
for idx, node in nodes[:5]:
    print(f"Индекс {idx}: {list(node.keys())}")
    if "id" in node:
        print(f"  id: {node['id']}")
    if "children" in node:
        print(f"  children: {node['children']}")
    if "data" in node:
        print(f"  data keys: {list(node['data'].keys()) if isinstance(node['data'], dict) else 'not dict'}")
    print("---")

# Сохраняем все найденные узлы в отдельный файл
with open("nodes_found.json", "w", encoding="utf-8") as f:
    json.dump(nodes, f, indent=2, ensure_ascii=False)

print("Узлы сохранены в nodes_found.json")
