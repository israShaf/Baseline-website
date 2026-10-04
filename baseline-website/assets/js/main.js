document.documentElement.classList.add('js');

// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});

// Product page: one plate stays put on desktop while the copy scrolls past.
// The section crossing the middle of the viewport is mounted, with a scanner wipe
// that runs left to right going down the page and right to left coming back up.
const shots = [...document.querySelectorAll('.shot')];
const stage = document.querySelector('.stage');
if (shots.length && stage) {
  const screens = [...stage.querySelectorAll('.stage-screens img')];
  const lamps = [...stage.querySelectorAll('.stage-dial span')];
  const path = stage.querySelector('.stage-path');
  const scan = stage.querySelector('.scan');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, running = [];

  const mount = next => {
    if (next === current) return;
    const forward = next > current, from = screens[current], to = screens[next];
    running.forEach(a => a.finish());
    screens.forEach(img => img.classList.remove('going'));
    from.classList.add('going');
    from.classList.remove('on');
    to.classList.add('on');
    shots.forEach((s, i) => s.classList.toggle('on', i === next));
    lamps.forEach((l, i) => l.classList.toggle('on', i === next));
    path.textContent = shots[next].dataset.path;
    current = next;

    const done = () => from.classList.remove('going');
    if (calm.matches) {
      const a = to.animate({ opacity: [0, 1] }, { duration: 180, easing: 'ease-out' });
      a.onfinish = done;
      running = [a];
      return;
    }
    const timing = { duration: 640, easing: 'cubic-bezier(.65, 0, .35, 1)' };
    const wipe = to.animate({ clipPath: forward ? ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] : ['inset(0 0 0 100%)', 'inset(0 0 0 0)'] }, timing);
    scan.classList.toggle('rev', !forward);
    // The head shares the wipe's timing so the lit line sits exactly on the reveal edge, then fades
    const head = scan.animate({ transform: [`translateX(${forward ? -100 : 100}%)`, 'translateX(0)'] }, { ...timing, fill: 'forwards' });
    const glow = scan.animate([{ opacity: 1 }, { opacity: 1, offset: .84 }, { opacity: 0 }], { duration: 760 });
    wipe.onfinish = done;
    glow.onfinish = () => head.cancel();
    running = [wipe, head, glow];
  };

  // The last section whose top has passed the middle of the viewport is the one being read.
  // Checked on scroll rather than with an observer so jumps (anchors, Home/End) land on the right screen.
  const pick = () => {
    const mid = innerHeight / 2;
    let next = 0;
    shots.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) next = i; });
    mount(next);
  };
  shots[0].classList.add('on');
  addEventListener('scroll', pick, { passive: true });
  pick();
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
