import fs from 'node:fs';
import path from 'node:path';
const upstream=process.argv[2];
const years=[-1000,-500,-323,-100,100,300,500,600,800,1000,1100,1200,1300,1400,1500,1530,1600,1700,1783,1815,1900,1920,1938,1960,2000];
const regions={china:[73,18,136,55],europe:[-13,33,45,71],poland:[10,46,36,59]};
const palette=['#c8b777','#8caf9b','#c79580','#9aa9be','#c5a6bb','#a4b681','#d4c798','#84b4b5','#c0b2cf','#d9ae7b','#b5c8a5','#adbdcd'];
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const filename=y=>`world_${y<0?'bc'+Math.abs(y):y}.geojson`;
// Correct identified anachronistic labels; geometry remains a coarse source reconstruction.
const corrections={
 '-1000':{'Zhoa':'Zhou'},
 '-100':{'Mauryan Empire':'Post-Mauryan kingdoms','Min-Yue':'Han Empire','Nan-Yue':'Han Empire','Kushan Empire':'Central Asian polities'},
 '300':{'Gupta Empire':'North Indian kingdoms','Han Zhao':'Jin','Satavahanihara':'Deccan kingdoms'},
 '1000':{'Xixia':'Tangut polity (Dingnan)','Nan Chao':'Dali'},
 '1100':{'Nan Chao':'Dali','Kingdom of Sukhotai':'Mon and Tai polities'},
 '1200':{'Liao':'Jin (Jurchen)','Nan Chao':'Dali','Mongol Empire':'Mongol and steppe polities','Imperial Japan (Fujiwara)':'Kamakura Japan','Sultanate of Delhi':'Ghurid possessions','Buyid dynasty':'Iranian polities'},
 '1700':{'Dutch Formosa':'Taiwan (Qing)','Post-Ming Warlords':'Qing Empire'},
 '1920':{'USSR':'Soviet Russia'},
 '1960':{'Tibet':'Tibet (China)'}
};
const color=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))>>>0;return palette[h%palette.length]};
function clip(r,b){let p=r;for(const [axis,value,sign] of [[0,b[0],1],[0,b[2],-1],[1,b[1],1],[1,b[3],-1]]){const out=[];for(let i=0;i<p.length;i++){const a=p[i],z=p[(i+1)%p.length],ai=sign*(a[axis]-value)>=0,zi=sign*(z[axis]-value)>=0;if(ai)out.push(a);if(ai!==zi){const t=(value-a[axis])/(z[axis]-a[axis]);out.push([a[0]+t*(z[0]-a[0]),a[1]+t*(z[1]-a[1])]);}}p=out;}return p;}
function simplify(r){if(r.length<5)return r;const out=[r[0]];for(let i=1;i<r.length-1;i++){const a=out.at(-1),b=r[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])>.045)out.push(b);}out.push(r.at(-1));return out;}
function area(r){return Math.abs(r.reduce((s,p,i)=>{const n=r[(i+1)%r.length];return s+p[0]*n[1]-n[0]*p[1]},0))/2;}
const manifest={};
fs.mkdirSync('maps/source',{recursive:true});
for(const year of years){
 const raw=upstream?JSON.parse(fs.readFileSync(path.join(upstream,'geojson',filename(year)))):null;
 if(raw)for(const f of raw.features){const rename=corrections[year];if(rename){for(const field of ['NAME','SUBJECTO'])if(rename[f.properties[field]])f.properties[field]=rename[f.properties[field]];}}
 for(const [region,bounds] of Object.entries(regions)){
  const key=`${year}-${region}`;const sourcePath=`maps/source/${key}.geojson`;
  const source=raw?{type:'FeatureCollection',features:raw.features.flatMap(f=>{
   if(!f.geometry||!['Polygon','MultiPolygon'].includes(f.geometry.type))return [];
   const polys=(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).flatMap(poly=>{
    const outer=simplify(clip(poly[0],bounds));
    if(outer.length<3||area(outer)<=.0001)return [];
    const rings=[outer,...poly.slice(1).map(r=>simplify(clip(r,bounds))).filter(r=>r.length>=3&&area(r)>.0001)];
    for(const ring of rings)if(ring[0][0]!==ring.at(-1)[0]||ring[0][1]!==ring.at(-1)[1])ring.push([...ring[0]]);
    return [rings];
   });
   return polys.length?[{type:'Feature',properties:{NAME:f.properties.NAME||'Obszar bez oznaczenia',SUBJECTO:f.properties.SUBJECTO||f.properties.NAME||'',BORDERPRECISION:f.properties.BORDERPRECISION||1},geometry:{type:'MultiPolygon',coordinates:polys}}]:[];
  })}:JSON.parse(fs.readFileSync(sourcePath));
  if(raw)fs.writeFileSync(sourcePath,JSON.stringify(source));
  const width=900,height=520,cos=Math.cos((bounds[1]+bounds[3])/2*Math.PI/180),scale=Math.min(860/((bounds[2]-bounds[0])*cos),480/(bounds[3]-bounds[1]));
  const xy=p=>[450+(p[0]-(bounds[0]+bounds[2])/2)*cos*scale,260-(p[1]-(bounds[1]+bounds[3])/2)*scale];
  let paths='',labels='';const legend=[];const labelBoxes=[];
  const sorted=[...source.features].sort((a,b)=>Math.max(...b.geometry.coordinates.map(p=>area(p[0])))-Math.max(...a.geometry.coordinates.map(p=>area(p[0]))));
  for(const f of sorted){const name=f.properties.NAME,fill=color(f.properties.SUBJECTO||name),precision=f.properties.BORDERPRECISION;
   const d=f.geometry.coordinates.map(poly=>poly.map(r=>'M'+r.map(p=>xy(p).map(n=>n.toFixed(1)).join(',')).join('L')+'Z').join('')).join('');
   paths+=`<path d="${d}" fill="${fill}" fill-opacity=".83" stroke="#5d6558" stroke-width="${precision<3?'.8':'1.2'}" ${precision<3?'stroke-dasharray="3 2"':''} fill-rule="evenodd"><title>${escape(name)}</title></path>`;
   if(name!=='Obszar bez oznaczenia')legend.push({name,color:fill,precision});
   const ring=[...f.geometry.coordinates].sort((a,b)=>area(b[0])-area(a[0]))[0][0];
   const points=ring.map(xy),x=(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,y=(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2;
   const size=area(ring)*scale*scale*cos;
   const label=name.length>25?name.slice(0,23)+'…':name;
   const box=[x-label.length*3.4,y-9,x+label.length*3.4,y+9];
   if(name!=='Obszar bez oznaczenia'&&size>2600&&labelBoxes.length<15&&!labelBoxes.some(z=>box[0]<z[2]&&box[2]>z[0]&&box[1]<z[3]&&box[3]>z[1])){
    labelBoxes.push(box);labels+=`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-size="13" fill="#263a31" stroke="#faf8ed" stroke-width="3" paint-order="stroke" font-family="Arial,sans-serif">${escape(label)}</text>`;
   }
  }
  const date=year<0?`${-year} p.n.e.`:year;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Granice i obszary historyczne: ${date}"><rect width="900" height="520" fill="#e9f0ef"/>${paths}${labels}<text x="870" y="28" font-size="14" text-anchor="end" fill="#52685f">N ↑</text><text x="18" y="505" font-family="Arial" font-size="11" fill="#52685f">${date} · Historical Basemaps / André Ourednik i współautorzy · GPL-3.0</text></svg>`;
  fs.writeFileSync(`maps/${key}.svg`,svg);manifest[key]={year,region,source:filename(year),legend:[...new Map(legend.map(l=>[l.name,l])).values()]};
 }
}
fs.writeFileSync('maps/manifest.js','const MAP_MANIFEST='+JSON.stringify(manifest)+';\n');
console.log(`Generated ${Object.keys(manifest).length} historical maps and editable regional GeoJSON sources.`);
