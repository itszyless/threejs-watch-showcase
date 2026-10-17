import './style.css';
import {gsap} from 'gsap';
import Lenis from 'lenis';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {watches} from './data.js';
import {home,collections,product,world,craft,arrow,image} from './pages.js';
import {initMotion} from './motion.js';

gsap.registerPlugin(ScrollTrigger);
const main=document.querySelector('main');
history.scrollRestoration='manual';
let cleanMotion=()=>{},scene=null,path='',renderVersion=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis=reduced?null:new Lenis({duration:1.15,smoothWheel:true});
lenis?.on('scroll',ScrollTrigger.update);
function clock(time){lenis?.raf(time*1000)}
gsap.ticker.add(clock);gsap.ticker.lagSmoothing(0);
const compare=new Set();let filter='All',query='';

async function render(){
 const version=++renderVersion;cleanMotion();scene?.dispose();scene=null;ScrollTrigger.getAll().forEach(t=>t.kill());path=location.pathname.replace(/\/$/,'')||'/';
 document.body.classList.remove('menu-open');lenis?.start();document.querySelector('.menu').setAttribute('aria-expanded','false');document.querySelector('.menu').setAttribute('aria-label','Open menu');
 const w=watches.find(w=>path===`/watches/${w.id}`);document.body.dataset.page=path==='/'?'home':path.split('/')[1];main.innerHTML=path==='/'?home():path==='/collections'?collections():path==='/our-world'?world():path==='/craftsmanship'?craft():w?product(w):'<section class="not-found section-pad"><h1>A new direction.</h1><p>This page is beyond the horizon.</p><a class="button" href="/">Return home</a></section>';
 document.title=`${w?w.name:path==='/collections'?'The watches':path==='/our-world'?'Our world':path==='/craftsmanship'?'Savoir-faire':'Nothing stands still.'} — Breitling`;
 document.querySelectorAll('header nav a').forEach(a=>a.classList.toggle('current',a.pathname===path));
 filter='All';query='';bind(w);cleanMotion=initMotion(main,lenis,()=>scene);document.fonts.ready.then(()=>ScrollTrigger.refresh());
 if(document.querySelector('#watch-stage')){const {WatchScene}=await import('./watch.js');if(version!==renderVersion)return;scene=new WatchScene(document.querySelector('#watch-stage'),{craft:true});scene.toggleStrap();}
 lenis?.resize();ScrollTrigger.refresh();
 if(location.hash)scrollToAnchor(location.hash,true);
}
function scrollToAnchor(hash,immediate=false){
 const target=document.querySelector(hash);if(!target)return;
 const offset=['the-icon','mechanical-study'].includes(target.id)?0:location.pathname.startsWith('/watches/')?145:90;
 const y=target.getBoundingClientRect().top+scrollY-offset;lenis?.resize();
 if(lenis)lenis.scrollTo(y,{immediate,force:true});else window.scrollTo({top:y,behavior:immediate||reduced?'instant':'smooth'});
}
function navigate(url){
 if(url.pathname===location.pathname&&url.hash){scrollToAnchor(url.hash);history.pushState({},'',url.pathname+url.hash);return;}
 history.pushState({},'',url.pathname+url.hash);lenis?.scrollTo(0,{immediate:true});window.scrollTo(0,0);render();main.focus({preventScroll:true});
}
function filterCards(){let count=0;document.querySelectorAll('.watch-card').forEach(c=>{const show=(filter==='All'||filter===c.dataset.world)&&c.dataset.name.includes(query.toLowerCase());c.hidden=!show;if(show)count++});document.querySelector('#result-count').textContent=`${count} ${count===1?'collection':'collections'}`;document.querySelector('.empty-state').hidden=count!==0;ScrollTrigger.refresh();}
function updateCompare(){document.querySelectorAll('[data-compare]').forEach(b=>{const selected=compare.has(b.dataset.compare);b.setAttribute('aria-pressed',selected);b.textContent=selected?'✓ Selected':'＋ Compare'});const tray=document.querySelector('.compare-tray');if(!tray)return;tray.hidden=compare.size===0;document.querySelector('#compare-summary').textContent=[...compare].map(id=>watches.find(w=>w.id===id).name).join(' + ');document.querySelector('[data-show-compare]').disabled=compare.size<2;}
function bind(w){
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});filterCards()}));document.querySelector('.search-watch input')?.addEventListener('input',e=>{query=e.target.value;filterCards()});document.querySelector('[data-reset-filters]')?.addEventListener('click',()=>{query='';filter='All';document.querySelector('.search-watch input').value='';document.querySelector('[data-filter="All"]').click()});
 document.querySelectorAll('[data-compare]').forEach(b=>b.addEventListener('click',()=>{if(compare.has(b.dataset.compare))compare.delete(b.dataset.compare);else if(compare.size<2)compare.add(b.dataset.compare);else{document.querySelector('#compare-summary').textContent='Select up to two watches. Remove one to choose another.';return}updateCompare()}));document.querySelector('[data-clear-compare]')?.addEventListener('click',()=>{compare.clear();updateCompare()});
 document.querySelector('[data-show-compare]')?.addEventListener('click',()=>{const selected=[...compare].map(id=>watches.find(w=>w.id===id));document.querySelector('#compare-table').innerHTML=`<div class="compare-columns">${selected.map(v=>`<div>${image(v.image,v.name,'',false)}<h3>${v.name}</h3><p>${v.model}</p><dl><div><dt>World</dt><dd>${v.world}</dd></div><div><dt>Story begins</dt><dd>${v.year}</dd></div><div><dt>Character</dt><dd>${v.tag}</dd></div></dl><a class="text-link" href="/watches/${v.id}">Discover ${v.name} ${arrow}</a></div>`).join('')}</div>`;document.querySelector('#compare-dialog').showModal();lenis?.stop()});updateCompare();
 document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{const img=document.querySelector('.gallery-active');gsap.to(img,{opacity:0,duration:.16,onComplete:()=>{img.src='/assets/'+b.dataset.gallery;img.onload=()=>gsap.to(img,{opacity:1,duration:.3});if(img.complete)gsap.to(img,{opacity:1,duration:.3})}});document.querySelectorAll('[data-gallery]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)})}));
 document.querySelector('[data-open-gallery]')?.addEventListener('click',()=>{document.querySelector('.zoom-image').src=document.querySelector('.gallery-active').src;document.querySelector('#gallery-dialog').showModal();lenis?.stop()});
 document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>lenis?.start());d.addEventListener('click',e=>{if(e.target===d)d.close()})});
 document.querySelectorAll('[data-open-model]').forEach(b=>b.addEventListener('click',()=>{const viewer=b.closest('[data-model-viewer]');viewer.innerHTML='<iframe title="Interactive Breitling Superocean Automatic 44 model by Ethan Mulwee" src="https://sketchfab.com/models/b910729e03c1403a89a8767dd62616b0/embed?autostart=1&ui_theme=dark&dnt=1" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen loading="eager"></iframe>';viewer.classList.add('is-live')}));
 document.querySelectorAll('[data-hero-angle]').forEach((b,i)=>b.addEventListener('click',()=>{const img=document.querySelector('.hero-watch');gsap.to(img,{opacity:0,scale:.97,duration:.3,onComplete:()=>{img.src='/assets/'+b.dataset.heroAngle;gsap.to(img,{opacity:1,scale:1,duration:.6})}});document.querySelectorAll('[data-hero-angle]').forEach(x=>x.classList.toggle('active',x===b));document.querySelector('.hero-index>span').innerHTML=`0${i+1} <i>/ 03</i>`}));
 document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{const story=document.querySelector('.scroll-story');const target=story.offsetTop+(story.offsetHeight-innerHeight)*(+b.dataset.chapter/2);lenis?lenis.scrollTo(target):window.scrollTo({top:target,behavior:'smooth'})}));
 document.querySelector('#explode')?.addEventListener('input',e=>{if(scene)scene.explode=+e.target.value/100;document.querySelector('#explode-value').textContent=e.target.value+'%'});document.querySelector('#rotate-toggle')?.addEventListener('click',e=>{if(!scene)return;scene.paused=!scene.paused;e.target.textContent=scene.paused?'Resume motion':'Pause motion';e.target.setAttribute('aria-pressed',scene.paused)});document.querySelector('#reset-view')?.addEventListener('click',()=>scene?.reset());
 const tabs=[...document.querySelectorAll('[data-detail-tab]')];const tabData=w?[
  {label:'01 / THE MECHANICAL HEART',title:'Precision,<br><em>from within.</em>',body:w.id==='navitimer'||w.id==='chronomat'?'The Manufacture Caliber 01 combines self-winding convenience with the character of a mechanical chronograph. An approximately 70-hour power reserve keeps the story moving between wears.':'A mechanical watch transforms the motion of everyday life into measured time. Discover the movement inside each reference on the official collection page.',photo:w.id==='navitimer'?'nav-back.webp':'movement.jpg',facts:['MECHANICAL','SWISS MADE','CONSIDERED DESIGN']},
  {label:'02 / THE OUTER EXPRESSION',title:'Strength,<br><em>in balance.</em>',body:w.id==='navitimer'?'The 43 mm steel case surrounds a bidirectional slide-rule bezel. Cambered sapphire is glareproofed on both sides. The details work together to bring clarity to a complex instrument.':'A case gives a watch its presence. The relationship between bezel, lugs, crystal and dial creates the collection’s distinctive proportions.',photo:w.hero,facts:['STEEL','SCULPTED PROPORTIONS','TACTILE CONTROLS']},
  {label:'03 / A PERSONAL CONNECTION',title:'Made to<br><em>move with you.</em>',body:w.id==='navitimer'?'The stainless-steel bracelet balances polished surfaces with a fluid series of links. A secure connection to the case completes the Navitimer’s confident silhouette.':'The bracelet or strap completes the watch’s character. Explore the collection’s available configurations to find the feel and finish that suits you.',photo:w.id==='navitimer'?'nav-rolled.webp':w.image,facts:['CONSIDERED FIT','DISTINCTIVE FINISH','EVERYDAY PRESENCE']}
 ]:[];
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>{tabs.forEach(x=>{x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});const data=tabData[i];document.querySelector('#detail-panel').setAttribute('aria-labelledby',b.id);document.querySelector('#tab-label').textContent=data.label;document.querySelector('#tab-title').innerHTML=data.title;document.querySelector('#tab-body').textContent=data.body;document.querySelector('#tab-facts').innerHTML=data.facts.map(f=>`<span>${f}</span>`).join('');document.querySelector('.tab-media img').src='/assets/'+data.photo;document.querySelector('.tab-media img').alt=w.name+' — '+tabs[i].textContent;gsap.fromTo('#detail-panel',{opacity:.3,y:8},{opacity:1,y:0,duration:reduced?0:.4})});b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();next.click()}})});
}

document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||a.target||a.hasAttribute('download'))return;const url=new URL(a.href);if(url.origin!==location.origin)return;e.preventDefault();document.querySelectorAll('dialog[open]').forEach(d=>d.close());navigate(url)});
window.addEventListener('popstate',()=>{if((location.pathname.replace(/\/$/,'')||'/')!==path){lenis?.scrollTo(0,{immediate:true});window.scrollTo(0,0);render()}});
const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close menu':'Open menu');open?lenis?.stop():lenis?.start()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');lenis?.start()}});
document.querySelector('[data-back-top]').addEventListener('click',()=>lenis?lenis.scrollTo(0):window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('load',()=>{if(location.hash)requestAnimationFrame(()=>scrollToAnchor(location.hash,true))},{once:true});
render();
