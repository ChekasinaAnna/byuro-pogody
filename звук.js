const WeatherSound=(()=>{
 'use strict';
 const names={water:'капля',wind:'ветер',merge:'слияние',light:'свет',deliver:'доставка'};
 const pool=[];let enabled=true,volume=.65,onStatus=()=>{};
 function configure(options){if(typeof options.enabled==='boolean')enabled=options.enabled;if(Number.isFinite(options.volume))volume=Math.max(0,Math.min(1,options.volume));if(options.onStatus)onStatus=options.onStatus;for(const a of pool){a.volume=volume;if(!enabled||volume===0)a.pause();}}
 async function play(kind='water',test=false){if(!enabled||volume===0){if(test)onStatus('Звук выключен или громкость на нуле.',false);return false;}const audio=new Audio('данные/звуки/'+(names[kind]||names.water)+'.wav');audio.preload='auto';audio.volume=volume;audio.dataset.sound=kind;audio.hidden=true;document.body.append(audio);pool.push(audio);while(pool.length>8){const old=pool.shift();old.pause();old.remove();}try{await audio.play();onStatus(test?'Проверочный аккорд воспроизводится. Если его не слышно, проверьте громкость устройства и звук вкладки.':'Звуки включены.',true);return true;}catch(error){onStatus(error.name==='NotAllowedError'?'Браузер не разрешил звук. Нажмите «Проверить звук» ещё раз и проверьте разрешения вкладки.':'Не удалось воспроизвести звук. Проверьте звук вкладки и повторите проверку.',false);return false;}}
 return {configure,play};
})();
