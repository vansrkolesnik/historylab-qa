/* HISTORY LAB — Theme v8.4.2 runtime.
   Chart & Content Recovery. Stability base: Theme v8.4.1. Visual behavior is preserved, but global
   mutation watching and chart work on every click are intentionally removed.
   Page scripts own content. This runtime owns visual state only. */
(function(){
  'use strict';

  const GREEN_RE=/^(bg|text|border)-(emerald|green)-/;
  const RED_RE=/^(bg|text|border)-(rose|red|crimson)-/;
  const SELECTED_RE=/^(?:bg-(?:amber|orange)-(?:500|600|700)|bg-\[#2c4c3e\])$/;
  const ANSWER_CLASS_RE=/^q\d+-btn$/;
  const tokens=el=>el&&el.classList?Array.from(el.classList):[];

  /* Single-choice information controls. These used to change directly to
     bg-white / bg-*-50/100 in page JS. v8.4 makes colour semantic. */
  const CHOICE_FUNCS=new Set([
    'switchTab','switchScienceTab','switchTrypillianTab','switchTool','switchInvention','switchSite','switchStage','switchEconomy',
    'selectGeo','selectCraft','selectGod','selectKing','selectHinduism','setBuddhaStep','selectAshokaHeritage','selectColony',
    'setDeclineTheory','selectCyrus','setRefStep','selectCulture','selectRecipe','selectCimmerian','setWarStep','selectHittite',
    'setDominoStep','setCityFeature','setHousing','filterRegion','filterSites','setScythGroup','setVarnaGroup','selectPectoralTier',
    'showLetter','decodeSymbol'
  ]);
  const PRESERVE_FUNCS=new Set(['selectSocialLevel','showVarnaInfo','showHouseInfo']);
  const DATA_GROUPS=['data-pillar','data-river','data-geo','data-clay','data-city'];
  const PRESERVE_DATA_GROUPS=['data-tier'];

  function handlerName(el){
    if(!el||!el.getAttribute)return '';
    const oc=el.getAttribute('onclick')||'';
    const m=oc.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);
    return m?m[1]:'';
  }
  function dataGroup(el){
    if(!el||!el.hasAttribute)return null;
    for(const a of DATA_GROUPS) if(el.hasAttribute(a)) return {attr:a,preserve:false};
    for(const a of PRESERVE_DATA_GROUPS) if(el.hasAttribute(a)) return {attr:a,preserve:true};
    return null;
  }
  function groupMeta(el){
    const fn=handlerName(el);
    if(CHOICE_FUNCS.has(fn)) return {kind:'fn',key:fn,preserve:false};
    if(PRESERVE_FUNCS.has(fn)) return {kind:'fn',key:fn,preserve:true};
    const dg=dataGroup(el); if(dg) return {kind:'data',key:dg.attr,preserve:dg.preserve};
    return null;
  }
  function groupElements(meta){
    if(!meta)return[];
    if(meta.kind==='data') return Array.from(document.querySelectorAll('['+meta.key+']'));
    return Array.from(document.querySelectorAll('button[onclick]')).filter(b=>handlerName(b)===meta.key);
  }
  function legacyLooksActive(el){
    if(!el||!el.classList)return false;
    if(el.classList.contains('active')||el.classList.contains('is-active')||el.getAttribute('aria-selected')==='true') return true;
    const cls=tokens(el).join(' ');
    return /\bbg-(?:amber|orange|red|rose|emerald|green|teal|cyan|sky|blue|indigo|purple|violet)-(?:500|600|700|800|900|950)\b/.test(cls) ||
      /\bbg-(?:mesoLapis|china-red|qin-red|terracotta-700|copper-700)\b/.test(cls);
  }
  function applyChoiceState(active, meta){
    const group=groupElements(meta); if(!group.length)return;
    group.forEach(el=>{
      el.classList.add(meta.preserve?'hl-v84-preserve-choice':'hl-v84-choice');
      el.classList.remove(meta.preserve?'hl-v84-choice':'hl-v84-preserve-choice');
      const on=el===active;
      el.classList.toggle('is-active',on);
      el.classList.toggle('is-inactive',!on);
      el.setAttribute('aria-pressed',on?'true':'false');
    });
  }
  function markChoiceGroups(){
    const seen=new Set();
    const candidates=Array.from(document.querySelectorAll('button[onclick],button[data-pillar],button[data-river],button[data-geo],button[data-clay],button[data-city],[data-tier]'));
    candidates.forEach(el=>{
      const meta=groupMeta(el); if(!meta)return;
      const id=meta.kind+':'+meta.key; if(seen.has(id))return; seen.add(id);
      const group=groupElements(meta); if(!group.length)return;
      const active=group.find(legacyLooksActive)||group[0];
      applyChoiceState(active,meta);
    });
  }

  function isAnswerButton(el){
    if(!el||el.nodeType!==1||el.tagName!=='BUTTON') return false;
    const t=tokens(el), oc=el.getAttribute('onclick')||'', label=(el.textContent||'').trim();
    if(/^checkQuiz\s*\(\s*\)\s*;?$/i.test(oc)) return false;
    if(/^(Перевірити(?:\s+відповіді)?|Спробувати ще раз|Пройти ще раз|Почати знову|Повторити тест)/i.test(label)) return false;
    return t.includes('quiz-opt')||t.includes('q-btn')||t.some(c=>ANSWER_CLASS_RE.test(c))||
      el.classList.contains('hl-v84-quiz-option')||/\b(checkAnswer|checkQuiz)\s*\(/.test(oc);
  }
  function addQuizTitleIcon(title){
    if(!title||title.querySelector('.hl-quiz-title-icon'))return;
    const icon=document.createElement('span');
    icon.className='hl-icon hl-icon--quiz hl-quiz-title-icon';
    icon.setAttribute('aria-hidden','true');
    title.insertBefore(icon,title.firstChild);
  }
  function quizShells(root=document){
    const scope=root&&root.querySelectorAll?root:document;
    return Array.from(scope.querySelectorAll('section#quiz,section#quiz-section,section#sec-quiz,section#test,.quiz-shell')).filter((el,i,a)=>a.indexOf(el)===i);
  }
  function questionCardForControl(control,shell){
    if(!control||!shell)return null;
    let group=control.parentElement;
    if(!group||group===shell)return null;
    let q=group.parentElement;
    if(!q||q===shell)return null;
    if(!shell.contains(q))return null;
    return q;
  }
  function markQuizShell(root=document){
    quizShells(root).forEach(shell=>{
      shell.classList.add('hl-quiz-shell');

      const title=Array.from(shell.querySelectorAll('h2,h3')).find(h=>{
        const t=(h.textContent||'').trim();
        return t==='Перевірка знань';
      });
      if(title){
        title.classList.add('hl-quiz-title');
        addQuizTitleIcon(title);
        const titleWrap=title.parentElement;
        if(titleWrap&&titleWrap!==shell){
          titleWrap.classList.add('hl-quiz-title-wrap');
          Array.from(titleWrap.children).forEach(el=>{
            if(el===title)return;
            const t=(el.textContent||'').trim();
            if(!t)return;
            if(/^Твій результат\s*:/i.test(t)) el.classList.add('hl-quiz-score');
            else if(el.matches('p') && !el.querySelector('button,input,label')) el.classList.add('hl-quiz-subtitle');
            else if(el.matches('span,div') && !el.querySelector('button,input,label')) el.classList.add('hl-quiz-legacy-marker');
          });
          let head=titleWrap;
          while(head.parentElement&&head.parentElement!==shell) head=head.parentElement;
          if(head&&head!==shell) head.classList.add('hl-quiz-head');
        }else if(title.parentElement===shell){
          title.classList.add('hl-quiz-title--direct');
          const intro=title.nextElementSibling;
          if(intro&&intro.matches&&intro.matches('p')&&!intro.querySelector('button,input,label')) intro.classList.add('hl-quiz-subtitle');
        }
      }

      shell.querySelectorAll('p,div,span,strong').forEach(el=>{
        const t=(el.textContent||'').trim();
        if(/^Твій результат\s*:/i.test(t) && el.children.length<=2) el.classList.add('hl-quiz-score');
      });
      /* Stage 5.1C.3C.3.1 — keep one score capsule per status row.
         Legacy markup often contains a text span "Твій результат:" inside
         the score container; do not style that child as a second capsule. */
      shell.querySelectorAll('.hl-quiz-score .hl-quiz-score').forEach(el=>el.classList.remove('hl-quiz-score'));

      const cards=new Set();
      shell.querySelectorAll('.quiz-q,.quiz-q-box,.hl-v84-quiz-question').forEach(q=>cards.add(q));

      shell.querySelectorAll('button').forEach(btn=>{
        if(!isAnswerButton(btn))return;
        btn.classList.add('hl-quiz-option');
        const q=questionCardForControl(btn,shell);
        if(q)cards.add(q);
      });
      shell.querySelectorAll('label').forEach(label=>{
        const radio=label.querySelector('input[type="radio"]');
        if(!radio)return;
        label.classList.add('hl-quiz-option');
        radio.classList.add('hl-quiz-radio');
        const q=questionCardForControl(label,shell);
        if(q)cards.add(q);
      });

      cards.forEach(card=>{
        card.classList.add('hl-quiz-card');
        const direct=Array.from(card.children);
        const question=direct.find(el=>el.matches&&el.matches('p,h3,h4')&&(el.textContent||'').trim());
        if(question)question.classList.add('hl-quiz-question-text');

        const group=direct.find(el=>{
          if(!el.querySelectorAll)return false;
          const options=Array.from(el.querySelectorAll(':scope > button,:scope > label')).filter(c=>
            c.classList.contains('hl-quiz-option') || c.querySelector?.('input[type="radio"]')
          );
          return options.length>=2;
        });
        if(group)group.classList.add('hl-quiz-options');
      });

      if(cards.size){
        let body=null;
        const arr=Array.from(cards);
        if(arr.length===1) body=arr[0].parentElement;
        else{
          let candidate=arr[0].parentElement;
          while(candidate&&candidate!==shell&&!arr.every(c=>candidate.contains(c))) candidate=candidate.parentElement;
          body=candidate&&candidate!==shell?candidate:null;
        }
        if(body)body.classList.add('hl-quiz-body');
      }

      shell.querySelectorAll('.quiz-feedback,.quiz-exp,.hl-v84-quiz-feedback,[id*="feedback" i]').forEach(el=>el.classList.add('hl-quiz-feedback'));
      shell.querySelectorAll('[id*="quiz-final" i],[id="quiz-result"],[id="test-result"],[id="quizResult"]').forEach(el=>el.classList.add('hl-quiz-result'));

      shell.querySelectorAll('button').forEach(btn=>{
        const label=(btn.textContent||'').trim();
        if(/^Перевірити(?:\s+відповіді)?$/i.test(label)) btn.classList.add('hl-quiz-submit');
        if(/^(Спробувати ще раз|Пройти ще раз|Почати знову|Повторити тест|Скинути(?:\s+тест)?)$/i.test(label)) btn.classList.add('hl-quiz-reset');
      });

      /* Stage 5.1C.3C.3 — one concise subtitle across §§1–60.
         Remove accidental subtitle marking from question cards, then reuse an
         existing real intro line or create one next to the quiz title. */
      if(title){
        shell.querySelectorAll('.hl-quiz-card .hl-quiz-subtitle').forEach(el=>el.classList.remove('hl-quiz-subtitle'));
        let subtitle=Array.from(shell.querySelectorAll('.hl-quiz-subtitle')).find(el=>!el.closest('.hl-quiz-card'))||null;
        if(!subtitle){
          subtitle=document.createElement('p');
          subtitle.className='hl-quiz-subtitle';
          title.insertAdjacentElement('afterend',subtitle);
        }
        const lessonMatch=(document.title||'').match(/§\s*(\d+)/);
        subtitle.textContent=lessonMatch?`Перевір свої знання за матеріалом §${lessonMatch[1]}.`:'Перевір свої знання за матеріалом уроку.';
        subtitle.setAttribute('data-hl-quiz-subtitle','normalized');
      }
    });
  }
  function syncQuizState(el){
    if(!el||!el.classList)return;
    const feedback=el.classList.contains('quiz-feedback')||el.classList.contains('quiz-exp')||el.classList.contains('hl-v84-quiz-feedback');
    const answer=isAnswerButton(el); if(!feedback&&!answer)return;
    if(answer)el.classList.add('hl-v84-quiz-option');
    if(feedback)el.classList.add('hl-v84-quiz-feedback');
    const t=tokens(el), correct=t.some(c=>GREEN_RE.test(c)), wrong=t.some(c=>RED_RE.test(c));
    const selected=!correct&&!wrong&&t.some(c=>SELECTED_RE.test(c));
    el.classList.toggle('is-correct',correct&&!wrong);
    el.classList.toggle('is-wrong',wrong&&!correct);
    el.classList.toggle('is-selected',selected);
  }
  function markQuiz(root=document){
    markQuizShell(root);
    root.querySelectorAll('.quiz-q,.quiz-q-box,.hl-quiz-card').forEach(el=>el.classList.add('hl-v84-quiz-question'));
    root.querySelectorAll('button').forEach(b=>{if(isAnswerButton(b))syncQuizState(b)});
    root.querySelectorAll('.quiz-feedback,.quiz-exp,.hl-quiz-feedback').forEach(syncQuizState);
  }

  function markHints(root=document){
    root.querySelectorAll('span,strong,b,p,div').forEach(el=>{
      const txt=(el.textContent||'').trim();
      if(!txt||!/^([💡🧠]\s*)?Підказка\s*:/i.test(txt))return;
      /* Prefer the smallest textual node. For the §10 pyramid hint this is the
         span itself, preventing a whole panel from being recoloured. */
      let box=el;
      if(el.tagName==='DIV'){
        const small=Array.from(el.children).find(ch=>/^(SPAN|P|STRONG|B)$/.test(ch.tagName)&&/^([💡🧠]\s*)?Підказка\s*:/i.test((ch.textContent||'').trim()));
        if(small)box=small;
      }
      box.classList.add('hl-v84-hint');
    });
  }
  function markTables(root=document){root.querySelectorAll('table').forEach(t=>t.classList.add('hl-v84-table'));}

  function refresh(target){
    const box=target&&target.closest?target.closest('.hl-quiz-card,.quiz-q,.quiz-q-box,#quiz,#quiz-section,#sec-quiz,#test,.hl-quiz-shell,.quiz-shell,section'):document;
    if(target&&isAnswerButton(target))syncQuizState(target);
    if(box&&box.querySelectorAll){
      box.querySelectorAll('button').forEach(b=>{if(isAnswerButton(b))syncQuizState(b)});
      box.querySelectorAll('.quiz-feedback,.quiz-exp').forEach(syncQuizState);
      markHints(box);
    }
  }
  function primeChartDefaults(){
    /* v8.4.2 — Chart & Content Recovery
       Lesson scripts own every Chart.js instance. Theme code MUST NOT mutate
       Chart.instances or call chart.update(), because doing so after responsive
       charts are constructed can leave a correctly-sized but blank canvas.
       Pages already set History Lab chart defaults before chart construction;
       this is only a safe fallback for pages that do not. */
    if(!window.Chart)return;
    try{
      Chart.defaults.color='#cbd5e1';
      Chart.defaults.borderColor='rgba(148,163,184,.24)';
    }catch(_e){}
  }

  function chartRecoveryNotice(){
    /* Never replace content. If a Chart.js canvas failed to initialize, show a
       small diagnostic instead of an unexplained empty teaching block. */
    document.querySelectorAll('canvas[id*="chart" i]').forEach(canvas=>{
      if(canvas.dataset.hlV842Checked==='1')return;
      canvas.dataset.hlV842Checked='1';
      let ok=false;
      try{ok=!!(window.Chart&&Chart.getChart&&Chart.getChart(canvas));}catch(_e){}
      if(ok)return;
      const note=document.createElement('div');
      note.className='hl-v842-chart-fallback';
      note.setAttribute('role','status');
      note.textContent=window.Chart
        ? 'Діаграма не ініціалізувалася. Оновіть сторінку; навчальний текст нижче залишається доступним.'
        : 'Не вдалося завантажити локальний модуль діаграм. Оновіть сторінку; навчальний текст залишається доступним.';
      canvas.insertAdjacentElement('afterend',note);
    });
  }


  function feedbackState(el){
    if(!el||!el.classList)return '';
    const cls=tokens(el).join(' ');
    if(/\b(?:bg|border|text)-(?:emerald|green)-/.test(cls))return 'success';
    if(/\b(?:bg|border|text)-(?:rose|red)-/.test(cls))return 'error';
    if(/\b(?:bg|border|text)-(?:amber|yellow|orange)-/.test(cls))return 'warning';
    return '';
  }
  function syncFeedback(el){
    if(!el||el.nodeType!==1)return;
    const id=(el.id||'').toLowerCase();
    const isCandidate=el.matches?.('.quiz-feedback,.quiz-exp,#smelt-result,[id*="result" i],[id*="feedback" i],[id*="message" i]');
    if(!isCandidate)return;
    const state=feedbackState(el);
    if(!state)return;
    el.classList.add('hl-v84-feedback');
    el.classList.toggle('is-success',state==='success');
    el.classList.toggle('is-warning',state==='warning');
    el.classList.toggle('is-error',state==='error');
    if(!el.hasAttribute('role'))el.setAttribute('role','status');
    if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite');
  }
  function markFeedback(root=document){
    if(root.nodeType===1)syncFeedback(root);
    root.querySelectorAll?.('.quiz-feedback,.quiz-exp,#smelt-result,[id*="result" i],[id*="feedback" i],[id*="message" i]').forEach(syncFeedback);
  }



  function localRoot(target){
    if(!target||!target.closest)return document;
    return target.closest('.hl-quiz-card,.quiz-q,.quiz-q-box,#quiz,#quiz-section,#sec-quiz,.hl-quiz-shell,.quiz-shell,#game-container,section,main')||document;
  }
  function refreshLocal(target){
    refresh(target);
    markFeedback(localRoot(target));
  }

  function init(){
    if(document.body){
      document.body.classList.add('hl-v84','hl-v842');
      document.body.classList.remove('hl-v841');
      document.body.classList.remove('hl-v82');
    }
    markQuiz();markChoiceGroups();markHints();markTables();markFeedback();

    /* v8.4.2: chart instances are read-only from the theme layer. */
    primeChartDefaults();
    window.addEventListener('load',()=>{
      /* A single native resize lets Chart.js finish responsive sizing without
         rewriting datasets/options or forcing update() from theme code. */
      setTimeout(()=>{
        try{window.dispatchEvent(new Event('resize'));}catch(_e){}
        setTimeout(chartRecoveryNotice,500);
      },180);
    },{once:true});

    /* No MutationObserver here. v8.4 watched every class mutation in the full
       document; highly interactive lessons could generate cascades of extra
       work. We instead refresh only the control's nearest teaching block. */
    document.addEventListener('click',ev=>{
      const target=ev.target&&ev.target.closest?ev.target.closest('button,[role="button"],[data-tier]'):null;
      if(!target)return;
      const meta=groupMeta(target);
      if(meta)applyChoiceState(target,meta);
      refreshLocal(target);
      /* One bounded post-handler pass catches legacy className rewrites. */
      setTimeout(()=>{
        if(meta)applyChoiceState(target,meta);
        refreshLocal(target);
      },0);
    },false);
    document.addEventListener('change',ev=>{
      setTimeout(()=>refreshLocal(ev.target),0);
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* Stage 4.0C — Secondary Navigation Active-State Coverage Fix
   Apply the same scroll/click active state to every lesson .hl-secondary-nav,
   whether it lives inside the hero/header or in a standalone sticky shell. */
(function () {
  function getTarget(link) {
    var href = link && link.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return null;
    try { return document.querySelector(href); }
    catch (e) { return null; }
  }

  function initHistoryLabSecondaryNav() {
    document.querySelectorAll('.hl-secondary-nav').forEach(function (nav) {
      var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
      var contentLinks = links.filter(function (link) { return !!getTarget(link); });
      if (!contentLinks.length) return;

      function setActive(link) {
        contentLinks.forEach(function (item) {
          var active = item === link;
          item.classList.toggle('is-active', active);
          if (active) item.setAttribute('aria-current', 'true');
          else item.removeAttribute('aria-current');
        });
        if (window.historyLabRevealNavItem) window.historyLabRevealNavItem(link);
      }

      var hashMatch = contentLinks.find(function (link) {
        return window.location.hash && link.getAttribute('href') === window.location.hash;
      });
      var preset = contentLinks.find(function (link) {
        return link.classList.contains('is-active') || link.getAttribute('aria-current') === 'true';
      });
      setActive(hashMatch || preset || contentLinks[0]);

      contentLinks.forEach(function (link) {
        link.addEventListener('click', function () { setActive(link); });
      });

      window.addEventListener('hashchange', function () {
        var match = contentLinks.find(function (link) {
          return link.getAttribute('href') === window.location.hash;
        });
        if (match) setActive(match);
      });

      if ('IntersectionObserver' in window) {
        var targets = contentLinks.map(getTarget).filter(Boolean);
        var observer = new IntersectionObserver(function (entries) {
          var visible = entries.filter(function (entry) { return entry.isIntersecting; })
            .sort(function (a, b) {
              if (b.intersectionRatio !== a.intersectionRatio) return b.intersectionRatio - a.intersectionRatio;
              return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
            });
          if (!visible.length) return;
          var id = visible[0].target.id;
          var match = contentLinks.find(function (link) { return link.getAttribute('href') === '#' + id; });
          if (match) setActive(match);
        }, { rootMargin: '-18% 0px -66% 0px', threshold: [0.01, 0.2, 0.5] });
        targets.forEach(function (target) { observer.observe(target); });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHistoryLabSecondaryNav, { once: true });
  else initHistoryLabSecondaryNav();
})();


/* Stage 2.2E.3 — keep active items visible and normalize tab-to-content movement. */
(function () {
  function prefersReducedMotion(){
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  window.historyLabRevealNavItem = function(item){
    if(!item || !item.closest) return;
    var scroller=item.closest('.hl-secondary-nav');
    if(!scroller || scroller.scrollWidth<=scroller.clientWidth+2) return;
    var left=item.offsetLeft-(scroller.clientWidth-item.offsetWidth)/2;
    scroller.scrollTo({left:Math.max(0,left),behavior:prefersReducedMotion()?'auto':'smooth'});
  };
  function init(){
    document.querySelectorAll('.hl-secondary-nav').forEach(function(nav){
      nav.addEventListener('click',function(ev){
        var item=ev.target.closest('a,button');
        if(!item || !nav.contains(item)) return;
        setTimeout(function(){window.historyLabRevealNavItem(item);},0);
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
/* Stage 2.3C — Content Icon Harmonization */
(function () {
  /* Only recurring semantic/UI-like symbols belong here. Historical objects,
     animals, ritual symbols and playful decorative emoji remain native. */
  var iconMap = {
    '💡':'idea',
    '🎉':'star',
    '👍':'check',
    '🏆':'star',
    '🌟':'star',
    '🔄':'repeat',
    '✅':'check',
    '❌':'close',
    '📊':'chart',
    '📍':'pin',
    '📌':'pin',
    '⚠️':'warning',
    '⚠':'warning',
    '🔍':'search',
    '🎯':'quiz',
    '⚗️':'science',
    '⚗':'science',
    '👑':'crown',
    '📜':'writing',
    '⚖️':'law',
    '⚖':'law',
    '📖':'book',
    '📚':'book',
    '📇':'book',
    '🌊':'water',
    '🌾':'wheat',
    '🏠':'dwelling',
    '🏙️':'city',
    '🏙':'city',
    '🗺️':'map',
    '🗺':'map',
    '✍️':'writing',
    '✍':'writing',
    '📐':'science',
    '⚒️':'tools',
    '⚒':'tools',
    '🔨':'tools',
    '⛏️':'tools',
    '⛏':'tools',
    '👥':'people',
    '💰':'trade',
    '🎨':'culture',
    '🎶':'music',
    '🎺':'music',
    '🏰':'fortress',
    '🛡️':'shield',
    '🛡':'shield',
    '⚔️':'war',
    '⚔':'war',
    '🗡️':'war',
    '🗡':'war',
    '🔥':'fire',
    '🏛️':'state',
    '🏛':'state',
    '💧':'water',
    '✒️':'writing',
    '✒':'writing',
    '⚙️':'tools',
    '⚙':'tools',
    '🏫':'school',
    '🌍':'map',
    '📈':'chart',
    '📏':'science',
    '⛵':'ship',
    '📦':'trade',
    '🌡️':'science',
    '🌡':'science',
    '🧭':'map',
    '🏗️':'tools',
    '🏗':'tools',
    '📝':'writing',
    '📄':'writing',
    '🔬':'science',
    '🧮':'science'
  };
  var keys = Object.keys(iconMap).sort(function(a,b){ return b.length-a.length; });
  var skipSelector = 'script,style,textarea,option,code,pre,.hl-icon,.hl-keep-emoji';

  function hasMappedSymbol(text){
    if(!text) return false;
    for(var i=0;i<keys.length;i++) if(text.indexOf(keys[i])!==-1) return true;
    return false;
  }
  function makeIcon(type){
    var span=document.createElement('span');
    span.className='hl-icon hl-content-icon hl-icon--'+type;
    span.setAttribute('aria-hidden','true');
    return span;
  }
  function iconizeTextNode(node){
    if(!node || node.nodeType!==3 || !hasMappedSymbol(node.nodeValue)) return;
    var parent=node.parentElement;
    if(!parent || parent.closest(skipSelector)) return;
    var text=node.nodeValue;
    var frag=document.createDocumentFragment();
    var pos=0;
    while(pos<text.length){
      var bestIndex=-1, bestKey='';
      for(var i=0;i<keys.length;i++){
        var idx=text.indexOf(keys[i],pos);
        if(idx!==-1 && (bestIndex===-1 || idx<bestIndex || (idx===bestIndex && keys[i].length>bestKey.length))){
          bestIndex=idx; bestKey=keys[i];
        }
      }
      if(bestIndex===-1){ frag.appendChild(document.createTextNode(text.slice(pos))); break; }
      if(bestIndex>pos) frag.appendChild(document.createTextNode(text.slice(pos,bestIndex)));
      frag.appendChild(makeIcon(iconMap[bestKey]));
      pos=bestIndex+bestKey.length;
    }
    node.replaceWith(frag);
  }
  function scan(root){
    if(!root) return;
    if(root.nodeType===3){ iconizeTextNode(root); return; }
    if(root.nodeType!==1 && root.nodeType!==9 && root.nodeType!==11) return;
    if(root.nodeType===1 && root.matches && root.matches(skipSelector)) return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var nodes=[];
    while(walker.nextNode()) if(hasMappedSymbol(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    nodes.forEach(iconizeTextNode);
  }
  function init(){
    scan(document.body);
    /* Observe only new/changed text, never attributes/classes. This keeps the
       layer light while also covering interactive content rendered later. */
    var observer=new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        if(m.type==='characterData') iconizeTextNode(m.target);
        if(m.type==='childList') Array.prototype.forEach.call(m.addedNodes,function(n){ scan(n); });
      });
    });
    if(document.body) observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.historyLabContentIconObserver=observer;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();


/* Stage 2.4B — Feedback, Result & Reset Behavior
   Keeps lesson-specific scoring logic intact, but normalizes the learner-facing
   behavior around progress, feedback, final result, and retake. */
(function(){
  'use strict';
  const SHELL_SELECTOR='section#quiz,section#quiz-section,section#sec-quiz,.quiz-shell,.hl-quiz-shell';
  const RESET_RE=/^(Спробувати ще раз|Пройти ще раз|Почати знову|Повторити тест)$/i;
  const SUBMIT_RE=/^Перевірити(?:\s+відповіді)?$/i;

  function shells(root=document){
    const scope=root&&root.querySelectorAll?root:document;
    return Array.from(scope.querySelectorAll(SHELL_SELECTOR)).filter((el,i,a)=>a.indexOf(el)===i);
  }
  function isVisible(el){
    if(!el||!el.isConnected)return false;
    if(el.classList&&el.classList.contains('hidden'))return false;
    try{return getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';}catch(_e){return true;}
  }
  function cards(shell){return Array.from(shell.querySelectorAll('.hl-quiz-card'));}
  function radioNames(shell){
    return Array.from(new Set(Array.from(shell.querySelectorAll('input[type="radio"][name]')).map(r=>r.name).filter(Boolean)));
  }
  function totalQuestions(shell){
    const names=radioNames(shell);
    if(names.length)return names.length;
    return cards(shell).length;
  }
  function answerButtons(card){
    return Array.from(card.querySelectorAll('button.hl-quiz-option'));
  }
  function cardAnswered(card){
    if(card.dataset.hlQuizAnswered==='1')return true;
    const opts=answerButtons(card);
    if(opts.some(b=>b.disabled||b.classList.contains('is-selected')||b.classList.contains('is-correct')||b.classList.contains('is-wrong')))return true;
    const group=opts[0]&&opts[0].parentElement;
    if(group&&group.dataset&&group.dataset.answered==='1')return true;
    const fb=card.querySelector('.hl-quiz-feedback,.quiz-feedback,.quiz-exp,.hl-v84-inline-feedback');
    return !!(fb&&isVisible(fb)&&(fb.textContent||'').trim());
  }
  function answeredCount(shell){
    const names=radioNames(shell);
    if(names.length)return names.filter(name=>shell.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`)).length;
    return cards(shell).filter(cardAnswered).length;
  }
  function inferOutcomeFromControl(control){
    if(!control||!control.classList)return '';
    if(control.classList.contains('is-correct'))return 'correct';
    if(control.classList.contains('is-wrong'))return 'wrong';
    const cls=control.className||'';
    if(/(?:bg|border)-(?:emerald|green)-/.test(cls))return 'correct';
    if(/(?:bg|border)-(?:rose|red|crimson)-/.test(cls))return 'wrong';
    return '';
  }
  function ensureFeedback(card,control){
    if(!card||!control)return;
    const existing=Array.from(card.querySelectorAll('.hl-quiz-feedback,.quiz-feedback,.quiz-exp,.hl-v84-inline-feedback'))
      .find(el=>isVisible(el)&&(el.textContent||'').trim());
    if(existing){
      existing.setAttribute('role','status');
      existing.setAttribute('aria-live','polite');
      return;
    }
    let feedback=card.querySelector('.hl-quiz-generated-feedback');
    if(!feedback){
      feedback=document.createElement('div');
      feedback.className='hl-quiz-feedback hl-quiz-generated-feedback';
      feedback.setAttribute('role','status');
      feedback.setAttribute('aria-live','polite');
      const opts=card.querySelector('.hl-quiz-options');
      (opts||card).insertAdjacentElement('afterend',feedback);
    }
    const outcome=inferOutcomeFromControl(control);
    feedback.classList.remove('is-correct','is-wrong','is-neutral');
    if(outcome==='correct'){
      feedback.classList.add('is-correct');
      feedback.textContent='Правильно! Можна переходити до наступного запитання.';
      card.dataset.hlQuizOutcome='correct';
    }else if(outcome==='wrong'){
      feedback.classList.add('is-wrong');
      feedback.textContent='Неправильно. Правильну відповідь виділено зеленим.';
      card.dataset.hlQuizOutcome='wrong';
    }else{
      feedback.classList.add('is-neutral');
      feedback.textContent='Відповідь обрано. Продовжуйте до завершення перевірки.';
    }
  }
  function ensureCorrectButtonVisible(card){
    if(!card)return;
    const opts=answerButtons(card);
    if(!opts.length)return;
    let correct=null;
    if(card.hasAttribute('data-correct')){
      const idx=parseInt(card.getAttribute('data-correct'),10);
      if(Number.isInteger(idx)&&opts[idx])correct=opts[idx];
    }
    if(!correct){
      correct=opts.find(btn=>/\btrue\b/.test(btn.getAttribute('onclick')||''))||null;
    }
    if(correct&&card.dataset.hlQuizOutcome==='wrong')correct.classList.add('is-correct');
  }
  function normalizeScoreElement(el){
    if(!el||el.children.length)return;
    let t=(el.textContent||'').trim();
    if(!t)return;
    let m=t.match(/^(?:Твій|Ваш)\s+результат:\s*(\d+)\s*(?:з|із)\s*(\d+)(?:\s+правильн\w*\s+відповід\w*)?!?$/i);
    if(m){el.textContent=`Результат: ${m[1]} із ${m[2]}`;return;}
    m=t.match(/^(?:Твій|Ваш)\s+результат:\s*(\d+)\s*\/\s*(\d+)!?$/i);
    if(m){el.textContent=`Результат: ${m[1]} із ${m[2]}`;return;}
    if(el.id==='quiz-score'){
      m=t.match(/^(\d+)\s*\/\s*(\d+)$/);
      if(m)el.textContent=`Правильно: ${m[1]} із ${m[2]}`;
    }
  }
  function normalizeScores(shell){
    shell.querySelectorAll('.hl-quiz-score,#scoreText,#quiz-score-text,#quiz-score').forEach(normalizeScoreElement);
  }
  function parseScore(shell,total){
    const selectors=['#scoreText','#quiz-score-text','#quiz-score','#quiz3-summary','#quiz-result','#test-result','#quizResult','.hl-quiz-score','.hl-quiz-result'];
    const seen=new Set();
    for(const sel of selectors){
      for(const el of shell.querySelectorAll(sel)){
        if(seen.has(el))continue;seen.add(el);
        const t=(el.textContent||'').replace(/\s+/g,' ').trim();
        let m=t.match(/(?:Результат|Твій результат|Ваш результат|Правильно)\s*:\s*(\d+)\s*(?:із|з|\/)\s*(\d+)/i);
        if(!m)m=t.match(/\b(\d+)\s*\/\s*(\d+)\b/);
        if(m){
          const score=parseInt(m[1],10), denom=parseInt(m[2],10);
          if(Number.isInteger(score)&&Number.isInteger(denom)&&denom>0)return {score,total:denom};
        }
      }
    }
    const names=radioNames(shell);
    if(names.length&&shell.dataset.hlQuizSubmitted==='1'){
      const score=names.reduce((sum,name)=>{
        const checked=shell.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`);
        return sum+(checked&&checked.value==='1'?1:0);
      },0);
      return {score,total:names.length};
    }
    const qs=cards(shell);
    if(qs.length&&qs.every(q=>q.dataset.hlQuizOutcome==='correct'||q.dataset.hlQuizOutcome==='wrong')){
      return {score:qs.filter(q=>q.dataset.hlQuizOutcome==='correct').length,total:qs.length};
    }
    return total?{score:null,total}:null;
  }
  function ensureProgress(shell){
    let progress=shell.querySelector(':scope .hl-quiz-progress');
    if(progress)return progress;
    progress=document.createElement('div');
    progress.className='hl-quiz-progress';
    progress.setAttribute('role','status');
    progress.setAttribute('aria-live','polite');
    const head=shell.querySelector('.hl-quiz-head');
    if(head)head.insertAdjacentElement('afterend',progress); else shell.prepend(progress);
    return progress;
  }
  function ensureSummary(shell){
    let box=shell.querySelector(':scope .hl-quiz-summary');
    if(box)return box;
    box=document.createElement('div');
    box.className='hl-quiz-summary hidden';
    box.setAttribute('role','status');
    box.setAttribute('aria-live','polite');
    const actions=ensureActions(shell);
    actions.insertAdjacentElement('beforebegin',box);
    return box;
  }
  function ensureActions(shell){
    let actions=shell.querySelector(':scope .hl-quiz-actions');
    if(actions)return actions;
    actions=document.createElement('div');
    actions.className='hl-quiz-actions';
    const reset=document.createElement('button');
    reset.type='button';
    reset.className='hl-quiz-reset hl-quiz-system-reset hidden';
    reset.innerHTML='<span class="hl-icon hl-icon--repeat" aria-hidden="true"></span><span>Спробувати ще раз</span>';
    reset.addEventListener('click',()=>hardReset(shell));
    actions.appendChild(reset);
    shell.appendChild(actions);
    return actions;
  }
  function markLegacyResetButtons(shell){
    shell.querySelectorAll('button').forEach(btn=>{
      if(btn.classList.contains('hl-quiz-system-reset'))return;
      const label=(btn.textContent||'').trim();
      if(RESET_RE.test(label))btn.classList.add('hl-quiz-legacy-reset');
    });
  }
  function hardReset(shell){
    const id=shell.id||'quiz';
    try{history.replaceState(null,'','#'+id);}catch(_e){try{location.hash=id;}catch(_e2){}}
    location.reload();
  }
  function syncRadioReview(shell){
    if(shell.dataset.hlQuizSubmitted!=='1')return;
    radioNames(shell).forEach(name=>{
      const group=Array.from(shell.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`));
      group.forEach(radio=>{
        const label=radio.closest('label.hl-quiz-option')||radio.closest('label');
        if(!label)return;
        label.classList.remove('is-correct','is-wrong','is-selected');
        if(radio.value==='1')label.classList.add('is-correct');
        if(radio.checked&&radio.value!=='1')label.classList.add('is-wrong');
        radio.disabled=true;
      });
    });
  }
  function showSummary(shell,score,total){
    const box=ensureSummary(shell);
    box.classList.remove('hidden','is-success','is-warning','is-error');
    let state='is-warning', note='Добрий результат. Перегляньте пояснення до помилок.';
    if(score===total){state='is-success';note='Відмінно! Усі відповіді правильні.';}
    else if(score/Math.max(total,1)<.6){state='is-error';note='Варто ще раз повторити матеріал і спробувати знову.';}
    box.classList.add(state);
    box.innerHTML=`<div class="hl-quiz-summary-score"><span class="hl-icon hl-icon--quiz" aria-hidden="true"></span><strong>Результат: ${score} із ${total}</strong></div><p>${note}</p>`;
    const reset=ensureActions(shell).querySelector('.hl-quiz-system-reset');
    reset.classList.remove('hidden');
  }
  function hideSummary(shell){
    const box=shell.querySelector(':scope .hl-quiz-summary');
    if(box)box.classList.add('hidden');
    const reset=shell.querySelector(':scope .hl-quiz-system-reset');
    if(reset)reset.classList.add('hidden');
  }
  function syncShell(shell,control){
    if(!shell)return;
    markLegacyResetButtons(shell);
    shell.querySelectorAll('.hl-quiz-feedback,.quiz-feedback,.quiz-exp,.hl-v84-inline-feedback,.hl-quiz-result').forEach(el=>{
      el.setAttribute('role','status');
      el.setAttribute('aria-live','polite');
    });
    if(control&&control.matches&&control.matches('button.hl-quiz-option')){
      const card=control.closest('.hl-quiz-card');
      if(card){
        card.dataset.hlQuizAnswered='1';
        const outcome=inferOutcomeFromControl(control);
        if(outcome)card.dataset.hlQuizOutcome=outcome;
        ensureCorrectButtonVisible(card);
        ensureFeedback(card,control);
      }
    }
    normalizeScores(shell);
    const total=totalQuestions(shell), answered=answeredCount(shell);
    const progress=ensureProgress(shell);
    if(total){
      const current=Math.min(answered,total);
      progress.textContent=`Відповідано ${current} / ${total}`;
      progress.setAttribute('aria-label',`Відповідано ${current} із ${total}`);
      progress.dataset.hlQuizProgress='compact';
    }else{
      progress.textContent='Перевірка знань';
      progress.setAttribute('aria-label','Прогрес перевірки знань');
      delete progress.dataset.hlQuizProgress;
    }
    const complete=total>0 && (shell.dataset.hlQuizSubmitted==='1'||answered>=total);
    if(!complete){hideSummary(shell);return;}
    syncRadioReview(shell);
    normalizeScores(shell);
    const parsed=parseScore(shell,total);
    if(parsed&&Number.isInteger(parsed.score))showSummary(shell,parsed.score,parsed.total||total);
  }
  function init(){
    shells().forEach(shell=>{
      shell.classList.add('hl-quiz-behavior');
      ensureActions(shell);
      markLegacyResetButtons(shell);
      syncShell(shell,null);
    });
    document.addEventListener('click',ev=>{
      const target=ev.target&&ev.target.closest?ev.target.closest('button,label'):null;
      if(!target)return;
      const shell=target.closest&&target.closest(SHELL_SELECTOR);
      if(!shell)return;
      if(target.classList.contains('hl-quiz-system-reset'))return;
      const label=(target.textContent||'').trim();
      if(SUBMIT_RE.test(label))shell.dataset.hlQuizSubmitted='1';
      setTimeout(()=>syncShell(shell,target.matches('button.hl-quiz-option')?target:null),0);
    },false);
    document.addEventListener('change',ev=>{
      const input=ev.target;
      if(!input||!input.matches||!input.matches('input[type="radio"]'))return;
      const shell=input.closest(SHELL_SELECTOR);if(!shell)return;
      setTimeout(()=>syncShell(shell,null),0);
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* Stage 2.4C — Quiz Accessibility & Responsive Audit
   Adds semantics and focus management without changing lesson answers/scoring. */
(function(){
  'use strict';
  const SHELL_SELECTOR='section#quiz,section#quiz-section,section#sec-quiz,section#test,.quiz-shell,.hl-quiz-shell';
  const SUBMIT_RE=/^Перевірити(?:\s+відповіді)?$/i;
  const RESET_RE=/^(Спробувати ще раз|Пройти ще раз|Почати знову|Повторити тест)$/i;
  let uid=0;
  const uniqueId=(prefix)=>`${prefix}-${++uid}`;
  const reduceMotion=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function shells(){
    return Array.from(document.querySelectorAll(SHELL_SELECTOR)).filter((el,i,a)=>a.indexOf(el)===i);
  }
  function quizTitle(shell){
    return shell.querySelector('.hl-quiz-title')||Array.from(shell.querySelectorAll('h2,h3')).find(h=>(h.textContent||'').trim()==='Перевірка знань')||null;
  }
  function cards(shell){return Array.from(shell.querySelectorAll('.hl-quiz-card'));}
  function questionText(card){return card.querySelector('.hl-quiz-question-text')||card.querySelector('h3,h4,p');}
  function optionsGroup(card){return card.querySelector('.hl-quiz-options');}

  function ensureId(el,prefix){
    if(!el)return '';
    if(!el.id)el.id=uniqueId(prefix);
    return el.id;
  }
  function prepareShell(shell,index){
    shell.setAttribute('role','region');
    const title=quizTitle(shell);
    if(title){
      const tid=ensureId(title,`hl-quiz-title-${index+1}`);
      title.setAttribute('tabindex','-1');
      shell.setAttribute('aria-labelledby',tid);
    }else{
      shell.setAttribute('aria-label','Перевірка знань');
    }

    cards(shell).forEach((card,cardIndex)=>{
      const q=questionText(card);
      const qid=ensureId(q,`hl-quiz-q-${index+1}-${cardIndex+1}`);
      const group=optionsGroup(card);
      if(group){
        const hasRadio=!!group.querySelector('input[type="radio"]');
        if(hasRadio){
          card.removeAttribute('role');
          card.removeAttribute('aria-labelledby');
          group.setAttribute('role','radiogroup');
          if(qid)group.setAttribute('aria-labelledby',qid);
        }else{
          card.setAttribute('role','group');
          if(qid)card.setAttribute('aria-labelledby',qid);
          group.removeAttribute('role');
          group.removeAttribute('aria-labelledby');
        }
      }else{
        card.setAttribute('role','group');
        if(qid)card.setAttribute('aria-labelledby',qid);
      }
      card.querySelectorAll('button.hl-quiz-option').forEach(btn=>{
        if(!btn.getAttribute('type'))btn.setAttribute('type','button');
      });
      card.querySelectorAll('input[type="radio"]').forEach((radio,radioIndex)=>{
        ensureId(radio,`hl-quiz-radio-${index+1}-${cardIndex+1}-${radioIndex+1}`);
      });
    });

    shell.querySelectorAll('.hl-quiz-feedback,.quiz-feedback,.quiz-exp,.hl-v84-inline-feedback,.hl-quiz-result,.hl-quiz-summary').forEach((el,i)=>{
      ensureId(el,`hl-quiz-status-${index+1}-${i+1}`);
      el.setAttribute('role','status');
      el.setAttribute('aria-live','polite');
      el.setAttribute('aria-atomic','true');
      if(el.classList.contains('hl-quiz-result')||el.classList.contains('hl-quiz-summary'))el.setAttribute('tabindex','-1');
    });
    const progress=shell.querySelector(':scope .hl-quiz-progress');
    if(progress){
      ensureId(progress,`hl-quiz-progress-${index+1}`);
      progress.setAttribute('role','status');
      progress.setAttribute('aria-live','polite');
      progress.setAttribute('aria-atomic','true');
      progress.setAttribute('aria-label','Прогрес перевірки знань');
    }
    shell.querySelectorAll('.hl-quiz-submit,.hl-quiz-system-reset').forEach(btn=>{
      if(!btn.getAttribute('type'))btn.setAttribute('type','button');
    });
  }

  function stateOf(option){
    if(option.classList.contains('is-correct'))return 'correct';
    if(option.classList.contains('is-wrong'))return 'wrong';
    return '';
  }
  function ensureStateIndicator(option,state){
    let mark=option.querySelector(':scope > .hl-quiz-state-indicator');
    if(!state){if(mark)mark.remove();return;}
    if(!mark){
      mark=document.createElement('span');
      mark.className='hl-quiz-state-indicator';
      mark.setAttribute('aria-hidden','true');
      option.appendChild(mark);
    }
    mark.innerHTML=`<span class="hl-icon hl-icon--${state==='correct'?'check':'close'}" aria-hidden="true"></span>`;
  }
  function connectFeedback(card){
    const feedback=Array.from(card.querySelectorAll('.hl-quiz-feedback,.quiz-feedback,.quiz-exp,.hl-v84-inline-feedback'))
      .find(el=>!el.classList.contains('hidden')&&(el.textContent||'').trim());
    if(!feedback)return;
    const fid=ensureId(feedback,'hl-quiz-feedback');
    feedback.setAttribute('role','status');
    feedback.setAttribute('aria-live','polite');
    feedback.setAttribute('aria-atomic','true');
    card.querySelectorAll('button.hl-quiz-option[data-hl-chosen="1"],button.hl-quiz-option.is-selected,button.hl-quiz-option.is-wrong,input[type="radio"]:checked').forEach(control=>{
      control.setAttribute('aria-describedby',fid);
    });
  }
  function syncStateCues(shell){
    shell.querySelectorAll('.hl-quiz-option').forEach(option=>ensureStateIndicator(option,stateOf(option)));
    cards(shell).forEach(connectFeedback);
    const summary=shell.querySelector(':scope .hl-quiz-summary');
    if(summary){
      summary.setAttribute('role','status');
      summary.setAttribute('aria-live','polite');
      summary.setAttribute('aria-atomic','true');
      summary.setAttribute('tabindex','-1');
    }
    shell.querySelectorAll('.hl-quiz-result').forEach(result=>{
      result.setAttribute('role','status');
      result.setAttribute('aria-live','polite');
      result.setAttribute('aria-atomic','true');
      result.setAttribute('tabindex','-1');
    });
  }
  function focusResult(shell){
    const result=shell.querySelector(':scope .hl-quiz-summary:not(.hidden)')||shell.querySelector('.hl-quiz-result:not(.hidden)');
    if(!result)return;
    try{result.focus({preventScroll:true});}catch(_e){result.focus();}
    try{result.scrollIntoView({block:'nearest',behavior:reduceMotion()?'auto':'smooth'});}catch(_e){}
  }
  function advanceFocusAfterAnswer(shell,button){
    if(!button||!button.classList.contains('hl-quiz-option'))return;
    const active=document.activeElement;
    if(!button.disabled && active===button)return;
    if(active&&active!==document.body&&shell.contains(active)&&active!==button)return;
    const all=cards(shell), current=button.closest('.hl-quiz-card'), start=Math.max(0,all.indexOf(current)+1);
    for(let i=start;i<all.length;i++){
      const next=all[i].querySelector('button.hl-quiz-option:not(:disabled),input[type="radio"]:not(:disabled)');
      if(next){try{next.focus();}catch(_e){}return;}
    }
    focusResult(shell);
  }
  function rememberReset(shell){
    const key=shell.id||'quiz';
    try{sessionStorage.setItem('hlQuizResetFocus',key);}catch(_e){}
  }
  function restoreResetFocus(){
    let key='';
    try{key=sessionStorage.getItem('hlQuizResetFocus')||'';sessionStorage.removeItem('hlQuizResetFocus');}catch(_e){}
    if(!key)return;
    const shell=document.getElementById(key)||shells().find(s=>(s.id||'quiz')===key);
    if(!shell)return;
    const title=quizTitle(shell)||shell;
    if(title===shell&&!shell.hasAttribute('tabindex'))shell.setAttribute('tabindex','-1');
    setTimeout(()=>{
      try{title.focus({preventScroll:true});}catch(_e){try{title.focus();}catch(_e2){}}
      try{title.scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'});}catch(_e){}
    },60);
  }
  function refreshAll(){shells().forEach((shell,i)=>{prepareShell(shell,i);syncStateCues(shell);});}

  function init(){
    refreshAll();
    restoreResetFocus();
    document.addEventListener('click',ev=>{
      const button=ev.target&&ev.target.closest?ev.target.closest('button'):null;
      if(!button)return;
      const shell=button.closest(SHELL_SELECTOR);if(!shell)return;
      const label=(button.textContent||'').replace(/\s+/g,' ').trim();
      if(button.classList.contains('hl-quiz-option')){
        const card=button.closest('.hl-quiz-card');
        if(card)card.querySelectorAll('button.hl-quiz-option').forEach(opt=>opt.removeAttribute('data-hl-chosen'));
        button.setAttribute('data-hl-chosen','1');
      }
      if(button.classList.contains('hl-quiz-system-reset')||RESET_RE.test(label))rememberReset(shell);
      const submit=button.classList.contains('hl-quiz-submit')||SUBMIT_RE.test(label);
      setTimeout(()=>{
        const i=shells().indexOf(shell);prepareShell(shell,Math.max(i,0));syncStateCues(shell);
        if(submit)focusResult(shell);
        else if(button.classList.contains('hl-quiz-option'))advanceFocusAfterAnswer(shell,button);
      },80);
    },true);
    document.addEventListener('change',ev=>{
      const input=ev.target;
      if(!input||!input.matches||!input.matches('input[type="radio"]'))return;
      const shell=input.closest(SHELL_SELECTOR);if(!shell)return;
      setTimeout(()=>{const i=shells().indexOf(shell);prepareShell(shell,Math.max(i,0));syncStateCues(shell);},50);
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* Stage 2.5A — Semantic Structure & Keyboard */
(function(){
  function isNativeControl(el){return !!el && /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName);}
  function activate(el){
    if(!el || el.getAttribute('aria-disabled')==='true')return;
    try{el.click();}catch(_e){}
  }
  function reduceMotion(){return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}

  function enhanceLegacyControls(root){
    (root||document).querySelectorAll('[onclick]').forEach(function(el){
      if(isNativeControl(el))return;
      if(!el.hasAttribute('role'))el.setAttribute('role','button');
      if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
      el.classList.add('hl-keyboard-control');
    });

    (root||document).querySelectorAll('.flip-card[role="button"]').forEach(function(card){
      card.setAttribute('aria-expanded',card.classList.contains('flipped')?'true':'false');
    });

    (root||document).querySelectorAll('button.hl-reveal').forEach(function(btn){
      var target=btn.nextElementSibling;
      if(target)btn.setAttribute('aria-expanded',target.classList.contains('hidden')?'false':'true');
    });
  }

  var TAB_SELECTOR='.tab-btn,.recipe-tab,.sc-tab-btn,.city-tab,.river-tab,.geo-tab,.site-btn';
  function tabGroups(root){
    var seen=[];
    (root||document).querySelectorAll(TAB_SELECTOR).forEach(function(tab){
      var parent=tab.parentElement;if(!parent||seen.indexOf(parent)!==-1)return;
      var tabs=Array.prototype.slice.call(parent.querySelectorAll(':scope > '+TAB_SELECTOR));
      if(tabs.length<2)return;
      seen.push(parent);
      parent.setAttribute('role','tablist');
      var anySelected=tabs.some(function(t){return t.getAttribute('aria-selected')==='true';});
      tabs.forEach(function(t,i){
        t.setAttribute('role','tab');
        if(!t.hasAttribute('type'))t.setAttribute('type','button');
        var selected=t.getAttribute('aria-selected')==='true'||t.classList.contains('is-active')||t.classList.contains('active');
        if(!anySelected && i===0)selected=true;
        t.setAttribute('aria-selected',selected?'true':'false');
        t.setAttribute('tabindex',selected?'0':'-1');
      });
    });
  }
  function selectTab(tab){
    var parent=tab&&tab.parentElement;if(!parent)return;
    var tabs=Array.prototype.slice.call(parent.querySelectorAll(':scope > [role="tab"]'));
    if(!tabs.length)return;
    tabs.forEach(function(t){
      var active=t===tab;
      t.setAttribute('aria-selected',active?'true':'false');
      t.setAttribute('tabindex',active?'0':'-1');
    });
  }

  function syncPressedGroups(root){
    var selectors=['.site-card','.belief-card','.site-filter-btn','.region-btn'];
    selectors.forEach(function(sel){
      var els=Array.prototype.slice.call((root||document).querySelectorAll(sel));
      els.forEach(function(el){
        var active=el.classList.contains('active')||el.classList.contains('is-active');
        el.setAttribute('aria-pressed',active?'true':'false');
      });
    });
  }

  function init(){
    var main=document.querySelector('main');
    if(main){
      if(!main.id)main.id='main-content';
      if(!main.hasAttribute('tabindex'))main.setAttribute('tabindex','-1');
    }
    document.querySelectorAll('nav').forEach(function(nav,i){
      if(!nav.hasAttribute('aria-label')&&!nav.hasAttribute('aria-labelledby')){
        nav.setAttribute('aria-label',i===0?'Основна навігація':'Додаткова навігація');
      }
    });
    document.querySelectorAll('button').forEach(function(btn){if(!btn.hasAttribute('type'))btn.setAttribute('type','button');});
    enhanceLegacyControls(document);
    tabGroups(document);
    syncPressedGroups(document);

    var skip=document.querySelector('.hl-skip-link');
    if(skip&&main){
      skip.addEventListener('click',function(ev){
        ev.preventDefault();
        try{main.focus({preventScroll:true});}catch(_e){try{main.focus();}catch(_e2){}}
        try{main.scrollIntoView({block:'start',behavior:reduceMotion()?'auto':'smooth'});}catch(_e){}
        try{history.replaceState(null,'','#'+main.id);}catch(_e){}
      });
    }

    document.addEventListener('keydown',function(ev){
      var el=ev.target;
      if(!el||!el.matches)return;
      if(el.matches('[role="button"]:not(button):not(a)')&&(ev.key==='Enter'||ev.key===' ')){
        ev.preventDefault();activate(el);return;
      }
      if(el.matches('[role="tab"]')&&['ArrowLeft','ArrowRight','Home','End'].indexOf(ev.key)!==-1){
        var parent=el.parentElement;
        var tabs=parent?Array.prototype.slice.call(parent.querySelectorAll(':scope > [role="tab"]')):[];
        if(!tabs.length)return;
        ev.preventDefault();
        var i=tabs.indexOf(el), next=i;
        if(ev.key==='ArrowRight')next=(i+1)%tabs.length;
        if(ev.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
        if(ev.key==='Home')next=0;
        if(ev.key==='End')next=tabs.length-1;
        tabs[next].focus();activate(tabs[next]);selectTab(tabs[next]);
      }
    },true);

    document.addEventListener('click',function(ev){
      var flip=ev.target&&ev.target.closest?ev.target.closest('.flip-card[role="button"]'):null;
      var reveal=ev.target&&ev.target.closest?ev.target.closest('button.hl-reveal'):null;
      var tab=ev.target&&ev.target.closest?ev.target.closest('[role="tab"]'):null;
      setTimeout(function(){
        if(flip)flip.setAttribute('aria-expanded',flip.classList.contains('flipped')?'true':'false');
        if(reveal){var target=reveal.nextElementSibling;if(target)reveal.setAttribute('aria-expanded',target.classList.contains('hidden')?'false':'true');}
        if(tab)selectTab(tab);
        syncPressedGroups(document);
      },0);
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Content Images Pass 2.1 — Chart & Media Reliability Fix */


/* Stage 3.1D — Section III active-learning mini-games */
(function(){
  function initGame(game){
    if(!game || game.dataset.hlMiniReady==='1')return;
    game.dataset.hlMiniReady='1';
    var rounds=Array.prototype.slice.call(game.querySelectorAll('.hl-s3-mini-round'));
    var scoreEl=game.querySelector('[data-mini-score]');
    var reset=game.querySelector('[data-mini-reset]');
    var score=0, answered=0;
    function update(){
      if(scoreEl)scoreEl.textContent=answered>=rounds.length?('Завершено: '+score+' із '+rounds.length+' правильно'):('Прогрес: '+answered+' / '+rounds.length+' • правильно: '+score);
    }
    rounds.forEach(function(round){
      var choices=Array.prototype.slice.call(round.querySelectorAll('.hl-s3-mini-choice'));
      var feedback=round.querySelector('.hl-s3-mini-feedback');
      choices.forEach(function(btn){
        btn.addEventListener('click',function(){
          if(round.dataset.answered==='1')return;
          round.dataset.answered='1'; answered++;
          var correct=btn.dataset.correct==='1';
          if(correct)score++;
          choices.forEach(function(c){
            c.disabled=true;c.setAttribute('aria-disabled','true');
            if(c.dataset.correct==='1')c.classList.add('is-correct');
          });
          if(!correct)btn.classList.add('is-wrong');
          if(feedback){
            feedback.classList.remove('is-good','is-bad');
            feedback.classList.add(correct?'is-good':'is-bad');
            var explanation=round.getAttribute('data-explanation')||'';
            feedback.textContent=(correct?'Правильно! ':'Не зовсім. ')+explanation;
          }
          update();
        });
      });
    });
    if(reset)reset.addEventListener('click',function(){
      score=0;answered=0;
      rounds.forEach(function(round){
        round.removeAttribute('data-answered');
        round.querySelectorAll('.hl-s3-mini-choice').forEach(function(btn){btn.disabled=false;btn.removeAttribute('aria-disabled');btn.classList.remove('is-correct','is-wrong');});
        var feedback=round.querySelector('.hl-s3-mini-feedback');if(feedback){feedback.textContent='';feedback.classList.remove('is-good','is-bad');}
      });
      update();
      var first=game.querySelector('.hl-s3-mini-choice');if(first)first.focus();
    });
    update();
  }
  function init(){document.querySelectorAll('[data-hl-mini-game]').forEach(initGame);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();


/* Stage 3.1F — reusable learning interactions: Match / Classification / Timeline / Hotspot */
(function(){
  function feedback(root,text,kind){var el=root.querySelector('[data-interaction-feedback]');if(!el)return;el.textContent=text;el.classList.remove('is-good','is-bad');if(kind)el.classList.add(kind);}
  function initHotspot(root){var btns=[].slice.call(root.querySelectorAll('.hl-s3-hotspot-btn'));var title=root.querySelector('[data-hotspot-title]'),detail=root.querySelector('[data-hotspot-detail]');btns.forEach(function(b){b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){btns.forEach(function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');if(title)title.textContent=b.dataset.title||b.textContent.trim();if(detail)detail.textContent=b.dataset.detail||'';});});}
  function initMatch(root){var src=[].slice.call(root.querySelectorAll('.hl-s3-match-source')),tar=[].slice.call(root.querySelectorAll('.hl-s3-match-target')),a=null,b=null,matched=0,total=src.length;function pick(btn,isSrc){if(btn.disabled)return;(isSrc?src:tar).forEach(function(x){if(!x.disabled)x.classList.remove('is-selected','is-wrong');});btn.classList.add('is-selected');if(isSrc)a=btn;else b=btn;if(a&&b){if(a.dataset.match===b.dataset.match){[a,b].forEach(function(x){x.classList.remove('is-selected');x.classList.add('is-matched');x.disabled=true;x.setAttribute('aria-disabled','true');});matched++;feedback(root,'Правильно. Знайдено пар: '+matched+' / '+total,'is-good');a=b=null;}else{a.classList.add('is-wrong');b.classList.add('is-wrong');feedback(root,'Ці елементи не утворюють пару. Спробуй іншу відповідність.','is-bad');a=b=null;}}}
src.forEach(function(x){x.addEventListener('click',function(){pick(x,true);});});tar.forEach(function(x){x.addEventListener('click',function(){pick(x,false);});});var r=root.querySelector('[data-interaction-reset]');if(r)r.addEventListener('click',function(){matched=0;a=b=null;src.concat(tar).forEach(function(x){x.disabled=false;x.removeAttribute('aria-disabled');x.classList.remove('is-selected','is-matched','is-wrong');});feedback(root,'Знайдено пар: 0 / '+total,'');if(src[0])src[0].focus();});}
  function initClassify(root){var items=[].slice.call(root.querySelectorAll('.hl-s3-classify-item')),answered=0,score=0,total=items.length;items.forEach(function(item){var choices=[].slice.call(item.querySelectorAll('.hl-s3-classify-choice')),out=item.querySelector('.hl-s3-classify-feedback');choices.forEach(function(btn){btn.addEventListener('click',function(){if(item.dataset.answered==='1')return;item.dataset.answered='1';answered++;var ok=btn.dataset.correct==='1';if(ok)score++;choices.forEach(function(c){c.disabled=true;c.setAttribute('aria-disabled','true');if(c.dataset.correct==='1')c.classList.add('is-correct');});if(!ok)btn.classList.add('is-wrong');if(out)out.textContent=(ok?'Правильно. ':'Не зовсім. ')+(item.dataset.explanation||'');feedback(root,'Прогрес: '+answered+' / '+total+' • правильно: '+score,answered===total?'is-good':'');});});});var r=root.querySelector('[data-interaction-reset]');if(r)r.addEventListener('click',function(){answered=score=0;items.forEach(function(item){item.removeAttribute('data-answered');item.querySelectorAll('.hl-s3-classify-choice').forEach(function(c){c.disabled=false;c.removeAttribute('aria-disabled');c.classList.remove('is-correct','is-wrong');});var out=item.querySelector('.hl-s3-classify-feedback');if(out)out.textContent='';});feedback(root,'Прогрес: 0 / '+total,'');var first=root.querySelector('.hl-s3-classify-choice');if(first)first.focus();});}
  function initTimeline(root){var events=[].slice.call(root.querySelectorAll('.hl-s3-timeline-event')),seq=root.querySelector('[data-timeline-sequence]'),expected=1,total=events.length;function msg(){if(expected>total)feedback(root,'Послідовність відновлено: '+total+' із '+total+'.','is-good');else feedback(root,'Крок '+expected+' із '+total+': обери наступну подію.','');}events.forEach(function(btn){btn.addEventListener('click',function(){if(btn.disabled)return;var order=Number(btn.dataset.order);btn.classList.remove('is-wrong');if(order===expected){btn.disabled=true;btn.setAttribute('aria-disabled','true');btn.classList.add('is-done');if(seq){var span=document.createElement('span');span.className='hl-s3-timeline-step';span.textContent=btn.textContent.trim();seq.appendChild(span);}expected++;msg();}else{btn.classList.add('is-wrong');feedback(root,'Ця подія йде пізніше. Шукай попередній крок.','is-bad');}});});var r=root.querySelector('[data-interaction-reset]');if(r)r.addEventListener('click',function(){expected=1;events.forEach(function(btn){btn.disabled=false;btn.removeAttribute('aria-disabled');btn.classList.remove('is-done','is-wrong');});if(seq)seq.innerHTML='';msg();if(events[0])events[0].focus();});msg();}
  function init(root){if(root.dataset.hlInteractionReady==='1')return;root.dataset.hlInteractionReady='1';var type=root.dataset.hlInteraction;if(type==='hotspot')initHotspot(root);else if(type==='match')initMatch(root);else if(type==='classify')initClassify(root);else if(type==='timeline')initTimeline(root);}
  function boot(){document.querySelectorAll('[data-hl-interaction]').forEach(init);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Stage 4.0C — Critical Maps & Media Reliability Pass */
(function(){
  function initCriticalMedia(img){
    if(!img || img.dataset.hlCriticalReady==='1')return;
    img.dataset.hlCriticalReady='1';
    var fallback=img.nextElementSibling;
    if(!fallback || !fallback.hasAttribute('data-hl-media-fallback'))return;
    function fail(){
      img.classList.add('hl-critical-media--failed');
      img.setAttribute('aria-hidden','true');
      fallback.hidden=false;
    }
    img.addEventListener('error',fail,{once:true});
    if(img.complete && !img.naturalWidth)fail();
  }
  function boot(){document.querySelectorAll('img[data-hl-critical-media="true"]').forEach(initCriticalMedia);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Stage 4.0C — Critical media runtime cache registration (deployed HTTPS only) */
(function(){
  if(!('serviceWorker' in navigator))return;
  var canRegister=location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1';
  if(!canRegister)return;
  window.addEventListener('load',function(){
    navigator.serviceWorker.register('/critical-media-sw.js').catch(function(){/* non-blocking reliability enhancement */});
  },{once:true});
})();


/* Final Browser QA Fix Pass — quiz summary + Ukrainian score grammar */
(function(){
  window.historyLabPointWord=function(value){
    var n=Math.abs(Number(value)||0), mod100=n%100, mod10=n%10;
    if(mod100>=11 && mod100<=14)return 'балів';
    if(mod10===1)return 'бал';
    if(mod10>=2 && mod10<=4)return 'бали';
    return 'балів';
  };

  window.historyLabSetLegacyQuizSummary=function(score,total,box){
    if(!box)return;
    var title=box.querySelector('h3'), text=box.querySelector('p');
    if(title && !title.dataset.hlOriginalText)title.dataset.hlOriginalText=title.textContent.trim();
    if(text && !text.dataset.hlOriginalText)text.dataset.hlOriginalText=text.textContent.trim();
    var ratio=total>0?score/total:0;
    var level='retry';
    if(ratio>=0.8){
      level='strong';
      if(title && title.dataset.hlOriginalText)title.textContent=title.dataset.hlOriginalText;
      if(text && text.dataset.hlOriginalText)text.textContent=text.dataset.hlOriginalText;
    }else if(ratio>=0.6){
      level='developing';
      if(title)title.textContent='Добрий результат — основне засвоєно.';
      if(text)text.textContent='Результат: '+score+' з '+total+'. Переглянь запитання, у яких помилився, і закріпи складні моменти.';
    }else{
      if(title)title.textContent='Варто повторити матеріал.';
      if(text)text.textContent='Результат: '+score+' з '+total+'. Повтори ключові блоки параграфа й спробуй пройти перевірку ще раз.';
    }
    box.setAttribute('data-hl-quiz-level',level);
  };
})();

/* Stage 5.1C.3C.2 — Quiz Visual Regression Fix
   Adds visual-state metadata only. Lesson scoring/reset implementations remain
   authoritative and are not replaced. */
(function(){
  'use strict';
  const SHELL_SELECTOR='section#quiz,section#quiz-section,section#sec-quiz,section#test,.quiz-shell,.hl-quiz-shell';
  const RESET_RE=/^(Спробувати ще раз|Пройти ще раз|Почати знову|Повторити тест|Скинути(?:\s+тест)?)$/i;

  function shells(){
    return Array.from(document.querySelectorAll(SHELL_SELECTOR)).filter((el,i,a)=>a.indexOf(el)===i);
  }
  function isVisible(el){
    if(!el||!el.isConnected||el.classList.contains('hidden'))return false;
    try{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden';}catch(_e){return true;}
  }
  function radioNames(shell){
    return Array.from(new Set(Array.from(shell.querySelectorAll('input[type="radio"][name]')).map(r=>r.name).filter(Boolean)));
  }
  function cards(shell){return Array.from(shell.querySelectorAll('.hl-quiz-card'));}
  function totalQuestions(shell){
    const names=radioNames(shell);
    return names.length||cards(shell).length;
  }
  function answeredCount(shell){
    const names=radioNames(shell);
    if(names.length){
      return names.filter(name=>shell.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`)).length;
    }
    return cards(shell).filter(card=>{
      if(card.dataset.hlQuizAnswered==='1')return true;
      return !!card.querySelector('button.hl-quiz-option[data-hl-chosen="1"],button.hl-quiz-option.is-selected,button.hl-quiz-option.is-correct,button.hl-quiz-option.is-wrong,button.hl-quiz-option:disabled');
    }).length;
  }
  function parseScore(result,total){
    if(!result)return null;
    const t=(result.textContent||'').replace(/\s+/g,' ').trim();
    let m=t.match(/(?:Результат|Твій результат|Ваш результат|Правильно)\s*:\s*(\d+)\s*(?:із|з|\/)\s*(\d+)/i);
    if(!m)m=t.match(/\b(\d+)\s*\/\s*(\d+)\b/);
    if(!m)return null;
    const score=parseInt(m[1],10), denom=parseInt(m[2],10);
    if(!Number.isInteger(score)||!Number.isInteger(denom)||denom<=0)return null;
    return {score,total:denom||total};
  }
  function classOutcome(result){
    const cls=String(result.className||'');
    if(/(?:bg|border)-(?:emerald|green)-/.test(cls))return 'success';
    if(/(?:bg|border)-(?:rose|red|crimson)-/.test(cls))return 'error';
    if(/(?:bg|border)-(?:amber|yellow|orange)-/.test(cls))return 'warning';
    return '';
  }
  function syncResultState(shell){
    const total=totalQuestions(shell), answered=answeredCount(shell);
    const results=Array.from(shell.querySelectorAll('.hl-quiz-result,#quizResult,#quiz-result,#test-result'))
      .filter((el,i,a)=>a.indexOf(el)===i);
    results.forEach(result=>{
      let desired='';
      if(isVisible(result)){
        if(total>0&&answered<total){
          desired='pending';
        }else{
          const explicit=classOutcome(result);
          if(explicit)desired=explicit;
          else{
            const parsed=parseScore(result,total);
            if(parsed){
              if(parsed.score===parsed.total)desired='success';
              else if(parsed.score/Math.max(parsed.total,1)<.6)desired='error';
              else desired='warning';
            }else desired='warning';
          }
        }
      }
      const states=['pending','success','warning','error'];
      const current=states.find(state=>result.classList.contains(`is-${state}`))||'';
      if(current===desired)return;
      states.forEach(state=>result.classList.remove(`is-${state}`));
      if(desired)result.classList.add(`is-${desired}`);
    });
  }
  function syncInteractionState(shell){
    const answered=answeredCount(shell);
    const hasVisibleResult=Array.from(shell.querySelectorAll('.hl-quiz-result,#quizResult,#quiz-result,#test-result')).some(el=>isVisible(el)&&(el.textContent||'').trim());
    const interacted=answered>0||hasVisibleResult||shell.dataset.hlQuizSubmitted==='1';
    shell.classList.toggle('hl-quiz-pristine',!interacted);
    shell.classList.toggle('hl-quiz-interacted',interacted);
    syncResultState(shell);
  }
  function syncAll(){shells().forEach(syncInteractionState);}
  function init(){
    syncAll();
    document.addEventListener('change',ev=>{
      const input=ev.target;
      if(!input||!input.matches||!input.matches('input[type="radio"]'))return;
      const shell=input.closest(SHELL_SELECTOR);if(!shell)return;
      setTimeout(()=>syncInteractionState(shell),0);
    },true);
    document.addEventListener('click',ev=>{
      const button=ev.target&&ev.target.closest?ev.target.closest('button'):null;
      if(!button)return;
      const shell=button.closest(SHELL_SELECTOR);if(!shell)return;
      const label=(button.textContent||'').trim();
      if(button.classList.contains('hl-quiz-option')){
        shell.classList.remove('hl-quiz-pristine');
        shell.classList.add('hl-quiz-interacted');
      }
      setTimeout(()=>{
        /* Inline resetTest() runs before this document-level listener; syncing
           afterward correctly restores pristine state when choices/result were
           cleared. */
        syncInteractionState(shell);
      },0);
    },false);
    const observer=new MutationObserver(records=>{
      const touched=new Set();
      records.forEach(rec=>{
        const node=rec.target&&rec.target.nodeType===1?rec.target:rec.target&&rec.target.parentElement;
        const shell=node&&node.closest?node.closest(SHELL_SELECTOR):null;
        if(shell)touched.add(shell);
      });
      touched.forEach(syncInteractionState);
    });
    shells().forEach(shell=>observer.observe(shell,{subtree:true,attributes:true,attributeFilter:['class','disabled'],childList:true,characterData:true}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Stage 5.1C — Final Regression Fix Pass 1
   Quiz Reset, Result Duplication & Nav Active-State
   Browser-QA confirmed QR-01..QR-04 and V-01. This compatibility layer keeps
   lesson-owned scoring authoritative while preventing the shared quiz layer
   from duplicating a native result and while fully clearing shared state after
   a lesson-owned reset. */
(function(){
  'use strict';

  const SHELL_SELECTOR='section#quiz,section#quiz-section,section#sec-quiz,section#test,.quiz-shell,.hl-quiz-shell';
  const RESET_RE=/^(?:Спробувати ще раз|Пройти(?:\s+випробування)?\s+(?:ще раз|знову)|Почати знову|Повторити тест|Скинути(?:\s+тест)?)$/i;
  const NATIVE_RESULT_SELECTOR='.hl-quiz-result,#quizResult,#quiz-result,#test-result,[id*="quiz-final" i]';

  function shells(){
    return Array.from(document.querySelectorAll(SHELL_SELECTOR)).filter((el,i,a)=>a.indexOf(el)===i);
  }
  function nativeResults(shell){
    return Array.from(shell.querySelectorAll(NATIVE_RESULT_SELECTOR))
      .filter((el,i,a)=>!el.classList.contains('hl-quiz-summary')&&a.indexOf(el)===i);
  }
  function hasNativeResult(shell){
    return nativeResults(shell).length>0;
  }
  function nativeResetButton(shell){
    return Array.from(shell.querySelectorAll('button')).find(btn=>{
      if(btn.classList.contains('hl-quiz-system-reset'))return false;
      const label=(btn.textContent||'').replace(/\s+/g,' ').trim();
      const onclick=btn.getAttribute('onclick')||'';
      return RESET_RE.test(label)||/\breset(?:Quiz|Test)?\s*\(/i.test(onclick);
    })||null;
  }
  function totalQuestions(shell){
    const names=Array.from(new Set(Array.from(shell.querySelectorAll('input[type="radio"][name]')).map(r=>r.name).filter(Boolean)));
    if(names.length)return names.length;
    return shell.querySelectorAll('.hl-quiz-card,.quiz-q,.quiz-q-box,.hl-v84-quiz-question').length;
  }
  function suppressSyntheticResult(shell){
    if(!shell||!hasNativeResult(shell))return;
    const summary=shell.querySelector(':scope > .hl-quiz-summary');
    if(summary)summary.classList.add('hidden');
    const systemReset=shell.querySelector(':scope > .hl-quiz-actions .hl-quiz-system-reset');
    if(systemReset&&nativeResetButton(shell)){
      /* A lesson-owned reset is canonical; suppress only the duplicate shared retake.
         When no native reset exists, the Stage 2.4B layer remains responsible for
         revealing the shared retake only after completion. */
      systemReset.classList.add('hidden');
    }
  }
  function resetSharedQuizState(shell){
    if(!shell)return;

    delete shell.dataset.hlQuizSubmitted;
    shell.classList.add('hl-quiz-pristine');
    shell.classList.remove('hl-quiz-interacted');

    shell.querySelectorAll('.hl-quiz-card,.quiz-q,.quiz-q-box,.hl-v84-quiz-question').forEach(card=>{
      delete card.dataset.hlQuizAnswered;
      delete card.dataset.hlQuizOutcome;
    });
    shell.querySelectorAll('[data-answered]').forEach(el=>el.removeAttribute('data-answered'));

    shell.querySelectorAll('button.hl-quiz-option').forEach(btn=>{
      btn.removeAttribute('data-hl-chosen');
      btn.classList.remove('is-selected','is-correct','is-wrong');
      btn.disabled=false;
      btn.removeAttribute('aria-disabled');
    });
    shell.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(input=>{
      input.checked=false;
      input.disabled=false;
      input.removeAttribute('aria-disabled');
    });
    shell.querySelectorAll('label.hl-quiz-option,.hl-quiz-option').forEach(option=>{
      option.classList.remove('is-selected','is-correct','is-wrong');
    });

    shell.querySelectorAll('.hl-quiz-generated-feedback').forEach(el=>el.remove());
    shell.querySelectorAll('.hl-quiz-state-indicator').forEach(el=>{
      el.removeAttribute('data-state');
      el.setAttribute('aria-hidden','true');
      el.textContent='';
    });

    nativeResults(shell).forEach(result=>{
      result.classList.add('hidden');
      result.classList.remove('is-pending','is-success','is-warning','is-error');
      result.removeAttribute('data-hl-quiz-level');
    });

    const summary=shell.querySelector(':scope > .hl-quiz-summary');
    if(summary){
      summary.classList.add('hidden');
      summary.classList.remove('is-success','is-warning','is-error');
    }
    const systemReset=shell.querySelector(':scope > .hl-quiz-actions .hl-quiz-system-reset');
    if(systemReset)systemReset.classList.add('hidden');

    const progress=shell.querySelector(':scope > .hl-quiz-progress');
    if(progress){
      const total=totalQuestions(shell);
      if(total>0){
        progress.textContent=`Відповідано 0 / ${total}`;
        progress.setAttribute('aria-label',`Відповідано 0 із ${total}`);
        progress.dataset.hlQuizProgress='compact';
      }else{
        progress.textContent='Перевірка знань';
        progress.setAttribute('aria-label','Прогрес перевірки знань');
        delete progress.dataset.hlQuizProgress;
      }
    }
  }
  function activateQuizNav(shell){
    if(!shell||!shell.id)return;
    const href='#'+shell.id;
    document.querySelectorAll('.hl-secondary-nav').forEach(nav=>{
      const links=Array.from(nav.querySelectorAll('a[href^="#"]'));
      const match=links.find(link=>link.getAttribute('href')===href);
      if(!match)return;
      links.forEach(link=>{
        const active=link===match;
        link.classList.toggle('is-active',active);
        if(active)link.setAttribute('aria-current','true');
        else link.removeAttribute('aria-current');
      });
      if(window.historyLabRevealNavItem)window.historyLabRevealNavItem(match);
    });
  }
  function isResetButton(button){
    if(!button)return false;
    if(button.classList.contains('hl-quiz-system-reset'))return false;
    const label=(button.textContent||'').replace(/\s+/g,' ').trim();
    const onclick=button.getAttribute('onclick')||'';
    return RESET_RE.test(label)||/\breset(?:Quiz|Test)?\s*\(/i.test(onclick);
  }
  function scheduleQuizNav(shell){
    activateQuizNav(shell);
    setTimeout(()=>activateQuizNav(shell),120);
  }

  function init(){
    shells().forEach(shell=>suppressSyntheticResult(shell));

    document.addEventListener('click',ev=>{
      const button=ev.target&&ev.target.closest?ev.target.closest('button'):null;
      if(!button)return;
      const shell=button.closest(SHELL_SELECTOR);
      if(!shell)return;

      if(isResetButton(button)){
        /* Inline lesson reset runs first; clear only the shared compatibility
           metadata after it, so lesson-owned scoring remains authoritative. */
        setTimeout(()=>{
          resetSharedQuizState(shell);
          suppressSyntheticResult(shell);
          activateQuizNav(shell);
        },25);
        return;
      }

      if(button.classList.contains('hl-quiz-option')||button.classList.contains('hl-quiz-submit')||/Перевірити(?:\s+відповіді)?/i.test((button.textContent||'').trim())){
        scheduleQuizNav(shell);
        setTimeout(()=>suppressSyntheticResult(shell),10);
      }
    },false);

    document.addEventListener('change',ev=>{
      const input=ev.target;
      if(!input||!input.matches||!input.matches('input[type="radio"],input[type="checkbox"]'))return;
      const shell=input.closest(SHELL_SELECTOR);
      if(!shell)return;
      scheduleQuizNav(shell);
      setTimeout(()=>suppressSyntheticResult(shell),10);
    },true);

    shells().forEach(shell=>{
      const observer=new MutationObserver(()=>{
        suppressSyntheticResult(shell);
        const visibleNative=nativeResults(shell).some(result=>{
          if(result.classList.contains('hidden'))return false;
          try{const cs=getComputedStyle(result);return cs.display!=='none'&&cs.visibility!=='hidden'&&(result.textContent||'').trim();}
          catch(_e){return (result.textContent||'').trim();}
        });
        if(visibleNative)activateQuizNav(shell);
      });
      observer.observe(shell,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','disabled','checked']});
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
