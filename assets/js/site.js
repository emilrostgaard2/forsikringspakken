(function(){
"use strict";
var d=document,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var kr=function(n){return Math.round(n).toLocaleString("da-DK")};

/* Navigation */
var burger=$(".burger"),nav=$(".nav");
if(burger){burger.addEventListener("click",function(){var o=burger.getAttribute("aria-expanded")==="true";burger.setAttribute("aria-expanded",!o);nav.classList.toggle("open",!o);d.body.style.overflow=o?"":"hidden"})}
$$(".dd").forEach(function(b){var m=b.nextElementSibling;b.addEventListener("click",function(e){e.stopPropagation();var o=b.getAttribute("aria-expanded")==="true";$$(".dd").forEach(function(x){x.setAttribute("aria-expanded","false");x.nextElementSibling.classList.remove("open")});if(!o){b.setAttribute("aria-expanded","true");m.classList.add("open")}})});
d.addEventListener("click",function(){$$(".dd").forEach(function(x){x.setAttribute("aria-expanded","false");x.nextElementSibling.classList.remove("open")})});
d.addEventListener("keydown",function(e){if(e.key==="Escape")d.dispatchEvent(new Event("click"))});

/* Reading progress, TOC, mobile CTA */
var bar=$(".progress"),mcta=$(".mcta"),art=$(".content"),links=$$(".toc ol a"),heads=links.map(function(a){return d.getElementById(a.getAttribute("href").slice(1))}).filter(Boolean);
var ticking=false;
function onScroll(){ticking=false;var y=window.scrollY,h=d.documentElement;
 if(bar&&art){var top=art.offsetTop,len=art.offsetHeight-window.innerHeight;bar.style.width=Math.max(0,Math.min(100,(y-top)/Math.max(len,1)*100))+"%"}
 if(mcta)mcta.classList.toggle("show",y>700&&y<h.scrollHeight-window.innerHeight-500);
 if(heads.length){var cur=0;heads.forEach(function(el,i){if(el.getBoundingClientRect().top<140)cur=i});links.forEach(function(a,i){a.classList.toggle("on",i===cur)})}}
window.addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* Mascot tips */
var bub=$(".bubble");
if(bub){var tips=JSON.parse(bub.getAttribute("data-tips")||"[]"),i=0;
 if(tips.length&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){setInterval(function(){bub.style.opacity=0;setTimeout(function(){i=(i+1)%tips.length;bub.textContent=tips[i];bub.style.opacity=1},300)},5200)}}

/* Pakkeberegner */
var calc=$("#pakkeberegner");
if(calc){var boxes=$$("input[type=checkbox]",calc);
 function rate(n){return n>=5?[.15,.25]:n===4?[.12,.2]:n===3?[.1,.15]:n===2?[.05,.1]:[0,0]}
 function upd(){var sel=boxes.filter(function(b){return b.checked}),sum=sel.reduce(function(s,b){return s+ +b.value},0),r=rate(sel.length);
  $("#c-n",calc).textContent=sel.length;$("#c-sum",calc).textContent=kr(sum)+" kr.";
  var r50=function(n){return Math.round(n/50)*50};$("#c-save",calc).textContent=sel.length>1?kr(r50(sum*r[0]))+"–"+kr(r50(sum*r[1]))+" kr.":"0 kr.";
  $("#c-pct",calc).textContent=sel.length>1?Math.round(r[0]*100)+"–"+Math.round(r[1]*100)+" %":"Vælg 2+";
  $("#c-meter",calc).style.width=(r[1]/.25*100)+"%";
  $("#c-msg",calc).textContent=sel.length===0?"Vælg de forsikringer, du har i dag.":sel.length===1?"Vælg én mere for at se samlerabatten.":"Få tilbud på hele pakken og se den reelle pris.";}
 boxes.forEach(function(b){b.addEventListener("change",upd)});upd()}

/* Behovsquiz */
var quiz=$("#behovsquiz");
if(quiz){var qs=$$(".quiz-q",quiz),ans={},step=0;
 function show(n){qs.forEach(function(q,i){q.classList.toggle("on",i===n)})}
 $$(".quiz-opts button",quiz).forEach(function(b){b.addEventListener("click",function(){ans[b.closest(".quiz-q").getAttribute("data-k")]=b.getAttribute("data-v");step++;if(step<qs.length-1)show(step);else{result();show(qs.length-1)}})});
 function item(name,url,tag,why){return'<li><b><a href="'+url+'">'+name+'</a></b><span>'+(tag==="must"?'<span class="tag must">Lovpligtig</span> ':tag==="rec"?'<span class="tag">Anbefales</span> ':'<span class="tag" style="background:#EEF2FA;color:#2B3A55">Overvej</span> ')+why+'</span></li>'}
 function result(){var h="",n=0;
  h+=item("Indboforsikring","/indboforsikring/","rec","Dækker dine ting og indeholder typisk privat ansvar.");n++;
  if(ans.bolig==="hus"){h+=item("Husforsikring","/husforsikring/","rec","Kræves af långiver ved realkreditlån og dækker bygningen.");n++}
  if(ans.bil==="bil"){h+=item("Bilforsikring","/bilforsikring/","must","Ansvarsforsikring er lovpligtig for indregistrerede biler.");n++}
  if(ans.bil==="mc"){h+=item("MC-forsikring","/mc-forsikring/","must","Ansvarsforsikring er lovpligtig for motorcykler og knallerter.");n++}
  if(ans.dyr==="hund"){h+=item("Hundeforsikring","/dyreforsikring/","must","Hundeloven kræver ansvarsforsikring på hunde.");n++}
  if(ans.dyr==="kat"){h+=item("Katteforsikring","/dyreforsikring/","opt","Sygeforsikring kan dække store dyrlægeregninger.");n++}
  if(ans.rejse==="ofte"){h+=item("Rejseforsikring","/rejseforsikring/","rec","Det blå sygesikringskort dækker ikke hjemtransport.");n++}
  h+=item("Ulykkesforsikring","/ulykkesforsikring/",ans.born==="ja"?"rec":"opt","Den offentlige dækning gælder kun arbejdsskader.");n++;
  if(ans.born==="ja"){h+=item("Livsforsikring","/livsforsikring/","rec","Sikrer familien økonomisk, hvis det værste sker.");n++}
  $("#q-list",quiz).innerHTML=h;$("#q-n",quiz).textContent=n}
 $("#q-reset",quiz).addEventListener("click",function(){ans={};step=0;show(0)})}

/* Prisestimator */
$$(".est").forEach(function(e){var cfg=JSON.parse(e.getAttribute("data-cfg")),sels=$$("select",e);
 function upd(){var m=sels.reduce(function(p,s){return p*parseFloat(s.value)},1),lo=cfg.base[0]*m,hi=cfg.base[1]*m;
  var rd=function(n){return n>=1000?Math.round(n/50)*50:Math.round(n/10)*10};
  $(".v",e).textContent=kr(rd(lo/12))+"–"+kr(rd(hi/12))+" kr./md.";$(".y",e).textContent="ca. "+kr(rd(lo))+"–"+kr(rd(hi))+" kr. om året"}
 sels.forEach(function(s){s.addEventListener("change",upd)});upd()});
})();
