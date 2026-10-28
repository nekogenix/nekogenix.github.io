export function endStarfield(surface: HTMLElement) {
  const stars = Array.from(surface.querySelectorAll<HTMLElement>('.end-star'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pushes = new WeakMap<HTMLElement, Animation>();
  let neutral: { x: number; y: number } | undefined;
  const clamp = (value: number) => Math.max(-40, Math.min(40, value));

  const resetParallax = () => {
    surface.style.setProperty('--parallax-x', '0px');
    surface.style.setProperty('--parallax-y', '0px');
  };
  function parallax(event: PointerEvent) {
    if (reducedMotion.matches || (event.pointerType === 'touch' && neutral))
      return;
    const bounds = surface.getBoundingClientRect();
    surface.style.setProperty(
      '--parallax-x',
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * -80}px`,
    );
    surface.style.setProperty(
      '--parallax-y',
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * -64}px`,
    );
  }
  surface.addEventListener('pointermove', parallax, { passive: true });
  surface.addEventListener('pointerdown', parallax, { passive: true });
  surface.addEventListener('pointerleave', resetParallax);
  surface.addEventListener('pointercancel', resetParallax);
  surface.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse' && !neutral) resetParallax();
  });

  function orientation(event: DeviceOrientationEvent) {
    if (
      reducedMotion.matches ||
      document.hidden ||
      !surface.hasAttribute('data-stars-active')
    ) {
      neutral = undefined;
      return;
    }
    if (event.beta === null || event.gamma === null) return;
    const angle = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
    const x = event.gamma * Math.cos(angle) + event.beta * Math.sin(angle);
    const y = event.beta * Math.cos(angle) - event.gamma * Math.sin(angle);
    neutral ??= { x, y };
    const delta = (value: number) => ((value + 540) % 360) - 180;
    surface.style.setProperty(
      '--parallax-x',
      `${clamp(-delta(x - neutral.x) * 5)}px`,
    );
    surface.style.setProperty(
      '--parallax-y',
      `${clamp(-delta(y - neutral.y) * 5)}px`,
    );
  }
  const motionButton =
    surface.querySelector<HTMLButtonElement>('[data-enable-tilt]');
  const orientationApi = globalThis.DeviceOrientationEvent as
    | (typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>;
      })
    | undefined;
  const listen = () =>
    globalThis.addEventListener('deviceorientation', orientation, {
      passive: true,
    });
  if (orientationApi && isSecureContext) {
    if (
      orientationApi.requestPermission &&
      navigator.maxTouchPoints > 0 &&
      matchMedia('(pointer: coarse)').matches &&
      motionButton
    ) {
      motionButton.hidden = false;
      motionButton.addEventListener('click', async () => {
        try {
          if ((await orientationApi.requestPermission!()) === 'granted') {
            listen();
            motionButton.hidden = true;
            return;
          }
        } catch {
          /* Permission may be unavailable in an embedded browser. */
        }
        motionButton.textContent = motionButton.dataset.deniedLabel ?? '';
        motionButton.disabled = true;
      });
    } else if (!orientationApi.requestPermission) listen();
  }
  screen.orientation?.addEventListener('change', () => {
    neutral = undefined;
    resetParallax();
  });

  surface.addEventListener('neko-supernova', (event) => {
    if (reducedMotion.matches) return;
    const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
    const positions = stars.map((star) => {
      const bounds = star.getBoundingClientRect();
      return {
        star,
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        translate: getComputedStyle(star).translate,
      };
    });
    positions.forEach(({ star, x: starX, y: starY, translate }, index) => {
      const dx = starX - x,
        dy = starY - y;
      const distance = Math.hypot(dx, dy);
      if (distance > 360) return;
      const force = 155 * (1 - distance / 360) ** 1.1;
      const angle = distance > 1 ? Math.atan2(dy, dx) : index * 2.4;
      pushes.get(star)?.cancel();
      pushes.set(
        star,
        star.animate(
          [
            {
              translate: translate === 'none' ? '0px 0px' : translate,
              easing: 'cubic-bezier(.16,1,.3,1)',
            },
            {
              translate: `${Math.cos(angle) * force}px ${Math.sin(angle) * force}px`,
              offset: 0.14,
              easing: 'ease-out',
            },
            {
              translate: `${Math.cos(angle) * force * 0.9}px ${Math.sin(angle) * force * 0.9}px`,
              offset: 0.42,
              easing: 'cubic-bezier(.4,0,.2,1)',
            },
            { translate: '0px 0px' },
          ],
          {
            id: 'neko-supernova-push',
            duration: 4200 + (index % 5) * 160,
          },
        ),
      );
    });
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    resetParallax();
    stars.forEach((star) => pushes.get(star)?.cancel());
  });
}
