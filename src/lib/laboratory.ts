import type { createLaboratoryScene } from './laboratory-scene';

let rememberedItem: string | undefined;

export function initializeLaboratory(signal: AbortSignal) {
  const root = document.querySelector<HTMLElement>('[data-laboratory]');
  if (!root) return;
  const shelf = root.querySelector<HTMLElement>('.lab-inventory')!;
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-lab-item]'),
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-lab-panel]'),
  );
  const model = root.querySelector<HTMLElement>('[data-lab-model]')!;
  const fallback = root.querySelector<HTMLImageElement>('[data-lab-fallback]')!;
  const status = root.querySelector<HTMLElement>('[data-lab-status]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set<Animation>();
  let selected = 0;
  let scene: ReturnType<typeof createLaboratoryScene> | undefined;
  let loading = false;
  let selectionToken = 0;
  let inView = false;

  function animate(element: Element, frames: Keyframe[], duration: number) {
    if (reduced.matches) return;
    const animation = element.animate(frames, {
      duration,
      easing: 'cubic-bezier(.22,.68,.25,1)',
      fill: 'both',
    });
    animations.add(animation);
    void animation.finished
      .then(() => {
        animations.delete(animation);
        animation.cancel();
      })
      .catch(() => {});
    return animation;
  }
  async function showModel(animateSelection: boolean) {
    if (!scene) return;
    const token = ++selectionToken;
    model.removeAttribute('data-ready');
    try {
      const ready = await scene.setItem(
        buttons[selected]!.dataset.model!,
        animateSelection,
      );
      if (ready && !signal.aborted && token === selectionToken)
        model.setAttribute('data-ready', '');
    } catch {
      if (token === selectionToken) model.removeAttribute('data-ready');
    }
  }
  function select(index: number, animateSelection = true, announce = true) {
    const next = (index + buttons.length) % buttons.length;
    const same = next === selected;
    const old = panels[selected]!;
    selected = next;
    rememberedItem = buttons[next]!.dataset.labItem;
    for (const animation of animations) animation.cancel();
    animations.clear();
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === next));
      button.tabIndex = i === next ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== next;
      panel.inert = i !== next;
      panel.removeAttribute('aria-hidden');
    });
    const panel = panels[next]!;
    if (!same && animateSelection && !reduced.matches) {
      old.hidden = false;
      old.setAttribute('aria-hidden', 'true');
      const leave = animate(
        old,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-6px)' },
        ],
        150,
      );
      void leave?.finished
        .then(() => {
          old.hidden = true;
          old.removeAttribute('aria-hidden');
        })
        .catch(() => {});
      animate(
        panel,
        [
          { opacity: 0, transform: 'translateY(7px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        300,
      );
    }
    fallback.src = buttons[next]!.querySelector('img')!.src;
    if (announce)
      status.textContent = `${buttons[next]!.getAttribute('aria-label')}. ${panel.querySelector('.lab-description')!.textContent}`;
    if (same && announce) spin();
    else void showModel(animateSelection);
    const cell = buttons[next]!.getBoundingClientRect();
    const bounds = shelf.getBoundingClientRect();
    if (cell.left < bounds.left + 16 || cell.right > bounds.right - 16)
      shelf.scrollBy({
        left: cell.left - bounds.left - bounds.width / 2 + cell.width / 2,
        behavior: animateSelection && !reduced.matches ? 'smooth' : 'instant',
      });
  }
  function spin() {
    if (scene && model.hasAttribute('data-ready')) scene.spin();
    else
      animate(
        fallback,
        [
          { transform: 'translate(-50%, -50%) perspective(600px) rotateY(0)' },
          {
            transform:
              'translate(-50%, -50%) perspective(600px) rotateY(360deg)',
          },
        ],
        850,
      );
  }
  const saved = buttons.findIndex(
    (button) => button.dataset.labItem === rememberedItem,
  );
  select(saved >= 0 ? saved : 0, false, false);

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index), { signal });
    button.addEventListener(
      'keydown',
      (event) => {
        const offset =
          event.key === 'ArrowRight'
            ? 2
            : event.key === 'ArrowLeft'
              ? -2
              : event.key === 'ArrowDown'
                ? 1
                : event.key === 'ArrowUp'
                  ? -1
                  : 0;
        if (!offset && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? buttons.length - 1
              : (index + offset + buttons.length) % buttons.length;
        buttons[next]!.focus({ preventScroll: true });
        select(next);
      },
      { signal },
    );
  });
  root
    .querySelector('[data-lab-rotate]')!
    .addEventListener('click', spin, { signal });
  const adjacent = (offset: number) => {
    select(selected + offset);
  };
  root
    .querySelector('[data-lab-previous]')!
    .addEventListener('click', () => adjacent(-1), { signal });
  root
    .querySelector('[data-lab-next]')!
    .addEventListener('click', () => adjacent(1), { signal });
  let pointer:
    | {
        id: number;
        x: number;
        y: number;
        startX: number;
        startY: number;
        horizontal: boolean;
      }
    | undefined;
  model.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0 || !event.isPrimary || pointer) return;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        horizontal: event.pointerType === 'mouse',
      };
      if (pointer.horizontal) model.setPointerCapture(event.pointerId);
    },
    { signal },
  );
  model.addEventListener(
    'pointermove',
    (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.startX,
        dy = event.clientY - pointer.startY;
      if (!pointer.horizontal) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          pointer = undefined;
          return;
        }
        if (Math.abs(dx) < 8) return;
        pointer.horizontal = true;
        model.setPointerCapture(event.pointerId);
      }
      scene?.rotate(
        (event.clientX - pointer.x) * 0.012,
        (event.clientY - pointer.y) * 0.006,
      );
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { signal },
  );
  const release = (event: PointerEvent) => {
    if (pointer?.id === event.pointerId) pointer = undefined;
  };
  model.addEventListener('pointerup', release, { signal });
  model.addEventListener('pointercancel', release, { signal });
  model.addEventListener(
    'lostpointercapture',
    (event) => {
      if (event.target === model) release(event);
    },
    { signal },
  );

  const observer = new IntersectionObserver(
    async ([entry]) => {
      inView = !!entry?.isIntersecting;
      scene?.setVisible(inView);
      if (!inView || loading || scene) return;
      loading = true;
      try {
        const { createLaboratoryScene } = await import('./laboratory-scene');
        if (signal.aborted) return;
        scene = createLaboratoryScene(model, signal);
        scene.setVisible(inView);
        await showModel(false);
      } catch {
        model.removeAttribute('data-ready');
      } finally {
        loading = false;
      }
    },
    { rootMargin: '180px 0px' },
  );
  observer.observe(root);
  signal.addEventListener(
    'abort',
    () => {
      selectionToken++;
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      animations.clear();
    },
    { once: true },
  );
  reduced.addEventListener(
    'change',
    () => {
      if (!reduced.matches) return;
      for (const animation of animations) animation.cancel();
      animations.clear();
      panels.forEach((panel, index) => {
        panel.hidden = index !== selected;
        panel.inert = index !== selected;
        panel.removeAttribute('aria-hidden');
      });
    },
    { signal },
  );
}
