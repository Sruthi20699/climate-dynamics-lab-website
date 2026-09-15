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
    const heroEyebrowEl = document.getElementById('hero-eyebrow');
    const heroTitleEl = document.getElementById('hero-title');
    const heroSubtitleEl = document.getElementById('hero-subtitle');
    const heroIntroEl = document.getElementById('hero-intro');
    const profileEyebrowEl = document.getElementById('profile-eyebrow');
    const profileHeadingEl = document.getElementById('profile-heading');
    const photoEl = document.getElementById('home-photo');
    const positionEl = document.getElementById('home-position');
    const bioEl = document.getElementById('home-bio');
    const linksEl = document.getElementById('home-profile-links');
    const focusGrid = document.getElementById('research-focus-grid');
    const focusSubtitleEl = document.getElementById('research-focus-subtitle');
    const announcementHeadingEl = document.getElementById('announcement-heading');
    const announcementText = document.getElementById('announcement-text');
    const announcementLink = document.getElementById('announcement-email-link');
    if (!positionEl && !bioEl && !focusGrid && !announcementText) return;

    let home, contact;
    try {
      const [homeRes, contactRes] = await Promise.all([
        fetch('data/home.json'),
        fetch('data/contact.json')
      ]);
      home = await homeRes.json();
      contact = await contactRes.json();
    } catch (e) {
      return;
    }

    const shortInstitution = contact.shortInstitution || contact.institution || '';

    if (heroEyebrowEl) heroEyebrowEl.textContent = home.heroEyebrow || [contact.department, shortInstitution].filter(Boolean).join(' · ');
    if (heroTitleEl && contact.name) heroTitleEl.textContent = contact.name;
    if (heroSubtitleEl) heroSubtitleEl.textContent = [contact.title, home.researchTagline].filter(Boolean).join(' · ');
    if (heroIntroEl) heroIntroEl.textContent = home.heroIntro || '';

    if (profileEyebrowEl && contact.title) profileEyebrowEl.textContent = contact.title;
    if (profileHeadingEl && contact.name) profileHeadingEl.textContent = contact.name;

    if (photoEl && home.photo) photoEl.src = home.photo;
    if (positionEl) positionEl.textContent = home.position || '';
    if (bioEl) bioEl.textContent = home.bio || '';

    if (linksEl) {
      if (home.scholarUrl) {
        const a = document.createElement('a');
        a.href = home.scholarUrl;
        a.textContent = 'Google Scholar';
        linksEl.appendChild(a);
      }
      if (home.researchgateUrl) {
        const a = document.createElement('a');
        a.href = home.researchgateUrl;
        a.textContent = 'ResearchGate';
        linksEl.appendChild(a);
      }
    }

    if (announcementHeadingEl) announcementHeadingEl.textContent = home.announcementHeading || 'Research Opportunities';
    if (announcementText) announcementText.textContent = home.recruitingStatement || '';
    if (announcementLink && contact.email) {
      announcementLink.href = `mailto:${contact.email}?subject=Research%20Opportunity%20Inquiry`;
    }

    if (focusSubtitleEl && home.researchFocusSubtitle) focusSubtitleEl.textContent = home.researchFocusSubtitle;

    if (focusGrid && Array.isArray(home.researchFocus)) {
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

      home.researchFocus.forEach((item) => {
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
