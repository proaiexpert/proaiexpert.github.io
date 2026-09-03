#!/usr/bin/env python3
"""Read-only MessagePack inventory for the recovered Boxes Hover payload.

This script never writes to the payload. It intentionally preserves unknown
MessagePack extension values as msgpack.ExtType instances and emits a compact
JSON inventory to stdout.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from pip._vendor import msgpack


PATTERNS = (
    "schema",
    "scene",
    "material",
    "texture",
    "camera",
    "cube",
    "hover",
    "position",
    "rotation",
    "scale",
    "color",
    "name",
    "uuid",
    "spline",
    "webgpu",
    "three",
)


def short_value(value: Any) -> Any:
    if isinstance(value, msgpack.ExtType):
        return {"ext_code": value.code, "payload_hex": value.data[:32].hex()}
    if isinstance(value, str):
        return value if len(value) <= 100 else value[:97] + "..."
    if isinstance(value, bytes):
        return {"bytes": len(value)}
    if isinstance(value, list):
        return {"list": len(value)}
    if isinstance(value, dict):
        return {"map": len(value)}
    return value


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "payload",
        nargs="?",
        default="owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin",
        type=Path,
    )
    args = parser.parse_args()
    payload = args.payload
    raw = payload.read_bytes()

    single_object_error = None
    try:
        msgpack.unpackb(raw, raw=False, strict_map_key=False)
    except Exception as exc:  # ExtraData is the expected result for this stream.
        single_object_error = f"{type(exc).__name__}: {exc}"

    unpacker = msgpack.Unpacker(raw=False, strict_map_key=False)
    unpacker.feed(raw)
    top_level_types = Counter()
    extension_counts = Counter()
    extension_lengths: dict[int, Counter[int]] = defaultdict(Counter)
    extension_payloads: dict[int, Counter[str]] = defaultdict(Counter)
    string_counts = Counter()
    string_locations: dict[str, list[int]] = defaultdict(list)
    first_items = []
    last_items = []
    nested_arrays = 0
    nested_maps = 0
    max_depth = 0
    stream_items = 0

    def visit(value: Any, depth: int, item_index: int) -> None:
        nonlocal nested_arrays, nested_maps, max_depth
        max_depth = max(max_depth, depth)
        if isinstance(value, msgpack.ExtType):
            extension_counts[value.code] += 1
            extension_lengths[value.code][len(value.data)] += 1
            extension_payloads[value.code][value.data.hex()] += 1
        elif isinstance(value, str):
            string_counts[value] += 1
            if len(string_locations[value]) < 6:
                string_locations[value].append(item_index)
        elif isinstance(value, list):
            nested_arrays += 1
            for child in value:
                visit(child, depth + 1, item_index)
        elif isinstance(value, dict):
            nested_maps += 1
            for key, child in value.items():
                visit(key, depth + 1, item_index)
                visit(child, depth + 1, item_index)

    while True:
        offset = unpacker.tell()
        try:
            value = next(unpacker)
        except StopIteration:
            break
        end = unpacker.tell()
        top_level_types[type(value).__name__] += 1
        visit(value, 0, stream_items)
        item = {
            "index": stream_items,
            "offset": offset,
            "end": end,
            "type": type(value).__name__,
            "summary": short_value(value),
        }
        if stream_items < 24:
            first_items.append(item)
        last_items.append(item)
        if len(last_items) > 12:
            last_items.pop(0)
        stream_items += 1

    token_hits = {}
    for pattern in PATTERNS:
        matches = [
            {"value": value, "count": count, "items": string_locations[value]}
            for value, count in string_counts.items()
            if pattern.lower() in value.lower()
        ]
        matches.sort(key=lambda entry: (-entry["count"], entry["value"]))
        if matches:
            token_hits[pattern] = matches[:30]

    extensions = {}
    for code in sorted(extension_counts):
        extensions[f"0x{code:02x}"] = {
            "decimal_code": code,
            "count_recursive": extension_counts[code],
            "lengths": {
                str(length): count
                for length, count in sorted(extension_lengths[code].items())
            },
            "unique_payloads": len(extension_payloads[code]),
            "payload_frequency": dict(extension_payloads[code].most_common()),
        }

    result = {
        "payload": str(payload),
        "size_bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "implementation": "pip._vendor.msgpack",
        "implementation_version": getattr(msgpack, "__version__", "unknown"),
        "single_object": {
            "success": single_object_error is None,
            "error": single_object_error,
        },
        "stream": {
            "items": stream_items,
            "consumed_bytes": unpacker.tell(),
            "all_bytes_consumed": unpacker.tell() == len(raw),
            "top_level_types": dict(sorted(top_level_types.items())),
        },
        "structure": {
            "nested_arrays": nested_arrays,
            "nested_maps": nested_maps,
            "max_depth": max_depth,
        },
        "extensions": extensions,
        "token_hits": token_hits,
        "unique_strings": len(string_counts),
        "top_strings": [
            {"value": value, "count": count}
            for value, count in string_counts.most_common(40)
        ],
        "first_items": first_items,
        "last_items": last_items,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
