export function nekoSupernova(surface: HTMLElement) {
  const layer = surface.querySelector<HTMLElement>('[data-neko-supernova]');
  if (!layer) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pulses: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    start: number;
  }[] = [];
  let lastPulse = 0;
  let frame = 0;
  const size = 96;
  const paw = [
    '...pp...pp...',
    '..pppp.pppp..',
    '..pppp.pppp..',
    '...pp...pp...',
    'pp.........pp',
    'ppp.......ppp',
    'ppp..ppp..ppp',
    '.p..ppppp..p.',
    '...ppppppp...',
    '..ppppppppp..',
    '..ppppppppp..',
    '...ppp.ppp...',
  ];
  const sparks = Array.from({ length: 32 }, (_, i) => ({
    angle: i * 2.39996,
    speed: 17 + ((i * 13) % 28),
    delay: (i % 4) * 0.025,
    bright: i % 3 === 0,
  }));

  function paint(
    context: CanvasRenderingContext2D,
    progress: number,
    still: boolean,
  ) {
    context.clearRect(0, 0, size, size);
    const radius = 3 + progress * 41;
    const fade = (1 - progress) ** 1.4;
    // A limited palette keeps every edge and particle visibly pixelated.
    for (let y = -44; y <= 44; y++) {
      for (let x = -44; x <= 44; x++) {
        const distance = Math.hypot(x, y);
        const grain = ((x * 73 + y * 37 + 12000) % 17) / 17;
        const ring = Math.abs(distance - radius);
        if (ring < 1.3 && grain > 0.2) context.fillStyle = '#ffc5e0';
        else if (ring < 3 && grain > 0.45) context.fillStyle = '#bc71ad';
        else if (distance < radius && distance > radius * 0.65 && grain > 0.78)
          context.fillStyle = '#68365f';
        else continue;
        context.globalAlpha = still ? 0.6 : fade;
        context.fillRect(x + 48, y + 48, 1, 1);
      }
    }
    for (const spark of sparks) {
      const age = Math.max(0, progress - spark.delay);
      const distance = 4 + Math.sqrt(age) * spark.speed;
      const x = Math.round(48 + Math.cos(spark.angle) * distance);
      const y = Math.round(48 + Math.sin(spark.angle) * distance);
      context.globalAlpha = fade;
      context.fillStyle = spark.bright ? '#ffe8f5' : '#ffc5e0';
      context.fillRect(x, y, 1, 1);
      if (spark.bright) {
        context.globalAlpha = fade * 0.35;
        context.fillRect(
          x - Math.sign(Math.cos(spark.angle)),
          y - Math.sign(Math.sin(spark.angle)),
          1,
          1,
        );
      }
    }
    const windup = Math.min(1, progress / 0.16);
    const contact = Math.max(0, 1 - Math.abs(progress - 0.19) / 0.07);
    const withdraw = Math.min(1, Math.max(0, (progress - 0.32) / 0.3));
    const offsetY = still ? 0 : -17 * (1 - windup) ** 2 - 16 * withdraw ** 2;
    const scaleX = still ? 1 : 0.8 + 0.2 * windup + 0.2 * contact;
    const scaleY = still ? 1 : 1.1 - 0.1 * windup - 0.25 * contact;
    context.globalAlpha = still
      ? 0.9
      : Math.min(1, progress / 0.04) * (1 - withdraw);
    context.fillStyle = '#ffc5e0';
    paw.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== 'p') continue;
        const left = Math.round(48 + (x - 6.5) * scaleX);
        const top = Math.round(48 + (y - 6) * scaleY + offsetY);
        const right = Math.round(48 + (x - 5.5) * scaleX);
        const bottom = Math.round(48 + (y - 5) * scaleY + offsetY);
        context.fillRect(left, top, right - left, bottom - top);
      }
    });
    context.globalAlpha = 1;
  }
  function animate(time: number) {
    frame = 0;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i]!;
      const progress = (time - pulse.start) / 1500;
      if (progress >= 1 || document.hidden || !pulse.canvas.isConnected) {
        pulse.canvas.remove();
        pulses.splice(i, 1);
      } else paint(pulse.context, progress, false);
    }
    if (pulses.length) frame = requestAnimationFrame(animate);
  }
  function pulse(x: number, y: number) {
    const bounds = layer!.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.style.setProperty('--nova-x', `${x - bounds.left}px`);
    canvas.style.setProperty('--nova-y', `${y - bounds.top}px`);
    canvas.style.setProperty(
      '--nova-size',
      `${Math.min(480, bounds.width * 1.2)}px`,
    );
    layer!.append(canvas);
    while (pulses.length >= 4) pulses.shift()!.canvas.remove();
    if (reducedMotion.matches) {
      while (layer!.childElementCount > 4) layer!.firstElementChild?.remove();
      paint(context, 0.25, true);
      setTimeout(() => canvas.remove(), 650);
    } else {
      pulses.push({ canvas, context, start: performance.now() });
      paint(context, 0, false);
      if (!frame) frame = requestAnimationFrame(animate);
    }
    lastPulse = performance.now();
    surface.dispatchEvent(
      new CustomEvent('neko-supernova', { detail: { x, y } }),
    );
  }
  surface.addEventListener(
    'pointerdown',
    (event) => pulse(event.clientX, event.clientY),
    { passive: true },
  );
  surface.addEventListener(
    'pointermove',
    (event) => {
      if (event.buttons && performance.now() - lastPulse > 160)
        pulse(event.clientX, event.clientY);
    },
    { passive: true },
  );
  surface.addEventListener('click', (event) => {
    if (event.detail !== 0 || !(event.target instanceof Element)) return;
    const node = event.target.closest('[data-adv-select]');
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    pulse(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  });
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    pulses.splice(0).forEach((pulse) => pulse.canvas.remove());
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stop();
  });
}
