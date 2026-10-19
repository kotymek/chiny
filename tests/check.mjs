import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({});
vm.runInContext(['data.js','extra-events.js','maps/manifest.js','historical-maps.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n')+'\nglobalThis.data = {ERAS,PLACES,MAP_YEARS,MAP_MANIFEST};',context);
const {ERAS,PLACES}=context.data;
assert.equal(ERAS[0].start,-1200);
assert.equal(ERAS.at(-1).end,2000);
for (const [i,e] of ERAS.entries()) {
 assert.equal(e.cards.length,3);
 assert(e.start<=e.end);
 if(i)assert.equal(e.start,ERAS[i-1].end+1,'No gaps or overlaps');
 for(const c of e.cards){assert(c.events.length>0);for(const place of c.places)assert(PLACES[place],place);if(c.source)assert(URL.canParse(c.source));}
}
for(const [year,id] of [[-44,'empires'],[966,'mieszko'],[1200,'builders'],[-1200,'bronze'],[2000,'contemporary']])assert.equal(ERAS.find(e=>e.start<=year&&e.end>=year).id,id);
new vm.Script(fs.readFileSync('app.js','utf8'));
const {MAP_YEARS,MAP_MANIFEST}=context.data;
let eventCount=0;
for(const e of ERAS){
 for(const y of MAP_YEARS[e.id]){
  assert(y>=e.start&&y<=e.end,`Map year outside era: ${e.id}/${y}`);
  for(const region of ['china','europe','poland']){
   const key=`${y}-${region}`,svg=fs.readFileSync(`maps/${key}.svg`,'utf8');
   assert(MAP_MANIFEST[key]);assert(svg.includes('<path'));assert(!/NaN|undefined|Infinity/.test(svg));
   const data=JSON.parse(fs.readFileSync(`maps/source/${key}.geojson`));assert(data.features.length>0);
   assert(svg.includes('Historical Basemaps'));
  }
 }
 for(const c of e.cards){eventCount+=c.events.length;assert(c.events.length>=3);for(const event of c.events)if(event[2])assert(URL.canParse(event[2]));}
}
assert(eventCount>=200);
assert(MAP_MANIFEST['1200-china'].legend.some(l=>/Song|Sung/i.test(l.name)));
assert(MAP_MANIFEST['1920-poland'].legend.some(l=>/Poland/i.test(l.name)));
console.log(`OK: ${ERAS.length} periods, ${eventCount} events, ${Object.keys(MAP_MANIFEST).length} maps; dates, geometry, attribution and syntax verified.`);
vm.runInContext(fs.readFileSync('time-explorer.js','utf8')+'\nglobalThis.timeApi={sliderToYear,yearToSlider,timeSelection};',context);
const {sliderToYear,yearToSlider,timeSelection}=context.timeApi;
for(let index=-1200;index<=1999;index++){
 const year=sliderToYear(index);assert.notEqual(year,0);assert.equal(yearToSlider(year),index);
 const result=timeSelection(year);assert(result);assert(MAP_YEARS[result.era.id].includes(result.mapYear));
 assert(result.era.start<=year&&result.era.end>=year);
}
assert.equal(timeSelection(0),null);
assert.equal(timeSelection(966).mapYear,1000);
assert.equal(timeSelection(1200).mapYear,1200);
assert.equal(timeSelection(2000).mapYear,2000);
assert.equal(sliderToYear(-1),-1);assert.equal(sliderToYear(0),1);
console.log('OK: slider covers all 3200 historical years, skips zero, and selects valid synchronized map dates.');
