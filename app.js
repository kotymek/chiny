const regions=['china','europe','poland'];
const regionNames=['Chiny','Europa','Ziemie polskie'];
const formatYear=n=>n<0?`${Math.abs(n)} p.n.e.`:`${n}`;
const fold=s=>s.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
let activeFilter='all';
function render(){
 const query=fold(document.querySelector('#search').value.trim());
 const visible=ERAS.filter(e=>(activeFilter==='all'||e.group===activeFilter)&&fold(JSON.stringify(e.cards)+' '+e.label).includes(query));
 document.querySelector('#timeline').innerHTML=visible.map(e=>`<section class="epoch" id="${e.id}" aria-label="${e.label}"><div class="date"><strong>${formatYear(e.start)}</strong><span>— ${formatYear(e.end)}<br>${e.label}</span>${mapYearControl(e)}</div>${e.cards.map((c,i)=>`<article class="card ${regions[i]}" aria-label="${regionNames[i]}: ${c.title}"><div class="period">${c.period}</div><h4>${c.title}</h4><p>${c.description}</p><ul class="events">${c.events.map(([date,text,source])=>`<li><b>${date}</b> · ${text}${source?` <a class="event-source" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="Źródło wydarzenia z roku ${date}">↗</a>`:""}</li>`).join('')}</ul>${historicalMap(e,regions[i])}<a class="source" href="${c.source||SOURCES[regions[i]]}" target="_blank" rel="noopener noreferrer">Źródło / czytaj dalej ↗</a></article>`).join('')}</section>`).join('');
 document.querySelector('#status').textContent=`${visible.length} z ${ERAS.length} przedziałów · ${visible.reduce((n,e)=>n+e.cards.reduce((s,c)=>s+c.events.length,0),0)} wydarzeń · porównuj regiony`;
 document.querySelector('#empty').hidden=visible.length!==0;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeFilter)));
}
const answers={
 '966':['Chiny za Mieszka I','Mieszko I panował około 960–992. W 960 roku powstała Północna dynastia Song, ze stolicą w Kaifengu. W czasie jego chrztu w 966 roku Song dopiero rozszerzali swoje państwo: na północy istniało Liao, a na południu wciąż niezależne królestwa. Zachodnie Xia powstało dopiero w 1038 roku.'],
 '-44':['Jaka dynastia rządziła za życia Cezara?','Za życia Juliusza Cezara (100–44 p.n.e.) w Chinach panowała Zachodnia dynastia Han (206 p.n.e.–9 n.e.), ze stolicą w Chang’an. Rzymskie wojny domowe i chińskie cesarstwo Han należą więc do tej samej opowieści o czasie.'],
 '1200':['Co budowano około roku 1200?','W Chinach rozwijał się port Quanzhou z infrastrukturą handlową i budowlami religijnymi. W Europie od 1194 roku odbudowywano gotycką katedrę w Chartres. Na ziemiach polskich rozwijało się opactwo cystersów w Sulejowie, ufundowane w 1176 roku; jego kościół konsekrowano w 1232 roku. To porównanie okresu wokół 1200 roku, a nie lista prac potwierdzonych dokładnie dla jednego roku.']
};
function jump(year,updateUrl=true){
 const answer=document.querySelector('#answer');
 if(!Number.isInteger(year)||year===0||year< -1200||year>2000){document.querySelector('#status').textContent='Wpisz rok od −1200 do 2000. Daty p.n.e. wpisuj z minusem. W tym zapisie nie ma roku 0.';return;}
 activeFilter='all';document.querySelector('#search').value='';document.querySelector('#year').value=year;render();
 const e=ERAS.find(e=>year>=e.start&&year<=e.end);const a=answers[String(year)];
 answer.hidden=false;answer.innerHTML=a?`<h3>${a[0]}</h3><p>${a[1]}</p>`:`<h3>Rok ${formatYear(year)}</h3><p>Wybrany przedział: ${e.label}. Karty poniżej przedstawiają kontekst całego okresu ${formatYear(e.start)}–${formatYear(e.end)}, nie tylko wydarzenia wybranego roku.</p>`;
 document.querySelector('#status').textContent=`Wybrano rok ${formatYear(year)} · ${e.label}`;
 // Place the answer immediately before the selected row so the context stays visible.
 document.getElementById(e.id).before(answer);
 answer.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 if(updateUrl)history.replaceState(null,'',`#rok=${year}`);
}
function resetAnswer(){const a=document.querySelector('#answer');a.hidden=true;document.querySelector('.column-head').before(a);}
document.querySelector('#search').addEventListener('input',()=>{resetAnswer();render()});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{resetAnswer();activeFilter=b.dataset.filter;render()}));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{resetAnswer();jump(Number(b.dataset.jump))}));
document.querySelector('#go').addEventListener('click',()=>{resetAnswer();jump(Number(document.querySelector('#year').value))});
document.querySelector('#year').addEventListener('keydown',e=>{if(e.key==='Enter'){resetAnswer();jump(Number(e.target.value))}});
document.querySelector('#poland').addEventListener('change',e=>document.querySelector('#atlas').classList.toggle('no-poland',!e.target.checked));
setupHistoricalMaps();
render();
if(/^#rok=-?\d+$/.test(location.hash))jump(Number(location.hash.split('=')[1]),false);
