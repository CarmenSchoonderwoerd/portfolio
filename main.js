/**
 * Carmen Schoonderwoerd Portfolio
 * Interactive Horizontal Exhibition & Navigation Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHorizontalScroll();
  initNavigation();
  initHeaderState();
});

/**
 * Horizontal Scroll Exhibition for Projects
 */
function initHorizontalScroll() {
  const wrapper = document.querySelector('.projects-scroll-wrapper');
  const track = document.getElementById('projectsTrack');
  const viewport = document.querySelector('.projects-sticky-viewport');

  if (!wrapper || !track) return;

  let maxTranslate = 0;
  let isMobile = window.innerWidth <= 850;

  function calculateDimensions() {
    isMobile = window.innerWidth <= 850;

    if (isMobile) {
      wrapper.style.height = 'auto';
      track.style.transform = 'none';
      return;
    }

    // Measure total horizontal width minus viewport width
    const scrollWidth = track.scrollWidth;
    const windowWidth = window.innerWidth;
    maxTranslate = Math.max(0, scrollWidth - windowWidth);

    // Set wrapper vertical height to accommodate the horizontal distance
    wrapper.style.height = `${maxTranslate + window.innerHeight}px`;

    // Apply current position immediately
    updateScroll();
  }

  function updateScroll() {
    if (isMobile) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTop = wrapper.offsetTop;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Relative scroll distance inside wrapper
    const relativeY = scrollY - wrapperTop;

    if (relativeY <= 0) {
      track.style.transform = 'translate3d(0, 0, 0)';
    } else if (relativeY >= maxTranslate) {
      track.style.transform = `translate3d(${-maxTranslate}px, 0, 0)`;
    } else {
      // Progress from 0 to 1
      const progress = relativeY / maxTranslate;
      const translateX = -progress * maxTranslate;
      track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    }
  }

  // Bind scroll with requestAnimationFrame for 60fps performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    calculateDimensions();
  });

  // Calculate initially and when images finish loading
  calculateDimensions();

  const projectImages = track.querySelectorAll('img');
  projectImages.forEach(img => {
    if (img.complete) {
      calculateDimensions();
    } else {
      img.addEventListener('load', calculateDimensions);
    }
  });

  // Small delay to ensure all CSS styles & fonts are rendered
  setTimeout(calculateDimensions, 250);
}

/**
 * Smooth Navigation Handling (Projects, About, Contact, Hero)
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 80;
      let targetY = 0;

      if (targetId === '#top' || targetId === '#hero') {
        targetY = 0;
      } else if (targetId === '#projects') {
        // Scroll right to the top of the projects scroll container
        targetY = targetEl.offsetTop - headerHeight;
      } else if (targetId === '#about' || targetId === '#contact') {
        // Target element is positioned after the scroll wrapper
        targetY = targetEl.offsetTop - headerHeight;
      }

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    });
  });

  // Update active state in navigation based on current section
  const sections = [
    { id: 'projects', el: document.getElementById('projects') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'contact', el: document.getElementById('contact') }
  ];

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = header ? header.offsetHeight : 80;
    const threshold = scrollY + headerHeight + 50;

    let currentSection = '';

    sections.forEach(({ id, el }) => {
      if (!el) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (threshold >= top && threshold < bottom) {
        currentSection = id;
      }
    });

    document.querySelectorAll('.site-nav .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}

/**
 * Header state on scroll
 */
function initHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}
