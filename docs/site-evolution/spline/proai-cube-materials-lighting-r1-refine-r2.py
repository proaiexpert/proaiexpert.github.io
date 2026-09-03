from pathlib import Path

path = Path('docs/site-evolution/spline/proai-cube-materials-lighting-r1/main.js')
text = path.read_text()

replacements = {
    "renderer.toneMappingExposure = 0.96;": "renderer.toneMappingExposure = 0.97;",
    "createStudioCard(environmentScene, { position: [4.8, 3.6, 5.8], width: 7.8, height: 4.8, color: 0xf2f4f7, intensity: 2.25 })": "createStudioCard(environmentScene, { position: [4.8, 3.6, 5.8], width: 7.8, height: 4.8, color: 0xe8ebef, intensity: 1.62 })",
    "createStudioCard(environmentScene, { position: [-5.8, 1.4, 3.9], width: 3.2, height: 6.4, color: 0xaab2bc, intensity: 1.28 })": "createStudioCard(environmentScene, { position: [-5.8, 1.4, 3.9], width: 4.8, height: 7.2, color: 0xb8c0ca, intensity: 2.10 })",
    "createStudioCard(environmentScene, { position: [-3.8, 4.6, -5.6], width: 2.4, height: 7.4, color: 0xffffff, intensity: 1.75 })": "createStudioCard(environmentScene, { position: [-3.8, 4.6, -5.6], width: 2.8, height: 7.4, color: 0xf4f5f7, intensity: 1.35 })",
    "createStudioCard(environmentScene, { position: [2.6, -4.8, -2.8], width: 5.6, height: 2.0, color: 0x7d858f, intensity: 0.72 })": "createStudioCard(environmentScene, { position: [2.6, -4.8, -2.8], width: 6.2, height: 2.4, color: 0x8b949f, intensity: 0.88 })",
    "graphiteFace: Object.freeze({ color: '#171b20', metalness: 0.90, roughness: 0.245, clearcoat: 0.22, clearcoatRoughness: 0.17, envMapIntensity: 1.34 })": "graphiteFace: Object.freeze({ color: '#1a1f25', metalness: 0.89, roughness: 0.255, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.40 })",
    "gunmetalFace: Object.freeze({ color: '#20262d', metalness: 0.88, roughness: 0.205, clearcoat: 0.28, clearcoatRoughness: 0.14, envMapIntensity: 1.42 })": "gunmetalFace: Object.freeze({ color: '#222931', metalness: 0.88, roughness: 0.220, clearcoat: 0.26, clearcoatRoughness: 0.15, envMapIntensity: 1.46 })",
    "blackChromeFace: Object.freeze({ color: '#0d1014', metalness: 0.96, roughness: 0.165, clearcoat: 0.20, clearcoatRoughness: 0.12, envMapIntensity: 1.52 })": "blackChromeFace: Object.freeze({ color: '#141920', metalness: 0.95, roughness: 0.200, clearcoat: 0.18, clearcoatRoughness: 0.14, envMapIntensity: 1.56 })",
    "smokedCore: Object.freeze({ color: '#07090b', metalness: 0.62, roughness: 0.385, clearcoat: 0.08, clearcoatRoughness: 0.25, envMapIntensity: 0.72 })": "smokedCore: Object.freeze({ color: '#090b0e', metalness: 0.58, roughness: 0.420, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.86 })",
    "lighting: Object.freeze({ hemisphereIntensity: 0.34, keyIntensity: 8.6, fillIntensity: 2.65, rimIntensity: 6.9, rectAreaLights: 3 })": "lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 7.2, fillIntensity: 4.9, rimIntensity: 5.8, rectAreaLights: 3 })",
    "colorManagement: Object.freeze({ outputColorSpace: 'SRGBColorSpace', toneMapping: 'ACESFilmicToneMapping', exposure: 0.96 })": "colorManagement: Object.freeze({ outputColorSpace: 'SRGBColorSpace', toneMapping: 'ACESFilmicToneMapping', exposure: 0.97 })",
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Missing refinement anchor: {old}')
    text = text.replace(old, new, 1)

path.write_text(text)
print('Applied Materials + Lighting R1 shadow-readability refinement R2')
