// Размещение согласованных растровых слоёв в координатах исходной иллюстрации.
const ObservatoryMotion=(()=>{
 const ns='http://www.w3.org/2000/svg';
 function paint(container,stage){
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1536 1024');svg.setAttribute('aria-hidden','true');svg.classList.add('observatory-layers');
  for(const layer of OBS_ART.stages[stage].layers){
   const p=OBS_ART.placements[layer.name],meta=OBS_ART.layers[layer.name],b=meta.displayBounds,pad=p.pad??2;
   const wrapper=document.createElementNS(ns,'g');wrapper.setAttribute('class','obs-'+(layer.cls||'static'));wrapper.dataset.layer=layer.name;
   wrapper.style.transformBox='view-box';wrapper.style.transformOrigin=(p.x+p.w*(layer.cls==='sock-up'?.03:.5))+'px '+(p.y+p.h*(layer.cls==='sock-up'?.38:.97))+'px';
   const box=document.createElementNS(ns,'svg');for(const [key,value]of Object.entries({x:p.x,y:p.y,width:p.w,height:p.h,viewBox:`${b.left-pad} ${b.top-pad} ${b.right-b.left+1+pad*2} ${b.bottom-b.top+1+pad*2}`,preserveAspectRatio:'none'}))box.setAttribute(key,value);
   const img=document.createElementNS(ns,'image');img.setAttribute('href','данные/'+meta.path);img.setAttribute('width',meta.width);img.setAttribute('height',meta.height);box.append(img);wrapper.append(box);svg.append(wrapper);
  }
  container.append(svg);container.hidden=false;
 }
 return {paint};
})();
