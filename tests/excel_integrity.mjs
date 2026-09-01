import { createRequire } from 'module';
const require=createRequire(import.meta.url);
const XLSX=require('../vendor/xlsx.full.min.js');
if(!XLSX || !XLSX.version) throw new Error('Real SheetJS vendor file is not loaded');
const ws={
  A1:{t:'s',v:'文字編號'},B1:{t:'s',v:'格式化數字'},C1:{t:'s',v:'日期'},D1:{t:'s',v:'數值'},E1:{t:'s',v:'公式'},
  A2:{t:'s',v:'000123'},
  B2:{t:'n',v:123,z:'000000'},
  C2:{t:'d',v:new Date('2026-08-31T00:00:00'),z:'yyyy-mm-dd'},
  D2:{t:'n',v:25},
  E2:{t:'n',v:50,f:'D2*2'}
};
ws['!ref']='A1:E2';
const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'完整性');
const bytes=XLSX.write(wb,{bookType:'xlsx',type:'buffer',cellStyles:true,cellDates:true});
const back=XLSX.read(bytes,{type:'buffer',cellFormula:true,cellDates:true,cellNF:true,cellStyles:true});
const r=back.Sheets['完整性'];
const asserts=[
  ['leading zero text',r.A2?.t==='s'&&r.A2?.v==='000123'],
  ['number stays number',r.B2?.t==='n'&&r.B2?.v===123],
  ['number format preserved',r.B2?.z==='000000'],
  ['date type preserved',r.C2?.t==='d'||(r.C2?.t==='n'&&r.C2?.z==='yyyy-mm-dd')],
  ['date format preserved',String(r.C2?.z||'').toLowerCase().includes('yy')],
  ['formula preserved',r.E2?.f==='D2*2']
];
for(const [n,ok] of asserts){console.log(ok?'PASS':'FAIL',n);if(!ok)process.exitCode=1;}
if(process.exitCode)throw new Error('Excel round-trip integrity failed');
console.log(`PASS ${asserts.length}/${asserts.length} Excel integrity checks`);
