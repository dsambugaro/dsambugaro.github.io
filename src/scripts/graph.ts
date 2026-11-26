// Animated network graph drawn behind the page.
//
// - Regular nodes are drawn on a <canvas>. They drift slowly and move away from the pointer.
// - "Special" nodes are real DOM elements (the portrait and the social links). The graph
//   measures them and connects them to nearby nodes. The path from the portrait to each
//   link runs through ordinary graph edges and lights up while the link is hovered.
// - Nodes sit on three depth planes (far, mid, near): size, brightness, drift and
//   pointer parallax change with depth. Blurred bokeh spots and dust add atmosphere.
// - The graph is sparse and faint inside a circle around the text and gets denser
//   outside it, so the change follows an arc that reaches the portrait.
// - With prefers-reduced-motion the graph is drawn once and stays still.

type Kind = 'dot' | 'ring' | 'square' | 'hub';

interface GNode {
  ax: number; // anchor
  ay: number;
  x: number; // current position
  y: number;
  ox: number; // pointer offset (eased)
  oy: number;
  phase: number;
  amp: number;
  speed: number;
  size: number;
  kind: Kind;
  alpha: number;
  hop: number; // hops from the portrait, for the pulse wave
  z: number; // depth plane: 0 far, 1 mid, 2 near
  par: number; // pointer parallax factor (0 for DOM nodes)
  el?: HTMLElement; // special nodes only
  r: number; // special nodes: radius of the DOM circle
}

interface Rect {
  l: number;
  t: number;
  r: number;
  b: number;
}

interface Options {
  canvas: HTMLCanvasElement;
  root: HTMLElement; // the element the canvas covers
  text: HTMLElement; // nodes fade out behind this
  // [portrait, ...others]; each has a `.ring` child. Elements with the class
  // `node-link` get an accent route from the portrait; the rest are plain nodes.
  specials: HTMLElement[];
}

const POINTER_RADIUS = 150;
// Horizontal position in the stage (0..1) where the dense part of the graph starts.
const FIELD_ANCHOR = 0.34;
const PULSE_STEP = 90; // ms per hop
// Dragging a DOM node: it follows the pointer with growing resistance and never
// gets further than DRAG_MAX px from its place; on release it springs back.
const DRAG_MAX = 150;
const DRAG_START = 4; // px of movement before a press counts as a drag

interface Drag {
  x: number; // current offset
  y: number;
  vx: number;
  vy: number;
  tx: number; // target offset while held
  ty: number;
  held: boolean;
  moved: boolean;
  sx: number; // pointer position at press
  sy: number;
  id: number; // pointer id
}
const PULSE_LENGTH = 800;
// Per depth plane: share of nodes, size range, brightness, drift, parallax, edges.
const PLANES = [
  { share: 0.45, size: [0.8, 1.3], alpha: 0.45, amp: 2.5, par: 0.006, links: 2 },
  { share: 0.4, size: [1.5, 2.3], alpha: 0.8, amp: 4, par: 0.014, links: 3 },
  { share: 0.15, size: [2.6, 3.6], alpha: 1, amp: 6, par: 0.028, links: 3 },
];

// Small seeded RNG so the layout is the same on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

const distToRect = (x: number, y: number, r: Rect) => {
  const dx = Math.max(r.l - x, 0, x - r.r);
  const dy = Math.max(r.t - y, 0, y - r.b);
  return Math.hypot(dx, dy);
};

export function startGraph({ canvas, root, text, specials }: Options) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { pulse(_tone: string) {}, freeze() {} };

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  let W = 0;
  let H = 0;
  let nodes: GNode[] = [];
  let edges: [number, number, number][] = []; // a, b, alpha
  let adjacency: number[][] = [];
  let firstSpecial = 0;
  // Shortest path through the graph from the portrait to each link (node indices).
  let routes: { el: HTMLElement; path: number[] }[] = [];
  let hot: HTMLElement | null = null; // hovered link
  const drags = new Map<HTMLElement, Drag>();
  // Colour pulses. Each click adds a wave with the accent colour of that moment;
  // waves started in quick succession follow each other instead of restarting.
  let waves: { start: number; color: string; tone: string }[] = [];
  // Frozen (easter egg): every node keeps one of the three tones, in bands.
  let frozen: number[] | null = null;
  let frozenSeed = 0;
  const TONES = ['lime', 'cyan', 'magenta'];
  let tones: string[] = [];
  let maxHop = 0;
  let order: number[] = []; // canvas nodes, far plane first
  // Atmosphere: blurred bokeh spots and dust, drawn under the graph.
  let bokeh: { x: number; y: number; r: number; a: number; phase: number; accent: boolean }[] = [];
  let dust: { x: number; y: number; a: number; phase: number }[] = [];
  const parallax = { x: 0, y: 0 };
  let glow: HTMLCanvasElement | null = null; // soft halo sprite for near nodes
  const pointer = { x: -1e4, y: -1e4, on: false };
  const colors = { line: '150,157,166', node: '125,132,141', accent: '#b5e853', bg: '#1c1f23', dark: true };

  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors.line = cs.getPropertyValue('--graph-line').trim() || colors.line;
    colors.node = cs.getPropertyValue('--graph-node').trim() || colors.node;
    colors.accent = cs.getPropertyValue('--accent-graph').trim() || colors.accent;
    colors.bg = cs.getPropertyValue('--bg').trim() || colors.bg;
    colors.dark = cs.colorScheme === 'dark';
    tones = TONES.map((n) => cs.getPropertyValue(`--tone-${n}`).trim() || colors.accent);
    // Halo sprite, redrawn when the colours change.
    glow = document.createElement('canvas');
    glow.width = glow.height = 64;
    const g = glow.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${colors.line},${colors.dark ? 0.35 : 0.14})`);
    grad.addColorStop(1, `rgba(${colors.line},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }

  function build() {
    const box = root.getBoundingClientRect();
    W = Math.round(box.width);
    H = Math.round(box.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rel = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top };
    };

    const rnd = mulberry32(11);
    const fresh: GNode[] = [];

    // DOM nodes first, so the regular ones keep clear of them. The portrait and the
    // links have fixed places (CSS); the area icons are placed below, by this script.
    // Hidden ones (display: none on small screens) are left out.
    const isArea = (el: HTMLElement) => el.classList.contains('node-area');
    const toNode = (el: HTMLElement): GNode => {
      const ring = (el.querySelector('.ring') as HTMLElement | null) ?? el;
      const c = rel(ring);
      const prevDx = parseFloat(el.style.getPropertyValue('--dx')) || 0;
      const prevDy = parseFloat(el.style.getPropertyValue('--dy')) || 0;
      const ax = (c.l + c.r) / 2 - prevDx;
      const ay = (c.t + c.b) / 2 - prevDy;
      return {
        ax, ay, x: ax, y: ay, ox: 0, oy: 0,
        phase: rnd() * Math.PI * 2, amp: 3, speed: 0.00035 + rnd() * 0.0002,
        size: 0, kind: 'dot', alpha: 1, hop: Infinity, z: 1, par: 0, el, r: (c.r - c.l) / 2,
      };
    };
    const fixed = specials.filter((el) => !isArea(el) && el.getClientRects().length > 0).map(toNode);
    const home = fixed[0];

    // Density, 0..1. Side by side: sparse and faint inside a circle centred on the
    // text that reaches the portrait's left edge, denser outside it. The edge of the
    // circle is an arc: at the top and bottom of the page the graph starts before
    // the portrait, in the middle it starts at the portrait. Stacked: dense in the
    // graph band at the top, sparse from the text down.
    const tr = rel(text);
    const stage = specials[0]?.parentElement;
    const side = stage ? rel(stage).l >= tr.r - 1 : true;
    const cx = (tr.l + tr.r) / 2;
    const cy = home.ay;
    // The arc is anchored where the portrait used to sit (34% of the stage), not on
    // the portrait itself, so moving the portrait does not move the graph.
    const sr = stage ? rel(stage) : null;
    const anchorX = side && sr ? sr.l + (sr.r - sr.l) * FIELD_ANCHOR : home.ax;
    const radius = Math.max(anchorX - home.r - cx, Math.hypot(tr.r - cx, tr.t - cy) + 40);
    const field = side
      ? (x: number, y: number) =>
          // Only the right side of the circle is an edge; left of the text stays sparse.
          smooth(radius * 0.82, radius * 1.18, Math.hypot(Math.max(0, x - cx), y - cy)) * smooth(cx - 120, cx + 160, x)
      : (_x: number, y: number) => 1 - smooth(tr.t - 120, tr.t + 40, y);

    // Labels next to the DOM nodes (e.g. "LinkedIn /in/...") stay clear of nodes too.
    const labels = fixed.flatMap((n) => [...n.el!.querySelectorAll('.label')].map(rel));

    // Area icons: scattered over the dense part of the graph, away from the portrait,
    // the links, the controls and each other. An icon that finds no
    // free spot (small screens) stays hidden.
    const controls = document.querySelector('.controls');
    const cr = controls ? rel(controls) : null;
    const placed: GNode[] = [];
    const gap = side ? 150 : 90;
    const maxIcons = side ? 8 : 4; // the stacked layout has little room
    for (const el of specials.filter(isArea)) {
      el.removeAttribute('data-placed');
      if (placed.length >= maxIcons) continue;
      for (let tries = 0; tries < 800; tries++) {
        const x = 36 + rnd() * (W - 72);
        const y = 36 + rnd() * (H - 72);
        if (field(x, y) < 0.3) continue;
        if (fixed.some((n) => Math.hypot(n.ax - x, n.ay - y) < n.r + 60)) continue;
        if (labels.some((r) => distToRect(x, y, r) < 36)) continue;
        if (cr && distToRect(x, y, cr) < 40) continue;
        if (placed.some((n) => Math.hypot(n.ax - x, n.ay - y) < gap)) continue;
        el.style.setProperty('--x', `${x.toFixed(1)}px`);
        el.style.setProperty('--y', `${y.toFixed(1)}px`);
        el.dataset.placed = '';
        placed.push(toNode(el));
        break;
      }
    }
    const special = [...fixed, ...placed];
    labels.push(...placed.flatMap((n) => [...n.el!.querySelectorAll('.label')].map(rel)));

    // Same density on any screen size: more nodes on bigger screens. A grid of
    // buckets keeps the distance checks cheap when there are many nodes.
    const spacing = W < 700 ? 58 : 70;
    const target = Math.min(1400, Math.round((W * H) / (spacing * spacing * 2.4)));
    const cell = spacing * 2.6; // >= the longest edge, so `around` finds all neighbours
    const grid = new Map<string, number[]>();
    const cellKey = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
    const around = (x: number, y: number) => {
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      const out: number[] = [];
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) out.push(...(grid.get(`${cx + i},${cy + j}`) ?? []));
      return out;
    };
    for (let i = 0; i < target * 40 && fresh.length < target; i++) {
      const x = rnd() * (W + 60) - 30;
      const y = rnd() * (H + 40) - 20;
      const f = field(x, y);
      if (rnd() > 0.1 + 0.9 * f) continue;
      if (special.some((s) => Math.hypot(s.ax - x, s.ay - y) < s.r + 18)) continue;
      if (labels.some((r) => distToRect(x, y, r) < 16)) continue;
      if (around(x, y).some((j) => Math.hypot(fresh[j].ax - x, fresh[j].ay - y) < spacing * 0.82)) continue;
      const depth = rnd();
      const z = depth < PLANES[0].share ? 0 : depth < PLANES[0].share + PLANES[1].share ? 1 : 2;
      const plane = PLANES[z];
      const roll = rnd();
      const kind: Kind = z === 1 && roll < 0.1 ? 'ring' : z === 1 && roll < 0.15 ? 'square' : 'dot';
      fresh.push({
        ax: x, ay: y, x, y, ox: 0, oy: 0,
        phase: rnd() * Math.PI * 2, amp: plane.amp * (0.6 + rnd() * 0.8), speed: 0.00025 + rnd() * 0.0003,
        size: plane.size[0] + rnd() * (plane.size[1] - plane.size[0]) + (kind === 'dot' ? 0 : 0.8),
        kind, alpha: (0.14 + 0.86 * f) * plane.alpha, hop: Infinity, z, par: plane.par, r: 0,
      });
      const k = cellKey(x, y);
      grid.set(k, [...(grid.get(k) ?? []), fresh.length - 1]);
    }

    const pool = fresh; // drawn on the canvas
    firstSpecial = pool.length;
    nodes = [...pool, ...special];
    adjacency = nodes.map(() => []);
    const seen = new Set<string>();
    edges = [];
    const link = (a: number, b: number) => {
      const k = key(a, b);
      if (seen.has(k)) return;
      seen.add(k);
      edges.push([a, b, Math.min(nodes[a].alpha, nodes[b].alpha)]);
      adjacency[a].push(b);
      adjacency[b].push(a);
    };
    // Candidates within `max` come from the grid; DOM nodes (max = Infinity) scan all.
    const nearest = (i: number, count: number, max: number) =>
      (max <= cell ? around(nodes[i].ax, nodes[i].ay) : fresh.map((_, j) => j))
        .map((j) => [j, Math.hypot(fresh[j].ax - nodes[i].ax, fresh[j].ay - nodes[i].ay) - nodes[i].r] as const)
        .filter(([j, d]) => j !== i && d < max)
        .sort((a, b) => a[1] - b[1])
        .slice(0, count);

    // Edges stay within a plane or between neighbouring planes, so depth reads.
    for (let i = 0; i < fresh.length; i++)
      for (const [j] of nearest(i, 6, spacing * 2.5)
        .filter(([j]) => Math.abs(fresh[j].z - fresh[i].z) <= 1)
        .slice(0, PLANES[fresh[i].z].links))
        link(i, j);
    // DOM nodes always connect, however sparse the graph is around them.
    for (let i = firstSpecial; i < nodes.length; i++)
      for (const [j] of nearest(i, i === firstSpecial ? 4 : 2, Infinity)) link(i, j);

    // Paths to the links: shortest (by length) through the ordinary edges, so they
    // look like the rest of the graph. Used only for the hover highlight.
    const portrait = firstSpecial;
    const dist = nodes.map(() => Infinity);
    const prev = nodes.map(() => -1);
    const done = nodes.map(() => false);
    dist[portrait] = 0;
    for (;;) {
      let u = -1;
      for (let i = 0; i < nodes.length; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0) break;
      done[u] = true;
      // Paths go through regular nodes only, never through another DOM node.
      if (u !== portrait && u >= firstSpecial) continue;
      for (const v of adjacency[u]) {
        const d = dist[u] + Math.hypot(nodes[v].ax - nodes[u].ax, nodes[v].ay - nodes[u].ay);
        if (d < dist[v]) {
          dist[v] = d;
          prev[v] = u;
        }
      }
    }
    routes = [];
    for (let i = firstSpecial + 1; i < firstSpecial + fixed.length; i++) {
      if (prev[i] < 0) continue;
      const path = [i];
      while (path[0] !== portrait) path.unshift(prev[path[0]]);
      routes.push({ el: nodes[i].el!, path });
    }

    order = pool.map((_, i) => i).sort((a, b) => nodes[a].z - nodes[b].z);

    // Bokeh and dust, only where the graph is dense.
    bokeh = [];
    dust = [];
    for (let i = 0; i < 4000 && bokeh.length < Math.round((W * H) / 220000) + 3; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      if (field(x, y) < 0.6) continue;
      bokeh.push({ x, y, r: 24 + rnd() * 70, a: 0.05 + rnd() * 0.08, phase: rnd() * 6.3, accent: rnd() < 0.25 });
    }
    for (let i = 0; i < 6000 && dust.length < Math.round((W * H) / 14000); i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      if (rnd() > field(x, y)) continue;
      dust.push({ x, y, a: 0.15 + rnd() * 0.35, phase: rnd() * 6.3 });
    }

    // Hops from the portrait, for the pulse wave.
    const queue = [portrait];
    nodes[portrait].hop = 0;
    maxHop = 0;
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adjacency[u]) {
        if (nodes[v].hop === Infinity) {
          nodes[v].hop = nodes[u].hop + 1;
          maxHop = Math.max(maxHop, nodes[v].hop);
          queue.push(v);
        }
      }
    }
    if (frozen) paintFrozen();
  }

  // Three tones in bands by distance from the portrait, like waves that got stuck,
  // with some jitter so the bands are not too regular.
  function paintFrozen() {
    const rnd = mulberry32(frozenSeed);
    const order = [0, 1, 2].sort(() => rnd() - 0.5);
    frozen = nodes.map((n) =>
      n.hop === Infinity ? Math.floor(rnd() * 3) : order[Math.floor((n.hop + rnd() * 1.6) / 2) % 3],
    );
    nodes.forEach((n, i) => {
      if (!n.el) return;
      const tone = TONES[frozen![i]];
      if (n.el.classList.contains('node-link')) n.el.dataset.tone = tone;
      else if (n.el.classList.contains('node-area')) {
        n.el.style.setProperty('--pulse', '100%');
        n.el.style.setProperty('--pulse-color', `var(--tone-${tone})`);
      }
    });
  }

  function step(t: number) {
    const still = calm.matches;
    // Parallax: the planes shift against the pointer, the near one the most.
    const px = pointer.on && !still ? pointer.x - W / 2 : 0;
    const py = pointer.on && !still ? pointer.y - H / 2 : 0;
    parallax.x += (-px - parallax.x) * 0.04;
    parallax.y += (-py - parallax.y) * 0.04;
    waves = waves.filter((w) => t - w.start < maxHop * PULSE_STEP + PULSE_LENGTH + 100);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const dx = still ? 0 : Math.sin(t * n.speed + n.phase) * n.amp;
      const dy = still ? 0 : Math.cos(t * n.speed * 0.8 + n.phase * 1.3) * n.amp;
      if (n.el) {
        const g = n.el && drags.get(n.el);
        let gx = 0;
        let gy = 0;
        if (g) {
          if (g.held) {
            g.x += (g.tx - g.x) * 0.35;
            g.y += (g.ty - g.y) * 0.35;
          } else if (still) {
            drags.delete(n.el);
          } else {
            // Underdamped spring: overshoots a little, then settles.
            g.vx = (g.vx - g.x * 0.16) * 0.78;
            g.vy = (g.vy - g.y * 0.16) * 0.78;
            g.x += g.vx;
            g.y += g.vy;
            if (Math.hypot(g.x, g.y) < 0.1 && Math.hypot(g.vx, g.vy) < 0.1) drags.delete(n.el);
          }
          if (drags.has(n.el)) {
            gx = g.x;
            gy = g.y;
          }
        }
        n.x = n.ax + dx + gx;
        n.y = n.ay + dy + gy;
        n.el.style.setProperty('--dx', `${(dx + gx).toFixed(2)}px`);
        n.el.style.setProperty('--dy', `${(dy + gy).toFixed(2)}px`);
        // Area icons take the accent colour while the pulse passes through them.
        const { p, color, tone } = pulseAt(n, t);
        if (n.el.classList.contains('node-link')) {
          // Links take the colour of the wave that reaches them, and keep it.
          if (p > 0 && tone) n.el.dataset.tone = tone;
          continue;
        }
        if (frozen) continue;
        if (p > 0) {
          n.el.style.setProperty('--pulse', `${Math.round(p * 100)}%`);
          n.el.style.setProperty('--pulse-color', color);
        } else if (n.el.style.getPropertyValue('--pulse')) {
          n.el.style.removeProperty('--pulse');
          n.el.style.removeProperty('--pulse-color');
        }
        continue;
      }
      let tx = 0;
      let ty = 0;
      if (pointer.on && !still) {
        const px = n.ax + dx - pointer.x;
        const py = n.ay + dy - pointer.y;
        const d = Math.hypot(px, py);
        if (d < POINTER_RADIUS && d > 0.01) {
          const f = (1 - d / POINTER_RADIUS) ** 2 * 28;
          tx = (px / d) * f;
          ty = (py / d) * f;
        }
      }
      n.ox += (tx - n.ox) * 0.08;
      n.oy += (ty - n.oy) * 0.08;
      n.x = n.ax + dx + n.ox + parallax.x * n.par;
      n.y = n.ay + dy + n.oy + parallax.y * n.par;
    }
  }

  // Strongest wave at a node: intensity 0..1 and that wave's colour.
  const pulseAt = (n: GNode, t: number) => {
    let p = 0;
    let color = colors.accent;
    let tone = '';
    for (const w of waves) {
      const k = (t - w.start - n.hop * PULSE_STEP) / PULSE_LENGTH;
      if (k >= 0 && k < 1 && 1 - k > p) {
        p = 1 - k;
        color = w.color;
        tone = w.tone;
      }
    }
    return { p, color, tone };
  };

  function draw(t: number) {
    const c = ctx!;
    c.clearRect(0, 0, W, H);
    const lineBase = colors.dark ? 0.42 : 0.36;
    const still = calm.matches;

    // Bokeh: big blurred spots that drift slowly and move most with the pointer.
    for (const b of bokeh) {
      const x = b.x + parallax.x * 0.05 + (still ? 0 : Math.sin(t * 0.00012 + b.phase) * 18);
      const y = b.y + parallax.y * 0.05 + (still ? 0 : Math.cos(t * 0.0001 + b.phase) * 14);
      const grad = c.createRadialGradient(x, y, 0, x, y, b.r);
      const a = b.a * (colors.dark ? 1 : 0.6);
      if (b.accent) {
        c.globalAlpha = a * 0.8;
        grad.addColorStop(0, colors.accent);
      } else {
        grad.addColorStop(0, `rgba(${colors.line},${a})`);
      }
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(x, y, b.r, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }
    // Dust: tiny far particles, no edges.
    c.fillStyle = `rgb(${colors.node})`;
    for (const d of dust) {
      c.globalAlpha = d.a * (still ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 + d.phase));
      c.fillRect(d.x + parallax.x * 0.003, d.y + parallax.y * 0.003, 1.2, 1.2);
    }
    c.globalAlpha = 1;

    // Edges
    for (const [a, b, alpha] of edges) {
      const na = nodes[a];
      const nb = nodes[b];
      let al = lineBase * alpha;
      if (pointer.on) {
        const d = Math.hypot((na.x + nb.x) / 2 - pointer.x, (na.y + nb.y) / 2 - pointer.y);
        if (d < POINTER_RADIUS) al += 0.3 * (1 - d / POINTER_RADIUS) * alpha;
      }
      c.lineWidth = Math.min(na.z, nb.z) === 2 ? 1.2 : Math.min(na.z, nb.z) === 1 ? 0.9 : 0.6;
      c.strokeStyle = `rgba(${colors.line},${al.toFixed(3)})`;
      c.beginPath();
      c.moveTo(na.x, na.y);
      c.lineTo(nb.x, nb.y);
      if (frozen) {
        c.globalAlpha = Math.min(1, alpha * 1.4) * 0.85;
        c.strokeStyle = tones[frozen[a]];
        c.stroke();
        c.globalAlpha = 1;
        continue;
      }
      c.stroke();
      const pa = pulseAt(na, t);
      const pb = pulseAt(nb, t);
      const pulse = pa.p >= pb.p ? pa : pb;
      if (pulse.p > 0) {
        c.globalAlpha = pulse.p * 0.8 * Math.min(1, alpha * 1.5);
        c.strokeStyle = pulse.color;
        c.stroke();
        c.globalAlpha = 1;
      }
    }

    // Lines from the pointer to nearby nodes
    if (pointer.on) {
      for (let i = 0; i < firstSpecial; i++) {
        const n = nodes[i];
        const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        if (d > POINTER_RADIUS * 0.9) continue;
        c.lineWidth = 0.8;
      c.strokeStyle = `rgba(${colors.line},${(0.28 * (1 - d / (POINTER_RADIUS * 0.9)) * n.alpha).toFixed(3)})`;
        c.beginPath();
        c.moveTo(pointer.x, pointer.y);
        c.lineTo(n.x, n.y);
        c.stroke();
      }
    }

    // While a link is hovered, its path from the portrait gets a little brighter.
    const route = !frozen && hot ? routes.find((r) => r.el === hot) : undefined;
    if (route) {
      c.lineJoin = 'round';
      c.lineWidth = 1.2;
      c.strokeStyle = `rgba(${colors.line},0.75)`;
      c.beginPath();
      route.path.forEach((k, j) => (j ? c.lineTo(nodes[k].x, nodes[k].y) : c.moveTo(nodes[k].x, nodes[k].y)));
      c.stroke();
    }
    c.shadowBlur = 0;
    c.globalAlpha = 1;

    // Nodes
    for (const i of order) {
      const n = nodes[i];
      const { p, color } = pulseAt(n, t);
      // Near nodes get a soft halo and a lighter fill.
      if (n.z === 2 && glow) {
        const g = n.size * 7;
        c.globalAlpha = n.alpha;
        c.drawImage(glow, n.x - g, n.y - g, g * 2, g * 2);
        c.globalAlpha = 1;
      }
      const shade = n.z === 2 ? colors.line : colors.node;
      const fill = frozen ? tones[frozen[i]] : `rgba(${shade},${(n.alpha * 0.95).toFixed(3)})`;
      if (frozen) c.globalAlpha = Math.min(1, n.alpha * 1.5);
      c.fillStyle = fill;
      c.strokeStyle = fill;
      c.lineWidth = 1.2;
      c.beginPath();
      if (n.kind === 'ring') {
        c.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        c.stroke();
      } else if (n.kind === 'square') {
        c.rect(n.x - n.size, n.y - n.size, n.size * 2, n.size * 2);
        c.fill();
      } else {
        c.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      if (p > 0) {
        c.globalAlpha = p * Math.min(1, n.alpha * 1.5);
        c.fillStyle = color;
        c.beginPath();
        c.arc(n.x, n.y, n.size + 1 + 3 * p, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1;
      }
    }
  }

  // Loop
  let raf = 0;
  let visible = true;
  const frame = (t: number) => {
    step(t);
    draw(t);
    raf = visible && (!calm.matches || drags.size) ? requestAnimationFrame(frame) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const redraw = () => {
    readColors();
    kick();
  };

  // Rebuild when the layout changes (resize, fonts loading).
  let resizeTimer = 0;
  const rebuild = () => {
    build();
    kick();
  };
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuild, 120);
  }).observe(root);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  }).observe(canvas);
  new MutationObserver(redraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-accent'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);
  calm.addEventListener('change', kick);

  // Pointer (mouse and pen only, touch just drifts)
  window.addEventListener('pointermove', (e) => {
    if (!finePointer.matches || e.pointerType === 'touch') return;
    const box = root.getBoundingClientRect();
    pointer.x = e.clientX - box.left;
    pointer.y = e.clientY - box.top;
    pointer.on = true;
  });
  document.documentElement.addEventListener('pointerleave', () => (pointer.on = false));

  // Drag the DOM nodes (mouse and pen only, so touch still scrolls the page).
  // Rubber band: the offset grows ever slower and stays under DRAG_MAX.
  const band = (d: number) => DRAG_MAX * (1 - 1 / (1 + d / (DRAG_MAX * 1.6)));
  let swallowClick = false;
  specials.forEach((el) => {
    el.addEventListener('dragstart', (e) => e.preventDefault()); // no native link/image drag
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      const g = drags.get(el);
      drags.set(el, {
        x: g?.x ?? 0, y: g?.y ?? 0, vx: 0, vy: 0, tx: g?.x ?? 0, ty: g?.y ?? 0,
        held: true, moved: false, sx: e.clientX, sy: e.clientY, id: e.pointerId,
      });
      kick();
    });
  });
  window.addEventListener('pointermove', (e) => {
    for (const [el, g] of drags) {
      if (!g.held || g.id !== e.pointerId) continue;
      const rx = e.clientX - g.sx;
      const ry = e.clientY - g.sy;
      const d = Math.hypot(rx, ry);
      if (!g.moved && d < DRAG_START) continue;
      if (!g.moved) {
        g.moved = true;
        el.setPointerCapture?.(e.pointerId);
        document.documentElement.classList.add('is-dragging');
      }
      const k = d ? band(d) / d : 0;
      g.tx = rx * k;
      g.ty = ry * k;
      kick();
    }
  });
  const release = (e: PointerEvent) => {
    for (const g of drags.values()) {
      if (!g.held || g.id !== e.pointerId) continue;
      g.held = false;
      if (g.moved) swallowClick = true; // a drag is not a click
      document.documentElement.classList.remove('is-dragging');
      kick();
    }
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  // Runs before any other click handler (capture on window).
  window.addEventListener(
    'click',
    (e) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    true,
  );
  window.addEventListener('pointerdown', () => (swallowClick = false), true);

  specials.forEach((el) => {
    if (!el.classList.contains('node-link')) return;
    const on = () => {
      hot = el;
      kick();
    };
    const off = () => {
      if (hot === el) hot = null;
      kick();
    };
    el.addEventListener('pointerenter', on);
    el.addEventListener('focus', on);
    el.addEventListener('pointerleave', off);
    el.addEventListener('blur', off);
  });

  readColors();
  build();
  kick();

  return {
    // A wave of accent colour that spreads from the portrait through the graph.
    // `tone` is the accent the wave carries (lime, cyan or magenta). With reduced
    // motion there is no wave, so the links switch colour at once.
    pulse(tone: string) {
      if (frozen) return;
      if (calm.matches) {
        specials.forEach((el) => el.classList.contains('node-link') && (el.dataset.tone = tone));
        return;
      }
      readColors(); // the accent may have just changed
      waves.push({ start: performance.now(), color: colors.accent, tone });
      kick();
    },
    // Easter egg: the graph keeps the three colours for good (until a reload).
    freeze() {
      readColors();
      waves = [];
      frozenSeed = Math.floor(Math.random() * 1e9);
      frozen = [];
      paintFrozen();
      kick();
    },
  };
}
