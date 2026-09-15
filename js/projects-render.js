(function () {
  function buildProjectItem(project) {
    const li = document.createElement('li');

    const title = document.createElement('div');
    title.className = 'funding-title';
    title.textContent = project.title || '';
    li.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'funding-meta';
    const parts = [project.agency, project.duration].filter(Boolean);
    meta.textContent = parts.join(' · ');
    li.appendChild(meta);

    return li;
  }

  async function init() {
    const list = document.getElementById('projects-list');
    const emptyState = document.getElementById('projects-empty');
    if (!list) return;

    let data;
    try {
      const res = await fetch('data/projects.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    const projects = Array.isArray(data.projects) ? data.projects : [];

    if (!projects.length) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    projects.forEach((project) => list.appendChild(buildProjectItem(project)));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
