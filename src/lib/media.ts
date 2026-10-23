interface PlaybackState {
  time: number;
  paused: boolean;
  manuallyStarted: boolean;
}

interface Connection extends EventTarget {
  saveData?: boolean;
}

const playback = new Map<string, PlaybackState>();

export function initializeMedia(signal: AbortSignal) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;

  for (const figure of document.querySelectorAll<HTMLElement>('[data-demo]')) {
    const name = figure.dataset.demo!;
    const video = figure.querySelector<HTMLVideoElement>('video')!;
    const sources = ['mp4', 'webm'].map((format) => {
      const source = document.createElement('source');
      source.type = `video/${format}`;
      source.dataset.format = format;
      return source;
    });
    const toggle = figure.querySelector<HTMLButtonElement>(
      '[data-video-toggle]',
    )!;
    const saved = playback.get(name);
    const chapters = (figure.dataset.chapters ?? '')
      .split(',')
      .filter(Boolean)
      .map(Number);
    const section = figure.closest('[data-demo-section]');
    const chapterItems = section?.querySelectorAll('[data-demo-chapter]');
    let visible = false;
    let loaded = false;
    let manuallyStarted = saved?.manuallyStarted ?? false;
    let userPaused = saved?.paused ?? false;
    let failed = false;
    let failedSources = 0;

    video.muted = true;
    video.defaultMuted = true;
    toggle.hidden = false;

    const updateButton = () => {
      const playing = !video.paused && !video.ended;
      figure.toggleAttribute('data-playing', playing);
      toggle.setAttribute(
        'aria-label',
        (playing ? toggle.dataset.pauseLabel : toggle.dataset.playLabel)!,
      );
    };

    const updateChapter = () => {
      if (!chapters.length || !figure.hasAttribute('data-ready')) return;
      const current = Math.max(
        0,
        chapters.findLastIndex((time) => video.currentTime >= time),
      );
      section?.setAttribute('data-video-active', '');
      chapterItems?.forEach((item, index) => {
        item.toggleAttribute('data-active', index === current);
      });
    };

    const load = () => {
      if (loaded && !failed) return;
      const width =
        video.getBoundingClientRect().width * Math.min(devicePixelRatio, 2) >
        1280
          ? 1920
          : 1280;
      failedSources = 0;
      const revision = name === 'laboratory-background' ? '?v=ui-trim' : '';
      for (const source of sources) {
        source.src = `/media/${name}-${width}.${source.dataset.format}${revision}`;
        if (!source.isConnected) video.append(source);
      }
      loaded = true;
      failed = false;
      video.load();
    };

    const synchronize = () => {
      const automatic = !reducedMotion.matches && !connection?.saveData;
      if (
        signal.aborted ||
        document.hidden ||
        !visible ||
        userPaused ||
        (!automatic && !manuallyStarted)
      ) {
        video.pause();
        return;
      }
      if (failed) return;
      load();
      void video.play().catch(() => updateButton());
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.1;
        synchronize();
      },
      { threshold: [0, 0.1] },
    );
    observer.observe(figure);

    toggle.addEventListener(
      'click',
      () => {
        if (!video.paused) {
          userPaused = true;
          video.pause();
        } else {
          userPaused = false;
          manuallyStarted = true;
          if (failed) loaded = false;
          failed = false;
          synchronize();
        }
      },
      { signal },
    );
    video.addEventListener('play', updateButton, { signal });
    video.addEventListener('pause', updateButton, { signal });
    video.addEventListener(
      'playing',
      () => {
        figure.setAttribute('data-ready', '');
        updateChapter();
      },
      { signal },
    );
    video.addEventListener('timeupdate', updateChapter, { signal });
    video.addEventListener(
      'loadedmetadata',
      () => {
        if (saved && Number.isFinite(video.duration))
          video.currentTime = Math.max(
            0,
            Math.min(saved.time, video.duration - 0.1),
          );
      },
      { signal, once: true },
    );
    const showPoster = () => {
      failed = true;
      figure.removeAttribute('data-ready');
      section?.removeAttribute('data-video-active');
      chapterItems?.forEach((item) => {
        item.removeAttribute('data-active');
      });
      video.pause();
    };
    video.addEventListener('error', showPoster, { signal });
    for (const source of sources)
      source.addEventListener(
        'error',
        () => {
          if (++failedSources >= sources.length) showPoster();
        },
        { signal },
      );
    document.addEventListener('visibilitychange', synchronize, { signal });
    reducedMotion.addEventListener('change', synchronize, { signal });
    connection?.addEventListener('change', synchronize, { signal });
    signal.addEventListener(
      'abort',
      () => {
        playback.set(name, {
          time: video.readyState >= 1 ? video.currentTime : (saved?.time ?? 0),
          paused: userPaused,
          manuallyStarted,
        });
        video.pause();
        observer.disconnect();
      },
      { once: true },
    );
    updateButton();
  }
}
