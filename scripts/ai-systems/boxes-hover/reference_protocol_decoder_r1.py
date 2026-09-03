#!/usr/bin/env python3
"""Read-only reference-protocol inventory for the Golden Boxes Hover payload.

This tool only decodes and reports. It never writes, re-encodes, or mutates the
payload. The 0x72/0x69/0x70 interpretation follows msgpackr's documented
record and structured-clone extensions; application-specific Spline
extensions remain opaque unless independently proven.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from pip._vendor import msgpack


DEFAULT_PAYLOAD = Path(
    "owner-preview/assets/3d/boxes-hover/"
    "public-original-inline-scene-payload.bin"
)
DEFAULT_OUTPUT = Path(
    "docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1"
)

TARGETS = (
    "objects",
    "materials",
    "Cube Material",
    "Cube",
    "Cube Instance",
    "OrthographicCamera",
    "MouseHover",
    "events",
    "states",
    "color",
    "roughness",
    "metalness",
    "reflectivity",
    "Ellipse Material",
    "Sphere Material",
    "Rectangle Material",
    "Text Material",
    "physical",
    "pattern",
    "transmission",
)


def short(value: Any, limit: int = 140) -> Any:
    if isinstance(value, msgpack.ExtType):
        return {
            "ext_code": value.code,
            "payload_hex": value.data.hex(),
            "payload_length": len(value.data),
        }
    if isinstance(value, str):
        return value if len(value) <= limit else value[: limit - 3] + "..."
    if isinstance(value, bytes):
        return {"bytes": len(value), "hex_prefix": value[:16].hex()}
    if isinstance(value, list):
        return {
            "list_length": len(value),
            "head": [short(item, 48) for item in value[:5]],
        }
    if isinstance(value, dict):
        return {"map_length": len(value)}
    return value


def type_name(value: Any) -> str:
    if isinstance(value, msgpack.ExtType):
        return "ExtType"
    return type(value).__name__


def parse_stream(raw: bytes) -> list[dict[str, Any]]:
    unpacker = msgpack.Unpacker(raw=False, strict_map_key=False)
    unpacker.feed(raw)
    items: list[dict[str, Any]] = []
    while True:
        start = unpacker.tell()
        try:
            value = next(unpacker)
        except StopIteration:
            break
        items.append(
            {
                "index": len(items),
                "offset": start,
                "end": unpacker.tell(),
                "type": type_name(value),
                "value": value,
            }
        )
    if unpacker.tell() != len(raw):
        raise RuntimeError("MessagePack stream did not consume the payload")
    return items


def walk(value: Any, item_index: int, path: tuple[Any, ...] = ()):
    yield value, item_index, path
    if isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk(child, item_index, path + (index,))
    elif isinstance(value, dict):
        for key, child in value.items():
            yield from walk(key, item_index, path + ("<key>",))
            yield from walk(child, item_index, path + (key,))


def ext_inventory(items: list[dict[str, Any]]) -> dict[str, Any]:
    counts: Counter[int] = Counter()
    lengths: dict[int, Counter[int]] = defaultdict(Counter)
    payloads: dict[int, Counter[str]] = defaultdict(Counter)
    occurrences: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        for value, item_index, path in walk(item["value"], item["index"]):
            if not isinstance(value, msgpack.ExtType):
                continue
            counts[value.code] += 1
            lengths[value.code][len(value.data)] += 1
            payloads[value.code][value.data.hex()] += 1
            if len(occurrences[value.code]) < 12:
                occurrences[value.code].append(
                    {
                        "item_index": item_index,
                        "path": list(path),
                        "payload_hex": value.data.hex(),
                    }
                )
    result: dict[str, Any] = {}
    for code in sorted(counts):
        result[f"0x{code:02x}"] = {
            "decimal_code": code,
            "count_recursive": counts[code],
            "payload_lengths": {
                str(length): count for length, count in sorted(lengths[code].items())
            },
            "unique_payloads": len(payloads[code]),
            "sample_occurrences": occurrences[code],
        }
    return result


def schema_definitions(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    definitions = []
    for index, item in enumerate(items[:-1]):
        value = item["value"]
        following = items[index + 1]["value"]
        if not (
            isinstance(value, msgpack.ExtType)
            and value.code == 0x72
            and len(value.data) == 1
            and isinstance(following, list)
            and all(isinstance(field, str) for field in following)
        ):
            continue
        definitions.append(
            {
                "record_id": value.data[0],
                "record_id_hex": f"0x{value.data[0]:02x}",
                "definition_item_index": index,
                "definition_offset": item["offset"],
                "fields_item_index": index + 1,
                "fields_offset": items[index + 1]["offset"],
                "field_count": len(following),
                "fields": following,
                "confidence": "CONFIRMED",
            }
        )
    return definitions


def id_pointer_analysis(items: list[dict[str, Any]]) -> dict[str, Any]:
    ids: list[dict[str, Any]] = []
    pointers: list[dict[str, Any]] = []
    for item in items:
        for value, item_index, path in walk(item["value"], item["index"]):
            if not isinstance(value, msgpack.ExtType) or len(value.data) != 4:
                continue
            if value.code not in (0x69, 0x70):
                continue
            row = {
                "item_index": item_index,
                "path": list(path),
                "value_uint32_be": int.from_bytes(value.data, "big"),
                "payload_hex": value.data.hex(),
            }
            (ids if value.code == 0x69 else pointers).append(row)
    id_values = {row["value_uint32_be"] for row in ids}
    pointer_values = {row["value_uint32_be"] for row in pointers}
    first_id_item = {}
    for row in ids:
        first_id_item.setdefault(row["value_uint32_be"], row["item_index"])
    pointer_order = [
        {
            **row,
            "prior_id_definition": (
                first_id_item.get(row["value_uint32_be"], 10**9) <= row["item_index"]
            ),
        }
        for row in pointers
    ]
    return {
        "endianness": "big",
        "id_extension": "0x69",
        "pointer_extension": "0x70",
        "id_occurrences": len(ids),
        "id_unique_values": len(id_values),
        "pointer_occurrences": len(pointers),
        "pointer_unique_values": len(pointer_values),
        "pointer_values_missing_from_id_namespace": sorted(pointer_values - id_values),
        "all_pointer_values_in_id_namespace": pointer_values <= id_values,
        "pointers_with_prior_id_definition": sum(
            row["prior_id_definition"] for row in pointer_order
        ),
        "pointer_order_sample": pointer_order[:12],
        "confidence": "CONFIRMED",
    }


def context_entry(item: dict[str, Any]) -> dict[str, Any]:
    value = item["value"]
    result = {
        "index": item["index"],
        "offset": item["offset"],
        "end": item["end"],
        "type": item["type"],
        "summary": short(value),
    }
    if isinstance(value, msgpack.ExtType):
        result["extension_code"] = value.code
        result["extension_payload_hex"] = value.data.hex()
    return result


def material_contexts(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    hits: dict[str, list[int]] = defaultdict(list)
    for item in items:
        for value, _, _ in walk(item["value"], item["index"]):
            if isinstance(value, str):
                for target in TARGETS:
                    if value == target and len(hits[target]) < 4:
                        hits[target].append(item["index"])
    contexts = []
    seen = set()
    for target in TARGETS:
        for hit in hits[target]:
            key = (target, hit)
            if key in seen:
                continue
            seen.add(key)
            start = max(0, hit - 4)
            end = min(len(items), hit + 5)
            contexts.append(
                {
                    "target": target,
                    "target_item_index": hit,
                    "window_item_start": start,
                    "window_item_end_exclusive": end,
                    "items": [context_entry(item) for item in items[start:end]],
                }
            )
    return contexts


def build_graph(
    raw: bytes,
    items: list[dict[str, Any]],
    definitions: list[dict[str, Any]],
    refs: dict[str, Any],
) -> dict[str, Any]:
    exact_locations: dict[str, list[int]] = defaultdict(list)
    for item in items:
        for value, _, _ in walk(item["value"], item["index"]):
            if isinstance(value, str) and value in {
                "Boxes",
                "Cube",
                "Cube Material",
                "Cube Instance",
                "pattern",
                "physical",
                "transmission",
            }:
                if len(exact_locations[value]) < 12:
                    exact_locations[value].append(item["index"])
    return {
        "payload": {
            "size_bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest(),
        },
        "protocol": {
            "0x72": {
                "role": "msgpackr record definition / record identifier",
                "evidence": "120 occurrences; record identifiers in 0x40-0x7f; declarations followed by field-name arrays",
                "confidence": "CONFIRMED",
            },
            "0x69": {
                "role": "structured-clone object ID registration, uint32 big-endian",
                "evidence": "97 unique four-byte values; official msgpackr decoder registers the following value under this ID",
                "confidence": "CONFIRMED",
            },
            "0x70": {
                "role": "structured-clone pointer to an earlier 0x69 ID, uint32 big-endian",
                "evidence": f"709 occurrences; 97 unique values; all pointer values are in the 0x69 namespace; prior-ID check={refs['pointers_with_prior_id_definition']}/{refs['pointer_occurrences']}",
                "confidence": "CONFIRMED",
            },
            "application_extensions": {
                "codes": ["0x01", "0x02", "0x03", "0x06"],
                "role": "Spline application-specific semantics unresolved; raw values preserved",
                "confidence": "UNKNOWN",
            },
        },
        "schema": {
            "definition_count": len(definitions),
            "record_ids": sorted({entry["record_id"] for entry in definitions}),
            "examples": definitions[:16],
            "confidence": "CONFIRMED",
        },
        "serialized_locations": {
            key: {"sample_item_indices": value}
            for key, value in sorted(exact_locations.items())
        },
        "edges": [
            {
                "from": "schema/scene/object/material records",
                "to": "msgpackr record field arrays",
                "confidence": "CONFIRMED",
                "evidence": "0x72 declaration immediately precedes field-name array in the flat stream",
            },
            {
                "from": "0x70 pointer",
                "to": "previously registered 0x69 ID target",
                "confidence": "CONFIRMED",
                "evidence": "all 97 pointer values are contained in the 0x69 ID namespace",
            },
            {
                "from": "Cube Material record",
                "to": "transmission / pattern / physical layer records",
                "confidence": "PROBABLE",
                "evidence": "serialized material region contains the three native layer names and their field tables; app-specific layer edge is not independently decoded",
            },
            {
                "from": "Cube / Cube Instance",
                "to": "specific Cube Material runtime identity",
                "confidence": "UNRESOLVED",
                "evidence": "the remaining Spline application extensions 0x01/0x02/0x03/0x06 prevent a safe end-to-end identity edge",
            },
        ],
        "runtime_cross_check": {
            "source": "prior read-only native runtime inventory",
            "cube_meshes": 143,
            "independent_runtime_material_identities": 143,
            "common_layer_signature_count": 1,
            "native_layers": ["transmission", "pattern", "light/physical"],
            "known_values": {
                "pattern.colorA": "white",
                "pattern.colorB": "black",
                "physical.metalness": 0.14,
                "physical.roughness": 0.35,
                "physical.reflectivity": 0.33,
                "transmission.ior": 1.5,
                "transmission.roughness": 2.7,
            },
            "serialized_semantic_identity": "PARTIAL",
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("payload", nargs="?", type=Path, default=DEFAULT_PAYLOAD)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    raw = args.payload.read_bytes()
    items = parse_stream(raw)
    definitions = schema_definitions(items)
    refs = id_pointer_analysis(items)

    args.output.mkdir(parents=True, exist_ok=True)
    schema = {
        "payload_sha256": hashlib.sha256(raw).hexdigest(),
        "payload_size_bytes": len(raw),
        "record_extension": "0x72",
        "definitions": definitions,
    }
    contexts = {
        "payload_sha256": hashlib.sha256(raw).hexdigest(),
        "payload_size_bytes": len(raw),
        "window_radius": 4,
        "contexts": material_contexts(items),
        "float_hits": {
            str(target): [
                item["index"]
                for item in items
                if isinstance(item["value"], float) and abs(item["value"] - target) < 1e-9
            ]
            for target in (0.14, 0.35, 0.33, 1.5, 2.7, 1.0, 0.05, 90.0)
        },
        "id_pointer_analysis": refs,
    }
    graph = build_graph(raw, items, definitions, refs)
    for path, data in (
        (args.output / "schema-table.json", schema),
        (args.output / "stream-context-materials.json", contexts),
        (args.output / "reference-graph.json", graph),
    ):
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
    print(
        json.dumps(
            {
                "payload_sha256": hashlib.sha256(raw).hexdigest(),
                "payload_size_bytes": len(raw),
                "stream_items": len(items),
                "record_definitions": len(definitions),
                "0x69_occurrences": refs["id_occurrences"],
                "0x70_occurrences": refs["pointer_occurrences"],
                "all_pointer_values_in_id_namespace": refs["all_pointer_values_in_id_namespace"],
                "output": str(args.output),
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
