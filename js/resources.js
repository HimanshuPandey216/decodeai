/**
 * DECODE AI - Resource Data Service & UI Renderer
 * Handles data fetching, filtering, card rendering, and detail view parsing.
 */

const ResourceService = (function () {
  let cache = null;

  async function getAll() {
    if (cache) return cache;
    try {
      const res = await fetch('data/resources.json');
      if (!res.ok) throw new Error('Failed to fetch resources');
      cache = await res.json();
      return cache;
    } catch (err) {
      console.error('ResourceService error:', err);
      return [];
    }
  }

  async function getBySlug(slug) {
    const resources = await getAll();
    return resources.find(r => r.slug === slug) || null;
  }

  async function getFeatured() {
    const resources = await getAll();
    return resources.filter(r => r.featured);
  }

  async function getByCategory(category) {
    const resources = await getAll();
    return resources.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  function renderResourceCard(item) {
    const badgeClass = getBadgeClass(item.type);
    const levelClass = getLevelClass(item.level);

    return `
      <div class="glass-card resource-card">
        <div>
          <div class="card-badges">
            <span class="badge ${badgeClass}">${escapeHtml(item.type)}</span>
            <span class="level-pill ${levelClass}">● ${escapeHtml(item.level)}</span>
          </div>
          
          <h3 class="resource-card-title">
            <a href="resource-detail.html?slug=${item.slug}">${escapeHtml(item.title)}</a>
          </h3>
          
          <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            ${escapeHtml(item.description)}
          </p>
          
          <div class="resource-tags">
            ${(item.tags || []).slice(0, 3).map(tag => `<span class="tag-pill">#${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
        
        <div class="resource-card-footer">
          <div class="contributor-meta">
            <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(item.contributor || item.author)}</span>
          </div>
          <span>${escapeHtml(item.estimatedReadingTime || '5 min')}</span>
        </div>
      </div>
    `;
  }

  function getBadgeClass(type) {
    switch (type) {
      case 'NOTES': return 'badge-notes';
      case 'PDF': return 'badge-pdf';
      case 'ROADMAP': return 'badge-roadmap';
      case 'BOOK NOTES': return 'badge-book';
      case 'RESEARCH': return 'badge-research';
      case 'TUTORIAL': return 'badge-tutorial';
      case 'CHEATSHEET': return 'badge-cheatsheet';
      case 'INTERVIEW': return 'badge-interview';
      default: return 'badge-notes';
    }
  }

  function getLevelClass(level) {
    switch (level) {
      case 'Beginner': return 'level-beginner';
      case 'Intermediate': return 'level-intermediate';
      case 'Advanced': return 'level-advanced';
      default: return 'level-beginner';
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    getAll,
    getBySlug,
    getFeatured,
    getByCategory,
    renderResourceCard,
    getBadgeClass,
    getLevelClass
  };
})();

// Page-specific initialization hooks
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Featured Resources grid on Homepage
  const featuredContainer = document.getElementById('featured-resources-grid');
  if (featuredContainer) {
    const featured = await ResourceService.getFeatured();
    if (featured.length > 0) {
      featuredContainer.innerHTML = featured.map(ResourceService.renderResourceCard).join('');
    } else {
      featuredContainer.innerHTML = '<p class="text-muted">No featured resources available.</p>';
    }
  }

  // 2. Full Explorer Grid on resources.html
  const explorerContainer = document.getElementById('explorer-resources-grid');
  if (explorerContainer) {
    const allResources = await ResourceService.getAll();
    let currentFiltered = [...allResources];

    function applyFilters() {
      const searchInput = document.getElementById('filter-search');
      const categorySelect = document.getElementById('filter-category');
      const levelSelect = document.getElementById('filter-level');
      const typeSelect = document.getElementById('filter-type');
      const countEl = document.getElementById('resource-count-badge');

      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const category = categorySelect ? categorySelect.value : 'all';
      const level = levelSelect ? levelSelect.value : 'all';
      const type = typeSelect ? typeSelect.value : 'all';

      currentFiltered = allResources.filter(item => {
        const matchesQuery = !query || 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(t => t.toLowerCase().includes(query));

        const matchesCat = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
        const matchesLevel = level === 'all' || item.level.toLowerCase() === level.toLowerCase();
        const matchesType = type === 'all' || item.type.toLowerCase() === type.toLowerCase();

        return matchesQuery && matchesCat && matchesLevel && matchesType;
      });

      if (countEl) {
        countEl.textContent = `${currentFiltered.length} Resources`;
      }

      if (currentFiltered.length === 0) {
        explorerContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="glass-card">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
            <h3>No matching resources found</h3>
            <p style="margin-top: 0.5rem;" class="text-muted">Try resetting your filter parameters or search term.</p>
            <button id="btn-reset-filters" class="btn btn-secondary" style="margin-top: 1.5rem;">Reset Filters</button>
          </div>
        `;
        document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (categorySelect) categorySelect.value = 'all';
          if (levelSelect) levelSelect.value = 'all';
          if (typeSelect) typeSelect.value = 'all';
          applyFilters();
        });
      } else {
        explorerContainer.innerHTML = currentFiltered.map(ResourceService.renderResourceCard).join('');
      }
    }

    // Attach listeners
    ['filter-search', 'filter-category', 'filter-level', 'filter-type'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFilters);
      }
    });

    // Check URL parameters for direct category navigation (e.g. resources.html?category=LLMs)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam && document.getElementById('filter-category')) {
      document.getElementById('filter-category').value = catParam;
    }

    applyFilters();
  }

  // 3. Detail Reader view on resource-detail.html
  const detailContainer = document.getElementById('resource-detail-container');
  if (detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      detailContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 4rem 1rem;">
          <h2>No Resource Specified</h2>
          <p style="margin-top: 1rem;">Please return to the Resource Explorer to pick a study guide.</p>
          <a href="resources.html" class="btn btn-primary" style="margin-top: 1.5rem;">Back to Explorer</a>
        </div>
      `;
      return;
    }

    const item = await ResourceService.getBySlug(slug);

    if (!item) {
      detailContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📑</div>
          <h2>Concept Not Found</h2>
          <p style="margin-top: 1rem;" class="text-muted">The resource "${slug}" has not been decoded yet or was relocated.</p>
          <a href="resources.html" class="btn btn-primary" style="margin-top: 1.5rem;">Back to Knowledge Base</a>
        </div>
      `;
      return;
    }

    // Render detail layout
    document.title = `${item.title} — Decode AI`;

    let actionButton = '';
    let viewerHTML = '';

    if (item.file) {
      if (item.file.endsWith('.pdf')) {
        viewerHTML = `
          <div style="margin-top: 2rem; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-surface);">
            <iframe src="${item.file}" style="width: 100%; height: 750px; border: none;" title="PDF Reader"></iframe>
          </div>
        `;
        actionButton = `<a href="${item.file}" download class="btn btn-outline">Download PDF</a>`;
      } else {
        // Embedded HTML note reader
        viewerHTML = `
          <div style="margin-top: 2rem; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-color); background: var(--bg-surface);">
            <iframe src="${item.file}" style="width: 100%; height: 800px; border: none;" id="note-iframe" title="HTML Note Reader"></iframe>
          </div>
        `;
        actionButton = `<a href="${item.file}" target="_blank" class="btn btn-outline">Open Fullscreen</a>`;
      }
    } else if (item.externalLink) {
      viewerHTML = `
        <div class="glass-card" style="margin-top: 2rem; text-align: center; padding: 3rem 1.5rem;">
          <h3>External Resource Reference</h3>
          <p style="margin-top: 0.75rem;">This guide references an external publication or paper.</p>
          <a href="${item.externalLink}" target="_blank" rel="noopener" class="btn btn-primary" style="margin-top: 1.5rem;">Open External Link ↗</a>
        </div>
      `;
    }

    detailContainer.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <a href="resources.html" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; margin-bottom: 1.5rem;">
          ← Back to All Resources
        </a>
        
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <span class="badge ${ResourceService.getBadgeClass(item.type)}">${item.type}</span>
          <span class="level-pill ${ResourceService.getLevelClass(item.level)}">● ${item.level}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">• ${item.category}</span>
        </div>
        
        <h1 style="margin-bottom: 1rem;">${item.title}</h1>
        <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">${item.description}</p>
        
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; padding: 1rem 0; border-y: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Contributor</div>
              <div style="font-weight: 600; color: var(--text-primary);">${item.contributor || item.author}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Reading Time</div>
              <div style="font-weight: 600; color: var(--text-primary);">${item.estimatedReadingTime || '10 min'}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Published</div>
              <div style="font-weight: 600; color: var(--text-primary);">${item.date || '2026'}</div>
            </div>
          </div>
          
          <div>${actionButton}</div>
        </div>
      </div>
      
      ${viewerHTML}
    `;
  }
});
