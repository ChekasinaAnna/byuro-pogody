const WeatherMotion=(()=>{
 'use strict';
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 let preference=false,descriptor=null,layer=null,control=null,frame=null;
 const flights=new Set();
 const butterflies=[
  {color:'blue',x:25,y:36,early:[24,38],size:4.4,seconds:13,delay:-2,wing:1.1,angle:-16,dx:120,dy:-65},
  {color:'yellow',x:12.5,y:40,early:[58,49],size:4.4,seconds:17,delay:-7,wing:1.35,angle:18,dx:150,dy:65},
  {color:'yellow',x:55.5,y:49,early:[75,37],size:4,seconds:15,delay:-10,wing:.95,angle:-12,dx:-130,dy:90},
  {color:'blue',x:64,y:63,early:[64,62],size:4.6,seconds:19,delay:-4,wing:1.25,angle:12,dx:135,dy:-80},
  {color:'yellow',x:75,y:56,early:[81,58],size:4.8,seconds:14,delay:-8,wing:1.5,angle:-20,dx:-145,dy:-75},
  {color:'blue',x:92,y:38,early:[88,36],size:4.2,seconds:18,delay:-12,wing:1.05,angle:16,dx:-130,dy:80}
 ];
 const reduced=()=>preference||media.matches;
 function stopFlights(){for(const effect of flights)effect.cancel();flights.clear();}
 function controls(){if(!control)return;const available=descriptor&&(descriptor.place==='observatory'||descriptor.place==='garden'&&descriptor.stage>0);control.hidden=!available;control.disabled=media.matches;control.textContent=media.matches?'Движение отключено системой':preference?'Включить движение':'Остановить движение';control.setAttribute('aria-pressed',String(!reduced()));}
 function align(){if(!descriptor||!layer)return;const img=descriptor.image;if(!img.naturalWidth||!frame.clientWidth||!frame.clientHeight)return;const width=frame.clientWidth,height=frame.clientHeight,scale=Math.max(width/img.naturalWidth,height/img.naturalHeight),paintedWidth=img.naturalWidth*scale,paintedHeight=img.naturalHeight*scale;Object.assign(layer.style,{width:paintedWidth+'px',height:paintedHeight+'px',left:(width-paintedWidth)/2+'px',top:(height-paintedHeight)/2+'px'});}
 function image(src,cls){const img=document.createElement('img');img.src='данные/'+src;img.alt='';img.draggable=false;img.className=cls;return img;}
 function paint(){if(!layer)return;layer.replaceChildren();layer.hidden=true;controls();if(!descriptor)return;if(descriptor.place==='observatory'){layer.classList.toggle('motion-still',reduced());layer.classList.toggle('motion-paused',document.hidden);align();ObservatoryMotion.paint(layer,descriptor.stage);return;}if(descriptor.place!=='garden'||descriptor.stage===0)return;const stage=descriptor.stage,still=reduced();layer.dataset.stage=String(stage);layer.classList.toggle('motion-paused',document.hidden);layer.classList.toggle('motion-still',still);align();
  if(!still){for(const [i,[x,y]] of [[14,70],[29,74],[36,67]].entries()){const ring=document.createElement('i');ring.className='pond-ripple'+(stage===1?' rain-ripple':'');ring.style.left=x+'%';ring.style.top=y+'%';ring.style.setProperty('--delay',(-i*1.7)+'s');layer.append(ring);}
   if(stage>=2){const leaf=document.createElement('span');leaf.className='ambient-foliage'+(stage===2?' sways':'');leaf.append(image('веточка-движение.png','foliage-image'));layer.append(leaf);}
  }
  if(stage>=3)butterflies.forEach((b,i)=>{const path=document.createElement('span');path.className='butterfly-path path-'+i;path.dataset.color=b.color;const [x,y]=stage===3?b.early:[b.x,b.y];Object.assign(path.style,{left:x+'%',top:y+'%',width:b.size+'%'});for(const [key,value] of Object.entries({'--duration':b.seconds+'s','--delay':b.delay+'s','--wing':b.wing+'s','--angle':b.angle+'deg','--dx':b.dx+'%','--dy':b.dy+'%'}))path.style.setProperty(key,value);const flutter=document.createElement('span');flutter.className='butterfly-flutter';flutter.append(image(b.color==='blue'?'бабочка-движение.png':'бабочка-жёлтая.png','butterfly-image'));path.append(flutter);layer.append(path);});
  layer.hidden=layer.childElementCount===0;
 }
 function init(){layer=document.getElementById('scene-effects');control=document.getElementById('scene-motion');frame=document.getElementById('scene-visual');if(frame&&typeof ResizeObserver==='function')new ResizeObserver(align).observe(frame);const changed=()=>{if(reduced())stopFlights();paint();};if(media.addEventListener)media.addEventListener('change',changed);else media.addListener(changed);document.addEventListener('visibilitychange',()=>{layer?.classList.toggle('motion-paused',document.hidden);if(document.hidden)stopFlights();});controls();}
 function configure({reduced:value}){const changed=preference!==Boolean(value);preference=Boolean(value);if(reduced())stopFlights();if(changed)paint();else controls();}
 function scene(options){descriptor=options;paint();}
 function clearScene(){descriptor=null;if(layer){layer.replaceChildren();layer.hidden=true;layer.removeAttribute('data-stage');}controls();}
 function animate(element,keyframes,options,cleanup){if(typeof element.animate!=='function')return;const effect=element.animate(keyframes,options);flights.add(effect);effect.finished.then(()=>{flights.delete(effect);cleanup?.();},()=>{flights.delete(effect);cleanup?.();});return effect;}
 function spawn({from,to,itemImage,family}){if(reduced()||document.hidden||!from||!to)return;const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();if(a.width===0||a.height===0)return;animate(from,[{transform:'scale(1)'},{transform:'scale(.95) rotate('+(family==='light'?'-2':'1')+'deg)'},{transform:'scale(1)'}],{duration:300,easing:'ease-out'});
  if(b.bottom<0||b.top>innerHeight||a.bottom<0||a.top>innerHeight||typeof Element.prototype.animate!=='function')return;const particle=document.createElement('img');particle.src=itemImage;particle.alt='';particle.className='weather-flight';particle.setAttribute('aria-hidden','true');const x=a.x+a.width/2-22,y=a.y+a.height/2-22,dx=b.x+b.width/2-22-x,dy=b.y+b.height/2-22-y;Object.assign(particle.style,{left:x+'px',top:y+'px'});document.body.append(particle);animate(particle,[{transform:'translate3d(0,0,0) scale(.7)',opacity:0},{transform:`translate3d(${dx*.4}px,${dy*.4-20}px,0) scale(1)`,opacity:.9,offset:.45},{transform:`translate3d(${dx}px,${dy}px,0) scale(.65)`,opacity:0}],{duration:520,easing:'cubic-bezier(.22,.6,.35,1)'},()=>particle.remove());
 }
 return {init,configure,scene,clearScene,spawn};
})();
