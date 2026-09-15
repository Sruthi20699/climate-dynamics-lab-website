(function () {
  function fillList(id, items) {
    const el = document.getElementById(id);
    if (!el || !Array.isArray(items)) return;
    items.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      el.appendChild(li);
    });
  }

  async function init() {
    const container = document.getElementById('biosketch-content');
    if (!container) return;

    let data;
    try {
      const res = await fetch('data/biosketch.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    const positionEl = document.getElementById('biosketch-position');
    if (positionEl) positionEl.textContent = data.currentPosition || '';

    const ipccEl = document.getElementById('biosketch-ipcc');
    if (ipccEl) ipccEl.textContent = data.ipccLine || '';

    fillList('biosketch-education', data.education);
    fillList('biosketch-experience', data.experience);
    fillList('biosketch-awards', data.awards);
    fillList('biosketch-contributions', data.contributions);
    fillList('biosketch-talks', data.talks);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
