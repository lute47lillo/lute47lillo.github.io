(function () {
  const pubs = window.PUBLICATIONS || [];

  function authorHTML(authors) {
    return authors.map(a => {
      const mine = a === "Lute Lillo" || a.includes("Lillo Portero");
      return mine ? `<strong>${a}</strong>` : a;
    }).join(", ");
  }

  function linksHTML(pub) {
    const labels = { paper: "Paper", arxiv: "arXiv", code: "Code" };
    const links = Object.entries(pub.links || {}).map(([key, href]) =>
      `<a class="pub-link" href="${href}" target="_blank" rel="noreferrer">${labels[key] || key}</a>`
    );
    links.push(`<button class="pub-link bibtex-button" type="button" data-bibtex="${encodeURIComponent(pub.bibtex || '')}">BibTeX</button>`);
    return links.join("");
  }

  function publicationHTML(pub, compact = false) {
    return `
      <article class="publication ${compact ? 'publication--compact' : ''}" data-year="${pub.year}" data-type="${pub.type}" data-topics="${(pub.topics || []).join('|').toLowerCase()}">
        <div class="pub-year">${pub.year}</div>
        <div class="pub-main">
          <div class="pub-heading-row">
            <h3 class="pub-title">${pub.title}</h3>
            ${pub.selected ? '<span class="selected-mark">Selected</span>' : ''}
          </div>
          <p class="pub-authors">${authorHTML(pub.authors)}</p>
          <p class="pub-venue"><em>${pub.venue}</em>${pub.note ? ` · ${pub.note}` : ''}</p>
          ${(!compact && pub.summary) ? `<p class="pub-summary">${pub.summary}</p>` : ''}
          <div class="pub-actions">${linksHTML(pub)}</div>
          ${(!compact && pub.topics) ? `<div class="tag-row">${pub.topics.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      </article>`;
  }

  function bindBibtex(scope) {
    scope.querySelectorAll('.bibtex-button').forEach(button => {
      button.addEventListener('click', async () => {
        const bibtex = decodeURIComponent(button.dataset.bibtex || '');
        try {
          await navigator.clipboard.writeText(bibtex);
          const old = button.textContent;
          button.textContent = 'Copied';
          window.setTimeout(() => { button.textContent = old; }, 1300);
        } catch (_) {
          window.prompt('Copy BibTeX:', bibtex);
        }
      });
    });
  }

  const selectedTarget = document.querySelector('[data-selected-publications]');
  if (selectedTarget) {
    selectedTarget.innerHTML = pubs.filter(p => p.selected).slice(0, 3).map(p => publicationHTML(p, true)).join('');
    bindBibtex(selectedTarget);
  }

  const allTarget = document.querySelector('[data-all-publications]');
  if (allTarget) {
    const sorted = [...pubs].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    allTarget.innerHTML = sorted.map(p => publicationHTML(p, false)).join('');
    bindBibtex(allTarget);

    const filterButtons = document.querySelectorAll('[data-pub-filter]');
    const search = document.querySelector('[data-pub-search]');
    let activeFilter = 'all';

    function applyFilters() {
      const q = (search?.value || '').trim().toLowerCase();
      allTarget.querySelectorAll('.publication').forEach(item => {
        const haystack = item.textContent.toLowerCase();
        const type = item.dataset.type;
        const matchesFilter = activeFilter === 'all' || type === activeFilter;
        const matchesSearch = !q || haystack.includes(q);
        item.hidden = !(matchesFilter && matchesSearch);
      });
      const visible = [...allTarget.querySelectorAll('.publication')].some(item => !item.hidden);
      document.querySelector('[data-empty-publications]')?.toggleAttribute('hidden', visible);
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.pubFilter;
        filterButtons.forEach(b => b.classList.toggle('active', b === button));
        applyFilters();
      });
    });
    search?.addEventListener('input', applyFilters);
  }
})();
