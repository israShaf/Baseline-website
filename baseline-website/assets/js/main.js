document.documentElement.classList.add('js');

// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});

// Product page: slide each screenshot window into place once, when it scrolls into view
const shots = document.querySelectorAll('.shot');
if (shots.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: .25 });
  shots.forEach(shot => observer.observe(shot));
}

// Footer date
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });

// Demo form: client-side validation only. Connect the submit handler to your CRM or form service.
const form = document.getElementById('demo-form');
if (form) {
  const ok = document.getElementById('form-ok');
  const check = (input, errId, msg) => {
    const bad = !input.validity.valid;
    input.setAttribute('aria-invalid', String(bad));
    input.setAttribute('aria-describedby', errId);
    document.getElementById(errId).textContent = bad ? msg : '';
    return !bad;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email;
    const v1 = check(name, 'e-name', 'Enter your name.');
    const v2 = check(email, 'e-email', email.value ? 'Enter a work email like name@company.com.' : 'Enter your work email.');
    if (!v1) return name.focus();
    if (!v2) return email.focus();
    ok.hidden = false;
    ok.textContent = `Request received. We’ll email ${email.value} to set a time.`;
    form.querySelector('button[type=submit]').disabled = true;
  });
}
