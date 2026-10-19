const MAP_YEARS={bronze:[-1000],philosophers:[-500,-323],empires:[-100,100],division:[300,500],tang:[600,800],mieszko:[1000,1100],builders:[1200],yuan:[1300],ming:[1400,1500],reformations:[1530,1600],qing:[1700,1783],industry:[1815,1900],wars:[1920,1938],contemporary:[1960,2000]};
const mapChoices={};
const mapEscape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function selectedMapYear(era){return mapChoices[era.id]??MAP_YEARS[era.id][0]}
function mapYearControl(era){return `<label class="map-year-label">Mapa z roku<select data-map-year="${era.id}" aria-label="Rok map dla epoki ${era.label}">${MAP_YEARS[era.id].map(y=>`<option value="${y}" ${selectedMapYear(era)===y?'selected':''}>${formatYear(y)}</option>`).join('')}</select></label>`}
function historicalMap(era,region){const y=selectedMapYear(era);return `<figure class="mini-map historical-map"><button class="map-open" data-map-era="${era.id}" data-map-region="${region}" aria-label="Powiększ mapę: ${regionNames[regions.indexOf(region)]}, ${formatYear(y)}"><img loading="lazy" width="900" height="520" src="maps/${y}-${region}.svg?v=3" alt="Mapa granic i obszarów historycznych: ${regionNames[regions.indexOf(region)]}, rok ${formatYear(y)}"><span>Rok ${formatYear(y)} · Powiększ ⤢</span></button><figcaption>Granice i zasięgi przybliżone dla wybranego roku. ${y<960&&region==='poland'?'Przed powstaniem państwa polskiego: obszary ludów i kultur.':'Nie przedstawia całego przedziału.'}</figcaption></figure>`}
function setupHistoricalMaps(){
 const dialog=document.querySelector('#map-dialog');
 let opener;
 document.querySelector('#timeline').addEventListener('change',e=>{
  if(!e.target.matches('[data-map-year]'))return;
  const id=e.target.dataset.mapYear;mapChoices[id]=Number(e.target.value);
  const era=ERAS.find(x=>x.id===id);
  document.querySelectorAll(`#${id} .historical-map`).forEach((figure,i)=>{figure.outerHTML=historicalMap(era,regions[i])});
  document.querySelector('#status').textContent=`Mapy: ${era.label}, rok ${formatYear(mapChoices[id])}. Zaktualizowano wszystkie trzy regiony.`;
 });
 document.querySelector('#timeline').addEventListener('click',e=>{
  const button=e.target.closest('.map-open');if(!button)return;opener=button;
  const era=ERAS.find(x=>x.id===button.dataset.mapEra),region=button.dataset.mapRegion,year=selectedMapYear(era),entry=MAP_MANIFEST[`${year}-${region}`];
  document.querySelector('#map-title').textContent=`${regionNames[regions.indexOf(region)]} · ${formatYear(year)}`;
  document.querySelector('#map-image').src=`maps/${year}-${region}.svg?v=3`;
  document.querySelector('#map-image').alt=`Granice i obszary historyczne: ${regionNames[regions.indexOf(region)]}, ${formatYear(year)}`;
  document.querySelector('#map-source').href=`https://github.com/aourednik/historical-basemaps/blob/da7a4b735ecef70aebdc9c73e409d8a2500d50f3/geojson/${entry.source}`;
  document.querySelector('#map-download').href=`maps/${year}-${region}.svg?v=3`;
  document.querySelector('#map-legend').innerHTML=entry.legend.map(l=>`<li><span style="background:${l.color}" aria-hidden="true"></span>${mapEscape(l.name)} <small>${l.precision===3?'granica określona w zbiorze jako prawna':'zasięg przybliżony'}</small></li>`).join('');
  document.querySelector('#map-warning').textContent=year<960?'Mapa obejmuje państwa oraz przybliżone zasięgi ludów i kultur. Nazwa grupy nie oznacza jednolitego państwa; na ziemiach polskich nie istniała jeszcze Polska.':'Rekonstrukcja dla wskazanego roku. Władztwa zależne, strefy wpływów i terytoria sporne mogą nakładać się na siebie. Mapa nie rozstrzyga współczesnych roszczeń.';
  dialog.showModal();
 });
 document.querySelector('#map-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('close',()=>opener?.focus());
}

