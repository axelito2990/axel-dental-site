// Language loader + UI glue
const YEAR_EL = document.getElementById('year');
if (YEAR_EL) YEAR_EL.textContent = new Date().getFullYear();

const els = document.querySelectorAll('[data-i18n]');
let translations = {};
let currentLang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

async function loadTranslations(){
  try{
    const res = await fetch('lang.json');
    translations = await res.json();
    applyLang(currentLang);
    bindNav();
  }catch(e){
    console.error('Lang file error', e);
  }
}

function t(path){
  const obj = translations[currentLang] || {};
  return path.split('.').reduce((acc,k)=> (acc && acc[k]) ? acc[k] : null, obj);
}

function applyLang(lang){
  currentLang = lang;
  els.forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (value) {
      if (['INPUT','TEXTAREA'].includes(el.tagName)) {
        el.setAttribute('placeholder', value);
      } else {
        el.textContent = value;
      }
    }
  });
  document.documentElement.lang = lang;
  // Update form default option placeholder
  document.querySelectorAll('select [data-i18n="form.selectDefault"]').forEach(opt=>{
    opt.textContent = t('form.selectDefault');
  });
}

function bindNav(){
  document.getElementById('btn-es')?.addEventListener('click',()=>applyLang('es'));
  document.getElementById('btn-en')?.addEventListener('click',()=>applyLang('en'));
}

// Simple mobile nav toggle (if needed later)
// ...

loadTranslations();
