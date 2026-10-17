import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function initMotion(root,lenis,getScene){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let manualExplode=false;
 const slider=root.querySelector('#explode');
 const handleSlider=()=>manualExplode=true;
 slider?.addEventListener('input',handleSlider);
 const ctx=gsap.context(()=>{

  ScrollTrigger.create({start:60,onUpdate:self=>document.querySelector('header').classList.toggle('scrolled',self.scroll()>60)});
  if(reduced){gsap.set('.reveal',{opacity:1,y:0});return;}
  if(root.querySelector('.campaign-hero')){gsap.from('.hero-copy h1 span',{yPercent:110,opacity:0,stagger:.1,duration:1.15,ease:'power4.out',clearProps:'transform,opacity'});
  gsap.from('.hero-copy p,.hero-copy .button',{y:25,opacity:0,stagger:.12,duration:.8,delay:.45,clearProps:'all'});
  gsap.from('.hero-product',{scale:1.12,opacity:0,duration:1.8,ease:'power2.out'});
  gsap.to('.hero-product',{yPercent:13,rotate:5,ease:'none',scrollTrigger:{trigger:'.campaign-hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.hero-copy',{yPercent:25,opacity:.15,ease:'none',scrollTrigger:{trigger:'.campaign-hero',start:'15% top',end:'bottom top',scrub:1}});
  }root.querySelectorAll('.reveal').forEach(el=>gsap.fromTo(el,{y:45,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 91%',once:true},clearProps:'transform'}));
  root.querySelectorAll('.parallax-media').forEach(el=>gsap.fromTo(el,{yPercent:-9},{yPercent:9,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
  const story=root.querySelector('.scroll-story');if(story){const texts=[...story.querySelectorAll('.chapter-text')],photos=[...story.querySelectorAll('.chapter-watch')];gsap.set(texts.slice(1),{autoAlpha:0,y:40});gsap.set(photos.slice(1),{autoAlpha:0,scale:.85});const tl=gsap.timeline({scrollTrigger:{trigger:story,start:'top top',end:'bottom bottom',scrub:1,onUpdate:s=>{const i=Math.min(2,Math.floor(s.progress*2.99));story.querySelectorAll('[data-chapter]').forEach((b,j)=>b.classList.toggle('active',j===i));gsap.set('.rail-track span',{scaleY:s.progress})}}});tl.to(photos[0],{rotate:8,scale:1.13,duration:1});for(let i=1;i<3;i++){tl.to(texts[i-1],{autoAlpha:0,y:-35,duration:.3},`step${i}`).to(photos[i-1],{autoAlpha:0,rotate:-8,scale:1.1,duration:.4},`step${i}`).to(texts[i],{autoAlpha:1,y:0,duration:.4},`step${i}+=.2`).to(photos[i],{autoAlpha:1,scale:1,rotate:i===1?-12:6,duration:.6},`step${i}`).to(photos[i],{scale:i===1?1.08:1.13,rotate:i===1?-6:12,duration:.8});}}
  root.querySelectorAll('.world-marquee').forEach(el=>gsap.to(el.firstElementChild,{xPercent:-18,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
  root.querySelectorAll('.word-reveal').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(word=>`<span>${word} </span>`).join('');gsap.fromTo(el.children,{opacity:.15},{opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:el,start:'top 85%',end:'bottom 45%',scrub:1}})});
  root.querySelectorAll('[data-year]').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 52%',end:'bottom 52%',onToggle:s=>{if(s.isActive)document.querySelectorAll('[data-year-nav]').forEach(a=>a.classList.toggle('active',a.dataset.yearNav===el.dataset.year))}}));
  const mechanical=root.querySelector('.mechanical-study');if(mechanical)ScrollTrigger.create({trigger:mechanical,start:'top top',end:'bottom bottom',onUpdate:s=>{const scene=getScene();if(!scene)return;scene.scrollRotation=s.progress*.5;if(!manualExplode){scene.explode=s.progress;slider.value=Math.round(s.progress*100);document.querySelector('#explode-value').textContent=Math.round(s.progress*100)+'%'}}});
 },root);
 // Global header/progress are outside the scoped context selector.
 const progress=ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{document.querySelector('.page-progress span').style.transform=`scaleX(${s.progress})`;document.querySelector('header').classList.toggle('scrolled',s.scroll()>60)}});
 return ()=>{ctx.revert();progress.kill();slider?.removeEventListener('input',handleSlider)};
}
