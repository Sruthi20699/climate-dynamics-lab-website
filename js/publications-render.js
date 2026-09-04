(function () {
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Minimal markdown-lite: only supports **bold** so editors can highlight
  // the lab's own author name in a citation without needing raw HTML.
  function renderBoldMarkdown(str) {
    const escaped = escapeHtml(str);
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function buildPubItem(pub) {
    const li = document.createElement('li');
    li.className = 'pub-item';

    const p = document.createElement('p');
    p.className = 'pub-citation';
    p.innerHTML =
      `${renderBoldMarkdown(pub.authors || '')} (${pub.year}). ` +
      `${escapeHtml(pub.title || '')} ` +
      `<em>${escapeHtml(pub.journal || '')}</em>, ${escapeHtml(pub.citation_detail || '')}`;
    li.appendChild(p);

    const links = document.createElement('div');
    links.className = 'pub-links';
    if (pub.doi_url) {
      const a = document.createElement('a');
      a.href = pub.doi_url;
      a.textContent = 'DOI';
      links.appendChild(a);
    }
    if (pub.pdf_url) {
      const a = document.createElement('a');
      a.href = pub.pdf_url;
      a.textContent = 'PDF';
      links.appendChild(a);
    }
    if (links.children.length) {
      li.appendChild(links);
    }

    return li;
  }

  async function init() {
    const container = document.getElementById('publications-list');
    if (!container) return;

    let data;
    try {
      const res = await fetch('data/publications.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    const pubs = Array.isArray(data.publications) ? data.publications.slice() : [];
    if (!pubs.length) return;

    const byYear = new Map();
    pubs.forEach((pub) => {
      const year = pub.year;
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(pub);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => b - a);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = (!prefersReducedMotion && 'IntersectionObserver' in window)
      ? new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
      : null;

    years.forEach((year) => {
      const section = document.createElement('section');
      section.className = 'pub-year reveal';
      section.setAttribute('aria-labelledby', `pub-${year}`);

      const h2 = document.createElement('h2');
      h2.id = `pub-${year}`;
      h2.textContent = String(year);
      section.appendChild(h2);

      const ul = document.createElement('ul');
      ul.className = 'pub-list';
      byYear.get(year).forEach((pub) => ul.appendChild(buildPubItem(pub)));
      section.appendChild(ul);

      container.appendChild(section);

      if (prefersReducedMotion || !observer) {
        section.classList.add('in-view');
      } else {
        observer.observe(section);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
