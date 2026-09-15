(function () {
  async function init() {
    let data;
    try {
      const res = await fetch('data/contact.json');
      data = await res.json();
    } catch (e) {
      return;
    }

    const shortInstitution = data.shortInstitution || data.institution || '';
    const tagline = [data.department, shortInstitution].filter(Boolean).join(' · ');

    const brandTitle = document.getElementById('site-brand-title');
    const brandSubtitle = document.getElementById('site-brand-subtitle');
    if (brandTitle && data.name) brandTitle.textContent = data.name;
    if (brandSubtitle && tagline) brandSubtitle.textContent = tagline;

    const footerName = document.getElementById('footer-about-name');
    const footerDept = document.getElementById('footer-about-dept');
    const footerAddress = document.getElementById('footer-about-address');
    if (footerName && data.name) footerName.textContent = data.name;
    if (footerDept && (data.department || data.institution)) {
      footerDept.textContent = '';
      if (data.department) footerDept.appendChild(document.createTextNode(data.department));
      if (data.department && data.institution) footerDept.appendChild(document.createElement('br'));
      if (data.institution) footerDept.appendChild(document.createTextNode(data.institution));
    }
    if (footerAddress && data.address) footerAddress.textContent = data.address;

    const footerEmail = document.getElementById('footer-contact-email');
    const footerPhone = document.getElementById('footer-contact-phone');
    const footerOffice = document.getElementById('footer-contact-office');
    if (footerEmail && data.email) {
      footerEmail.textContent = data.email;
      footerEmail.href = `mailto:${data.email}`;
    }
    if (footerPhone && data.phone) footerPhone.textContent = data.phone;
    if (footerOffice && data.office) footerOffice.textContent = data.office;

    const copyrightEl = document.getElementById('footer-copyright');
    if (copyrightEl) {
      const year = new Date().getFullYear();
      const parts = [data.name, data.department, shortInstitution].filter(Boolean).join(', ');
      copyrightEl.textContent = `© ${year} ${parts}. All rights reserved.`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
