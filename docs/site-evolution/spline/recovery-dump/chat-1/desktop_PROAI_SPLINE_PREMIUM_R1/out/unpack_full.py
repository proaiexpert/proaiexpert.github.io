import os
import json
import msgpack
import base64
from msgpack import ExtType

def ext_hook(code, data):
    # Преобразуем все ext-данные в читаемый вид
    if code == 114:
        # Вероятно, это ссылка на объект – сохраняем как hex
        return {'_ext_114': data.hex()}
    elif code == 2:
        return {'_ext_2': data.hex()}
    elif code == 3:
        return {'_ext_3': data.hex()}
    elif code == 1:
        return {'_ext_1': data.hex()}
    else:
        # Для других кодов просто сохраняем base64
        return {'_ext_{}'.format(code): base64.b64encode(data).decode('ascii')}

def make_json_safe(value):
    if isinstance(value, bytes):
        return {'_bytes_hex': value.hex()}
    if isinstance(value, list):
        return [make_json_safe(item) for item in value]
    if isinstance(value, tuple):
        return [make_json_safe(item) for item in value]
    if isinstance(value, dict):
        return {str(make_json_safe(key)): make_json_safe(val) for key, val in value.items()}
    return value

with open("scene.splinecode", "rb") as f:
    raw = f.read()

# Пропускаем первые 4 байта (заголовок)
payload = raw[4:]

try:
    obj = msgpack.unpackb(payload, raw=False, ext_hook=ext_hook, strict_map_key=False)
except Exception as e:
    if type(e).__name__ != "ExtraData":
        print("Ошибка распаковки:", e)
        exit()
    unpacker = msgpack.Unpacker(raw=False, ext_hook=ext_hook, strict_map_key=False)
    unpacker.feed(payload)
    obj = list(unpacker)

obj = make_json_safe(obj)

# Сохраняем в JSON
with open("scene_full.json", "w", encoding="utf-8") as f:
    json.dump(obj, f, indent=2, ensure_ascii=False)

print("Готово! Создан файл scene_full.json в папке out.")
