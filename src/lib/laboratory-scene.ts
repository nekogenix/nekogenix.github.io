import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createLaboratoryScene(
  container: HTMLElement,
  signal: AbortSignal,
) {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-2, 2, 2, -2, 0.1, 30);
  camera.position.set(3, 2.3, 5);
  camera.lookAt(0, 0, 0);
  scene.add(new AmbientLight(0xffffff, 2.1));
  const key = new DirectionalLight(0xfff5eb, 2.5);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const fill = new DirectionalLight(0xdecde9, 0.7);
  fill.position.set(4, 1, -3);
  scene.add(fill);
  const loader = new GLTFLoader();
  const cache = new Map<string, Promise<Object3D>>();
  const assets = new Set<Object3D>();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function loadAsset(url: string) {
    if (!cache.has(url))
      cache.set(
        url,
        loader
          .loadAsync(url)
          .then((gltf) => {
            if (signal.aborted) {
              disposeAsset(gltf.scene);
              return gltf.scene;
            }
            assets.add(gltf.scene);
            return gltf.scene;
          })
          .catch((error) => {
            cache.delete(url);
            throw error;
          }),
      );
    return cache.get(url)!;
  }
  let current: Group | undefined;
  let revision = 0;
  let loadedRevision = 0;
  let frame = 0;
  let visible = true;
  let motion: { start: number; from: number; to: number } | undefined;

  function draw() {
    frame = 0;
    if (signal.aborted || !visible || document.hidden) return;
    if (motion && current) {
      const progress = Math.min(1, (performance.now() - motion.start) / 1050);
      const ease = 1 - (1 - progress) ** 4;
      current.rotation.y = MathUtils.lerp(motion.from, motion.to, ease);
      if (progress === 1) motion = undefined;
    }
    renderer.render(scene, camera);
    if (motion) frame = requestAnimationFrame(draw);
  }
  function request() {
    if (!frame && !signal.aborted && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function settle(finish = true) {
    if (motion && current) {
      if (finish) current.rotation.y = motion.to;
      current.position.y = 0;
    }
    motion = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    camera.left = -1.85 * aspect;
    camera.right = 1.85 * aspect;
    camera.top = 1.85;
    camera.bottom = -1.85;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    request();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  reduced.addEventListener(
    'change',
    () => {
      settle();
      request();
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) settle();
      else request();
    },
    { signal },
  );
  renderer.domElement.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      settle();
      container.removeAttribute('data-ready');
      container.setAttribute('data-fallback', '');
    },
    { signal },
  );
  renderer.domElement.addEventListener(
    'webglcontextrestored',
    () => {
      if (current && loadedRevision === revision) {
        container.removeAttribute('data-fallback');
        container.setAttribute('data-ready', '');
      }
      request();
    },
    { signal },
  );

  function disposeAsset(object: Object3D) {
    const materials = new Set<Material>();
    const textures = new Set<Texture>();
    object.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.geometry.dispose();
      for (const material of Array.isArray(node.material)
        ? node.material
        : [node.material])
        materials.add(material);
    });
    for (const material of materials) {
      for (const value of Object.values(material))
        if (value && typeof value === 'object' && 'isTexture' in value)
          textures.add(value as Texture);
      material.dispose();
    }
    for (const texture of textures) {
      texture.dispose();
      if (
        typeof ImageBitmap !== 'undefined' &&
        texture.image instanceof ImageBitmap
      )
        texture.image.close();
    }
  }

  signal.addEventListener(
    'abort',
    () => {
      revision++;
      settle();
      observer.disconnect();
      for (const asset of assets) disposeAsset(asset);
      cache.clear();
      assets.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
    { once: true },
  );
  resize();

  return {
    async preload(urls: string[]) {
      const pending = [...new Set(urls)];
      await Promise.all(
        Array.from({ length: 2 }, async () => {
          while (!signal.aborted && pending.length) {
            try {
              await loadAsset(pending.shift()!);
            } catch {
              // A failed preload can be retried when the item is selected.
            }
          }
        }),
      );
    },
    async setItem(url: string, animate = true) {
      const token = ++revision;
      const asset = await loadAsset(url);
      if (signal.aborted || token !== revision) return false;
      settle();
      if (current) scene.remove(current);
      const model = asset.clone(true);
      const bounds = new Box3().setFromObject(model);
      const size = bounds.getSize(new Vector3());
      model.position.sub(bounds.getCenter(new Vector3()));
      current = new Group();
      loadedRevision = token;
      current.add(model);
      current.scale.setScalar(2.15 / Math.max(size.x, size.y, size.z));
      const base = asset.children[0]?.userData.kind === 'block' ? Math.PI : 0;
      current.rotation.y = base;
      scene.add(current);
      if (animate && !reduced.matches)
        motion = {
          start: performance.now(),
          from: base - Math.PI * 2,
          to: base,
        };
      request();
      return true;
    },
    spin() {
      if (!current) return;
      settle(false);
      if (reduced.matches) current.rotation.y += Math.PI / 2;
      else
        motion = {
          start: performance.now(),
          from: current.rotation.y,
          to: current.rotation.y + Math.PI * 2,
        };
      request();
    },
    rotate(horizontal: number, vertical: number) {
      if (!current) return;
      settle(false);
      current.rotation.y += horizontal;
      current.rotation.x = MathUtils.clamp(
        current.rotation.x + vertical,
        -0.55,
        0.55,
      );
      request();
    },
    setVisible(value: boolean) {
      visible = value;
      if (!visible) settle();
      else request();
    },
  };
}
