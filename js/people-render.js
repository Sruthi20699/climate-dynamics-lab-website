(function () {
  const AVATAR_GRADIENTS = [
    ['#0F2C59', '#005691'],
    ['#005691', '#2C7BB0'],
    ['#0A1F3F', '#0891B2'],
    ['#2C7BB0', '#0F2C59'],
    ['#0891B2', '#0A1F3F'],
    ['#0F2C59', '#0891B2']
  ];

  function initials(name) {
    const words = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
    return words.slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
  }

  function gradientFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    const pair = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
  }

  function buildPhoto(person) {
    if (person.photo) {
      const img = document.createElement('img');
      img.src = person.photo;
      img.alt = `Avatar illustration for ${person.name}`;
      img.className = 'member-photo';
      img.loading = 'lazy';
      return img;
    }
    const div = document.createElement('div');
    div.className = 'member-photo member-photo-initials';
    div.style.background = gradientFor(person.name);
    div.setAttribute('aria-hidden', 'true');
    div.textContent = initials(person.name);
    return div;
  }

  function buildMemberCard(person) {
    const article = document.createElement('article');
    article.className = 'member-card reveal';
    article.appendChild(buildPhoto(person));

    const h3 = document.createElement('h3');
    h3.textContent = person.name;
    article.appendChild(h3);

    const role = document.createElement('p');
    role.className = 'member-role';
    role.textContent = person.role || '';
    article.appendChild(role);

    const bio = document.createElement('p');
    bio.className = 'member-bio';
    bio.textContent = person.bio || '';
    article.appendChild(bio);

    const links = document.createElement('div');
    links.className = 'member-links';
    if (person.email) {
      const a = document.createElement('a');
      a.href = `mailto:${person.email}`;
      a.setAttribute('aria-label', `Email ${person.name}`);
      a.textContent = 'Email';
      links.appendChild(a);
    }
    if (person.scholar) {
      const a = document.createElement('a');
      a.href = person.scholar;
      a.setAttribute('aria-label', `${person.name}'s Google Scholar profile`);
      a.textContent = 'Scholar';
      links.appendChild(a);
    }
    if (links.children.length) {
      article.appendChild(links);
    }

    return article;
  }

  function buildAlumniItem(person) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'alumni-name';
    name.textContent = person.name;
    const detail = document.createElement('span');
    detail.className = 'alumni-detail';
    detail.textContent = person.detail || '';
    li.appendChild(name);
    li.appendChild(detail);
    return li;
  }

  async function init() {
    const postdocGrid = document.getElementById('postdoc-grid');
    const phdGrid = document.getElementById('phd-grid');
    const alumniList = document.getElementById('alumni-list');
    if (!postdocGrid && !phdGrid && !alumniList) return;

    let data;
    try {
      const res = await fetch('data/people.json');
      data = await res.json();
    } catch (e) {
      return;
    }

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

    function reveal(el) {
      if (prefersReducedMotion || !observer) {
        el.classList.add('in-view');
      } else {
        observer.observe(el);
      }
    }

    if (postdocGrid && Array.isArray(data.postdocs)) {
      data.postdocs.forEach((p) => reveal(postdocGrid.appendChild(buildMemberCard(p))));
    }

    if (phdGrid && Array.isArray(data.phdStudents)) {
      data.phdStudents.forEach((p) => reveal(phdGrid.appendChild(buildMemberCard(p))));
    }

    if (alumniList && Array.isArray(data.alumni)) {
      data.alumni.forEach((p) => alumniList.appendChild(buildAlumniItem(p)));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
