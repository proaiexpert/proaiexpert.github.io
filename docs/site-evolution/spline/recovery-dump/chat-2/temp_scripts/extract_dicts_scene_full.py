import json
data = json.load(open('scene_full.json'))
dicts = [(i, item) for i, item in enumerate(data) if isinstance(item, dict)]
print(f'Всего словарей: {len(dicts)}')
for idx, d in dicts[:20]:
    print(f'Индекс {idx}: ключи = {list(d.keys())}')
    # Покажем первые 3 значения для ключей, которые не являются ext
    for k in list(d.keys())[:3]:
        val = d[k]
        if isinstance(val, (str, int, float)):
            print(f'  {k} = {repr(val)[:50]}')
        elif isinstance(val, list):
            print(f'  {k} = list[{len(val)}]')
        elif isinstance(val, dict):
            print(f'  {k} = dict с ключами {list(val.keys())[:5]}')
    print('---')
