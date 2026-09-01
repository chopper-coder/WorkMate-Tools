"use strict";
(function(){
  const APP = "app.js";
  const CDN = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
  const SRI = "sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT";
  let appStarted = false;
  function startApp(){
    if(appStarted) return;
    appStarted = true;
    const s=document.createElement("script");
    s.src=APP;
    s.defer=false;
    document.body.appendChild(s);
  }
  if(window.XLSX && window.XLSX.version){
    window.__WORKMATE_SHEETJS_SOURCE__="local";
    startApp();
    return;
  }
  const s=document.createElement("script");
  s.src=CDN;
  s.integrity=SRI;
  s.crossOrigin="anonymous";
  s.referrerPolicy="no-referrer";
  s.onload=function(){
    window.__WORKMATE_SHEETJS_SOURCE__=(window.XLSX&&window.XLSX.version)?"official-cdn-sri":"unavailable";
    startApp();
  };
  s.onerror=function(){
    window.__WORKMATE_SHEETJS_SOURCE__="unavailable";
    startApp();
  };
  document.head.appendChild(s);
})();
