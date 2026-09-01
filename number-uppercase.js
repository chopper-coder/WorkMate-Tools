(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.OfficeNumberUppercase=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DIGITS=['零','壹','貳','參','肆','伍','陸','柒','捌','玖'];
  const SMALL_UNITS=['仟','佰','拾',''];
  const GROUP_UNITS=['','萬','億','兆','京','垓','秭','穰'];
  const MAX_INTEGER_DIGITS=GROUP_UNITS.length*4;
  const MAX_DECIMAL_DIGITS=16;

  function normalizeInput(raw){
    const source=String(raw??'').trim();
    if(!source) throw new Error('請輸入數字');
    let s=source.replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/．/g,'.').replace(/－/g,'-').replace(/＋/g,'+').replace(/[，,]/g,'').replace(/\s+/g,'');
    let accounting=false;if(/^\(.*\)$/.test(s)||/^（.*）$/.test(s)){accounting=true;s=s.slice(1,-1);}
    s=s.replace(/^(?:新臺幣|NTD|NT\$|NT＄|\$)/i,'').replace(/元$/,'');
    if(accounting&&!/^[+-]/.test(s))s='-'+s;
    const m=s.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
    if(!m) throw new Error('格式錯誤，只接受一般十進位數字，不支援科學記號');
    let intPart=m[2].replace(/^0+(?=\d)/,'');
    const fracPart=m[3]||'';
    if(intPart.length>MAX_INTEGER_DIGITS) throw new Error(`整數部分最多 ${MAX_INTEGER_DIGITS} 位`);
    if(fracPart.length>MAX_DECIMAL_DIGITS) throw new Error(`小數部分最多 ${MAX_DECIMAL_DIGITS} 位`);
    return {negative:m[1]==='-',intPart,fracPart,source};
  }

  function fourDigitsToUpper(group){
    const s=String(group).padStart(4,'0').slice(-4);
    let out='',zeroPending=false;
    for(let i=0;i<4;i++){
      const d=Number(s[i]);
      if(d===0){
        if(out && /[1-9]/.test(s.slice(i+1))) zeroPending=true;
        continue;
      }
      if(zeroPending){out+='零';zeroPending=false;}
      out+=DIGITS[d]+SMALL_UNITS[i];
    }
    return out;
  }

  function integerToUpper(intPart){
    let s=String(intPart||'0').replace(/^0+(?=\d)/,'');
    if(!/^\d+$/.test(s)) throw new Error('整數格式錯誤');
    if(s==='0') return '零';
    if(s.length>MAX_INTEGER_DIGITS) throw new Error(`整數部分最多 ${MAX_INTEGER_DIGITS} 位`);
    const groups=[];
    while(s.length){groups.unshift(s.slice(-4));s=s.slice(0,-4);}
    let out='',zeroBetween=false;
    for(let i=0;i<groups.length;i++){
      const group=groups[i];
      const value=Number(group);
      const unitIndex=groups.length-1-i;
      if(value===0){
        if(out && groups.slice(i+1).some(g=>Number(g)!==0)) zeroBetween=true;
        continue;
      }
      if(out && (zeroBetween || value<1000) && !out.endsWith('零')) out+='零';
      out+=fourDigitsToUpper(group)+GROUP_UNITS[unitIndex];
      zeroBetween=false;
    }
    return out;
  }

  function numberToUpper(raw){
    const p=normalizeInput(raw);
    const isZero=p.intPart==='0' && (!p.fracPart || /^0+$/.test(p.fracPart));
    let out=integerToUpper(p.intPart);
    if(p.fracPart) out+='點'+[...p.fracPart].map(ch=>DIGITS[Number(ch)]).join('');
    return (p.negative&&!isZero?'負':'')+out;
  }

  function roundToCents(p){
    const frac=(p.fracPart+'00').slice(0,2);
    let scaled=BigInt(p.intPart)*100n+BigInt(frac||'0');
    if((p.fracPart[2]||'0')>='5') scaled+=1n;
    return scaled;
  }

  function currencyToUpper(raw,options={}){
    const p=normalizeInput(raw);
    const prefix=options.prefix===false?'':'新臺幣';
    const scaled=roundToCents(p);
    const integer=(scaled/100n).toString();
    const jiao=Number((scaled/10n)%10n),fen=Number(scaled%10n);
    const isZero=scaled===0n;
    let out=prefix+integerToUpper(integer)+'元';
    if(jiao===0&&fen===0) out+='整';
    else{
      if(jiao>0) out+=DIGITS[jiao]+'角';
      else if(fen>0) out+='零';
      if(fen>0) out+=DIGITS[fen]+'分';
      else if(jiao>0) out+='整';
    }
    return (p.negative&&!isZero?'負':'')+out;
  }

  function convert(raw,mode='number',options={}){
    return mode==='currency'?currencyToUpper(raw,options):numberToUpper(raw);
  }

  return {DIGITS,MAX_INTEGER_DIGITS,MAX_DECIMAL_DIGITS,normalizeInput,integerToUpper,numberToUpper,currencyToUpper,convert};
});
