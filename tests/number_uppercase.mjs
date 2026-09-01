import core from '../number-uppercase.js';
const cases=[
  ['number','0','零'],['number','10','壹拾'],['number','101','壹佰零壹'],['number','1001','壹仟零壹'],
  ['number','10001','壹萬零壹'],['number','100000001','壹億零壹'],['number','1000000000001','壹兆零壹'],
  ['number','-12.03','負壹拾貳點零參'],
  ['currency','0','新臺幣零元整'],['currency','12345.6','新臺幣壹萬貳仟參佰肆拾伍元陸角整'],
  ['currency','123.05','新臺幣壹佰貳拾參元零伍分'],['currency','123.456','新臺幣壹佰貳拾參元肆角陸分'],
  ['currency','999.999','新臺幣壹仟元整'],['currency','-1.5','負新臺幣壹元伍角整'],
  ['currency','（1,234.50）','負新臺幣壹仟貳佰參拾肆元伍角整']
];
let failed=0;
for(const [mode,input,expected] of cases){
  try{const actual=core.convert(input,mode);const ok=actual===expected;console.log(ok?'PASS':'FAIL',mode,input,'=>',actual);if(!ok){console.error(' expected:',expected);failed++;}}
  catch(e){console.error('FAIL',mode,input,e.message);failed++;}
}
if(failed) process.exit(1);
console.log(`PASS ${cases.length}/${cases.length} number-uppercase checks`);
