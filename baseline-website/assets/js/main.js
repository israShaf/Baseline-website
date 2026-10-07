document.documentElement.classList.add('js');

// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});

// Product page: the deck is 300vh tall with a pinned viewport. Scroll position only picks
// which slide is showing; the change itself is a fixed CSS transition, so it never stutters with the wheel.
const deck = document.querySelector('.deck');
if (deck) {
  const slides = [...deck.querySelectorAll('.slide')];
  const dots = [...deck.querySelectorAll('.deck-dots i')];
  let current = 0;
  const show = next => {
    if (next === current) return;
    slides.forEach((s, i) => {
      s.classList.toggle('on', i === next);
      s.classList.toggle('past', i < next);
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === next));
    deck.dataset.slide = next + 1;
    current = next;
  };
  const pick = () => {
    const r = deck.getBoundingClientRect();
    const step = (r.height - innerHeight) / slides.length;
    if (step <= 0) return show(0);
    show(Math.max(0, Math.min(slides.length - 1, Math.floor(-r.top / step))));
  };
  addEventListener('scroll', pick, { passive: true });
  addEventListener('resize', pick);
  pick();
}

// Footer date
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });

// Demo form: checked here, then sent to Netlify Forms (the form carries data-netlify in contact.html)
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
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    button.textContent = 'Sending…';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(res => {
      if (!res.ok) throw new Error(res.status);
      ok.hidden = false;
      ok.textContent = `Request received. We’ll email ${email.value} to set a time.`;
      button.textContent = 'Request sent';
    }).catch(() => {
      ok.hidden = false;
      ok.textContent = 'Your request didn’t go through. Check your connection and try again.';
      button.disabled = false;
      button.textContent = 'Book a demo';
    });
  });
}
