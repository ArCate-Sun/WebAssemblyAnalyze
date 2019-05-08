function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    // temp.onload = function()
    // {
    //     // 放在页面不好看，执行完后移除掉
    //     this.parentNode.removeChild(this);
    // };
    document.head.appendChild(temp);
}
(function () {
    var ie =!!(window.attachEvent&&!window.opera),wk=/webkit\/(\d+)/i.test(navigator.userAgent)&&(RegExp.$1<525);
    var fn =[],run=function(){for(var i=0;i<fn.length;i++)fn[i]();},d=document;d.ready=function(f){
    if(!ie&&!wk&&d.addEventListener){returnd.addEventListener('DOMContentLoaded',f,false);}if(fn.push(f)>1)return;
    if(ie)(function(){try{d.documentElement.doScroll('left');run();}catch(err){setTimeout(arguments.callee,0);}})();
    else if(wk)var t=setInterval(function(){if(/^(loaded|complete)$/.test(d.readyState))clearInterval(t),run();},0);};
 })();

window.onload = function() {
    
}