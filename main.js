
(function(){
  var header=document.getElementById('header');
  var root=document.documentElement;
  function setH(){root.style.setProperty('--header-h',header.offsetHeight+'px');}
  setH();
  window.addEventListener('resize',setH);
  window.addEventListener('load',setH);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(setH);}

  var burger=document.getElementById('burger');
  var menu=document.getElementById('menu');
  function toggle(open){
    burger.setAttribute('aria-expanded',open);
    burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    menu.classList.toggle('is-open',open);
    menu.setAttribute('aria-hidden',!open);
    document.body.classList.toggle('lock',open);
  }
  burger.addEventListener('click',function(){toggle(burger.getAttribute('aria-expanded')!=='true');});
  menu.addEventListener('click',function(e){if(e.target.closest('a')){toggle(false);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){toggle(false);}});
  window.addEventListener('resize',function(){if(window.innerWidth>980){toggle(false);}});

})();
