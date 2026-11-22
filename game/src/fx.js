// Ambient ember particle layer, canvas overlay behind the table.
export function startFx(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;
  const P = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  function resize() {
    w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
  }
  window.addEventListener('resize', resize);
  resize();
  function spawn(y0) {
    P.push({
      x: Math.random() * w,
      y: y0 !== undefined ? y0 : h + 10,
      r: rand(1.4, 3.4),
      vy: rand(-0.3, -0.8),
      vx: rand(-0.15, 0.15),
      life: 0,
      max: rand(240, 520),
      hue: rand(16, 40),
    });
  }
  for (let i = 0; i < 80; i++) spawn(Math.random() * h);
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.x += p.vx + Math.sin((p.life + i * 13) * 0.02) * 0.25;
      p.y += p.vy;
      p.life++;
      const fade = 1 - p.life / p.max;
      if (p.life > p.max || p.y < -12) {
        P.splice(i, 1);
        spawn();
        continue;
      }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue},100%,62%,${0.85 * fade})`);
      g.addColorStop(0.5, `hsla(${p.hue},95%,50%,${0.32 * fade})`);
      g.addColorStop(1, 'hsla(20,80%,40%,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}
