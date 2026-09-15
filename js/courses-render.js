(function () {
  function buildItem(course) {
    const li = document.createElement('li');

    const title = document.createElement('div');
    title.className = 'funding-title';
    title.textContent = course.code ? `${course.code} — ${course.name || ''}` : (course.name || '');
    li.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'funding-meta';
    meta.textContent = course.semester || '';
    li.appendChild(meta);

    if (course.description) {
      const desc = document.createElement('p');
      desc.className = 'member-bio';
      desc.textContent = course.description;
      li.appendChild(desc);
    }

    return li;
  }

  function renderGroup(listId, emptyId, items) {
    const list = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    if (!list) return;

    if (!Array.isArray(items) || !items.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    items.forEach((course) => list.appendChild(buildItem(course)));
  }

  async function init() {
    if (!document.getElementById('postgraduate-courses-list')) return;

    let data;
    try {
      const res = await fetch('data/courses.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    renderGroup('postgraduate-courses-list', 'postgraduate-courses-empty', data.postgraduate);
    renderGroup('undergraduate-courses-list', 'undergraduate-courses-empty', data.undergraduate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
