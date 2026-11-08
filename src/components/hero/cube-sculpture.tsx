import { useEffect, useRef } from "react";
import * as THREE from "three";

const cubeSize = 1;
const spacing = 1.18;
const cornerOffset = 0.56;
const driftDistance = 0.075;
const revolutionMs = 35_000;
const radiansPerMs = 2 * Math.PI / revolutionMs;
const mint = 0xb9f8cf; // sRGB equivalent of the headline's green-200.

export const CubeSculpture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!context) return;

    const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    const cameraDistance = Math.hypot(7, 5.8, 10);
    const azimuth = Math.atan2(7, 10);
    const initialElevation = Math.asin(5.8 / cameraDistance);
    const maxElevation = THREE.MathUtils.degToRad(85);
    let elevation = initialElevation;
    let manualRotation = 0;

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const box = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const edges = new THREE.EdgesGeometry(box);
    const outerLines = new THREE.LineBasicMaterial({
      color: 0x638d77,
    });
    const coreLines = new THREE.LineBasicMaterial({ color: mint });
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x79bc96 });
    const driftingCubes: {
      outline: THREE.LineSegments;
      origin: THREE.Vector3;
      rates: THREE.Vector3;
    }[] = [];
    const randomRate = () => (0.65 + Math.random() * 1.1) * (Math.random() < 0.5 ? -1 : 1);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const center = x === 0 && y === 0 && z === 0;
          const displaced = x !== 0 && x === y && x === -z;
          const distance = spacing + (displaced ? cornerOffset : 0);
          const outline = new THREE.LineSegments(edges, center ? coreLines : outerLines);
          outline.position.set(x * distance, y * distance, z * distance);
          sculpture.add(outline);
          if (!center) {
            driftingCubes.push({
              outline,
              origin: outline.position.clone(),
              rates: new THREE.Vector3(randomRate(), randomRate(), randomRate()),
            });
          }
        }
      }
    }
    sculpture.add(new THREE.Mesh(box, coreMaterial));

    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;

      // A corner sweeps a circle as the group turns. Fit its full projected path.
      const extent = spacing + cornerOffset + cubeSize / 2 + driftDistance;
      const radius = Math.SQRT2 * extent;
      const halfHeight = Math.hypot(extent, radius) * 1.06;
      const aspect = width / height;
      const vertical = Math.max(halfHeight, radius * 1.06 / aspect);

      camera.left = -vertical * aspect;
      camera.right = vertical * aspect;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      render();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let previousTime: number | undefined;
    let elapsed = 0;
    let drag: { id: number; x: number; y: number } | undefined;
    const updatePose = () => {
      sculpture.rotation.y = manualRotation + elapsed * radiansPerMs;
      const seconds = elapsed / 1000;

      for (const { outline, origin, rates } of driftingCubes) {
        outline.position.set(
          origin.x + Math.sin(seconds * rates.x) * driftDistance,
          origin.y + Math.sin(seconds * rates.y) * driftDistance,
          origin.z + Math.sin(seconds * rates.z) * driftDistance,
        );
      }
    };
    const animate = (time: number) => {
      if (previousTime !== undefined) elapsed += time - previousTime;
      previousTime = time;
      updatePose();
      render();
    };
    const updatePlayback = () => {
      previousTime = undefined;
      const playing = inView && !drag && !document.hidden && !reducedMotion.matches;
      renderer.setAnimationLoop(playing ? animate : null);
    };
    const rotate = (horizontal: number, vertical: number) => {
      manualRotation += horizontal;
      elevation = THREE.MathUtils.clamp(elevation + vertical, -maxElevation, maxElevation);
      const horizontalDistance = Math.cos(elevation) * cameraDistance;
      camera.position.set(
        Math.sin(azimuth) * horizontalDistance,
        Math.sin(elevation) * cameraDistance,
        Math.cos(azimuth) * horizontalDistance,
      );
      camera.lookAt(0, 0, 0);
      updatePose();
      render();
    };

    const controller = new AbortController();
    const options = { signal: controller.signal };
    canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || drag) return;
      canvas.setPointerCapture(event.pointerId);
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      updatePlayback();
    }, options);
    canvas.addEventListener("pointermove", (event) => {
      if (drag?.id !== event.pointerId) return;
      rotate((event.clientX - drag.x) * 0.012, (event.clientY - drag.y) * 0.008);
      drag.x = event.clientX;
      drag.y = event.clientY;
    }, options);
    canvas.addEventListener("lostpointercapture", (event) => {
      if (drag?.id !== event.pointerId) return;
      drag = undefined;
      updatePlayback();
    }, options);
    const arrowRotations = new Map([
      ["ArrowLeft", [-0.15, 0]],
      ["ArrowRight", [0.15, 0]],
      ["ArrowUp", [0, 0.08]],
      ["ArrowDown", [0, -0.08]],
    ]);
    canvas.addEventListener("keydown", (event) => {
      const rotation = arrowRotations.get(event.key);
      if (!rotation) return;
      event.preventDefault();
      rotate(rotation[0], rotation[1]);
    }, options);
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        elapsed = 0;
        updatePose();
        render();
      }
      updatePlayback();
    }, options);
    document.addEventListener("visibilitychange", updatePlayback, options);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    const resizeObserver = new ResizeObserver(resize);

    camera.position.set(7, 5.8, 10);
    camera.lookAt(0, 0, 0);
    resize();
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);

    return () => {
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      controller.abort();
      renderer.setAnimationLoop(null);
      coreMaterial.dispose();
      coreLines.dispose();
      outerLines.dispose();
      edges.dispose();
      box.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="z-10 mt-6 aspect-square w-[calc(100%+1rem)] max-w-76 self-center bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-green-200)_14%,transparent),transparent_32%)] lg:absolute lg:top-1/2 lg:right-28 lg:mt-0 lg:w-[31vw] lg:max-w-none lg:-translate-y-1/2 xl:w-[36vw]">
      <canvas
        ref={canvasRef}
        role="group"
        aria-label="Cube sculpture. Drag or use the arrow keys to rotate."
        tabIndex={0}
        data-lenis-prevent-touch
        className="block size-full touch-none cursor-grab select-none outline-offset-4 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-green-200"
      />
    </div>
  );
};
