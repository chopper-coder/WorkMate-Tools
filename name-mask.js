'use strict';
(function(root, factory){
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WorkMateNameMask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  function graphemes(value){
    const text = String(value ?? '');
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
      const seg = new Intl.Segmenter('zh-Hant', {granularity:'grapheme'});
      return Array.from(seg.segment(text), x => x.segment);
    }
    return Array.from(text);
  }

  function mask(raw){
    const name = String(raw ?? '').trim();
    if (!name) return '';
    const chars = graphemes(name);
    if (chars.length === 1) return 'O';
    if (chars.length === 2) return `${chars[0]}O`;
    return `${chars[0]}${'O'.repeat(chars.length - 2)}${chars[chars.length - 1]}`;
  }

  function maskLines(text){
    return String(text ?? '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(name => ({name, masked: mask(name)}));
  }

  return Object.freeze({mask, maskLines, graphemes});
});
