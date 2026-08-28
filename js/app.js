/**
 * DECODE AI - Main Application Initializer
 * Handles logo fallback logic, navigation state, mobile drawer, statistics, and page hooks.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoFallback();
  initMobileMenu();
  highlightActiveNavLink();
  initStatsCounters();
  initRoadmapsView();
});

/**
 * Ensures logo.png works seamlessly.
 * If /assets/logo.png fails to load, replaces image element with a visually attractive fallback logo badge.
 */
function initLogoFallback() {
  const logoImgs = document.querySelectorAll('.js-logo-img');
  
  logoImgs.forEach(img => {
    img.onerror = function () {
      const parent = img.parentElement;
      if (parent) {
        const fallbackBadge = document.createElement('div');
        fallbackBadge.className = 'logo-placeholder';
        fallbackBadge.setAttribute('aria-label', 'DECODE AI Logo Placeholder');
        fallbackBadge.textContent = 'D';
        
        img.style.display = 'none';
        parent.insertBefore(fallbackBadge, img);
      }
    };

    // Trigger check if src is broken or missing
    if (img.complete && img.naturalWidth === 0) {
      img.onerror();
    }
  });
}

/**
 * Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });
  }
}

/**
 * Highlights current page link in main navigation bar
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Loads dynamic statistics from DECODE_CONFIG
 */
function initStatsCounters() {
  if (typeof DECODE_CONFIG === 'undefined' || !DECODE_CONFIG.stats) return;

  DECODE_CONFIG.stats.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (el) {
      el.textContent = stat.number;
    }
  });
}

/**
 * Interactive Roadmap view handler for roadmaps.html
 */
async function initRoadmapsView() {
  const container = document.getElementById('roadmap-pipeline-container');
  if (!container) return;

  try {
    const res = await fetch('data/roadmaps.json');
    if (!res.ok) return;
    const roadmaps = await res.json();
    const activeRoadmap = roadmaps[0]; // AI Engineer roadmap default

    if (activeRoadmap && activeRoadmap.stages) {
      container.innerHTML = activeRoadmap.stages.map(stage => `
        <div class="glass-card roadmap-node" onclick="alert('Stage ${stage.step}: ${stage.name}\\n\\n${stage.description}\\n\\nRecommended Topics: ${stage.topics.join(', ')}')">
          <div class="node-number">${stage.step}</div>
          <div class="node-content">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.35rem;">${stage.name}</h3>
            <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">${stage.description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${stage.topics.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('Roadmaps view load error:', err);
  }
}
