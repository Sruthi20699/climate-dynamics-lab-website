(function () {
  function buildItem(person) {
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

  function renderGroup(listId, emptyId, items) {
    const list = document.getElementById(listId);
    const empty = document.getElementById(emptyId);
    if (!list) return;

    if (!Array.isArray(items) || !items.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    items.forEach((person) => list.appendChild(buildItem(person)));
  }

  async function init() {
    if (!document.getElementById('phd-students-list')) return;

    let data;
    try {
      const res = await fetch('data/students.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    renderGroup('phd-students-list', 'phd-students-empty', data.phdStudents);
    renderGroup('mtech-students-list', 'mtech-students-empty', data.mtechStudents);
    renderGroup('master-students-list', 'master-students-empty', data.masterStudents);
    renderGroup('bachelor-students-list', 'bachelor-students-empty', data.bachelorStudents);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
