const chapters=[
{year:'START',nav:'Västerås',place:'VÄSTERÅS, SWEDEN',svPlace:'VÄSTERÅS, SVERIGE'},
{year:'2012',nav:'University',svNav:'Universitet',place:'KARLSTAD',date:'2012 — 2015',title:'Karlstad University',svTitle:'Karlstads universitet',role:'BSc, IT Design · Systems Design',svRole:'Kandidatexamen, IT-Design · Systemdesign',points:['Built a foundation in computer science, software architecture and algorithmic problem-solving.','Studied design patterns, object-oriented programming and web technologies — the starting point for a career in frontend architecture.'],svPoints:['Byggde en grund inom datavetenskap, mjukvaruarkitektur och algoritmisk problemlösning.','Studerade designmönster, objektorienterad programmering och webbteknik — starten på en karriär inom frontendarkitektur.'],tech:['System design','OOP','Web technologies']},
{year:'2016',nav:'Ericsson',place:'KARLSKRONA',date:'JAN 2016 — JUL 2016',title:'Ericsson',role:'Systems Developer',svRole:'Systemutvecklare',points:['Worked in a team of three on a proof of concept integrating Ericsson products with Amazon Web Services.','Helped migrate Ericsson Adaptive Inventory, one of the company’s largest platforms, to AWS Marketplace.'],svPoints:['Arbetade i ett team på tre personer med ett konceptprojekt för att integrera Ericssons produkter med Amazon Web Services.','Bidrog till att migrera Ericsson Adaptive Inventory, en av företagets största plattformar, till AWS Marketplace.'],tech:['Java','HTML','AWS','Agile']},
{year:'2016',nav:'IStaff',place:'STOCKHOLM',date:'AUG 2016 — OCT 2019',svDate:'AUG 2016 — OKT 2019',title:'Läkarleasing / IStaff',role:'Frontend Developer & Team Leader',svRole:'Frontendutvecklare & teamledare',points:['Led a three-person frontend team, training and supporting new developers.','Developed a staffing and recruitment platform that helped recruiters manage their candidates.','Rebuilt the legacy product for a cloud-based platform, modernising its interface and technology.'],svPoints:['Ledde ett frontendteam på tre personer och utbildade och stöttade nya utvecklare.','Utvecklade en bemannings- och rekryteringsplattform för att hjälpa rekryterare hantera kandidater.','Skrev om den äldre produkten för en molnbaserad plattform och moderniserade gränssnitt och teknik.'],tech:['React','Webpack','Node.js','TypeScript','Next.js','Cypress']},
{year:'2019',nav:'D. Wellington',place:'STOCKHOLM',date:'OCT 2019 — JUL 2022',svDate:'OKT 2019 — JUL 2022',title:'Daniel Wellington',role:'Senior Frontend Developer',svRole:'Senior frontendutvecklare',points:['Maintained and developed the webshop, contributing to its overall structure.','Helped create a company-wide component library using Atomic Design.','Trained new developers joining the team.'],svPoints:['Förvaltade och utvecklade webbshopen och bidrog till planeringen av dess struktur.','Medverkade i skapandet av ett gemensamt komponentbibliotek med Atomic Design.','Utbildade nya utvecklare i teamet.'],tech:['React','Gatsby','TypeScript','Node.js','Contentful','Optimizely','Styled Components']},
{year:'2022',nav:'Daresay',place:'SOLNA, STOCKHOLM',date:'AUG 2022 — SEP 2024',title:'Daresay',role:'Frontend Developer',svRole:'Frontendutvecklare',points:['Built an application that visualised time savings in RNA-LNP drug development.','Developed Cramo’s SmartControl portal for equipment rental, project budgets and sensor data.','Contributed to ClimateView using Next.js and Sanity, collaborating closely with designers and backend developers.'],svPoints:['Byggde en applikation som visualiserade tidsbesparingar inom RNA-LNP-läkemedelsutveckling.','Utvecklade Cramos SmartControl-portal för maskinuthyrning, projektbudgetar och sensordata.','Bidrog till ClimateView med Next.js och Sanity i nära samarbete med designers och backendutvecklare.'],tech:['Angular','TypeScript','Node.js','Azure','Next.js','Sanity']},
{year:'2024',nav:'CONSID / VW',place:'VÄSTERÅS, SWEDEN',svPlace:'VÄSTERÅS, SVERIGE',date:'AUG 2024 — PRESENT',svDate:'AUG 2024 — NUVARANDE',title:'CONSID / Volkswagen',role:'Frontend Developer & UX Designer',svRole:'Frontendutvecklare & UX-designer',points:['Developing scalable, user-friendly web applications, primarily in Angular.','Designing and prototyping interfaces in Figma, taking solutions from concept to product with product owners and development teams.','Optimising performance, accessibility and usability.'],svPoints:['Utvecklar skalbara och användarvänliga webbapplikationer, främst i Angular.','Designar och prototypar gränssnitt i Figma och tar lösningar från koncept till färdig produkt tillsammans med produktägare och utvecklingsteam.','Optimerar prestanda, tillgänglighet och användbarhet.'],tech:['Angular','TypeScript','C#','Azure','Figma','Node.js','React']}
];
// Set verified contact details here when supplied by the owner.
const contact={email:'',linkedin:''};
let sv=false,current=0,progress=0,rawProgress=0,scheduled=false,lastPosition=window.scrollY,walkDistance=0,stopTimer;
const track=document.querySelector('#track'),landscapes=[...document.querySelectorAll('.landscape')],sprite=document.querySelector('.sprite'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const environments=[
 {file:'vasteras-promenade.png',position:45},
 {file:'karlstad.png',position:48},
 {file:'karlskrona.png',position:50},
 {file:'stockholm-promenade.png',position:0},
 {file:'stockholm-promenade.png',position:50},
 {file:'stockholm-promenade.png',position:100},
 {file:'vasteras-promenade.png',position:45}
];
const readyImages=new Set(['vasteras-promenade.png']);
for(const file of new Set(environments.map(e=>e.file))){
 const img=new Image();img.src=`assets/${file}`;
 img.onload=()=>{readyImages.add(file);update()};
}
function paintEnvironment(layer,environment,opacity){
 if(!readyImages.has(environment.file)){if(opacity===1)environment=environments[0];else{layer.style.opacity='0';return}}
 const url=`url("assets/${environment.file}")`;
 if(layer.style.backgroundImage!==url)layer.style.backgroundImage=url;
 // Every city shares one visible image height and one ground plane.
 // End the artwork at the footer instead of cropping pavement below it.
 const height=Math.max(1,document.querySelector('#stage').offsetHeight-100);
 const width=Math.max(window.innerWidth,height*1942/809);
 layer.style.backgroundSize=`${width}px ${height}px`;
 layer.style.backgroundPosition=`${environment.position}% bottom`;
 layer.style.opacity=String(opacity);
}
function updateEnvironment(){
 const position=progress*6;
 const from=Math.min(6,Math.floor(position));
 const to=Math.min(6,from+1);
 const fraction=position-from;
 if(environments[from].file===environments[to].file){
  const pan=reduced.matches?(fraction>=.5?1:0):fraction;
  paintEnvironment(landscapes[0],{...environments[from],position:environments[from].position+(environments[to].position-environments[from].position)*pan},1);
  landscapes[1].style.opacity='0';return;
 }
 // Crossfade while the next experience moves into view, preserving full opacity below it.
 const blend=reduced.matches?(fraction>=.5?1:0):Math.max(0,Math.min(1,(fraction-.2)/.6));
 paintEnvironment(landscapes[0],environments[from],1);
 paintEnvironment(landscapes[1],environments[to],blend);
}
// Reserve a small scroll interval at either desk for getting up and sitting down.
const deskInterval=.03;
const startStation=document.querySelector('.workstation-start');
const endStation=document.querySelector('.workstation-end');
let deskReady=false;
const deskImage=new Image();
deskImage.onload=()=>{deskReady=true;update()};
deskImage.src='assets/desk-sequence-clean.png';
function deskFrame(distance){
 if(reduced.matches)return distance<deskInterval?0:3;
 if(distance<.006)return 0;
 if(distance<.018)return 1;
 if(distance<deskInterval)return 2;
 return 3;
}
function updateActor(){
 const departing=rawProgress<deskInterval;
 const arriving=rawProgress>1-deskInterval;
 const atDesk=deskReady&&(departing||arriving);
 sprite.style.visibility=atDesk?'hidden':'visible';
 startStation.style.visibility=deskReady?'visible':'hidden';
 endStation.style.visibility=deskReady?'visible':'hidden';
 startStation.style.backgroundPosition=`${deskFrame(rawProgress)*100/3}% 0`;
 endStation.style.backgroundPosition=`${deskFrame(1-rawProgress)*100/3}% 0`;
 startStation.style.transform=`translate3d(${-progress*6*window.innerWidth}px,0,0)`;
 endStation.style.transform=`translate3d(${(1-progress)*6*window.innerWidth}px,0,0)`;
}
function txt(c,k){return sv&&c['sv'+k[0].toUpperCase()+k.slice(1)]||c[k]}
function details(c){return `<p class="role">${txt(c,'role')}</p><ul class="details">${txt(c,'points').map(p=>`<li>${p}</li>`).join('')}</ul><div class="tech">${c.tech.map(t=>`<span>${t}</span>`).join('')}</div>`}
function contacts(){return contact.email||contact.linkedin?`<div class="intro-actions">${contact.email?`<a href="mailto:${contact.email}">Email</a>`:''}${contact.linkedin?`<a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`:''}</div>`:''}
function render(){document.documentElement.lang=sv?'sv':'en';document.querySelector('#language').innerHTML=sv?'SV <span>/ EN</span>':'EN <span>/ SV</span>';document.querySelector('#language').setAttribute('aria-label',sv?'Switch to English':'Byt till svenska');document.querySelector('.portfolio').textContent=sv?'EN INTERAKTIV PORTFOLIO':'THE INTERACTIVE PORTFOLIO';document.querySelector('.skip').textContent=sv?'Hoppa till erfarenheter':'Skip to experience';
track.innerHTML=chapters.map((c,i)=>i===0?`<article class="scene intro" aria-label="${sv?'Introduktion':'Introduction'}"><div class="scene-content"><div class="eyebrow">${sv?'FRÅN VÄSTERÅS. ALLTID FRAMÅT.':'BASED IN VÄSTERÅS. ALWAYS MOVING FORWARD.'}</div><h1>Emmanuel<br>Gomez<span style="color:var(--gold)">.</span></h1><p class="lead">${sv?'Frontendutvecklare & UX-designer.<br>Det här är min resa — en erfarenhet i taget.':'Frontend developer & UX designer.<br>This is my journey — one chapter at a time.'}</p><div class="intro-actions"><button class="start" data-go="1">${sv?'BÖRJA RESAN →':'START THE JOURNEY →'}</button><a class="text-link" href="#story">${sv?'Läs mina erfarenheter':'Read my experience'}</a></div></div></article>`:`<article class="scene experience" aria-label="${txt(c,'title')}"><span class="chapter" aria-hidden="true">0${i}</span><div class="scene-content"><div class="eyebrow">${sv?'KAPITEL':'CHAPTER'} 0${i} &nbsp; / &nbsp; ${txt(c,'date')}</div><h2>${txt(c,'title')}</h2>${details(c)}${i===6?contacts():''}</div></article>`).join('');
document.querySelector('#timeline').innerHTML=chapters.map((c,i)=>`<button data-go="${i}" aria-label="${txt(c,'nav')}, ${c.year}"><span class="nav-year">${i===0?(sv?'HEM':'HOME'):c.year}</span><span class="nav-name">${txt(c,'nav')}</span></button>`).join('');document.querySelector('#reading-title').textContent=sv?'Mina erfarenheter i korthet.':'The experience, at a glance.';document.querySelector('#back').textContent=sv?'Tillbaka till resan ↑':'Back to the journey ↑';document.querySelector('#read-list').innerHTML=chapters.slice(1).map(c=>`<article class="read-item"><div class="dates">${txt(c,'date')}</div><div><h3>${txt(c,'title')}</h3>${details(c)}</div></article>`).join('')+contacts();document.querySelector('#hint').textContent=sv?'SCROLLA FÖR ATT UTFORSKA ↓':'SCROLL TO EXPLORE ↓';update()}
function extent(){return document.querySelector('#journey').offsetHeight-document.querySelector('#stage').offsetHeight}
function go(i){window.scrollTo({top:extent()*(i===0?0:i===6?1:deskInterval+(1-2*deskInterval)*i/6),behavior:reduced.matches?'instant':'smooth'})}
function update(){scheduled=false;rawProgress=Math.max(0,Math.min(1,window.scrollY/extent()));progress=Math.max(0,Math.min(1,(rawProgress-deskInterval)/(1-2*deskInterval)));current=Math.min(6,Math.round(progress*6));track.style.transform=`translate3d(${-progress*6*window.innerWidth}px,0,0)`;updateEnvironment();updateActor();document.querySelector('#location').textContent=txt(chapters[current],'place');document.querySelector('#count').textContent=`0${current+1} / 07`;document.querySelectorAll('#timeline button').forEach((b,i)=>{b.classList.toggle('active',i===current);if(i===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});document.querySelectorAll('.scene').forEach((s,i)=>{s.inert=i!==current;s.setAttribute('aria-hidden',i!==current?'true':'false')});}
window.addEventListener('scroll',()=>{const delta=window.scrollY-lastPosition;lastPosition=window.scrollY;if(!reduced.matches&&window.scrollY<=extent()){walkDistance+=Math.abs(delta);sprite.style.backgroundPosition=`${Math.floor(walkDistance/24)%4*100/3}% 0`;sprite.style.transform=`scaleX(${delta<0?-1:1})`;clearTimeout(stopTimer);stopTimer=setTimeout(()=>sprite.style.backgroundPosition='0 0',130)}if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',update);document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(Number(b.dataset.go))});document.querySelector('#language').addEventListener('click',()=>{sv=!sv;render()});document.querySelector('#back').addEventListener('click',()=>go(0));document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();go(0)});render();

document.addEventListener('keydown',e=>{if(window.scrollY>extent()||e.target.matches('button,a,input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();go(Math.min(6,current+1))}if(e.key==='ArrowLeft'){e.preventDefault();go(Math.max(0,current-1))}});
