// Easter egg effect: the portrait "breaks". Smoke puffs rise from it and small
// coloured sparks crackle off its edge for a few seconds. Drawn on a temporary
// full-screen canvas over the page; the shake itself is a CSS animation.

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  age: number;
  life: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
}

const DURATION = 3400;
const SMOKE_UNTIL = 2600;
const SPARK_BURSTS = [0, 180, 520, 950, 1500, 2100];

export function smokeAndSparks(target: Element, colors: string[], dark: boolean) {
  const canvas = document.createElement('canvas');
  canvas.className = 'breakdown';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '50',
  });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);

  const puffs: Puff[] = [];
  const sparks: Spark[] = [];
  const smoke = dark ? '150,156,164' : '95,102,110';
  let bursts = [...SPARK_BURSTS];
  let lastPuff = -1e9;
  const start = performance.now();
  let prev = start;

  // The portrait can move (drift, scroll), so read its box on every frame.
  const circle = () => {
    const r = target.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
  };

  const frame = (now: number) => {
    const t = now - start;
    const dt = Math.min(3, (now - prev) / 16.7); // in 60 fps frames
    prev = now;
    const c = circle();

    // Spawn smoke from the upper half of the portrait.
    if (t < SMOKE_UNTIL && t - lastPuff > 60) {
      lastPuff = t;
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      puffs.push({
        x: c.x + Math.cos(a) * c.r * 0.8,
        y: c.y + Math.sin(a) * c.r * 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.6 - Math.random() * 0.9,
        r: 6 + Math.random() * 8,
        age: 0,
        life: 1400 + Math.random() * 900,
      });
    }
    // Spark bursts from random points on the edge.
    while (bursts.length && t >= bursts[0]) {
      bursts.shift();
      const a = Math.random() * Math.PI * 2;
      const ox = c.x + Math.cos(a) * c.r;
      const oy = c.y + Math.sin(a) * c.r;
      const count = 14 + Math.floor(Math.random() * 14);
      for (let i = 0; i < count; i++) {
        const dir = a + (Math.random() - 0.5) * 1.8;
        const speed = 3 + Math.random() * 6;
        sparks.push({
          x: ox,
          y: oy,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed - 2,
          age: 0,
          life: 350 + Math.random() * 450,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of puffs) {
      p.age += dt * 16.7;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.99;
      p.r += 0.35 * dt;
      const k = p.age / p.life;
      if (k >= 1) continue;
      const a = 0.32 * Math.sin(Math.PI * Math.min(1, k * 1.6)) * (1 - k);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(${smoke},${a.toFixed(3)})`);
      g.addColorStop(1, `rgba(${smoke},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineCap = 'round';
    ctx.lineWidth = 1.6;
    if (dark) ctx.shadowBlur = 6;
    for (const s of sparks) {
      s.age += dt * 16.7;
      if (s.age >= s.life) continue;
      s.vy += 0.28 * dt;
      s.vx *= 0.97;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      ctx.globalAlpha = 1 - s.age / s.life;
      ctx.strokeStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (t < DURATION) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

// A few sparks only, for clicks after the portrait has already broken.
export function sparksOnly(target: Element, colors: string[], dark: boolean) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '50',
  });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);
  const r = target.getBoundingClientRect();
  const a = Math.random() * Math.PI * 2;
  const ox = r.left + r.width / 2 + (Math.cos(a) * r.width) / 2;
  const oy = r.top + r.height / 2 + (Math.sin(a) * r.height) / 2;
  const sparks: Spark[] = Array.from({ length: 12 }, () => {
    const dir = a + (Math.random() - 0.5) * 1.6;
    const speed = 2.5 + Math.random() * 5;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed - 1.5,
      age: 0,
      life: 300 + Math.random() * 350,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
  let prev = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(3, (now - prev) / 16.7);
    prev = now;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.5;
    if (dark) ctx.shadowBlur = 6;
    let alive = false;
    for (const s of sparks) {
      s.age += dt * 16.7;
      if (s.age >= s.life) continue;
      alive = true;
      s.vy += 0.28 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      ctx.globalAlpha = 1 - s.age / s.life;
      ctx.strokeStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
      ctx.stroke();
    }
    if (alive) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
