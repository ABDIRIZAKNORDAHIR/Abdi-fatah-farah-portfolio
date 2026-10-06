import { portfolio } from './portfolio-data';
import { portraits } from './photos';

document.querySelectorAll<HTMLImageElement>('[data-portrait]').forEach(image => {
  const key = image.dataset.portrait as keyof typeof portraits | undefined;
  if (key && portraits[key]) image.src = portraits[key];
});

const projectGrid = document.querySelector<HTMLElement>('#project-grid');
const serviceGrid = document.querySelector<HTMLElement>('#service-grid');
const timeline = document.querySelector<HTMLElement>('#timeline');
const galleryGrid = document.querySelector<HTMLElement>('#gallery-grid');
const repoGrid = document.querySelector<HTMLElement>('#repo-grid');
const filterBar = document.querySelector<HTMLElement>('#project-filters');
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);

const externalLink = (href: string, label: string, className: string) =>
  '<a class="' + className + '" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' + label + ' <span aria-hidden="true">↗</span></a>';

if (projectGrid) {
  projectGrid.innerHTML = portfolio.projects.map(project => {
    const live = 'live' in project && project.live ? externalLink(project.live, 'Live 24/7', 'project-live') : '';
    const github = 'github' in project && project.github ? externalLink(project.github, 'GitHub', 'project-github') : '';
    return '<article class="project-card reveal" data-language="' + escapeHtml(project.language) + '"><div class="project-art art-' + project.kind + '" aria-hidden="true"><span>' + project.number + '</span><i></i><b>' + project.language + '</b></div><div class="project-copy"><span class="project-tag">' + project.language + '</span><h3>' + escapeHtml(project.title) + '</h3><p>' + escapeHtml(project.description) + '</p><div class="project-actions">' + live + github + '<a href="#contact" class="project-link" aria-label="Ask about ' + escapeHtml(project.title) + '">Discuss <span aria-hidden="true">↗</span></a></div></div></article>';
  }).join('');
}

if (filterBar && projectGrid) {
  const languages = ['All', ...new Set(portfolio.projects.map(project => project.language))];
  filterBar.innerHTML = languages.map((language, index) =>
    '<button type="button" class="filter-chip' + (index === 0 ? ' is-active' : '') + '" data-filter="' + escapeHtml(language) + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' + escapeHtml(language) + '</button>'
  ).join('');
  filterBar.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.filter-chip');
    if (!button) return;
    const filter = button.dataset.filter || 'All';
    filterBar.querySelectorAll<HTMLButtonElement>('.filter-chip').forEach(chip => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    projectGrid.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
      const show = filter === 'All' || card.dataset.language === filter;
      card.hidden = !show;
      if (show) card.classList.add('is-visible');
    });
  });
}

if (repoGrid) {
  repoGrid.innerHTML = portfolio.repositories.map(repo => {
    const live = repo.live ? externalLink(repo.live, 'Open live', 'repo-live') : '';
    return '<article class="repo-card reveal"><span class="project-tag">' + escapeHtml(repo.language) + '</span><h3>' + escapeHtml(repo.name) + '</h3><p>' + escapeHtml(repo.description) + '</p><div class="project-actions">' + live + externalLink(repo.url, 'GitHub', 'project-github') + '</div></article>';
  }).join('');
}

if (serviceGrid) serviceGrid.innerHTML = portfolio.services.map((service, index) => '<article class="service-card reveal"><span class="service-number">0' + (index + 1) + '</span><span class="service-icon" aria-hidden="true">' + service.icon + '</span><h3>' + escapeHtml(service.title) + '</h3><p>' + escapeHtml(service.description) + '</p><a href="#contact" aria-label="Ask about ' + escapeHtml(service.title) + '">Start a conversation <span aria-hidden="true">↗</span></a></article>').join('');
if (timeline) timeline.innerHTML = portfolio.timeline.map(item => '<article class="timeline-item reveal"><span class="timeline-date">' + item.year + ' · ' + item.language + '</span><div class="timeline-dot" aria-hidden="true"></div><div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p></div></article>').join('');
if (galleryGrid) galleryGrid.innerHTML = portfolio.gallery.map((item, index) => '<figure class="gallery-item reveal gallery-item-' + (index + 1) + '" role="button" tabindex="0" aria-label="Open photo: ' + escapeHtml(item.alt) + '"><img src="' + portraits[item.image as keyof typeof portraits] + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" decoding="async" /><figcaption>' + escapeHtml(item.label) + '</figcaption></figure>').join('');

const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}));

const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
const savedTheme = localStorage.getItem('abdel-fattah-theme');
if (savedTheme === 'light') document.body.classList.add('theme-light');
const updateThemeButton = () => {
  const light = document.body.classList.contains('theme-light');
  themeToggle?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle?.setAttribute('aria-pressed', String(light));
  if (themeToggle) themeToggle.innerHTML = light ? '<span aria-hidden="true">☾</span>' : '<span aria-hidden="true">☼</span>';
};
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('theme-light');
  localStorage.setItem('abdel-fattah-theme', document.body.classList.contains('theme-light') ? 'light' : 'dark');
  updateThemeButton();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = (root: ParentNode = document) => {
  const items = root.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
};
reveal();

const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('#main-nav a')];
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
  }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => activeObserver.observe(section));
}
const header = document.querySelector<HTMLElement>('#site-header');
const progressBar = document.querySelector<HTMLElement>('#scroll-progress');
const updateScrollUi = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 14);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
};
updateScrollUi();
window.addEventListener('scroll', updateScrollUi, { passive: true });

const clock = document.querySelector<HTMLElement>('#live-clock');
const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Mogadishu',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
});
const paintClock = () => {
  if (clock) clock.textContent = clockFormat.format(new Date());
};
paintClock();
window.setInterval(paintClock, 1000);

const lightbox = document.querySelector<HTMLElement>('#lightbox');
const lightboxImage = document.querySelector<HTMLImageElement>('#lightbox-image');
const lightboxCaption = document.querySelector<HTMLElement>('#lightbox-caption');
let lightboxIndex = 0;
const showPhoto = (index: number) => {
  const item = portfolio.gallery[index];
  if (!item || !lightboxImage || !lightboxCaption) return;
  lightboxIndex = index;
  lightboxImage.src = portraits[item.image as keyof typeof portraits];
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.label + ' · ' + (index + 1) + ' / ' + portfolio.gallery.length;
};
const openLightbox = (index: number) => {
  showPhoto(index);
  lightbox?.removeAttribute('hidden');
  document.body.classList.add('no-scroll');
};
const closeLightbox = () => {
  lightbox?.setAttribute('hidden', '');
  document.body.classList.remove('no-scroll');
};
const stepPhoto = (direction: number) => showPhoto((lightboxIndex + direction + portfolio.gallery.length) % portfolio.gallery.length);
document.querySelectorAll<HTMLElement>('.gallery-item').forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
  item.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openLightbox(index);
  });
});
document.querySelector('#lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('#lightbox-prev')?.addEventListener('click', () => stepPhoto(-1));
document.querySelector('#lightbox-next')?.addEventListener('click', () => stepPhoto(1));
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (lightbox?.hasAttribute('hidden')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') stepPhoto(-1);
  if (event.key === 'ArrowRight') stepPhoto(1);
});

const form = document.querySelector<HTMLFormElement>('#contact-form');
const note = document.querySelector<HTMLElement>('#form-note');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const text = 'Hello Abdi fatah farah, I am ' + name + ' (' + email + '). ' + message;
  const link = 'https://wa.me/' + portfolio.whatsapp + '?text=' + encodeURIComponent(text);
  window.open(link, '_blank', 'noopener,noreferrer');
  if (note) note.textContent = 'Your message is ready in WhatsApp. Review it and press send when you are ready.';
});
const year = document.querySelector<HTMLElement>('#year');
if (year) year.textContent = String(new Date().getFullYear());
