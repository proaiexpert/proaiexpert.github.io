from pathlib import Path

path = Path('assets/js/hero-premium-core-2-r2.js')
s = path.read_text(encoding='utf-8')

if 'sdFacetedSlab' in s and 'float lamella1=' in s:
    print('Premium Core R2 third pass already applied')
    raise SystemExit(0)


def one(old, new, label):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected 1 match, found {n}')
    s = s.replace(old, new, 1)

one(
'    float sdRoundBox(vec3 p,vec3 b,float r){ vec3 q=abs(p)-b+r; return min(max(q.x,max(q.y,q.z)),0.0)+length(max(q,0.0))-r; }',
'''    float sdRoundBox(vec3 p,vec3 b,float r){ vec3 q=abs(p)-b+r; return min(max(q.x,max(q.y,q.z)),0.0)+length(max(q,0.0))-r; }
    float sdFacetedSlab(vec3 p,vec3 b,float r,float cut){
      float d=sdRoundBox(p,b,r);
      d=max(d,(abs(p.x)+abs(p.y)-b.x-b.y)*0.7071-cut);
      return d;
    }''',
'faceted helper')

# Architectural intelligence stack: thinner shells, layered lamellae, stronger negative space.
one('float outer=abs(sdRoundBox(a,vec3(0.315,0.410,0.220),0.135))-0.027;',
    'float outer=abs(sdFacetedSlab(a,vec3(0.335,0.400,0.105),0.050,0.040))-0.020;',
    'outer intelligence frame')
one('outer=max(outer,-sdRoundBox(a-vec3(0.23,0.02,0.16),vec3(0.20,0.20,0.13),0.08));',
    'outer=max(outer,-sdRoundBox(a-vec3(0.20,0.02,0.075),vec3(0.18,0.23,0.075),0.050));',
    'outer intelligence opening')
one('float mid=abs(sdRoundBox(b,vec3(0.235,0.315,0.165),0.105))-0.022;',
    'float mid=abs(sdFacetedSlab(b,vec3(0.255,0.305,0.082),0.042,0.032))-0.018;',
    'mid intelligence frame')
one('mid=max(mid,-sdRoundBox(b-vec3(-0.16,-0.02,0.12),vec3(0.13,0.18,0.11),0.07));',
    'mid=max(mid,-sdRoundBox(b-vec3(-0.13,-0.02,0.060),vec3(0.12,0.18,0.065),0.043));',
    'mid intelligence opening')
one('float kernel=sdRoundBox(c,vec3(0.125,0.215,0.105),0.072);',
    'float kernel=sdFacetedSlab(c,vec3(0.135,0.210,0.064),0.036,0.024);',
    'kernel faceting')
one('kernel=max(kernel,-sdRoundBox(c-vec3(0.00,0.015,0.08),vec3(0.052,0.130,0.055),0.035));',
    'kernel=max(kernel,-sdRoundBox(c-vec3(0.00,0.015,0.045),vec3(0.055,0.125,0.042),0.028));',
    'kernel aperture')\nanchor='''      if(kernel<res.x)res=vec2(kernel,4.52);\n\n      vec3 r=q-vec3(0.04,-0.01,0.015);'''
insert='''      if(kernel<res.x)res=vec2(kernel,4.52);

      vec3 l1=q-vec3(0.02,0.00,0.300);
      l1.xy=rot(-0.20+uMotion*detail*0.020*sin(uTime*0.26))*l1.xy;
      float lamella1=sdFacetedSlab(l1,vec3(0.245,0.305,0.014),0.026,0.028);
      lamella1=max(lamella1,-sdRoundBox(l1-vec3(0.095,0.015,0.012),vec3(0.105,0.165,0.020),0.030));
      if(lamella1<res.x)res=vec2(lamella1,4.62);

      vec3 l2=q-vec3(0.00,-0.015,0.245);
      l2.xy=rot(0.11-uMotion*detail*0.018*sin(uTime*0.21+1.2))*l2.xy;
      float lamella2=sdFacetedSlab(l2,vec3(0.205,0.265,0.012),0.024,0.025);
      lamella2=max(lamella2,-sdRoundBox(l2-vec3(-0.075,-0.02,0.010),vec3(0.085,0.145,0.018),0.027));
      if(lamella2<res.x)res=vec2(lamella2,4.66);

      vec3 l3=q-vec3(0.035,0.005,0.195);
      l3.xy=rot(-0.04+uMotion*detail*0.015*sin(uTime*0.18+2.0))*l3.xy;
      float lamella3=sdFacetedSlab(l3,vec3(0.165,0.225,0.010),0.021,0.022);
      if(lamella3<res.x)res=vec2(lamella3,4.70);

      vec3 r=q-vec3(0.04,-0.01,0.015);'''
one(anchor,insert,'intelligence lamellae')

# Replace tubular macro masses with broad faceted plates.
one('float spine=sdRoundBox(s,vec3(0.19,0.81,0.30),0.118);',
    'float spine=sdFacetedSlab(s,vec3(0.285,0.715,0.145),0.055,0.035);',
    'spine plate')
one('spine=max(spine,-sdRoundBox(s-vec3(0.13,0.05,0.25),vec3(0.12,0.39,0.14),0.06));',
    '''spine=max(spine,-sdRoundBox(s-vec3(0.13,0.04,0.105),vec3(0.175,0.405,0.095),0.045));
      spine=max(spine,dot(s.xy,normalize(vec2(0.82,-0.57)))-0.54);''',
    'spine opening/cut')
one('float crownD=sdRoundBox(crown,vec3(0.62,0.165,0.29),0.105);',
    'float crownD=sdFacetedSlab(crown,vec3(0.585,0.205,0.145),0.052,0.038);',
    'crown plate')
one('crownD=max(crownD,-sdRoundBox(crown-vec3(0.31,-0.015,0.24),vec3(0.21,0.11,0.12),0.048));',
    '''crownD=max(crownD,-sdRoundBox(crown-vec3(0.27,-0.02,0.105),vec3(0.22,0.12,0.095),0.040));
      crownD=max(crownD,dot(crown.xy,normalize(vec2(-0.72,0.69)))-0.56);''',
    'crown opening/cut')
one('float keelD=sdRoundBox(keel,vec3(0.57,0.185,0.33),0.112);',
    'float keelD=sdFacetedSlab(keel,vec3(0.555,0.205,0.150),0.052,0.038);',
    'keel plate')
one('keelD=max(keelD,-sdRoundBox(keel-vec3(-0.32,0.0,0.28),vec3(0.18,0.12,0.12),0.045));',
    '''keelD=max(keelD,-sdRoundBox(keel-vec3(-0.28,0.0,0.110),vec3(0.19,0.125,0.095),0.040));
      keelD=max(keelD,dot(keel.xy,normalize(vec2(0.74,0.67)))-0.54);''',
    'keel opening/cut')
one('float finD=sdRoundBox(fin,vec3(0.145,0.48,0.22),0.092);',
    'float finD=sdFacetedSlab(fin,vec3(0.185,0.475,0.125),0.048,0.032);',
    'output fin plate')
one('float upperD=sdRoundBox(upper,vec3(0.39,0.105,0.060),0.058);',
    'float upperD=sdFacetedSlab(upper,vec3(0.405,0.125,0.045),0.034,0.025);',
    'upper front plate')
one('float lowerD=sdRoundBox(lower,vec3(0.42,0.11,0.066),0.060);',
    'float lowerD=sdFacetedSlab(lower,vec3(0.430,0.130,0.050),0.034,0.026);',
    'lower front plate')
one('float bridgeD=sdRoundBox(bridge,vec3(0.105,0.42,0.10),0.070);',
    'float bridgeD=sdFacetedSlab(bridge,vec3(0.125,0.365,0.070),0.040,0.025);',
    'bridge plate')
one('float sailD=sdRoundBox(sail,vec3(0.34,0.48,0.055),0.075);',
    'float sailD=sdFacetedSlab(sail,vec3(0.385,0.500,0.040),0.040,0.034);',
    'rear sail plate')
one('float brandD=sdRoundBox(brand,vec3(0.235,0.062,0.030),0.032);',
    'float brandD=sdFacetedSlab(brand,vec3(0.250,0.068,0.026),0.022,0.016);',
    'brand plate')
one('float rearD=sdRoundBox(rear,vec3(0.46,0.46,0.055),0.070);',
    'float rearD=sdFacetedSlab(rear,vec3(0.480,0.470,0.036),0.036,0.034);',
    'rear depth plate')
one('float jawD=sdRoundBox(jaw,vec3(0.22,0.095,0.17),0.060);',
    'float jawD=sdFacetedSlab(jaw,vec3(0.235,0.110,0.105),0.038,0.026);',
    'jaw plate')

# Aperture becomes a smoked vertical window rather than another rounded component.
one('float glass=sdRoundBox(glassQ,vec3(0.205,0.255,0.024),0.055);',
    'float glass=sdFacetedSlab(glassQ,vec3(0.190,0.285,0.018),0.030,0.025);',
    'smoked aperture plate')

# More assertive physical base, still low-profile.
one('float platform=sdRoundBox(platformP,vec3(0.78,0.060,0.52),0.060);',
    'float platform=sdFacetedSlab(platformP,vec3(0.80,0.055,0.50),0.040,0.035);',
    'platform receiver')
one('float platformTopD=sdRoundBox(platformTop,vec3(0.57,0.018,0.36),0.035);',
    'float platformTopD=sdFacetedSlab(platformTop,vec3(0.60,0.018,0.35),0.025,0.025);',
    'platform top')

# Brighter architectural internal surfaces, still contained by smoked/dark metal shell.
one('return vec3(0.016,0.098,0.120)*(0.82+0.10*ndl)+cyan*(0.075+rim*0.28+filament*0.105+glow*0.042);',
    'return vec3(0.018,0.112,0.136)*(0.84+0.10*ndl)+cyan*(0.090+rim*0.31+filament*0.115+glow*0.050);',
    'kernel material lift')

# Slightly larger signature object on both desktop and mobile; mobile remains separately framed.
one('float focal=mix(2.82,2.42,detailMix());',
    'float focal=mix(3.18,2.56,detailMix());',
    'camera signature framing')

path.write_text(s, encoding='utf-8')
print('Premium Core R2 sculptural third pass applied')
