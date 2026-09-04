(function () {
  const PAGE_SIZE = 6;

  function buildCard(item, opts) {
    const article = document.createElement('article');
    article.className = 'news-card reveal';

    const img = document.createElement('img');
    img.src = item.image || 'images/news-default.svg';
    img.alt = item.image_alt || `Illustration for: ${item.title}`;
    img.className = 'news-image';
    img.loading = 'lazy';
    article.appendChild(img);

    const content = document.createElement('div');
    content.className = 'news-content';

    const date = document.createElement('span');
    date.className = 'news-date';
    date.textContent = item.date || '';
    content.appendChild(date);

    const h3 = document.createElement('h3');
    h3.textContent = item.title || '';
    content.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = item.description || '';
    content.appendChild(p);

    const linkHref = opts.forceLink || (item.link && item.link !== '#' ? item.link : null);
    if (linkHref) {
      const a = document.createElement('a');
      a.href = linkHref;
      a.className = 'news-link';
      a.innerHTML = 'Read More &rarr;';
      content.appendChild(a);
    }

    article.appendChild(content);
    return article;
  }

  function reveal(el, observer, prefersReducedMotion) {
    if (prefersReducedMotion || !observer) {
      el.classList.add('in-view');
    } else {
      observer.observe(el);
    }
  }

  async function init() {
    const homeGrid = document.getElementById('home-news-grid');
    const fullGrid = document.getElementById('highlights-grid');
    const loadMoreBtn = document.getElementById('load-more-highlights');
    if (!homeGrid && !fullGrid) return;

    let data;
    try {
      const res = await fetch('data/highlights.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    const items = Array.isArray(data.highlights) ? data.highlights : [];
    if (!items.length) return;

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

    if (homeGrid) {
      items.slice(0, 3).forEach((item) => {
        const card = buildCard(item, { forceLink: 'highlights.html' });
        homeGrid.appendChild(card);
        reveal(card, observer, prefersReducedMotion);
      });
    }

    if (fullGrid) {
      let shown = 0;

      function renderNextPage() {
        const nextItems = items.slice(shown, shown + PAGE_SIZE);
        nextItems.forEach((item) => {
          const card = buildCard(item, {});
          fullGrid.appendChild(card);
          reveal(card, observer, prefersReducedMotion);
        });
        shown += nextItems.length;

        if (loadMoreBtn) {
          loadMoreBtn.hidden = shown >= items.length;
        }
      }

      renderNextPage();

      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
          e.preventDefault();
          renderNextPage();
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
