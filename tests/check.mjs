import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({});
vm.runInContext(fs.readFileSync('data.js','utf8')+'\nglobalThis.data = {ERAS,PLACES};',context);
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
console.log(`OK: ${ERAS.length} periods, ${ERAS.length*3} cards; contiguous ranges, map coordinates, anchor years, JS syntax.`);
