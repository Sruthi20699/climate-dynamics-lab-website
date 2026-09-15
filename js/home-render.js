(function () {
  function buildFocusCard(item) {
    const article = document.createElement('article');
    article.className = 'theme-card reveal';

    const icon = document.createElement('div');
    icon.className = 'theme-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\u{1F30A}';
    article.appendChild(icon);

    const h3 = document.createElement('h3');
    h3.textContent = item.title || '';
    article.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = item.description || '';
    article.appendChild(p);

    return article;
  }

  async function init() {
    const photoEl = document.getElementById('home-photo');
    const positionEl = document.getElementById('home-position');
    const bioEl = document.getElementById('home-bio');
    const linksEl = document.getElementById('home-profile-links');
    const focusGrid = document.getElementById('research-focus-grid');
    const announcementText = document.getElementById('announcement-text');
    const announcementLink = document.getElementById('announcement-email-link');
    if (!positionEl && !bioEl && !focusGrid && !announcementText) return;

    let data;
    try {
      const res = await fetch('data/home.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    if (photoEl && data.photo) photoEl.src = data.photo;
    if (positionEl) positionEl.textContent = data.position || '';
    if (bioEl) bioEl.textContent = data.bio || '';

    if (linksEl) {
      if (data.scholarUrl) {
        const a = document.createElement('a');
        a.href = data.scholarUrl;
        a.textContent = 'Google Scholar';
        linksEl.appendChild(a);
      }
      if (data.researchgateUrl) {
        const a = document.createElement('a');
        a.href = data.researchgateUrl;
        a.textContent = 'ResearchGate';
        linksEl.appendChild(a);
      }
    }

    if (announcementText) {
      announcementText.textContent = data.recruitingStatement || '';
    }
    if (announcementLink && data.recruitingEmail) {
      announcementLink.href = `mailto:${data.recruitingEmail}?subject=Research%20Opportunity%20Inquiry`;
    }

    if (focusGrid && Array.isArray(data.researchFocus)) {
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

      data.researchFocus.forEach((item) => {
        const card = focusGrid.appendChild(buildFocusCard(item));
        if (prefersReducedMotion || !observer) {
          card.classList.add('in-view');
        } else {
          observer.observe(card);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
