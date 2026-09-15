(function () {
  function encodeFormData(formData) {
    return Array.from(formData.entries())
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  function setupNetlifyForm(form) {
    const status = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (status) {
        status.hidden = false;
        status.textContent = 'Sending…';
        status.className = 'form-status';
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(new FormData(form))
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Form submission failed with status ${res.status}`);
          form.reset();
          if (status) {
            status.textContent = 'Thanks — your message has been sent.';
            status.className = 'form-status form-status-success';
          }
        })
        .catch(() => {
          if (status) {
            status.textContent = 'Something went wrong. Please email asavita@iitd.ac.in directly.';
            status.className = 'form-status form-status-error';
          }
        });
    });
  }

  async function init() {
    const officeBlockEl = document.getElementById('contact-office-block');
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const officeEl = document.getElementById('contact-office');
    const form = document.getElementById('contact-form');
    if (!officeBlockEl && !emailEl && !phoneEl && !officeEl && !form) return;

    if (form) setupNetlifyForm(form);

    let data;
    try {
      const res = await fetch('data/contact.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    if (officeBlockEl) {
      officeBlockEl.textContent = [
        data.name,
        data.title,
        data.department,
        data.institution,
        data.address
      ].filter(Boolean).join('\n');
    }

    if (phoneEl) phoneEl.textContent = data.phone || '';
    if (officeEl) officeEl.textContent = data.office || '';

    if (emailEl && data.email) {
      emailEl.textContent = data.email;
      emailEl.href = `mailto:${data.email}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
