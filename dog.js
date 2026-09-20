// A small companion joins the Stockholm chapters and leaves at Västerås.
window.createTrailDog=function({element,walker,reduced}){
 const sprite=element.querySelector('.dog-sprite');
 const image=new Image();
 let ready=false,active=false,x=null,target=0,raf=0,previousTime=0;
 let movingUntil=0,heading=1,cycle=0;
 const offscreen=()=>-element.offsetWidth-12;
 function requestFrame(){if(!raf){previousTime=0;raf=requestAnimationFrame(tick)}}
 function paint(running){
  element.style.transform=`translate3d(${x}px,0,0)`;
  sprite.style.transform=`scaleX(${heading})`;
  sprite.style.backgroundPosition=`${(running?Math.floor(cycle)%4:0)*100/3}% 0`;
  element.style.visibility=ready&&(active||x>offscreen()+.5)?'visible':'hidden';
 }
 function update(wanted){
  active=wanted;
  if(!ready)return;
  if(x===null)x=offscreen();
  // 30px clear gap from the dog's box to the avatar's left edge.
  target=active?Math.max(4,walker.offsetLeft-30-element.offsetWidth):offscreen();
  if(reduced.matches){
   if(raf)cancelAnimationFrame(raf);raf=0;
   x=target;heading=1;paint(false);return;
  }
  if(Math.abs(target-x)>.5||performance.now()<movingUntil)requestFrame();
  else paint(false);
 }
 function tick(now){
  raf=0;
  const dt=previousTime?Math.min((now-previousTime)/1000,.05):1/60;
  previousTime=now;
  const delta=target-x;
  const traveling=Math.abs(delta)>.5;
  if(traveling){
   heading=delta<0?-1:1;
   const speed=Math.max(180,Math.abs(target-offscreen())/1.15);
   x+=Math.sign(delta)*Math.min(Math.abs(delta),speed*dt);
  }else x=target;
  const running=traveling||(active&&now<movingUntil);
  if(running)cycle+=dt*10;
  paint(running);
  if(traveling||(active&&now<movingUntil))raf=requestAnimationFrame(tick);
 }
 image.onload=()=>{ready=true;update(active)};
 image.src='assets/french-bulldog.png';
 reduced.addEventListener('change',()=>update(active));
 return {
  update,
  scroll(delta){
   if(!delta||!active||reduced.matches)return;
   movingUntil=performance.now()+140;
   if(x!==null&&Math.abs(target-x)<=.5)heading=delta<0?-1:1;
   if(ready)requestFrame();
  }
 };
};
