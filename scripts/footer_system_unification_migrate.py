from pathlib import Path
import re, yaml
ROOT=Path(__file__).resolve().parents[1]

def read(p): return p.read_text(encoding='utf-8')
def write(p,t): p.parent.mkdir(parents=True,exist_ok=True); p.write_text(t,encoding='utf-8')

# Central social/contact data
social_path=ROOT/'_data/social-links.yml'
social=yaml.safe_load(read(social_path))
for lang in ('en','ru'):
    social.setdefault('by_language',{}).setdefault(lang,[])
    if 'telegram' not in social['by_language'][lang]: social['by_language'][lang].append('telegram')
    social.setdefault('contact_by_language',{}).setdefault(lang,[])
    if 'telegram' not in social['contact_by_language'][lang]: social['contact_by_language'][lang].append('telegram')
write(social_path,yaml.safe_dump(social,sort_keys=False,allow_unicode=True,width=1000))

write(ROOT/'_includes/footer-system/contact-links.html',"""{% assign footer_lang = include.lang | default: 'en' %}
{% assign social_data = site.data['social-links'] %}
<a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a>
{% assign contact_keys = social_data.contact_by_language[footer_lang] %}
{% for social_key in contact_keys %}
  {% assign social = social_data.profiles[social_key] %}
  {% if social and social.href %}
  <a href="{{ social.href }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.labels[footer_lang] }}">{{ social.name }} <span aria-hidden="true">↗</span></a>
  {% endif %}
{% endfor %}
""")

# Commercial centralized contacts
p=ROOT/'_includes/footer-system/commercial.html'; t=read(p)
old='''          <a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a>
          {% if footer_lang == 'ru' %}
          <a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a>
          {% endif %}'''
assert old in t
write(p,t.replace(old,'          {% include footer-system/contact-links.html lang=footer_lang %}',1))

# Portfolio order = contact first, navigation second
p=ROOT/'_includes/footer-system/portfolio.html'; t=read(p)
start=t.index('      <div class="site-footer__details">')
end=t.index('      </div>\n    </div>',start)+len('      </div>')
new='''      <div class="site-footer__details">
        <div class="site-footer__detail-group" role="group" aria-labelledby="site-footer-contact-{{ footer_lang }}-portfolio-{{ footer_variant }}">
          <h3 id="site-footer-contact-{{ footer_lang }}-portfolio-{{ footer_variant }}">{{ footer_copy.contact_title }}</h3>
          {% include footer-system/contact-links.html lang=footer_lang %}
        </div>

        <nav class="site-footer__detail-group site-footer__services" aria-label="{{ portfolio_copy.navigation_title }}">
          <h3>{{ portfolio_copy.navigation_title }}</h3>
          {% if portfolio_copy.show_back %}
          <a href="{{ portfolio_copy.back_href }}">{{ portfolio_copy.back_label }}</a>
          {% endif %}
          {% for service in footer_copy.services limit: 2 %}
          <a href="{{ service.href }}">{{ service.label }}</a>
          {% endfor %}
        </nav>
      </div>'''
write(p,t[:start]+new+t[end:])

# Editorial data
fp=ROOT/'_data/footer.yml'; data=yaml.safe_load(read(fp))
data['en']['editorial']={
 'hub':{'eyebrow':'INSIGHTS','title':'Continue from useful context to a practical next step.','summary':'Return to the editorial archive, explore the relevant capability, or begin with a concise description of the business problem.','action_label':'Discuss your project','action_href':'/contact/#project-intake','navigation_title':'Continue reading','show_back':False,'back_label':'All insights','back_href':'/insights/'},
 'article':{'eyebrow':'NEXT STEP','title':'Turn the useful idea into a working decision.','summary':'Use the article as context, review related materials, or describe the current priority so the next step can be scoped clearly.','action_label':'Discuss your project','action_href':'/contact/#project-intake','navigation_title':'Continue','show_back':True,'back_label':'All insights','back_href':'/insights/'}
}
data['ru']['editorial']={
 'hub':{'eyebrow':'МАТЕРИАЛЫ','title':'От полезного контекста — к практичному следующему шагу.','summary':'Вернитесь к архиву материалов, изучите подходящее направление или начните с краткого описания бизнес-задачи.','action_label':'Обсудить проект','action_href':'/ru/contact/#project-intake','navigation_title':'Продолжить чтение','show_back':False,'back_label':'Все материалы','back_href':'/ru/insights/'},
 'article':{'eyebrow':'СЛЕДУЮЩИЙ ШАГ','title':'Превратим полезную идею в рабочее решение.','summary':'Используйте статью как контекст, откройте связанные материалы или кратко опишите текущий приоритет, чтобы определить следующий этап.','action_label':'Обсудить проект','action_href':'/ru/contact/#project-intake','navigation_title':'Продолжить','show_back':True,'back_label':'Все материалы','back_href':'/ru/insights/'}
}
write(fp,yaml.safe_dump(data,sort_keys=False,allow_unicode=True,width=1000))

# Editorial include and router
write(ROOT/'_includes/footer-system/editorial.html',"""{% assign footer_lang = include.lang | default: 'en' %}
{% assign footer_variant = include.variant | default: 'article' %}
{% assign footer_copy = site.data.footer[footer_lang] %}
{% assign editorial_copy = footer_copy.editorial[footer_variant] %}

<footer class="site-footer site-footer--editorial site-footer--editorial-{{ footer_variant }}" data-footer-family="editorial" data-footer-variant="{{ footer_variant }}">
  <div class="site-footer__shell">
    <div class="site-footer__main">
      <div class="site-footer__cta site-footer__editorial-closing" role="group" aria-labelledby="site-footer-title-{{ footer_lang }}-editorial-{{ footer_variant }}">
        <p class="site-footer__eyebrow">{{ editorial_copy.eyebrow }}</p>
        <h2 id="site-footer-title-{{ footer_lang }}-editorial-{{ footer_variant }}">{{ editorial_copy.title }}</h2>
        <p class="site-footer__summary">{{ editorial_copy.summary }}</p>
        <a class="site-footer__primary-action" href="{{ editorial_copy.action_href }}">{{ editorial_copy.action_label }} <span aria-hidden="true">→</span></a>
      </div>
      <div class="site-footer__details">
        <div class="site-footer__detail-group" role="group" aria-labelledby="site-footer-contact-{{ footer_lang }}-editorial-{{ footer_variant }}">
          <h3 id="site-footer-contact-{{ footer_lang }}-editorial-{{ footer_variant }}">{{ footer_copy.contact_title }}</h3>
          {% include footer-system/contact-links.html lang=footer_lang %}
        </div>
        <nav class="site-footer__detail-group site-footer__services" aria-label="{{ editorial_copy.navigation_title }}">
          <h3>{{ editorial_copy.navigation_title }}</h3>
          {% if editorial_copy.show_back %}<a href="{{ editorial_copy.back_href }}">{{ editorial_copy.back_label }}</a>{% endif %}
          {% for service in footer_copy.services limit: 2 %}<a href="{{ service.href }}">{{ service.label }}</a>{% endfor %}
        </nav>
      </div>
    </div>
    {% include footer-system/brand-zone.html %}
    {% include footer-system/bottom.html lang=footer_lang locale_href=include.locale_href %}
  </div>
</footer>
""")
write(ROOT/'_includes/footer-system/footer.html',"""{% assign footer_family = include.family | default: 'commercial' %}
{% case footer_family %}
  {% when 'portfolio' %}
    {% include footer-system/portfolio.html lang=include.lang variant=include.variant locale_href=include.locale_href %}
  {% when 'editorial' %}
    {% include footer-system/editorial.html lang=include.lang variant=include.variant locale_href=include.locale_href %}
  {% else %}
    {% include footer-system/commercial.html lang=include.lang variant=include.variant locale_href=include.locale_href %}
{% endcase %}
""")

# Homepage uses centralized contacts/social matrix
p=ROOT/'_includes/footer-commercial-v1.html'; t=read(p)
old='''          <a href="mailto:hello@proai-expert.com">hello@proai-expert.com</a>
          {% if footer_lang == 'ru' %}
          <a href="https://t.me/proAiexpert" target="_blank" rel="noopener noreferrer">Telegram <span aria-hidden="true">↗</span></a>
          {% endif %}'''
assert old in t
t=t.replace(old,'          {% include footer-system/contact-links.html lang=footer_lang %}',1)
m=re.search(r'      <nav class="site-footer__socials".*?</nav>',t,re.S); assert m
rep='''      {% assign social_data = site.data['social-links'] %}
      {% assign social_keys = social_data.by_language[footer_lang] %}
      <nav class="site-footer__socials" aria-label="{{ footer_social_label }}">
        {% for social_key in social_keys %}
          {% assign social = social_data.profiles[social_key] %}
          <a href="{{ social.href }}" target="_blank" rel="noopener noreferrer" aria-label="{{ social.labels[footer_lang] }}">{{ social.name }}</a>
        {% endfor %}
      </nav>'''
t=t[:m.start()]+rep+t[m.end():]
write(p,t)

# CSS
p=ROOT/'assets/css/footer-system-v1.css'; t=read(p).rstrip()
append='''

/* Footer System V1 — Editorial family. */
.site-footer--editorial { background:radial-gradient(circle at 28% 0%,rgba(184,182,236,.04),transparent 30%),linear-gradient(180deg,rgba(255,255,255,.009),rgba(255,255,255,.003)); }
.site-footer--editorial .site-footer__summary { max-width:620px; }
.site-footer--editorial .site-footer__brand-zone { min-block-size:clamp(96px,8vw,144px); margin-top:clamp(38px,4.6vw,62px); }
.site-footer--editorial .site-footer__watermark { font-size:clamp(68px,9.6vw,160px); color:rgba(255,255,255,.036); }
@media (min-width:981px) {
  .site-footer--editorial .site-footer__shell { padding-top:clamp(54px,5.7vw,82px); }
  .site-footer--editorial .site-footer__main { grid-template-columns:minmax(0,1.06fr) minmax(360px,.94fr); gap:clamp(50px,5.7vw,86px); }
  .site-footer--editorial .site-footer__cta h2 { max-width:15ch; font-size:clamp(36px,4.1vw,60px); line-height:1; }
}
@media (max-width:700px) {
  .site-footer--editorial .site-footer__cta h2 { max-width:14ch; font-size:clamp(34px,9.8vw,46px); }
  .site-footer--editorial .site-footer__brand-zone { min-block-size:74px; margin-top:32px; }
  .site-footer--editorial .site-footer__watermark { width:100%; max-width:100%; font-size:clamp(38px,11vw,50px); }
}
@media (max-height:540px) and (orientation:landscape) {
  .site-footer--editorial .site-footer__cta h2 { max-width:16ch; font-size:clamp(30px,5.4vw,41px); }
  .site-footer--editorial .site-footer__brand-zone { min-block-size:60px; margin-top:22px; }
  .site-footer--editorial .site-footer__watermark { width:auto; max-width:none; font-size:clamp(44px,8.4vw,64px); }
}
.site-footer--editorial:lang(ru) .site-footer__cta h2 { overflow-wrap:normal; word-break:normal; hyphens:none; }
@media (max-width:700px) { .site-footer--editorial:lang(ru) .site-footer__cta h2 { max-width:100%; font-size:clamp(31px,8.9vw,39px); line-height:1.04; } }
'''
assert 'Footer System V1 — Editorial family.' not in t
write(p,t+append+'\n')

FOOTER_CSS='<link rel="stylesheet" href="/assets/css/footer-system-v1.css?v=20260804.4">'
def add_css(t,path):
    if 'footer-system-v1.css' in t: return t
    m=re.search(r'</head>',t,re.I)
    if not m: raise AssertionError(f'no head close: {path}')
    return t[:m.start()]+FOOTER_CSS+'\n'+t[m.start():]
def lang_switch(t,path):
    pats=[r'class=["\'][^"\']*lang-link[^"\']*["\'][^>]*href=["\']([^"\']+)',r'href=["\']([^"\']+)["\'][^>]*class=["\'][^"\']*lang-link']
    for pat in pats:
        m=re.search(pat,t,re.I)
        if m:return m.group(1)
    raise AssertionError(f'no lang link: {path}')
def migrate_static(path,lang):
    t=read(path)
    if re.search(r'http-equiv=["\']refresh',t,re.I): return False
    if '<footer' not in t: return False
    locale=lang_switch(t,path)
    inc=f'{{% include footer-system/footer.html family="editorial" lang="{lang}" variant="article" locale_href="{locale}" %}}'
    t,n=re.subn(r'<footer\b.*?</footer>',inc,t,count=1,flags=re.S|re.I); assert n==1,(path,n)
    t=add_css(t,path)
    if not t.startswith('---'): t='---\nlayout: null\n---\n'+t
    write(path,t); return True

migrated=[]
for p in sorted((ROOT/'insights').rglob('*.html')):
    if p in {ROOT/'insights/index.html',ROOT/'insights/what-happens-after-a-lead-arrives/index.html'}: continue
    if migrate_static(p,'en'): migrated.append(p)
for p in sorted((ROOT/'ru/insights').rglob('*.html')):
    if p in {ROOT/'ru/insights/index.html',ROOT/'ru/insights/chto-proiskhodit-posle-zayavki/index.html'}: continue
    if migrate_static(p,'ru'): migrated.append(p)

# Hub source
for path,lang,locale in [(ROOT/'_includes/lead-hub-en-01.html','en','/ru/insights/'),(ROOT/'_includes/lead-hub-ru-01.html','ru','/insights/')]:
    t=read(path); inc=f'{{% include footer-system/footer.html family="editorial" lang="{lang}" variant="hub" locale_href="{locale}" %}}'
    t,n=re.subn(r'<footer\b.*?</footer>',inc,t,count=1,flags=re.S|re.I); assert n==1,path
    write(path,add_css(t,path))

# Lead-response source chain
for path in [ROOT/'_includes/lead-response-en-01.html',ROOT/'_includes/lead-response-ru-02.html']:
    write(path,add_css(read(path),path))
path=ROOT/'_includes/lead-response-en-07.html'; t=read(path)
t,n=re.subn(r'<footer\b.*?</footer>','{% include footer-system/footer.html family="editorial" lang="en" variant="article" locale_href="/ru/insights/chto-proiskhodit-posle-zayavki/" %}',t,count=1,flags=re.S|re.I); assert n==1
write(path,t)
path=ROOT/'_includes/lead-response-ru-10.html'; t=read(path); pos=t.index('<footer id="contact">')
write(path,t[:pos]+'{% include footer-system/footer.html family="editorial" lang="ru" variant="article" locale_href="/insights/what-happens-after-a-lead-arrives/" %}')
write(ROOT/'_includes/lead-response-ru-11.html','<script src="/mobile-behavior-v123.js"></script><script src="/assets/js/premium-insights-v1.js?v=20260802.5"></script></body></html>')

# Docs contract
for path in [ROOT/'docs/FOOTER_SYSTEM_HANDOFF.md',ROOT/'docs/FOOTER_SYSTEM_SPEC.md']:
    if not path.exists(): continue
    t=read(path).replace('- Telegram: no;','- Telegram: yes;').replace('- no Telegram on EN.','- Telegram is available on EN and RU;').replace('- Telegram on EN;','- unverified or dead social URLs;')
    marker='## User-approved cross-family consistency override (2026-08-04)'
    if marker not in t:
        t=t.rstrip()+f'''\n\n{marker}\n\n- Contact details are the first detail group; related paths/capabilities are the second group in every full footer family.\n- Email and Telegram are rendered in both EN and RU.\n- Social/profile destinations are owned only by `_data/social-links.yml`.\n- VK must be enabled through the same data source after the canonical profile/community URL is verified; a guessed or dead VK link is prohibited.\n- Editorial hubs, article source include chains, and current canonical article outputs use the Editorial Footer family with the same structural brand zone and bottom wordmark treatment.\n'''
    write(path,t)

# Assertions
assert 'telegram' in yaml.safe_load(read(social_path))['by_language']['en']
assert read(ROOT/'_includes/footer-system/portfolio.html').index('site-footer-contact-') < read(ROOT/'_includes/footer-system/portfolio.html').index('site-footer__services')
for path in migrated:
    t=read(path); assert t.startswith('---\nlayout: null\n---\n') and t.count('family="editorial"')==1 and '<footer' not in t and 'footer-system-v1.css' in t
print('MIGRATED',len(migrated))
for p in migrated: print(p.relative_to(ROOT))
