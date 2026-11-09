
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

// Keep photo viewing on the page, with an accessible close control.
(function () {
  const links = document.querySelectorAll('.work-gallery__slide, .process-card__photo, .object-case__photo');
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const viewer = document.createElement('dialog');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-label', 'Просмотр фотографии');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'photo-viewer__close';
  close.setAttribute('aria-label', 'Закрыть фотографию');
  close.textContent = '×';
  const photo = document.createElement('img');
  photo.className = 'photo-viewer__image';
  viewer.append(close, photo);
  document.body.append(viewer);
  let opener;
  links.forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      photo.src = link.href;
      photo.alt = link.querySelector('img')?.alt || 'Фотография работ';
      viewer.showModal();
      document.body.classList.add('photo-open');
      close.focus();
    });
  });
  close.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('photo-open');
    photo.removeAttribute('src');
    if (opener) opener.focus({preventScroll: true});
  });
})();

// Request video bytes only after the visitor presses play.
document.querySelectorAll('.process-video').forEach(container => {
  const button = container.querySelector('.process-video__play');
  const video = container.querySelector('video');
  button.addEventListener('click', () => {
    video.src = video.dataset.src;
    video.hidden = false;
    button.hidden = true;
    video.focus();
    video.play().catch(() => {
      // Native controls remain available if the browser blocks playback.
    });
  });
});

// Keep the overview short while leaving every process available on demand.
(function () {
  const toggle = document.getElementById('processes-toggle');
  const extra = document.getElementById('extra-processes');
  if (!toggle || !extra) return;
  extra.hidden = true;
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    extra.hidden = !expanded;
    toggle.textContent = expanded ? 'Свернуть процессы' : 'Все процессы (9)';
  });
})();

// Leave video controls unobstructed while playback is active.
document.querySelectorAll('.process-video__player').forEach(video => {
  const update = () => document.body.classList.toggle('video-playing',
    Array.from(document.querySelectorAll('.process-video__player')).some(player => !player.paused && !player.ended));
  ['play', 'pause', 'ended'].forEach(event => video.addEventListener(event, update));
});
