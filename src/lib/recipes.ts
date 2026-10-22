export function initializeRecipeTooltips(signal: AbortSignal) {
  const items = document.querySelectorAll('[data-recipe-item]');
  if (!items.length) return;
  let active: HTMLElement | undefined;
  let tooltip: HTMLElement | undefined;
  let pointer: { x: number; y: number } | undefined;
  let dismissed: HTMLElement | undefined;

  for (const item of items) item.setAttribute('data-tooltip-enabled', '');

  const itemFor = (target: EventTarget | null) =>
    target instanceof Element
      ? target.closest<HTMLElement>('[data-recipe-item]')
      : null;

  const hide = () => {
    active?.removeAttribute('data-tooltip-open');
    // Keep the last position while the tooltip fades out.
    active = undefined;
    tooltip = undefined;
  };

  const position = () => {
    if (!active || !tooltip) return;
    const anchor = active.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const x = pointer?.x ?? anchor.left + anchor.width / 2;
    const y = pointer?.y ?? anchor.bottom;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const left = Math.max(8, Math.min(x + 14, viewportWidth - width - 8));
    const top = y + height + 22 < viewportHeight ? y + 18 : y - height - 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
  };

  const show = (item: HTMLElement) => {
    if (active !== item) hide();
    active = item;
    tooltip = item.querySelector<HTMLElement>('[data-item-tooltip]')!;
    item.setAttribute('data-tooltip-open', '');
    tooltip.setAttribute('data-positioned', '');
    position();
  };

  document.addEventListener(
    'pointerover',
    (event) => {
      const item = itemFor(event.target);
      if (!item || item === itemFor(event.relatedTarget)) return;
      dismissed = undefined;
      pointer = { x: event.clientX, y: event.clientY };
      show(item);
    },
    { signal },
  );
  document.addEventListener(
    'pointermove',
    (event) => {
      const item = itemFor(event.target);
      if (!item || item === dismissed) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (active === item) position();
      else show(item);
    },
    { signal },
  );
  document.addEventListener(
    'pointerout',
    (event) => {
      if (
        !active ||
        active !== itemFor(event.target) ||
        active === itemFor(event.relatedTarget)
      )
        return;
      pointer = undefined;
      if (document.activeElement === active) position();
      else hide();
    },
    { signal },
  );
  document.addEventListener(
    'focusin',
    (event) => {
      const item = itemFor(event.target);
      if (!item) return;
      dismissed = undefined;
      pointer = undefined;
      show(item);
    },
    { signal },
  );
  document.addEventListener(
    'focusout',
    (event) => {
      if (active === itemFor(event.target)) hide();
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        dismissed = active;
        hide();
      }
    },
    { signal },
  );
  const reposition = () => {
    if (active && document.activeElement === active) {
      const anchor = active.getBoundingClientRect();
      if (anchor.bottom > 0 && anchor.top < innerHeight) {
        pointer = undefined;
        position();
        return;
      }
    }
    hide();
  };
  addEventListener('scroll', reposition, {
    signal,
    capture: true,
    passive: true,
  });
  addEventListener('resize', reposition, { signal, passive: true });
  signal.addEventListener('abort', hide, { once: true });
}
