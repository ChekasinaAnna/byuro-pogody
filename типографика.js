// Русские короткие слова переносятся вместе со следующим словом.
// Текст остаётся обычным текстом: без вставок HTML и принудительных переносов.
const WeatherTypography=(()=>{
 'use strict';
 const shortWords=/(?<![\p{L}\p{N}_])([авикосуябж]|во|до|за|из|ко|на|об|от|по|со|но|да)[ \t]+(?=\S)/giu;
 const ignored='script,style,textarea,pre,code,[data-no-typography]';
 function text(value){return String(value).replace(shortWords,'$1\u00a0');}
 function apply(root){
  if(!root)return;
  if(root.nodeType===Node.TEXT_NODE){if(root.parentElement?.closest(ignored))return;const value=text(root.data);if(value!==root.data)root.data=value;return;}
  if(root.nodeType!==Node.ELEMENT_NODE||root.closest(ignored))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode()))apply(node);
 }
 function init(){
  apply(document.body);
  const observer=new MutationObserver(records=>{
   const roots=new Set();
   for(const record of records){if(record.type==='characterData')roots.add(record.target);else for(const node of record.addedNodes)roots.add(node);}
   for(const root of roots)if(root.isConnected)apply(root);
  });
  observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 return {text,apply};
})();
