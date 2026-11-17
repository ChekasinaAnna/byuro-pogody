'use strict';
const WeatherRules=(()=>{
const SIZE=20, VERSION=3;
const LEVELS=[null,
 {name:'Капля',image:'капля.png',rank:1,family:'water'},
 {name:'Туман',image:'туман.png',rank:2,family:'water'},
 {name:'Облако',image:'облако.png',rank:3,family:'water'},
 {name:'Дождевая туча',image:'туча.png',rank:4,family:'water'},
 {name:'Искра',image:'искра.png',rank:1,family:'light'},
 {name:'Луч',image:'луч.png',rank:2,family:'light'},
 {name:'Солнечный зайчик',image:'зайчик.png',rank:3,family:'light'},
 {name:'Маленькое солнце',image:'солнце.png',rank:4,family:'light'},
 {name:'Дуновение',image:'дуновение.png',rank:1,family:'wind'},
 {name:'Ветерок',image:'ветерок.png',rank:2,family:'wind'},
 {name:'Порыв',image:'порыв.png',rank:3,family:'wind'},
 {name:'Воздушный поток',image:'поток.png',rank:4,family:'wind'}
];
const ORDERS=[
 {id:'rain',title:'Первый дождь',sender:'Смотритель сада',story:'Цветы поникли, а в пруду почти не осталось воды. Пришлите три дождевые тучи, чтобы напоить цветы и наполнить пруд.',needs:[[4,3]],reply:'Дождь пришёл! На листьях снова блестят капли, а пруд наполняется водой. Теперь поможем самым нежным растениям.',reward:'Дождь напоил сад',scene:1},
 {id:'ferns',title:'Утро для папоротников',sender:'Смотритель сада',story:'Папоротникам нужна мягкая влажная дымка. Приготовьте три тумана и оставьте их на этом уровне.',needs:[[2,3]],reply:'Папоротники расправились. В благодарность передаю солнечную линзу — она умеет собирать свет. Попробуйте разбудить наших бабочек!',reward:'Папоротники расправились',scene:2},
 {id:'butterflies',title:'Разбудить бабочек',sender:'Смотритель сада',story:'После дождя бабочки спрятались. Соберите трёх солнечных зайчиков, чтобы согреть все клумбы.',needs:[[7,3]],reply:'Бабочки вернулись! Солнечная линза пригодится и в оранжерее. А художница прислала вам отдельную просьбу.',reward:'На клумбе появились бабочки',scene:3},
 {id:'glasshouse',title:'Свет для оранжереи',sender:'Смотритель сада',story:'Саженцам нужен рассеянный свет. Приготовьте три облака и три луча — вместе они дадут мягкую погоду.',needs:[[3,3],[6,3]],reply:'В оранжерее стало светло и свежо. Сад почти готов к открытию. Осталось устроить маленькое чудо для гостей.',reward:'Оранжерея ожила',scene:4},
 {id:'rainbow',title:'Радуга к открытию',sender:'Смотритель сада',story:'Гости уже в пути. Приготовьте три дождевые тучи и три маленьких солнца — мы составим из них радужный прогноз.',needs:[[4,3],[8,3]],reply:'Над садом появилась радуга! Спасибо вашему бюро за пять добрых прогнозов. Сад готов встречать гостей — первая глава завершена.',reward:'Сад открыт для гостей',scene:5}
];
const SIDE={id:'artist',title:'Облака для художницы',sender:'Художница Лея',story:'Я рисую открытие сада. Пришлите три пушистых облака — хочу поймать их формы на бумаге. Можно после всех важных дел.',needs:[[3,3]],reply:'Облака получились чудесными. Дарю вам открытку с садом — сохраните её на память о нашей первой встрече.',reward:'Получена открытка Леи',scene:3};
const OBS_ORDERS=[
 {id:'path',title:'Тропа на холм',sender:'Смотрительница Нора',story:'Туман укрыл ступени, и до обсерватории трудно добраться. Пришлите три ветерка — они расчистят тропу, а я зажгу фонарь у двери.',needs:[[10,3]],reply:'Ступени снова видны! Я зажгла фонарь у входа. Теперь можно заняться старым флюгером.',reward:'Тропа освободилась',scene:1},
 {id:'vane',title:'Разбудить флюгер',sender:'Смотрительница Нора',story:'Флюгер давно не чувствовал ветра, а воздушный рукав поник. Соберите три уверенных порыва, чтобы оживить их.',needs:[[11,3]],reply:'Флюгер ожил, рукав расправился! Открою вам приём: ветерок разгоняет облако и выпускает луч. Его можно применять в мастерской — или собирать свет обычной линзой.',reward:'Флюгер снова работает',scene:2},
 {id:'window',title:'Карта за стеклом',sender:'Смотрительница Нора',story:'На окне осела пыль. Три тумана помогут её снять, а три луча осветят звёздную карту за стеклом.',needs:[[2,3],[6,3]],reply:'Сквозь чистое окно видна старая карта неба. На ней отмечен Бумажный змей — попробуем найти его сегодня!',reward:'За стеклом появилась карта',scene:3},
 {id:'telescope',title:'Открыть купол',sender:'Смотрительница Нора',story:'Три солнечных зайчика согреют заевший механизм, а три ветерка помогут раскрыть створки. Телескоп уже ждёт.',needs:[[7,3],[10,3]],reply:'Купол открыт, телескоп смотрит в вечернее небо. Осталось разогнать последнюю полосу облаков.',reward:'Телескоп готов к наблюдению',scene:4},
 {id:'constellation',title:'Бумажный змей',sender:'Смотрительница Нора',story:'Нужны три воздушных потока, чтобы очистить небо, и три луча для настройки телескопа. Тогда увидим наше первое созвездие.',needs:[[12,3],[6,3]],reply:'Вот он — Бумажный змей! Обсерватория снова принимает гостей. Дарю вашему бюро звёздную открытку на память о первом наблюдении.',reward:'Первое созвездие найдено',scene:5}
];
function activeChapter(v){return v.observatoryStarted?'observatory':'garden';}
function chapterOrders(v){return v.observatoryStarted?OBS_ORDERS:ORDERS;}
function chapterProgress(v){return v.observatoryStarted?v.observatoryCompleted:v.completed;}
function windUnlocked(v){return v.observatoryStarted;}
function conversionUnlocked(v){return v.observatoryStarted&&v.observatoryCompleted>=2;}
function campaignDone(v){return v.observatoryCompleted===5;}
const counters=v=>['moves','merges','generated'].every(k=>Number.isSafeInteger(v[k])&&v[k]>=0&&v[k]<1000000000);
const cells=(a,n,max=8)=>Array.isArray(a)&&a.length===n&&a.every(x=>Number.isInteger(x)&&x>=0&&x<=max);
function initialState(){return {version:VERSION,board:[1,1,2,0,0,1,2,0,3,0,0,1,1,0,0,0,0,0,0,0],shelf:[0,0,0],completed:0,observatoryStarted:false,observatoryCompleted:0,sideDone:false,moves:0,merges:0,generated:0};}
function validState(v){return !!v&&v.version===VERSION&&cells(v.board,SIZE,12)&&cells(v.shelf,3,12)&&Number.isInteger(v.completed)&&v.completed>=0&&v.completed<=5&&typeof v.sideDone==='boolean'&&(!v.sideDone||v.completed>=3)&&typeof v.observatoryStarted==='boolean'&&Number.isInteger(v.observatoryCompleted)&&v.observatoryCompleted>=0&&v.observatoryCompleted<=5&&(!v.observatoryStarted?v.observatoryCompleted===0&&[...v.board,...v.shelf].every(x=>x<=8):v.completed===5)&&counters(v);}
function restore(text){try{let v=JSON.parse(text);if(v?.version===1&&cells(v.board,SIZE,4)&&typeof v.won==='boolean'&&counters(v)){v={...initialState(),board:[...v.board],completed:v.won?1:0,moves:v.moves,merges:v.merges,generated:v.generated};}else if(v?.version===2&&cells(v.board,SIZE)&&cells(v.shelf,3)&&Number.isInteger(v.completed)&&v.completed>=0&&v.completed<=5&&typeof v.sideDone==='boolean'&&(!v.sideDone||v.completed>=3)&&counters(v)){v={...v,version:VERSION,observatoryStarted:false,observatoryCompleted:0};}if(!validState(v))return null;return {version:VERSION,board:[...v.board],shelf:[...v.shelf],completed:v.completed,observatoryStarted:v.observatoryStarted,observatoryCompleted:v.observatoryCompleted,sideDone:v.sideDone,moves:v.moves,merges:v.merges,generated:v.generated};}catch{return null;}}
function serialize(v){if(!validState(v))throw TypeError('Некорректное сохранение');return JSON.stringify(v);}
function lightUnlocked(v){return v.completed>=2;}
function sideAvailable(v){return v.completed>=3&&!v.sideDone;}
function currentOrder(v,target='story'){return target==='side'?(sideAvailable(v)?SIDE:null):(chapterOrders(v)[chapterProgress(v)]??null);}
function count(v,item){return [...v.board,...v.shelf].filter(x=>x===item).length;}
function ready(v,target='story'){const order=currentOrder(v,target);return !!order&&order.needs.every(([item,n])=>count(v,item)>=n);}
function sceneStage(v){return chapterProgress(v); }
function mass(v){return [...v.board,...v.shelf].reduce((sum,x)=>sum+(x?2**(LEVELS[x].rank-1):0),0);}
const copy=v=>({...v,board:[...v.board],shelf:[...v.shelf]});
const index=(i,n=SIZE)=>Number.isInteger(i)&&i>=0&&i<n;
const canMerge=item=>item>0&&LEVELS[item].rank<4;
function findPair(v){for(let i=0;i<SIZE;i++)if(canMerge(v.board[i]))for(let j=i+1;j<SIZE;j++)if(v.board[i]===v.board[j])return [i,j];return null;}
function fullAdvice(v){if(ready(v))return {type:'deliver',text:'Заявка готова. Отправьте погоду — освободится место.'};if(ready(v,'side'))return {type:'side',text:'Облака для художницы готовы. Отправьте их из письма Леи.'};const pair=findPair(v);if(pair)return {type:'merge',pair,text:'Объедините подсвеченную пару — освободится место.'};if(v.shelf.includes(0))return {type:'store',text:'Выберите предмет и уберите его на свободное место полки.'};return {type:'recycle',text:'Выберите ненужный предмет и верните в прибор. Это действие можно отменить.'};}
function act(state,action){
 if(!validState(state))throw TypeError('Некорректное состояние поля');
 const unchanged=type=>({state,changed:false,type});if(!action)return unchanged('invalid');
 const next=copy(state);const changed=(type,extra={})=>{next.moves++;return {state:next,changed:true,type,...extra};};
 if(action.type==='restart-observatory'){
  if(!state.observatoryStarted)return unchanged('locked');
  next.board=Array(SIZE).fill(0);next.observatoryCompleted=0;return changed('restart-observatory');
 }
 if(action.type==='start-observatory'){
  if(state.completed!==5||state.observatoryStarted)return unchanged('locked');
  next.observatoryStarted=true;next.board=Array(SIZE).fill(0);return changed('start-observatory');
 }
 if(action.type==='convert'){
  if(!conversionUnlocked(state))return unchanged('locked-conversion');
  if(!index(action.from)||!index(action.to)||action.from===action.to||state.board[action.from]!==10||state.board[action.to]!==3)return unchanged('invalid-conversion');
  next.board[action.from]=0;next.board[action.to]=6;return changed('convert',{item:6,index:action.to});
 }
 if(action.type==='spawn'){
  if(action.source!==undefined&&!['water','light','wind'].includes(action.source))return unchanged('invalid');
  if(action.source==='light'&&!lightUnlocked(state))return unchanged('locked');
  if(action.source==='wind'&&!windUnlocked(state))return unchanged('locked');
  if(state.completed===0&&ready(state))return unchanged('deliver-first');
  if(chapterProgress(state)===5&&!sideAvailable(state))return unchanged('finished');
  const empty=next.board.indexOf(0);if(empty<0)return unchanged('full');next.board[empty]=action.source==='wind'?9:action.source==='light'?5:1;next.generated++;return changed('spawn',{index:empty});
 }
 if(action.type==='deliver'){
  const target=action.target??'story';if(!['story','side'].includes(target))return unchanged('invalid');
  const order=currentOrder(state,target);if(!order)return unchanged('finished');if(!ready(state,target))return unchanged('not-ready');
  for(const [item,n] of order.needs){let remaining=n;for(const list of [next.board,next.shelf])for(let i=0;i<list.length&&remaining>0;i++)if(list[i]===item){list[i]=0;remaining--;}}
  if(target==='side')next.sideDone=true;else if(state.observatoryStarted)next.observatoryCompleted++;else next.completed++;
  return changed('deliver',{order,target,unlockedLight:state.completed<2&&next.completed===2,chapter:target==='side'?'garden':activeChapter(state),unlockedConversion:next.observatoryCompleted===2&&state.observatoryCompleted<2,chapterDone:target==='story'&&chapterProgress(next)===5&&chapterProgress(state)<5});
 }
 if(action.type==='store'){
  if(!index(action.from)||!next.board[action.from])return unchanged('invalid');const empty=next.shelf.indexOf(0);if(empty<0)return unchanged('shelf-full');next.shelf[empty]=next.board[action.from];next.board[action.from]=0;return changed('store');
 }
 if(action.type==='retrieve'){
  if(!index(action.from,3)||!next.shelf[action.from])return unchanged('invalid');const empty=next.board.indexOf(0);if(empty<0)return unchanged('full');next.board[empty]=next.shelf[action.from];next.shelf[action.from]=0;return changed('retrieve',{index:empty});
 }
 if(action.type==='recycle'){
  if(!index(action.from)||!next.board[action.from])return unchanged('invalid');const item=next.board[action.from];next.board[action.from]=0;return changed('recycle',{item});
 }
 if(action.type!=='move'||!index(action.from)||!index(action.to)||action.from===action.to||!next.board[action.from])return unchanged('invalid');
 const a=next.board[action.from],b=next.board[action.to];
 if(a===b&&canMerge(a)){next.board[action.from]=0;next.board[action.to]=a+1;next.merges++;return changed('merge',{item:a+1,index:action.to});}
 next.board[action.to]=a;next.board[action.from]=b;return changed(b?'swap':'move',{index:action.to});
}

return {SIZE,VERSION,LEVELS,ORDERS,SIDE,OBS_ORDERS,activeChapter,chapterOrders,chapterProgress,windUnlocked,conversionUnlocked,campaignDone,initialState,validState,restore,mass,act,findPair,serialize,lightUnlocked,sideAvailable,currentOrder,count,ready,sceneStage,fullAdvice};
})();
