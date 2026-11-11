/* Logique du site (langue, fenêtres). Les textes sont dans textes.js : pas besoin de toucher à ce fichier. */
(function(){
  var root=document.documentElement,langBtn=document.getElementById("lang"),clock=document.getElementById("clock");
  var hasText=typeof TEXTES!=="undefined";
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  var lang=get("lang")||((navigator.language||"fr").slice(0,2)==="fr"?"fr":"en");
  if(!hasText||!TEXTES[lang])lang="fr";

  function tick(){clock.textContent=new Date().toLocaleTimeString(lang==="fr"?"fr-BE":"en-GB",{hour:"2-digit",minute:"2-digit"})}
  function applyLang(){
    if(hasText){
      var d=TEXTES[lang];
      root.lang=lang;document.title=d.title;
      document.querySelector('meta[name="description"]').setAttribute("content",d.desc);
      document.querySelectorAll("[data-i18n]").forEach(function(el){var k=el.getAttribute("data-i18n");if(d[k])el.textContent=d[k]});
      document.querySelectorAll("[data-i18n-aria]").forEach(function(el){el.setAttribute("aria-label",d[el.getAttribute("data-i18n-aria")])});
    }
    langBtn.textContent=lang==="fr"?"EN":"FR";langBtn.lang=lang==="fr"?"en":"fr";
    langBtn.setAttribute("aria-label",lang==="fr"?"Switch to English":"Passer en français");
    tick();
  }
  langBtn.addEventListener("click",function(){lang=lang==="fr"?"en":"fr";set("lang",lang);applyLang()});
  setInterval(tick,30000);

  /* Fenêtres */
  var bar=document.querySelector(".menubar"),wins=[].slice.call(document.querySelectorAll(".win")),z=10,opener=null;
  function front(w){w.style.zIndex=++z}
  function openWin(id,btn){
    var w=document.getElementById(id),i=wins.indexOf(w);opener=btn;
    if(w.hidden&&window.innerWidth>700&&!w.dataset.placed){w.style.left=(300+i*30)+"px";w.style.top=(bar.offsetHeight+30+i*26)+"px";w.dataset.placed=1}
    w.hidden=false;front(w);w.focus();
  }
  function closeWin(w){w.hidden=true;if(opener)opener.focus()}
  document.querySelectorAll("[data-open]").forEach(function(b){b.addEventListener("click",function(){openWin(b.getAttribute("data-open"),b)})});
  wins.forEach(function(w){
    w.addEventListener("pointerdown",function(){front(w)});
    w.querySelector(".x").addEventListener("click",function(){closeWin(w)});
    var tb=w.querySelector(".tb");
    tb.addEventListener("pointerdown",function(e){
      if(e.target.closest("button")||window.innerWidth<=700)return;
      var r=w.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;
      tb.setPointerCapture(e.pointerId);
      function mv(ev){
        w.style.left=Math.max(0,Math.min(window.innerWidth-w.offsetWidth,ev.clientX-dx))+"px";
        w.style.top=Math.max(bar.offsetHeight,Math.min(window.innerHeight-48,ev.clientY-dy))+"px";
      }
      function up(){tb.removeEventListener("pointermove",mv);tb.removeEventListener("pointerup",up)}
      tb.addEventListener("pointermove",mv);tb.addEventListener("pointerup",up);
    });
  });
  document.addEventListener("keydown",function(e){
    if(e.key!=="Escape")return;
    var top=null;wins.forEach(function(w){if(!w.hidden&&(!top||+w.style.zIndex>+top.style.zIndex))top=w});
    if(top)closeWin(top);
  });

  applyLang();
  if(window.innerWidth>700)openWin("w-about",null);
})();
