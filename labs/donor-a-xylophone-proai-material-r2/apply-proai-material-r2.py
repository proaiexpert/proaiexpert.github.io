from pathlib import Path

ROOT = Path('/tmp/xylophone')

# Start from the exact pinned donor and apply R1 first, then this final R2 material-only correction.
exec(Path('labs/donor-a-xylophone-proai-material-r1/apply-proai-material.py').read_text(), {'__name__': '__main__'})

p = ROOT / 'src/js/components/xylophone/Xylophone.ts'
s = p.read_text()
s = s.replace('grad.addColorStop(0.28, "#C9CDD1")\n    grad.addColorStop(0.50, "#676BFF")\n    grad.addColorStop(0.72, "#5B50FF")\n    grad.addColorStop(1.0, "#9BA8FF")', 'grad.addColorStop(0.42, "#242A31")\n    grad.addColorStop(0.76, "#2B323A")\n    grad.addColorStop(0.94, "#676BFF")\n    grad.addColorStop(1.0, "#5B50FF")')
s = s.replace('u_transmission: { value: REVIEW_THEME === "proai" ? 0.76 : 0.84 }', 'u_transmission: { value: REVIEW_THEME === "proai" ? 0.44 : 0.84 }')
s = s.replace('u_refractStrength: { value: REVIEW_THEME === "proai" ? 0.14 : 0.2 }', 'u_refractStrength: { value: REVIEW_THEME === "proai" ? 0.075 : 0.2 }')
s = s.replace('u_fresnelPower: { value: REVIEW_THEME === "proai" ? 2.35 : 3.0 }', 'u_fresnelPower: { value: REVIEW_THEME === "proai" ? 1.85 : 3.0 }')
s = s.replace('u_iridStrength: { value: REVIEW_THEME === "proai" ? 0.16 : 0.6 }', 'u_iridStrength: { value: REVIEW_THEME === "proai" ? 0.055 : 0.6 }')
s = s.replace('u_iridCycles: { value: REVIEW_THEME === "proai" ? 1.15 : 3.0 }', 'u_iridCycles: { value: REVIEW_THEME === "proai" ? 0.72 : 3.0 }')
s = s.replace('u_iridPower: { value: REVIEW_THEME === "proai" ? 3.2 : 2.5 }', 'u_iridPower: { value: REVIEW_THEME === "proai" ? 4.6 : 2.5 }')
s = s.replace('u_iridBody: { value: REVIEW_THEME === "proai" ? 0.018 : 0.12 }', 'u_iridBody: { value: REVIEW_THEME === "proai" ? 0.003 : 0.12 }')
p.write_text(s)

p = ROOT / 'src/shaders/xylophone/xylophoneFrag.glsl'
s = p.read_text()
# Strict R2 hierarchy: 60% black chrome, 25% gunmetal, 15% graphite/silver-black.
s = s.replace('if (family >= 4.0 && family < 7.0) base = GRAPHITE;\n    else if (family >= 7.0 && family < 9.0) base = GUNMETAL;\n    else if (family >= 9.0) base = SILVER * 0.72;', 'if (family >= 6.0 && family < 8.5) base = GUNMETAL;\n    else if (family >= 8.5 && family < 9.5) base = GRAPHITE;\n    else if (family >= 9.5) base = mix(GRAPHITE, SILVER, 0.28);')
# Interaction becomes state-like: no broad lavender body fill.
s = s.replace('vec3 activeIndigo = mix(INDIGO_DEEP, INDIGO_EDGE, clamp(dot(N, normalize(LIGHT_DIR)) * 0.5 + 0.5, 0.0, 1.0));\n    vec3 activeBase = mix(base, activeIndigo, reveal * (pearlMask > 0.5 ? 0.18 : 0.62));\n    vec3 bodyP = lighting * (activeBase * 1.18 + vec3(0.012));', 'vec3 activeIndigo = mix(INDIGO_DEEP, INDIGO, clamp(dot(N, normalize(LIGHT_DIR)) * 0.5 + 0.5, 0.0, 1.0));\n    float indigoState = reveal * reveal * (pearlMask > 0.5 ? 0.015 : 0.16);\n    vec3 activeBase = mix(base, activeIndigo, indigoState);\n    vec3 bodyP = lighting * (activeBase * 0.92 + vec3(0.004));')
s = s.replace('transP = mix(transP, activeBase * 1.08, 0.18 + reveal * 0.42);\n    vec3 frostedP = mix(bodyP, transP, u_transmission * (1.0 - 0.38 * reveal));', 'transP = mix(transP, activeBase * 0.82, 0.52 + reveal * 0.12);\n    vec3 frostedP = mix(bodyP, transP, u_transmission * (1.0 - 0.22 * reveal));')
# Stronger narrow silver chrome rim, less cloudy optical wash.
s = s.replace('vec3 colorP = mix(frostedP, sheenP, fresP * 0.50);\n    colorP += fresP * vec3(0.072, 0.078, 0.09);', 'float chromeFamily = 1.0 - step(6.0, family);\n    float gunmetalFamily = step(6.0, family) * (1.0 - step(8.5, family));\n    vec3 chromeSheen = mix(sheenP, SILVER, 0.58);\n    vec3 satinSheen = mix(sheenP, SILVER * 0.72, 0.30);\n    vec3 materialSheen = mix(sheenP, chromeSheen, chromeFamily);\n    materialSheen = mix(materialSheen, satinSheen, gunmetalFamily);\n    vec3 colorP = mix(frostedP, materialSheen, fresP * (0.72 * chromeFamily + 0.46 * gunmetalFamily + 0.38));\n    colorP += fresP * SILVER * (0.16 * chromeFamily + 0.07 * gunmetalFamily + 0.035);')
s = s.replace('vec3 opticalTint = mix(SILVER, INDIGO_EDGE, optical * 0.48);\n    colorP += opticalTint * (pow(edgeP, u_iridPower) * u_iridStrength + u_iridBody * edgeP);\n    colorP += INDIGO * reveal * 0.055;', 'vec3 opticalTint = mix(SILVER, INDIGO, optical * 0.09);\n    colorP += opticalTint * (pow(edgeP, u_iridPower) * u_iridStrength + u_iridBody * edgeP);\n    colorP += INDIGO_DEEP * reveal * reveal * 0.008;')
# Pearl: warm opaque/satin optical body, deliberately isolated from indigo.
s = s.replace('colorP = mix(colorP, colorP + SILVER * fresP * 0.16, pearlMask);', 'vec3 pearlBody = lighting * (PEARL * 0.88 + vec3(0.018, 0.016, 0.012));\n    vec3 pearlOptical = mix(pearlBody, mix(PEARL, SILVER, 0.34), fresP * 0.46);\n    pearlOptical += PEARL * pow(edgeP, 3.6) * 0.07;\n    colorP = mix(colorP, pearlOptical, pearlMask);')
# Environment is much darker with a narrow silver ceiling and effectively no indigo wash.
s = s.replace('vec3 horizonP = vec3(0.1412, 0.1647, 0.1922); // Graphite\n    vec3 skyP = vec3(0.7882, 0.8039, 0.8196); // Silver\n    vec3 envP = t < 0.5 ? mix(groundP, horizonP, t * 2.0) : mix(horizonP, skyP, (t - 0.5) * 2.0);\n    return mix(envP, vec3(0.4039, 0.4196, 1.0), smoothstep(0.82, 1.0, t) * 0.055);', 'vec3 horizonP = vec3(0.0549, 0.0706, 0.0902); // #0E1217\n    vec3 skyP = vec3(0.7882, 0.8039, 0.8196); // narrow Silver highlight\n    vec3 envP = t < 0.78 ? mix(groundP, horizonP, smoothstep(0.0, 0.78, t)) : mix(horizonP, skyP, smoothstep(0.78, 1.0, t));\n    return mix(envP, vec3(0.3569, 0.3137, 1.0), smoothstep(0.975, 1.0, t) * 0.008);')
p.write_text(s)

p = ROOT / 'src/shaders/xylophoneBg/xylophoneBgFrag.glsl'
s = p.read_text()
s = s.replace('vec3 upper = vec3(0.0549, 0.0706, 0.0902);    // restrained cool-black separation\n    color = mix(obsidian, upper, smoothstep(0.08, 0.92, t) * 0.72);\n    color = mix(color, vec3(0.3569, 0.3137, 1.0), smoothstep(0.92, 1.0, t) * 0.018);', 'vec3 upper = vec3(0.0196, 0.0235, 0.0275);    // #050607 near-black separation\n    color = mix(obsidian, upper, smoothstep(0.22, 0.96, t) * 0.62);')
p.write_text(s)

print('Applied final ProAI material R2 correction to the same four R1 material files only.')
