import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CursorTrail — Codrops-inspired fiery burn-through effect
 * 
 * Architecture: TWO WebGL layers with CSS blend modes
 * 1. BURN layer (mix-blend-mode: multiply) — dark scorch marks DARKEN content below
 * 2. FIRE layer (mix-blend-mode: screen) — bright fire embers ADD light on top
 * 
 * This creates a genuine "burned through" visual where the mouse trail
 * physically chars/scorches the video, text, and cards underneath.
 */

const SIM_RES = 200;         // Flow-field simulation resolution
const BRUSH_RADIUS = 8;      // Base brush radius in grid cells
const HEAT_DECAY = 0.88;     // Active flame cooling rate
const SCORCH_DECAY = 0.975;  // Charred residue lingers ~3s
const FLOW_DECAY = 0.92;     // Flow vector momentum decay

export default function CursorTrail() {
  const burnRef = useRef(null);
  const fireRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const burnContainer = burnRef.current;
    const fireContainer = fireRef.current;
    if (!burnContainer || !fireContainer) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ═══════════════════════════════════════════
    // SHARED SIMULATION: CPU flow-field + heat map
    // ═══════════════════════════════════════════
    // R: flow vector X (centered at 128)
    // G: flow vector Y (centered at 128)
    // B: active flame heat (0-255)
    // A: charred scorch residue (0-255)
    const simBuffer = new Uint8Array(SIM_RES * SIM_RES * 4);
    for (let i = 0; i < SIM_RES * SIM_RES; i++) {
      simBuffer[i * 4] = 128;
      simBuffer[i * 4 + 1] = 128;
    }

    // ═══════════════════════════════════════════
    // LAYER 1: BURN (Scorch / Char) — mix-blend-mode: multiply
    // Renders LIGHT colors where nothing is burned (multiply with white = no change)
    // Renders DARK colors where scorched (multiply with dark = darkens content)
    // ═══════════════════════════════════════════
    const burnScene = new THREE.Scene();
    const burnCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const burnRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    burnRenderer.setSize(width, height);
    burnRenderer.setPixelRatio(dpr);
    burnRenderer.setClearColor(0x000000, 0);
    burnContainer.appendChild(burnRenderer.domElement);

    const burnDataTex = new THREE.DataTexture(
      simBuffer, SIM_RES, SIM_RES,
      THREE.RGBAFormat, THREE.UnsignedByteType
    );
    burnDataTex.minFilter = THREE.LinearFilter;
    burnDataTex.magFilter = THREE.LinearFilter;

    const burnMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uSim;
        uniform vec2 uRes;
        varying vec2 vUv;

        // Blocky pixelated dither (matches Codrops jagged brush aesthetic)
        float blockDither(vec2 uv, vec2 res) {
          vec2 px = uv * res;
          vec2 grid = floor(px / 3.0);
          float n = fract(sin(dot(grid, vec2(12.9898, 78.233))) * 43758.5453);
          return n;
        }

        void main() {
          vec4 sim = texture2D(uSim, vUv);
          float heat = sim.b;
          float scorch = sim.a;

          // Flow vectors for UV displacement (direction-aware warp)
          float flowX = (sim.r - 0.5) * 2.0; // -1 to +1
          float flowY = (sim.g - 0.5) * 2.0;
          float flowMag = length(vec2(flowX, flowY));

          float intensity = max(heat, scorch);
          if (intensity < 0.01) {
            discard;
          }

          float dither = blockDither(vUv, uRes);

          // ---- SCORCH (char mark) ----
          // For multiply blend: white = invisible, dark = burns content
          // Create a char mark that goes from white (untouched) to deep brown-black (charred)
          float scorchStrength = smoothstep(0.02, 0.5, scorch) * (0.6 + 0.5 * dither);
          scorchStrength = clamp(scorchStrength, 0.0, 1.0);

          // Charred soot color ramp:
          // Light gray → dark brown → pure black (deeper burn = darker)
          vec3 charColor;
          if (scorchStrength < 0.4) {
            float t = scorchStrength / 0.4;
            charColor = mix(vec3(0.85, 0.82, 0.78), vec3(0.35, 0.18, 0.08), t);
          } else {
            float t = (scorchStrength - 0.4) / 0.6;
            charColor = mix(vec3(0.35, 0.18, 0.08), vec3(0.05, 0.02, 0.01), t);
          }

          // Edge fraying: jagged dithered edges like real burn marks
          float edgeCut = step(0.3, dither + scorch * 0.6);
          float alpha = scorchStrength * edgeCut * 0.95;

          // Add scattered displacement-based pixel scatter at edges
          // (simulates the pixelated torn/scattered effect from Codrops)
          float scatter = smoothstep(0.1, 0.6, flowMag) * step(0.55, dither);
          alpha = max(alpha, scatter * scorch * 0.7);

          // Active heat also creates char through multiply (darkening underneath)
          if (heat > 0.03) {
            float heatChar = smoothstep(0.03, 0.7, heat);
            // Dark reddish-brown where actively burning
            vec3 hotCharColor = mix(vec3(0.4, 0.12, 0.03), vec3(0.12, 0.04, 0.01), heatChar);
            float hotAlpha = heatChar * 0.85 * (0.5 + 0.5 * edgeCut);
            charColor = mix(charColor, hotCharColor, step(alpha, hotAlpha) * hotAlpha);
            alpha = max(alpha, hotAlpha);
          }

          gl_FragColor = vec4(charColor, alpha);
        }
      `,
      uniforms: {
        uSim: { value: burnDataTex },
        uRes: { value: new THREE.Vector2(width, height) }
      },
      transparent: true,
      depthWrite: false
    });

    burnScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), burnMaterial));

    // ═══════════════════════════════════════════
    // LAYER 2: FIRE (Bright embers + sparks) — mix-blend-mode: screen
    // Renders BLACK where nothing is burning (screen with black = no change)
    // Renders BRIGHT where fire is active (screen with bright = adds light)
    // ═══════════════════════════════════════════
    const fireScene = new THREE.Scene();
    const fireCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fireRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    fireRenderer.setSize(width, height);
    fireRenderer.setPixelRatio(dpr);
    fireRenderer.setClearColor(0x000000, 0);
    fireContainer.appendChild(fireRenderer.domElement);

    const fireDataTex = new THREE.DataTexture(
      simBuffer, SIM_RES, SIM_RES,
      THREE.RGBAFormat, THREE.UnsignedByteType
    );
    fireDataTex.minFilter = THREE.LinearFilter;
    fireDataTex.magFilter = THREE.LinearFilter;

    const fireMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uSim;
        uniform vec2 uRes;
        uniform float uTime;
        varying vec2 vUv;

        float blockDither(vec2 uv, vec2 res) {
          vec2 px = uv * res;
          vec2 grid = floor(px / 2.5);
          float n = fract(sin(dot(grid, vec2(12.9898, 78.233))) * 43758.5453);
          return n;
        }

        // Animated noise for flickering fire
        float fireNoise(vec2 uv, float t) {
          vec2 grid = floor(uv * 60.0);
          float n = fract(sin(dot(grid + floor(t * 8.0), vec2(127.1, 311.7))) * 43758.5453);
          return n;
        }

        void main() {
          vec4 sim = texture2D(uSim, vUv);
          float heat = sim.b;
          float scorch = sim.a;
          float flowX = (sim.r - 0.5) * 2.0;
          float flowY = (sim.g - 0.5) * 2.0;
          float flowMag = length(vec2(flowX, flowY));

          if (heat < 0.015 && scorch < 0.08) {
            discard;
          }

          float dither = blockDither(vUv, uRes);
          float flicker = fireNoise(vUv, uTime);

          vec3 fireColor = vec3(0.0);
          float fireAlpha = 0.0;

          // ---- Active Fire (following cursor) ----
          if (heat > 0.015) {
            float h = heat * (0.65 + 0.45 * dither);
            h *= (0.7 + 0.3 * flicker); // Fire flicker animation

            if (h < 0.25) {
              // Deep red ember coals
              float t = h / 0.25;
              fireColor = mix(vec3(0.6, 0.04, 0.0), vec3(0.95, 0.25, 0.02), t);
              fireAlpha = t * 0.75;
            } else if (h < 0.6) {
              // Blazing orange/gold
              float t = (h - 0.25) / 0.35;
              fireColor = mix(vec3(0.95, 0.25, 0.02), vec3(1.0, 0.75, 0.08), t);
              fireAlpha = 0.75 + t * 0.2;
            } else {
              // White-hot core
              float t = clamp((h - 0.6) / 0.4, 0.0, 1.0);
              fireColor = mix(vec3(1.0, 0.75, 0.08), vec3(1.0, 0.97, 0.88), t);
              fireAlpha = 0.95;
            }

            // Pixelated block cut-out pattern (like Codrops scattered pixels)
            float blockCut = step(0.15, dither + heat * 0.4);
            fireAlpha *= blockCut;
          }

          // ---- Dying ember sparks in scorch trails ----
          if (scorch > 0.08 && heat < 0.3) {
            float emberChance = step(0.72, dither) * smoothstep(0.08, 0.5, scorch);
            if (emberChance > 0.0) {
              float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + dither * 20.0);
              vec3 emberColor = mix(vec3(0.7, 0.1, 0.0), vec3(0.95, 0.35, 0.02), pulse * 0.5);
              float emberAlpha = emberChance * 0.6 * pulse;
              fireColor = mix(fireColor, emberColor, step(fireAlpha, emberAlpha));
              fireAlpha = max(fireAlpha, emberAlpha);
            }
          }

          // ---- Directional pixel scatter sparks (fly out from brush path) ----
          if (flowMag > 0.15 && heat > 0.05) {
            float scatterChance = step(0.8, dither) * smoothstep(0.15, 0.8, flowMag);
            if (scatterChance > 0.0) {
              vec3 sparkColor = vec3(1.0, 0.65, 0.1);
              float sparkAlpha = scatterChance * heat * 0.7;
              fireColor = mix(fireColor, sparkColor, step(fireAlpha, sparkAlpha));
              fireAlpha = max(fireAlpha, sparkAlpha);
            }
          }

          gl_FragColor = vec4(fireColor, fireAlpha);
        }
      `,
      uniforms: {
        uSim: { value: fireDataTex },
        uRes: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 }
      },
      transparent: true,
      depthWrite: false
    });

    fireScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fireMaterial));

    // ═══════════════════════════════════════════
    // MOUSE TRACKING + BRUSH STAMPING
    // ═══════════════════════════════════════════
    const mouse = {
      x: width / 2, y: height / 2,
      prevX: width / 2, prevY: height / 2,
      isMoving: false
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isMoving = true;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Deposit flow + heat + scorch into the simulation buffer
    const stampBrush = (fromX, fromY, toX, toY) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5) return;

      const speed = Math.min(dist, 50);
      const steps = Math.max(1, Math.min(Math.floor(dist / 2.5), 40));

      // Flow direction vector (normalized, scaled by speed)
      const ndx = dx / (dist || 1);
      const ndy = dy / (dist || 1);
      const vx = Math.max(-127, Math.min(127, ndx * Math.min(speed * 3.2, 100)));
      const vy = Math.max(-127, Math.min(127, ndy * Math.min(speed * 3.2, 100)));
      const flowR = Math.floor(128 + vx);
      const flowG = Math.floor(128 + vy);

      const radius = Math.floor(BRUSH_RADIUS + Math.min(speed * 0.18, 6));

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const curX = fromX + dx * t;
        const curY = fromY + dy * t;

        const gx = Math.floor((curX / width) * SIM_RES);
        const gy = Math.floor((1.0 - curY / height) * SIM_RES);

        for (let oy = -radius; oy <= radius; oy++) {
          const cy = gy + oy;
          if (cy < 0 || cy >= SIM_RES) continue;

          for (let ox = -radius; ox <= radius; ox++) {
            const cx = gx + ox;
            if (cx < 0 || cx >= SIM_RES) continue;

            const d = Math.hypot(ox, oy) / radius;
            if (d > 1.0) continue;

            // Smooth envelope: peaks at center, fades at edges
            const envelope = (1.0 - d * d) * (1.0 - d);

            // Dither pattern for jagged/blocky edges
            const px = cx % 4;
            const py = cy % 4;
            const dither = ((px ^ py) * 67 + cx * 13 + cy * 29) % 100 / 100;

            // Add heat (active fire)
            const heatAdd = Math.floor(
              envelope * (dither > 0.25 ? 1.0 : 0.3) * (140 + speed * 2.5)
            );
            // Add scorch (charred residue)
            const scorchAdd = Math.floor(
              envelope * (175 + speed * 1.8)
            );

            const idx = (cy * SIM_RES + cx) * 4;

            simBuffer[idx + 0] = flowR; // Flow X
            simBuffer[idx + 1] = flowG; // Flow Y
            simBuffer[idx + 2] = Math.min(255, simBuffer[idx + 2] + heatAdd); // Heat
            simBuffer[idx + 3] = Math.min(255, Math.max(simBuffer[idx + 3], scorchAdd)); // Scorch
          }
        }
      }
    };

    // ═══════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (mouse.isMoving) {
        stampBrush(mouse.prevX, mouse.prevY, mouse.x, mouse.y);
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.isMoving = false;
      }

      // Decay simulation
      let hasActivity = false;
      for (let i = 0; i < SIM_RES * SIM_RES; i++) {
        const idx = i * 4;
        const heat = simBuffer[idx + 2];
        const scorch = simBuffer[idx + 3];

        if (heat > 0 || scorch > 0) {
          hasActivity = true;

          // Heat decays fast (fire cools)
          if (heat > 0) {
            const nh = Math.floor(heat * HEAT_DECAY);
            simBuffer[idx + 2] = nh < 2 ? 0 : nh;
          }

          // Scorch decays slowly (char residue lingers)
          if (scorch > 0) {
            const ns = Math.floor(scorch * SCORCH_DECAY);
            simBuffer[idx + 3] = ns < 2 ? 0 : ns;
          }

          // Flow vectors decay to neutral
          simBuffer[idx + 0] = 128 + Math.floor((simBuffer[idx + 0] - 128) * FLOW_DECAY);
          simBuffer[idx + 1] = 128 + Math.floor((simBuffer[idx + 1] - 128) * FLOW_DECAY);
        }
      }

      if (hasActivity) {
        burnDataTex.needsUpdate = true;
        fireDataTex.needsUpdate = true;
      }

      const elapsed = clock.getElapsedTime();
      fireMaterial.uniforms.uTime.value = elapsed;

      burnRenderer.render(burnScene, burnCamera);
      fireRenderer.render(fireScene, fireCamera);
    };

    animate();

    // Handle resize
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      burnRenderer.setSize(width, height);
      fireRenderer.setSize(width, height);
      burnMaterial.uniforms.uRes.value.set(width, height);
      fireMaterial.uniforms.uRes.value.set(width, height);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      burnDataTex.dispose();
      fireDataTex.dispose();
      burnMaterial.dispose();
      fireMaterial.dispose();
      burnRenderer.dispose();
      fireRenderer.dispose();

      if (burnRenderer.domElement?.parentNode) {
        burnRenderer.domElement.parentNode.removeChild(burnRenderer.domElement);
      }
      if (fireRenderer.domElement?.parentNode) {
        fireRenderer.domElement.parentNode.removeChild(fireRenderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Layer 1: BURN (char/scorch marks) — multiply blend DARKENS content underneath */}
      <div
        ref={burnRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[35] overflow-hidden"
        style={{ mixBlendMode: 'multiply' }}
      />
      {/* Layer 2: FIRE (bright embers/sparks) — screen blend ADDS light on top */}
      <div
        ref={fireRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[36] overflow-hidden"
        style={{ mixBlendMode: 'screen' }}
      />
    </>
  );
}
