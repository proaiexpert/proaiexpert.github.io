from pathlib import Path
import re

path = Path('assets/js/hero-premium-core-2-r2.js')
s = path.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str):
    global s
    count = s.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly 1 match, found {count}')
    s = s.replace(old, new, 1)

# Bring the architectural intelligence stack forward so it reads as nested processing,
# not a hidden central glow.
replace_once('vec3 a=q-vec3(0.08,0.00,0.015);', 'vec3 a=q-vec3(0.07,0.00,0.105);', 'internal outer position')
replace_once('vec3 b=q-vec3(0.045,-0.015,0.00);', 'vec3 b=q-vec3(0.035,-0.015,0.085);', 'internal mid position')
replace_once('vec3 c=q-vec3(0.075,-0.02,0.012);', 'vec3 c=q-vec3(0.060,-0.02,0.105);', 'internal kernel position')
replace_once('vec3 r=q-vec3(0.05,-0.01,-0.06);', 'vec3 r=q-vec3(0.04,-0.01,0.015);', 'internal rails position')

# Stronger front shell masses.
replace_once(
'''vec3 upper=q-vec3(-0.03,0.34,0.42+0.025*shellMotion*sin(uTime*.24+0.3));
      upper.xy=rot(-0.34+0.025*shellMotion*sin(uTime*.14))*upper.xy; upper.xz=rot(0.10)*upper.xz;
      float upperD=sdRoundBox(upper,vec3(0.34,0.090,0.055),0.052);''',
'''vec3 upper=q-vec3(-0.05,0.38,0.44+0.028*shellMotion*sin(uTime*.24+0.3));
      upper.xy=rot(-0.34+0.025*shellMotion*sin(uTime*.14))*upper.xy; upper.xz=rot(0.10)*upper.xz;
      float upperD=sdRoundBox(upper,vec3(0.39,0.105,0.060),0.058);''',
'upper shell')
replace_once(
'''vec3 lower=q-vec3(0.29,-0.29,0.39-0.020*shellMotion*sin(uTime*.18+1.7));
      lower.xy=rot(0.13-0.018*shellMotion*sin(uTime*.15))*lower.xy; lower.xz=rot(-0.13)*lower.xz;
      float lowerD=sdRoundBox(lower,vec3(0.38,0.10,0.060),0.055);''',
'''vec3 lower=q-vec3(0.27,-0.31,0.405-0.022*shellMotion*sin(uTime*.18+1.7));
      lower.xy=rot(0.13-0.018*shellMotion*sin(uTime*.15))*lower.xy; lower.xz=rot(-0.13)*lower.xz;
      float lowerD=sdRoundBox(lower,vec3(0.42,0.11,0.066),0.060);''',
'lower shell')

# Broad asymmetric rear sail + integrated graphite brand plate: these break the rounded-beam demo read.
anchor = '''      if(bridgeD<res.x)res=vec2(bridgeD,2.0);\n\n      if(uQuality>0.74){'''
insert = '''      if(bridgeD<res.x)res=vec2(bridgeD,2.0);\n\n      vec3 sail=q-vec3(-0.18,0.16,-0.34+0.018*shellMotion*sin(uTime*.12+0.7));
      sail.xy=rot(-0.19+0.012*shellMotion*sin(uTime*.10))*sail.xy;
      sail.xz=rot(-0.17)*sail.xz;
      float sailD=sdRoundBox(sail,vec3(0.34,0.48,0.055),0.075);
      sailD=max(sailD, dot(sail.xy,normalize(vec2(0.78,0.62)))-0.30);
      sailD=max(sailD,-sdRoundBox(sail-vec3(0.17,-0.08,0.035),vec3(0.22,0.25,0.045),0.055));
      if(sailD<res.x)res=vec2(sailD,1.0);

      vec3 brand=q-vec3(0.11,0.50,0.405);
      brand.xy=rot(-0.27)*brand.xy;
      brand.xz=rot(0.11)*brand.xz;
      float brandD=sdRoundBox(brand,vec3(0.235,0.062,0.030),0.032);
      if(brandD<res.x)res=vec2(brandD,7.0);\n\n      if(uQuality>0.74){'''
replace_once(anchor, insert, 'sail + brand insertion')

# Replace the enclosing glass shell with a smaller asymmetric smoked aperture, exposing the nested system.
pattern = re.compile(r'''      vec3 glassQ=q-vec3\(0\.09,0\.0,0\.03\);\n      glassQ\.xy=rot\(0\.08\)\*glassQ\.xy;\n      float glass=abs\(sdRoundBox\(glassQ,vec3\(0\.355,0\.455,0\.255\),0\.155\)\)-0\.018;\n      glass=max\(glass,0\.105-glassQ\.z\);\n      glass=max\(glass,glassQ\.x-0\.285\);\n      glass=max\(glass,-glassQ\.x-0\.135\);\n      if\(glass<res\.x\)res=vec2\(glass,3\.0\);''')
replacement = '''      vec3 glassQ=q-vec3(0.23,0.08,0.355);
      glassQ.xy=rot(-0.16)*glassQ.xy;
      glassQ.xz=rot(0.08)*glassQ.xz;
      float glass=sdRoundBox(glassQ,vec3(0.205,0.255,0.024),0.055);
      glass=max(glass,-sdRoundBox(glassQ-vec3(-0.055,0.015,0.018),vec3(0.105,0.145,0.030),0.040));
      if(glass<res.x)res=vec2(glass,3.0);'''
s, n = pattern.subn(replacement, s, count=1)
if n != 1:
    raise SystemExit(f'smoked aperture: expected 1 match, found {n}')

# Layered physical receiver/platform.
replace_once(
'''      if(platform<res.x)res=vec2(platform,6.0);\n\n      float floorD''',
'''      if(platform<res.x)res=vec2(platform,6.0);
      vec3 platformTop=p-vec3(0.01,-1.075,-0.02);
      float platformTopD=sdRoundBox(platformTop,vec3(0.57,0.018,0.36),0.035);
      if(platformTopD<res.x)res=vec2(platformTopD,6.18);\n\n      float floorD''',
'platform top')

# Align the reflective ProAI mark to the dedicated plate.
replace_once('vec3 q=objectSpace(p)-vec3(-0.03,0.34,0.42);', 'vec3 q=objectSpace(p)-vec3(0.11,0.50,0.405);', 'brand mark position')
replace_once('q.xy=rot(0.34)*q.xy;', 'q.xy=rot(0.27)*q.xy;', 'brand mark rotation')
replace_once('vec2 uv=q.xy*3.25;', 'vec2 uv=q.xy*4.2;', 'brand mark scale')

# More legible architectural cyan depth while keeping containment.
replace_once('vec3 inner=vec3(0.012,0.052,0.065)*(0.78+0.20*ndl)*pulse;', 'vec3 inner=vec3(0.012,0.060,0.074)*(0.80+0.20*ndl)*pulse;', 'inner outer material')
replace_once('inner+=cyan*(rim*0.18+glow*0.022);', 'inner+=cyan*(0.020+rim*0.22+glow*0.030);', 'inner outer light')
replace_once('vec3 inner=vec3(0.018,0.075,0.090)*(0.72+0.12*ndl);', 'vec3 inner=vec3(0.018,0.084,0.100)*(0.74+0.14*ndl);', 'inner mid material')
replace_once('inner+=cyan*(rim*0.21+spec*0.075+glow*0.030);', 'inner+=cyan*(0.026+rim*0.25+spec*0.085+glow*0.036);', 'inner mid light')
replace_once('vec3 inner=vec3(0.015,0.085,0.105)*(0.80+0.08*ndl);', 'vec3 kernel=vec3(0.016,0.098,0.120)*(0.82+0.10*ndl);', 'kernel base rename')
replace_once('inner+=cyan*(0.055+rim*0.24+filament*0.095+glow*0.035);\n        return inner;', 'kernel+=cyan*(0.075+rim*0.28+filament*0.105+glow*0.042);\n        return kernel;', 'kernel light')
replace_once('base+=ice*spec*(0.20+mark*0.18)+cyan*fres*0.040;', 'base+=ice*spec*(0.22+mark*0.42)+cyan*fres*0.040+vec3(0.16,0.22,0.24)*mark*0.035;', 'brand reflection')
replace_once('base*=1.0-mark*0.055;', 'base*=1.0-mark*0.085;', 'brand etch')

# Signal field: still subordinate, but sufficiently spatial and visible to read input→processing→output.
for old, new, label in [
    ('float la=1.0-smoothstep(0.0011,0.0064,a.x)', 'float la=1.0-smoothstep(0.0012,0.0076,a.x)', 'signal a width'),
    ('lb=1.0-smoothstep(0.0010,0.0052,b.x)', 'lb=1.0-smoothstep(0.0011,0.0061,b.x)', 'signal b width'),
    ('lc=1.0-smoothstep(0.0009,0.0046,c.x)', 'lc=1.0-smoothstep(0.0010,0.0054,c.x)', 'signal c width'),
    ('float aS=la*(0.050+pa*0.54),bS=lb*(0.024+pb*0.16),cS=lc*(0.018+pc*0.12);', 'float aS=la*(0.068+pa*0.60),bS=lb*(0.034+pb*0.20),cS=lc*(0.025+pc*0.15);', 'signal primary strengths'),
    ('float dS=ld*0.030*(1.0-prog*0.25),eS=le*(0.025+pe*0.22)*(0.45+0.55*prog),fS=lf*0.018*detail*(0.35+0.65*prog);', 'float dS=ld*0.038*(1.0-prog*0.25),eS=le*(0.034+pe*0.26)*(0.45+0.55*prog),fS=lf*0.024*detail*(0.35+0.65*prog);', 'signal fragments strengths'),
]:
    replace_once(old, new, label)

# Mobile uses its own camera framing instead of a scaled desktop composition.
replace_once('vec3 rd=normalize(uu*p.x+vv*p.y+ww*2.38);', 'float focal=mix(2.82,2.42,detailMix());\n      vec3 rd=normalize(uu*p.x+vv*p.y+ww*focal);', 'camera focal tier')

path.write_text(s, encoding='utf-8')
print('Premium Core R2 second-pass patch applied:', path)
