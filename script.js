const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);

// ---------- Poppy (SVG). Pour utiliser ton propre dessin : assets/horse.png ----------
const HORSE = `<svg viewBox="0 0 200 215" aria-label="Poppy, le petit cheval rose">
<g fill="#fff" opacity=".85"><ellipse cx="62" cy="118" rx="14" ry="26" transform="rotate(-25 62 118)"/><ellipse cx="152" cy="112" rx="14" ry="26" transform="rotate(25 152 112)"/></g>
<path d="M150 120q38-6 34 38q-6-22-30-18z" fill="#fff" stroke="#FFB8D4" stroke-width="3"/>
<g fill="#FFB8D4"><rect x="60" y="145" width="18" height="55" rx="9"/><rect x="84" y="148" width="18" height="52" rx="9"/><rect x="112" y="148" width="18" height="52" rx="9"/><rect x="134" y="145" width="18" height="55" rx="9"/></g>
<g fill="#fff"><rect x="60" y="190" width="18" height="11" rx="5"/><rect x="84" y="190" width="18" height="11" rx="5"/><rect x="112" y="190" width="18" height="11" rx="5"/><rect x="134" y="190" width="18" height="11" rx="5"/></g>
<ellipse cx="106" cy="135" rx="58" ry="36" fill="#FFD5E6"/>
<path d="M66 50l-6-34 30 22zM134 50l6-34-30 22z" fill="#FFB8D4"/><path d="M70 44l-2-18 16 12zM130 44l2-18-16 12z" fill="#FFEAF3"/>
<ellipse cx="100" cy="82" rx="46" ry="44" fill="#FFD5E6"/>
<g fill="#fff" stroke="#FFB8D4" stroke-width="2"><circle cx="78" cy="42" r="13"/><circle cx="100" cy="36" r="14"/><circle cx="122" cy="42" r="13"/><circle cx="62" cy="62" r="10"/></g>
<ellipse cx="100" cy="106" rx="24" ry="17" fill="#FFEAF3"/><circle cx="92" cy="104" r="2.4" fill="#E95791"/><circle cx="108" cy="104" r="2.4" fill="#E95791"/>
<path d="M91 112q9 8 18 0" stroke="#E95791" stroke-width="3" fill="none" stroke-linecap="round"/>
<g class="eye"><ellipse cx="78" cy="80" rx="9" ry="12" fill="#3a2240"/><ellipse cx="122" cy="80" rx="9" ry="12" fill="#3a2240"/><g fill="#fff"><circle cx="81" cy="75" r="4"/><circle cx="125" cy="75" r="4"/><circle cx="75" cy="85" r="2"/><circle cx="119" cy="85" r="2"/></g></g>
<circle cx="62" cy="98" r="9" fill="#FF91BD" opacity=".55"/><circle cx="138" cy="98" r="9" fill="#FF91BD" opacity=".55"/>
<path d="M76 34l5-22 11 14 8-18 8 18 11-14 5 22z" fill="#F8D98B" stroke="#E9B949" stroke-width="2" stroke-linejoin="round"/>
<path d="M134 56l22-12v26zM136 56l-20-12v26z" fill="#E95791"/><circle cx="136" cy="56" r="5" fill="#FF91BD"/></svg>`;
$$('.horse').forEach(e => e.innerHTML = HORSE);

// ---------- Sons (Web Audio, après interaction) ----------
let ctx; const tone = (f, v = .12, d = .4, type = 'sine') => {
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(ctx.destination); o.start(); o.stop(t + d); } catch (e) {}
};
// Musique : met ton fichier dans assets/music/music.mp3 (sinon une petite mélodie de boîte à musique est jouée)
const file = new Audio('assets/music/music.mp3'); file.loop = true; file.volume = .5;
let synth = null, playing = false;
const notes = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 880, 784, 659, 587]; let ni = 0;
const startSynth = () => synth = setInterval(() => tone(notes[ni++ % 16], .07, .9, 'triangle'), 420);
$('#music').onclick = () => {
  playing = !playing; $('#music').classList.toggle('on', playing);
  if (!playing) { file.pause(); clearInterval(synth); synth = null; return; }
  file.play().catch(() => { if (playing && !synth) startSynth(); });
};

// ---------- Effets ----------
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2800); }
function burst(list = ['🎉', '🌸', '✨', '⭐', '🎀'], n = 60) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.className = 'fall'; s.textContent = list[i % list.length];
    s.style.cssText += `left:${rnd(0, 100)}vw;font-size:${rnd(16, 32)}px;animation-duration:${rnd(3, 6)}s;animation-delay:${rnd(0, 1.5)}s`;
    document.body.append(s); setTimeout(() => s.remove(), 8000);
  }
}
function pop(el, n = 14, list = ['⭐', '✨', '🌸']) {
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'), a = rnd(0, 6.28), d = rnd(70, 170); s.className = 'pp'; s.textContent = list[i % list.length];
    s.style.cssText += `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;font-size:${rnd(16, 28)}px`;
    document.body.append(s); setTimeout(() => s.remove(), 1200);
  }
}
const anim = (el, c, ms = 1000) => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); setTimeout(() => el.classList.remove(c), ms); };
const party = (horse) => { burst(['🎉', '🌸', '✨', '⭐'], 80); anim(horse, 'jump', 700); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f), i * 120)); };

// Ambiance : pétales et papillons discrets
setInterval(() => { if (!document.hidden && $('#main').hidden === false) {
  const s = document.createElement('span'); s.className = 'fall'; s.textContent = Math.random() < .8 ? '🌸' : '🌷';
  s.style.cssText += `left:${rnd(0, 100)}vw;font-size:${rnd(14, 22)}px;animation-duration:${rnd(9, 14)}s;opacity:.7`; document.body.append(s); setTimeout(() => s.remove(), 15000); } }, 1800);
setInterval(() => { if (!document.hidden && $('#main').hidden === false) {
  const s = document.createElement('span'); s.className = 'fly'; s.textContent = '🦋'; s.style.cssText += `left:${rnd(5, 90)}vw;top:100vh;font-size:22px;animation-duration:${rnd(9, 13)}s`;
  document.body.append(s); setTimeout(() => s.remove(), 14000); } }, 5000);

// ---------- Introduction ----------
for (let i = 0; i < 40; i++) { const s = document.createElement('i'); s.className = 'sp'; s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;animation-delay:${rnd(0, 6)}s`; $('#intro').append(s); }
$('#enter').onclick = () => {
  const h = $('#intro .horse'); h.classList.add('run'); burst(['✨', '🌸'], 40); tone(784);
  setTimeout(() => $('#flash').classList.add('on'), 600);
  setTimeout(() => { $('#intro').remove(); $('#main').hidden = false; $('#hud').hidden = false; window.scrollTo(0, 0); $('#flash').classList.remove('on'); }, 1200);
};

// ---------- Hero : 19 bougies décoratives ----------
for (let i = 0; i < 19; i++) { const c = document.createElement('i'); c.className = 'cdl on'; c.style.animationDelay = i * .07 + 's'; $('#mini').append(c); }

// ---------- Lettre ----------
$('#env').onclick = () => { $('#env').hidden = true; $('#card').classList.add('open'); pop($('#card'), 12, ['💌', '✨', '🌸']); tone(659); setTimeout(() => $('#card').scrollIntoView({ behavior: 'smooth', block: 'center' }), 500); };

// ---------- Poppy ----------
const say = t => $('#say').innerHTML = t, P = $('#pop');
const run = (from, to, ms) => P.animate([{ transform: `translateX(${from})` }, { transform: `translateX(${to})` }], { duration: ms, easing: 'ease-in-out' }).finished;
$$('[data-a]').forEach(b => b.onclick = async () => {
  const a = b.dataset.a;
  if (a === 'tour') { say('Youhou, c’est parti ! 🎀'); await run('-30vw', '30vw', 2200); await run('30vw', '0', 1200); anim(P, 'jump', 700); }
  if (a === 'flowers') { say('Des fleurs pour toi ! 🌸'); pop(P, 22, ['🌸', '🌷', '🌼', '🌺']); burst(['🌸', '🌷', '🌼'], 30); tone(880); }
  if (a === 'sky') { say('Regarde comme le ciel brille ! ⭐'); $('#poppy').classList.add('sky'); pop(P, 16, ['⭐', '✨']); toast('Le ciel scintille ✨'); [784, 988, 1175].forEach((f, i) => setTimeout(() => tone(f), i * 150)); }
  if (a === 'cake') { say('Je cours vers le gâteau ! 🎂'); await run('0', '35vw', 1100); setTimeout(() => $('#cake').scrollIntoView({ behavior: 'smooth' }), 100); }
});

// ---------- Boîte à surprises ----------
$('#open').onclick = () => {
  const g = $('#gift'); g.classList.add('open'); $('#open').hidden = true; tone(523);
  setTimeout(() => { pop(g, 30, ['⭐', '✨', '🎀', '🌸']); party($('#gh')); $('#giftMsg').classList.add('show'); }, 600);
};

// ---------- 19 bougies ----------
let lit = 0;
for (let i = 0; i < 19; i++) {
  const c = document.createElement('button'); c.className = 'cdl'; c.setAttribute('aria-label', 'Bougie ' + (i + 1));
  c.onclick = () => {
    if (c.classList.contains('on')) return; c.classList.add('on'); lit++; $('#lit').textContent = lit; tone(400 + lit * 30, .1, .3);
    if (lit === 19) { party($('#ch')); pop($('.cake'), 20); $('#cakeMsg').classList.add('show'); }
  };
  $('#candles').append(c);
}

// ---------- Vœu ----------
$('#wishBtn').onclick = () => {
  $('#wish').classList.add('night'); $('#wishHorse').classList.add('sky', 'closed'); $('#wishMsg').classList.add('show');
  burst(['⭐', '✨'], 60); pop($('.moon'), 16, ['✨', '⭐']); [659, 784, 988, 1319].forEach((f, i) => setTimeout(() => tone(f, .1, .7), i * 220));
  $('#wishBtn').hidden = true;
};

// ---------- 19 fleurs ----------
const years = ['Le début d’une belle histoire 🌸', 'Les premiers éclats de rire ✨', 'Les premiers pas vers l’aventure 🌷', 'Des jeux et de la curiosité 🎀', 'Les premiers grands rêves ✨', 'Les premiers jours d’école 📚', 'De nouveaux amis 🌼', 'Des découvertes partout 🦋', 'Des souvenirs qui brillent ⭐', 'De nouveaux souvenirs 🌷', 'Une année pleine d’énergie 🌺', 'De grands changements ✨', 'De nouvelles passions 🎨', 'Un cap important 🌸', 'Une nouvelle étape 🌸', 'Des rêves qui grandissent 🌙', 'De la confiance et des projets 💪', 'Un pas vers l’avenir 🚀', 'Et maintenant, une nouvelle aventure commence ! 🎀'];
const fe = ['🌸', '🌷', '🌺', '🌼', '🏵️'];
years.forEach((t, i) => {
  const b = document.createElement('button'); b.textContent = fe[i % 5]; b.style.setProperty('--i', i); b.setAttribute('aria-label', `Fleur ${i + 1} an${i ? 's' : ''}`);
  b.onclick = () => { b.classList.add('open'); $('#phrase').textContent = `${i + 1} an${i ? 's' : ''} — ${t}`; pop(b, 6, ['✨', '🌸']); tone(500 + i * 40, .1, .3); };
  $('#g19').append(b);
});

// ---------- Apparitions au défilement ----------
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .2 });
$$('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 3) * .15 + 's'; io.observe(e); });
io.observe($('#g19'));
$$('.pol img').forEach(i => i.onerror = () => i.removeAttribute('src'));
$$('.pol').forEach(p => p.onmouseenter = () => pop(p, 5, ['⭐', '✨']));

// ---------- Mini-jeu : 19 étoiles ----------
let found = 0; const secs = $$('#main > section');
for (let i = 0; i < 19; i++) {
  const s = document.createElement('button'); s.className = 'hs'; s.textContent = '⭐'; s.setAttribute('aria-label', 'Étoile cachée');
  s.style.cssText += `left:${rnd(4, 86)}%;top:${rnd(8, 82)}%;animation-delay:${rnd(0, 2)}s`;
  s.onclick = () => {
    s.classList.add('found'); found++; $('#cnt').textContent = $('#cnt2').textContent = found; pop(s, 7, ['⭐', '✨']); tone(700 + found * 35, .12, .35);
    if (found === 19) { burst(['🎉', '⭐', '🌸'], 90); $('#gameMsg').textContent = 'Bravo Imane ! 🎉⭐'; setTimeout(() => $('#secret').hidden = false, 900); }
  };
  secs[i % secs.length].append(s);
}
$('#unlock').onclick = () => { $('#secret').hidden = true; $('#locked').hidden = false; setTimeout(() => $('#throne').scrollIntoView({ behavior: 'smooth' }), 100); };

// ---------- Trône + scène finale ----------
for (let i = 0; i < 19; i++) { const s = document.createElement('span'); s.className = 'sk'; s.textContent = '⭐'; s.style.cssText = `left:${rnd(3, 93)}%;top:${rnd(3, 85)}%;animation-delay:${rnd(0, 3)}s`; $('#skyst').append(s); }
const go = new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return; e.target.classList.add('go'); o.unobserve(e.target);
  if (e.target.id === 'finale') { burst(['🌸', '🌷'], 40); setTimeout(() => burst(['✨', '🎉', '🎀'], 50), 9000); }
  else { burst(['👑', '✨'], 20); tone(1047); }
}), { threshold: .35 });
$$('.sc').forEach(s => go.observe(s));
