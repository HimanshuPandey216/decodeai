/**
 * DECODE AI - Global Search Engine & Modal Manager
 * Supports instant search across resources, notes, books, roadmaps, research, tags & categories.
 * Shortcut: Ctrl+K or Cmd+K
 */

(function () {
  let searchData = [];
  let modalBackdrop = null;
  let searchInput = null;
  let searchResultsContainer = null;

  async function loadSearchData() {
    try {
      const response = await fetch('data/resources.json');
      if (response.ok) {
        searchData = await response.json();
      }
    } catch (e) {
      console.warn('Search data load fallback:', e);
    }
  }

  function createSearchModalUI() {
    if (document.getElementById('search-modal-backdrop')) return;

    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'search-modal-backdrop';
    modalBackdrop.className = 'search-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="search-modal" role="dialog" aria-modal="true" aria-label="Global Search">
        <div class="search-modal-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="global-search-input" class="search-modal-input" placeholder="Search notes, books, concepts, roadmaps... (Type keyword)" autocomplete="off">
          <span class="kbd-shortcut">ESC</span>
        </div>
        <div id="search-results-list" class="search-results-list">
          <div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
            Start typing to search Decode AI knowledge base...
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    searchInput = document.getElementById('global-search-input');
    searchResultsContainer = document.getElementById('search-results-list');

    // Backdrop click to close
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeSearchModal();
      }
    });

    // Real-time search query listener
    searchInput.addEventListener('input', (e) => {
      handleSearchQuery(e.target.value.trim());
    });
  }

  function openSearchModal() {
    createSearchModalUI();
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      setTimeout(() => searchInput && searchInput.focus(), 50);
    }
  }

  function closeSearchModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  function handleSearchQuery(query) {
    if (!query) {
      searchResultsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
          Start typing to search Decode AI knowledge base...
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    const matches = searchData.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</div>
          No resources found for "<strong style="color: var(--text-primary);">${escapeHtml(query)}</strong>"
          <div style="font-size: 0.85rem; margin-top: 0.5rem;">Try searching for "Transformers", "RAG", "PyTorch", or "Roadmap"</div>
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = matches.map(item => `
      <a href="resource-detail.html?slug=${item.slug}" class="search-result-item" onclick="window.closeSearchModal && window.closeSearchModal()">
        <div class="search-result-title">${escapeHtml(item.title)}</div>
        <div class="search-result-meta">
          <span class="badge badge-${getTypeBadgeClass(item.type)}">${escapeHtml(item.type)}</span>
          <span>• ${escapeHtml(item.category)}</span>
          <span>• ${escapeHtml(item.level)}</span>
          <span>• ${escapeHtml(item.estimatedReadingTime || '')}</span>
        </div>
      </a>
    `).join('');
  }

  function getTypeBadgeClass(type) {
    switch (type) {
      case 'NOTES': return 'notes';
      case 'PDF': return 'pdf';
      case 'ROADMAP': return 'roadmap';
      case 'BOOK NOTES': return 'book';
      case 'RESEARCH': return 'research';
      case 'TUTORIAL': return 'tutorial';
      case 'CHEATSHEET': return 'cheatsheet';
      case 'INTERVIEW': return 'interview';
      default: return 'notes';
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Keyboard Navigation Shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    // Slash key '/' when not in input
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearchModal();
    }
    // Escape key
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    loadSearchData();

    // Bind all trigger buttons
    document.querySelectorAll('.js-open-search').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });
  });

  window.openSearchModal = openSearchModal;
  window.closeSearchModal = closeSearchModal;
})();
