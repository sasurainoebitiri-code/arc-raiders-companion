/**
 * ARC Raiders 総合攻略ツール - Google Apps Script 入口
 * アプリ本体は GitHub Pages に置いてあり、この GAS はそれを全画面で表示します。
 * マップイベントの予定は ARC Raiders Wiki（CC BY-SA）から取得して本体に渡します（10分キャッシュ）。
 */
var APP_URL = 'https://sasurainoebitiri-code.github.io/arc-raiders-companion/';
var ROTATION_URL = 'https://arcraiders.wiki/w/extensions/ConditionRotation/map_rotation.json';

function doGet() {
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">'
    + '<style>html,body{margin:0;height:100%;background:#0e1116}iframe{border:0;width:100%;height:100%;display:block}</style></head><body>'
    + '<iframe id="app" src="' + APP_URL + '" allow="autoplay; clipboard-write"></iframe>'
    + '<script>'
    + 'var f=document.getElementById("app");'
    + 'function push(){google.script.run.withSuccessHandler(function(t){try{f.contentWindow.postMessage({type:"arcRot",data:t},"*");}catch(e){}}).getRotation();}'
    + 'window.addEventListener("message",function(e){if(e.data&&e.data.type==="arcReady")push();});'
    + 'setInterval(push,600000);'
    + '</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('ARC Raiders 総合攻略ツール')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getRotation() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('rotation');
  if (hit) return hit;
  try {
    var res = UrlFetchApp.fetch(ROTATION_URL, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return '[]';
    var text = res.getContentText();
    JSON.parse(text);
    if (text.length < 100000) cache.put('rotation', text, 600);
    return text;
  } catch (e) {
    return '[]';
  }
}

// 最初に一度だけ実行して、外部URL取得の許可を出してください。
function authorize() { Logger.log(getRotation().length); }
