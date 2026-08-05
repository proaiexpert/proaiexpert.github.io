from pathlib import Path
import re

FILES = {
    Path('contact/index.html'): {
        'lang': 'en',
        'intro': 'For a useful first step, three things are enough: what is happening now, what feels weak, and what you want to improve.',
        'panel_title': 'Request a Private Review',
        'panel_body': 'Share a short description of the business, current website or process, and the main issue. ProAI Expert will review fit, identify the highest-priority starting area, and recommend the next useful step.',
        'panel_boundary': 'This is a no-cost, limited first review—not a complete audit, implementation plan, or free consulting engagement.',
        'group_label': 'Project direction',
        'field_label': 'What best describes the request?',
        'field_hint': 'If the format is still unclear, choose the closest direction — we can define the rest together.',
        'options': [
            ('ai_systems_automation', 'AI Systems & Automation'),
            ('websites_branding', 'Websites & Branding'),
            ('both', 'Both'),
            ('not_sure', 'Not sure yet'),
        ],
        'errors': {
            'honeypot': 'Please refresh the page and try again, or email hello@proai-expert.com directly.',
            'email': 'Please check the email address.',
            'context': 'Please add a little more context — minimum 20 characters.',
            'sending_button': 'Sending…',
            'sending': 'Sending your inquiry…',
            'failed': 'Submission did not complete. Please try again or email hello@proai-expert.com directly.',
        },
    },
    Path('ru/contact/index.html'): {
        'lang': 'ru',
        'intro': 'Для первого шага достаточно трёх вещей: что происходит сейчас, что кажется слабым и что вы хотите улучшить.',
        'panel_title': 'Запросить первичный разбор',
        'panel_body': 'Кратко опишите бизнес, текущий сайт или процесс и главную проблему. ProAI Expert оценит соответствие задачи, определит приоритетное направление и предложит полезный следующий шаг.',
        'panel_boundary': 'Это бесплатный ограниченный первичный разбор, а не полный аудит, готовый план реализации или бесплатная консультационная работа.',
        'group_label': 'Направление проекта',
        'field_label': 'Что ближе к вашему запросу',
        'field_hint': 'Если формат пока неясен, выберите ближайшее направление — остальное определим вместе.',
        'options': [
            ('ai_systems_automation', 'AI-системы и автоматизация'),
            ('websites_branding', 'Сайты и брендинг'),
            ('both', 'Оба направления'),
            ('not_sure', 'Пока не уверен'),
        ],
        'errors': {
            'honeypot': 'Обновите страницу и попробуйте ещё раз, или напишите напрямую на hello@proai-expert.com.',
            'email': 'Проверьте адрес почты.',
            'context': 'Опишите задачу чуть подробнее — минимум 20 символов.',
            'sending_button': 'Отправляем…',
            'sending': 'Отправляем запрос…',
            'failed': 'Отправка не завершилась. Попробуйте ещё раз или напишите напрямую на hello@proai-expert.com.',
        },
    },
}

CSS = '''\n.private-review-context{display:none;margin:0 0 24px;padding:22px 24px 24px;border-radius:24px;border:1px solid rgba(93,226,255,.18);background:linear-gradient(180deg,rgba(93,226,255,.08),rgba(93,226,255,.025));box-shadow:0 20px 54px rgba(0,0,0,.2)}.private-review-context.is-visible{display:block}.private-review-context strong{display:block;margin-bottom:10px;color:var(--ai-cyan);font-size:12px;letter-spacing:2px;text-transform:uppercase}.private-review-context p{color:rgba(255,255,255,.72);font-size:16px;line-height:1.7}.private-review-context .private-review-boundary{margin-top:10px;color:rgba(255,255,255,.5);font-size:13px;line-height:1.6}#project-intake{scroll-margin-top:calc(var(--header-h) + 20px)}\n'''

JS_TEMPLATE = r'''const requestTypeInput=document.getElementById('intent');
const selectedDirectionInput=document.getElementById('selected_direction');
const sourcePageInput=document.getElementById('source_page');
const sourceCtaInput=document.getElementById('source_cta');
const sourceContextInput=document.getElementById('source_context');
const referringUrlInput=document.getElementById('referring_url');
const languageInput=document.getElementById('language');
const directionButtons=document.querySelectorAll('#directionGroup .pill');
const privateReviewContext=document.getElementById('privateReviewContext');
const REQUEST_TYPES=new Set(['private_review','project_inquiry']);
const SOURCE_PAGES=new Set(['homepage','contact']);
const SOURCE_CTAS=new Set(['homepage_hero','homepage_ways_to_start','homepage_final','direct_contact']);
const DIRECTIONS=new Set(['ai_systems_automation','websites_branding','both','not_sure']);
function allowlisted(params,key,allowed,fallback){const value=params.get(key);return value&&allowed.has(value)?value:fallback;}
function boundedIdentifier(value,maxLength){if(!value||value.length>maxLength||!/^[a-z0-9_-]+$/.test(value)){return '';}return value;}
function boundedUrl(value,maxLength){if(!value||value.length>maxLength){return '';}try{const parsed=new URL(value,window.location.origin);return parsed.protocol==='http:'||parsed.protocol==='https:'?parsed.href:'';}catch(error){return '';}}
function setDirection(value){const safeValue=DIRECTIONS.has(value)?value:'not_sure';directionButtons.forEach((button)=>{const active=button.dataset.value===safeValue;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});selectedDirectionInput.value=safeValue;}
const pageParams=new URLSearchParams(window.location.search);
const requestContext={
  intent:allowlisted(pageParams,'intent',REQUEST_TYPES,'project_inquiry'),
  sourcePage:allowlisted(pageParams,'source_page',SOURCE_PAGES,'contact'),
  sourceCta:allowlisted(pageParams,'source_cta',SOURCE_CTAS,'direct_contact'),
  selectedDirection:allowlisted(pageParams,'selected_direction',DIRECTIONS,'not_sure'),
  sourceContext:boundedIdentifier(pageParams.get('source_context'),120),
  referringUrl:boundedUrl(pageParams.get('referring_url'),500),
  language:'__LANG__'
};
requestTypeInput.value=requestContext.intent;
sourcePageInput.value=requestContext.sourcePage;
sourceCtaInput.value=requestContext.sourceCta;
sourceContextInput.value=requestContext.sourceContext;
referringUrlInput.value=requestContext.referringUrl;
languageInput.value=requestContext.language;
setDirection(requestContext.selectedDirection);
if(privateReviewContext){const isPrivateReview=requestContext.intent==='private_review';privateReviewContext.classList.toggle('is-visible',isPrivateReview);privateReviewContext.setAttribute('aria-hidden',String(!isPrivateReview));}
directionButtons.forEach((button)=>{button.addEventListener('click',()=>setDirection(button.dataset.value));});
const contactForm=document.getElementById('contactForm');
const formFeedback=document.getElementById('formFeedback');
const formSuccess=document.getElementById('formSuccess');
const submitButton=contactForm.querySelector('.submit-btn');
const honeypotField=document.getElementById('company_website');
const startedAtField=document.getElementById('form_started_at');
const emailField=document.getElementById('email');
const contextField=document.getElementById('context');
const defaultSubmitLabel=submitButton.textContent;
const EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
startedAtField.value=String(Date.now());
function showFeedback(message,state){formFeedback.textContent=message;formFeedback.className='form-feedback'+(state?' '+state:'');}
function showSuccessState(){contactForm.style.display='none';formSuccess.classList.add('is-visible');showFeedback('','');}
if(pageParams.get('submitted')==='1'){showSuccessState();history.replaceState({},document.title,window.location.pathname+window.location.hash);}
contactForm.addEventListener('submit',async(event)=>{
  event.preventDefault();
  const emailValue=emailField.value.trim();
  const contextValue=contextField.value.trim();
  if(honeypotField.value.trim()!==''){showFeedback('__HONEYPOT__','is-error');return;}
  if(!EMAIL_REGEX.test(emailValue)){showFeedback('__EMAIL__','is-error');emailField.focus();return;}
  if(contextValue.length<20){showFeedback('__CONTEXT__','is-error');contextField.focus();return;}
  submitButton.disabled=true;
  submitButton.setAttribute('aria-busy','true');
  submitButton.textContent='__SENDING_BUTTON__';
  showFeedback('__SENDING__','is-processing');
  const formData=new FormData(contactForm);
  try{
    const response=await fetch(contactForm.action,{method:'POST',headers:{'Accept':'application/json'},body:formData});
    if(!response.ok){throw new Error('Submission failed');}
    contactForm.reset();
    requestTypeInput.value=requestContext.intent;
    sourcePageInput.value=requestContext.sourcePage;
    sourceCtaInput.value=requestContext.sourceCta;
    sourceContextInput.value=requestContext.sourceContext;
    referringUrlInput.value=requestContext.referringUrl;
    languageInput.value=requestContext.language;
    setDirection('not_sure');
    startedAtField.value=String(Date.now());
    showSuccessState();
  }catch(error){
    showFeedback('__FAILED__','is-error');
    submitButton.disabled=false;
    submitButton.removeAttribute('aria-busy');
    submitButton.textContent=defaultSubmitLabel;
  }
});
'''

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected 1 match, found {count}')
    return text.replace(old, new, 1)

for path, cfg in FILES.items():
    text = path.read_text(encoding='utf-8')

    css_anchor = '.form-success{display:none'
    if '.private-review-context{' not in text:
        idx = text.index(css_anchor)
        text = text[:idx] + CSS + text[idx:]

    intro_marker = f'<p class="form-intro">{cfg["intro"]}</p>'
    panel = (
        intro_marker
        + f'<aside aria-hidden="true" class="private-review-context" id="privateReviewContext" aria-labelledby="privateReviewTitle">'
        + f'<strong id="privateReviewTitle">{cfg["panel_title"]}</strong>'
        + f'<p>{cfg["panel_body"]}</p>'
        + f'<p class="private-review-boundary">{cfg["panel_boundary"]}</p>'
        + '</aside>'
    )
    text = replace_once(text, intro_marker, panel, f'{path}: private review panel')

    field_start = text.index('<div class="field"><label>' + cfg['field_label'] + '</label>')
    field_end = text.index('<div class="field"><label for="context">', field_start)
    buttons = []
    for value, label in cfg['options']:
        active = value == 'not_sure'
        classes = 'pill is-active' if active else 'pill'
        buttons.append(
            f'<button aria-pressed="{str(active).lower()}" class="{classes}" data-value="{value}" type="button">{label}</button>'
        )
    direction_field = (
        f'<div class="field"><label>{cfg["field_label"]}</label>'
        f'<div class="input-hint">{cfg["field_hint"]}</div>'
        f'<div aria-label="{cfg["group_label"]}" class="pill-group" id="directionGroup" role="group">'
        + ''.join(buttons)
        + '</div>'
        + '<input id="intent" name="intent" type="hidden" value="project_inquiry"/>'
        + '<input id="selected_direction" name="selected_direction" type="hidden" value="not_sure"/>'
        + '<input id="source_page" name="source_page" type="hidden" value="contact"/>'
        + '<input id="source_cta" name="source_cta" type="hidden" value="direct_contact"/>'
        + '<input id="source_context" name="source_context" type="hidden" value=""/>'
        + '<input id="referring_url" name="referring_url" type="hidden" value=""/>'
        + f'<input id="language" name="language" type="hidden" value="{cfg["lang"]}"/>'
        + '</div>'
    )
    text = text[:field_start] + direction_field + text[field_end:]

    js_start = text.index("const intentInput=document.getElementById('intent');")
    js_end = text.index('</script>\n<script id="mobile-header-global-fix-script">', js_start)
    js = JS_TEMPLATE.replace('__LANG__', cfg['lang'])
    for key, placeholder in [
        ('honeypot','__HONEYPOT__'),('email','__EMAIL__'),('context','__CONTEXT__'),
        ('sending_button','__SENDING_BUTTON__'),('sending','__SENDING__'),('failed','__FAILED__')
    ]:
        js = js.replace(placeholder, cfg['errors'][key].replace("'", "\\'"))
    text = text[:js_start] + js + text[js_end:]

    if 'innerHTML' in text:
        raise RuntimeError(f'{path}: innerHTML found')
    for required in [
        'name="intent"', 'name="selected_direction"', 'name="source_page"',
        'name="source_cta"', 'name="source_context"', 'name="referring_url"',
        'name="language"', 'https://formspree.io/f/xbdakqoz'
    ]:
        if required not in text:
            raise RuntimeError(f'{path}: missing {required}')
    path.write_text(text, encoding='utf-8')
    print(f'patched {path}')
