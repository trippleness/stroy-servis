
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


  const track = document.getElementById('work-gallery-track');
  if (track) {
    const previous = document.querySelector('.work-gallery__arrow--prev');
    const next = document.querySelector('.work-gallery__arrow--next');
    const slides = Array.from(track.children);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateArrows() {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }
    function move(direction) {
      const left = track.getBoundingClientRect().left;
      const positions = slides.map(slide => slide.getBoundingClientRect().left - left + track.scrollLeft);
      const target = direction > 0
        ? positions.find(position => position > track.scrollLeft + 4)
        : positions.slice().reverse().find(position => position < track.scrollLeft - 4);
      track.scrollTo({left: target === undefined ? (direction > 0 ? track.scrollWidth : 0) : target,
        behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    track.addEventListener('scroll', updateArrows, {passive: true});
    window.addEventListener('resize', updateArrows);
    window.addEventListener('load', updateArrows);
    updateArrows();
  }
})();
