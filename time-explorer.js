// The slider uses a continuous index; historical year zero is skipped.
const sliderToYear=value=>value<0?value:value+1;
const yearToSlider=year=>year<0?year:year-1;
function timeSelection(year){
 if(!Number.isInteger(year)||year===0||year< -1200||year>2000)return null;
 const era=ERAS.find(e=>year>=e.start&&year<=e.end);
 const mapYear=MAP_YEARS[era.id].reduce((best,y)=>Math.abs(y-year)<Math.abs(best-year)?y:best);
 return {year,era,mapYear};
}
let explorerKey='';
function updateExplorer(year,saveUrl=false){
 const selection=timeSelection(year);if(!selection)return;
 const {era,mapYear}=selection;
 const slider=document.querySelector('#time-slider');slider.value=yearToSlider(year);slider.setAttribute('aria-valuetext',formatYear(year));
 document.querySelector('#time-year').textContent=formatYear(year);
 document.querySelector('#time-period').textContent=`${era.label} · ${formatYear(era.start)}–${formatYear(era.end)}`;
 document.querySelector('#time-map-note').textContent=year===mapYear?`Mapy: rok ${formatYear(mapYear)}. Wydarzenia obejmują cały wskazany okres.`:`Wybrany rok: ${formatYear(year)}. Najbliższa dostępna mapa w tym okresie: ${formatYear(mapYear)}. Nie interpolujemy granic; wydarzenia obejmują cały okres.`;
 const key=`${era.id}/${mapYear}`;
 if(explorerKey!==key){
  document.querySelector('#time-cards').innerHTML=era.cards.map((card,i)=>`<article class="time-card ${regions[i]}"><h3>${regionNames[i]}</h3>${historicalMap(era,regions[i],mapYear)}<div class="period">${card.period}</div><h4>${card.title}</h4><ul class="events">${card.events.map(([date,text,source])=>`<li><b>${date}</b> · ${text}${source?` <a href="${source}" class="event-source" target="_blank" rel="noopener noreferrer" aria-label="Źródło wydarzenia z roku ${date}">↗</a>`:''}</li>`).join('')}</ul><a class="source" href="${card.source||SOURCES[regions[i]]}" target="_blank" rel="noopener noreferrer">Źródło / czytaj dalej ↗</a></article>`).join('');
  explorerKey=key;
 }
 const years=Object.values(MAP_YEARS).flat().sort((a,b)=>a-b);
 document.querySelector('#time-prev').disabled=!years.some(y=>y<year);
 document.querySelector('#time-next').disabled=!years.some(y=>y>year);
 if(saveUrl){history.replaceState(null,'',`#czas=${year}`);document.querySelector('#time-live').textContent=`Rok ${formatYear(year)}. Mapy: ${formatYear(mapYear)}. ${era.label}.`;}
}
function setupTimeExplorer(){
 const slider=document.querySelector('#time-slider');
 slider.addEventListener('input',()=>updateExplorer(sliderToYear(Number(slider.value))));
 slider.addEventListener('change',()=>updateExplorer(sliderToYear(Number(slider.value)),true));
 for(const [id,direction] of [['#time-prev',-1],['#time-next',1]])document.querySelector(id).addEventListener('click',()=>{
  const year=sliderToYear(Number(slider.value)),years=Object.values(MAP_YEARS).flat().sort((a,b)=>a-b);
  const next=direction<0?years.filter(y=>y<year).at(-1):years.find(y=>y>year);
  if(next!==undefined)updateExplorer(next,true);
 });
 updateExplorer(966);
 document.querySelector('#motto-button').addEventListener('click',()=>{
  const button=document.querySelector('#motto-button');const open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));button.parentElement.classList.toggle('motto-open',open);
 });
 document.querySelector('.motto').addEventListener('keydown',e=>{if(e.key==='Escape'){e.currentTarget.classList.add('motto-dismissed');document.querySelector('#motto-button').setAttribute('aria-expanded','false');e.currentTarget.classList.remove('motto-open');}});
 for(const type of ['pointerenter','focusin'])document.querySelector('.motto').addEventListener(type,e=>e.currentTarget.classList.remove('motto-dismissed'));
}
