import os, json, msgpack
INPUT = "scene.splinecode"
OUTPUT_DIR = "extracted"
os.makedirs(OUTPUT_DIR, exist_ok=True)
with open(INPUT, "rb") as f:
    data = f.read()
if len(data) < 4:
    print("Файл слишком мал")
    exit()
def ext_hook(code, ext_data):
    return {
        "__msgpack_ext__": code,
        "data_hex": ext_data.hex(),
    }

def make_json_safe(value):
    if isinstance(value, bytes):
        return {"__bytes_hex__": value.hex()}
    if isinstance(value, list):
        return [make_json_safe(item) for item in value]
    if isinstance(value, tuple):
        return [make_json_safe(item) for item in value]
    if isinstance(value, dict):
        return {str(make_json_safe(key)): make_json_safe(val) for key, val in value.items()}
    return value

payload = data[4:]
try:
    obj = msgpack.unpackb(payload, raw=False, ext_hook=ext_hook)
except msgpack.ExtraData:
    unpacker = msgpack.Unpacker(raw=False, ext_hook=ext_hook)
    unpacker.feed(payload)
    obj = list(unpacker)
obj = make_json_safe(obj)
with open(os.path.join(OUTPUT_DIR, "scene.json"), "w", encoding="utf-8") as f:
    json.dump(obj, f, indent=2, ensure_ascii=False)
print("Done. Result: extracted/scene.json")
