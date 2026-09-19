(function () {
  const animalMap = {
    cat: { fill: '#f4d9ba', accent: '#d67a4d', scale: 1, yaw: 0 },
    bear: { fill: '#a77052', accent: '#5a3826', scale: 1.12, yaw: 0 },
    bunny: { fill: '#f4efe7', accent: '#d38c9f', scale: 0.96, yaw: 0 },
    deer: { fill: '#c98b52', accent: '#7a4320', scale: 1.02, yaw: 0 },
    dino: { fill: '#7fcf86', accent: '#286e3c', scale: 1, yaw: 0 },
    fox: { fill: '#f4b26a', accent: '#b9582b', scale: 1.03, yaw: 0 },
    frog: { fill: '#7dd77d', accent: '#2d9d5b', scale: 0.98, yaw: 0 },
    hamster: { fill: '#d9b08a', accent: '#9a5e36', scale: 0.98, yaw: 0 },
    hedgehog: { fill: '#d2b18c', accent: '#7a5636', scale: 1, yaw: 0 },
    koala: { fill: '#bdbdc5', accent: '#6f7384', scale: 1.02, yaw: 0 },
    mouse: { fill: '#d7d8db', accent: '#8b8d94', scale: 0.97, yaw: 0 },
    otter: { fill: '#b98b68', accent: '#5d3c2d', scale: 1.04, yaw: 0 },
    owl: { fill: '#d9b68a', accent: '#754d2c', scale: 1, yaw: 0 },
    panda: { fill: '#f1f1f1', accent: '#3d3d3d', scale: 1.04, yaw: 0 },
    penguin: { fill: '#f2f2f2', accent: '#4a4a4a', scale: 1, yaw: 0 },
    pug: { fill: '#d7a98d', accent: '#6d4334', scale: 1.04, yaw: 0 },
    raccoon: { fill: '#c98d64', accent: '#5b3425', scale: 1.05, yaw: 0 },
    redpanda: { fill: '#d5a190', accent: '#8a4d40', scale: 1.02, yaw: 0 },
    sheep: { fill: '#f4f1f0', accent: '#8b8b8c', scale: 1.03, yaw: 0 },
    sloth: { fill: '#a98a74', accent: '#5d4639', scale: 1.05, yaw: 0 },
    tiger: { fill: '#edbf64', accent: '#a85d2d', scale: 1.08, yaw: 0 },
    wolf: { fill: '#bfc6d3', accent: '#58677d', scale: 1.08, yaw: 0 },
    rabbit: { fill: '#f0efe8', accent: '#b58a73', scale: 0.96, yaw: 0 },
    lion: { fill: '#f0bf74', accent: '#9a5c29', scale: 1.08, yaw: 0 },
    elephant: { fill: '#c3c5c5', accent: '#5e5f61', scale: 1.12, yaw: 0 },
    giraffe: { fill: '#f0d484', accent: '#8d5f2a', scale: 1.08, yaw: 0 },
    neutral: { fill: '#e8d7b8', accent: '#7a5d38', scale: 1, yaw: 0 },
  };

  const store = {
    currentAnimal: 'neutral',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    tx: window.innerWidth / 2,
    ty: window.innerHeight / 2,
    hovered: false,
    pressed: false,
  };

  const clickSound = new Audio('models/click.mp3');
  clickSound.preload = 'auto';

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --cursor-main: #e8d7b8;
      --cursor-accent: #7a5d38;
      --cursor-shadow: rgba(0, 0, 0, 0.22);
      --cursor-scale: 1;
    }

    html, body {
      cursor: none !important;
    }

    * {
      cursor: none !important;
    }

    #animalCursor {
      position: fixed;
      left: 0;
      top: 0;
      width: 28px;
      height: 28px;
      pointer-events: none;
      z-index: 2147483647;
      transform: translate(-50%, -50%) scale(var(--cursor-scale));
      opacity: 0;
      transition: opacity 120ms ease;
      will-change: transform, left, top;
      filter: drop-shadow(0 6px 8px var(--cursor-shadow));
    }

    #animalCursor.visible {
      opacity: 1;
    }

    #animalCursor svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    #animalCursor .pad {
      fill: var(--cursor-main);
      stroke: rgba(62, 40, 20, 0.18);
      stroke-width: 1.3;
    }

    #animalCursor .toe {
      fill: var(--cursor-main);
      stroke: rgba(62, 40, 20, 0.18);
      stroke-width: 1.3;
    }

    #animalCursor .accent {
      fill: var(--cursor-accent);
      opacity: 0.95;
    }

    #animalCursor.is-hovering {
      transform: translate(-50%, -50%) scale(calc(var(--cursor-scale) * 1.2));
    }

    #animalCursor.is-pressed {
      transform: translate(-50%, -50%) scale(calc(var(--cursor-scale) * 0.82));
    }

    @media (pointer: coarse) {
      html, body, * {
        cursor: auto !important;
      }

      #animalCursor {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const cursor = document.createElement('div');
  cursor.id = 'animalCursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse class="pad" cx="32" cy="40" rx="17" ry="13" />
      <circle class="toe" cx="18" cy="15" r="8" />
      <circle class="toe" cx="28" cy="10" r="7" />
      <circle class="toe" cx="38" cy="10" r="7" />
      <circle class="toe" cx="48" cy="15" r="8" />
      <path class="accent" d="M24 32C24 27.6 27.6 24 32 24C36.4 24 40 27.6 40 32V38C40 43.5 35.5 48 30 48H28C22.5 48 18 43.5 18 38V32H24Z" opacity="0.22"/>
      <path class="accent" d="M23 40C25.5 43 29 45 32 45C35 45 38.5 43 41 40" fill="none" stroke="rgba(62,40,20,0.18)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  document.body.appendChild(cursor);

  function getAnimalFromPage() {
    const params = new URLSearchParams(window.location.search);
    const animalParam = params.get('animal');
    if (animalParam) return animalParam.toLowerCase();

    const pageName = window.location.pathname.split('/').pop().replace(/\.[^/.]+$/, '').toLowerCase();
    if (pageName && pageName !== 'index') return pageName;

    const title = document.title.toLowerCase();
    const matches = Object.keys(animalMap).filter((key) => title.includes(key));
    if (matches.length) return matches[0];

    return 'neutral';
  }

  function applyCursorAnimal(key) {
    const value = animalMap[key] || animalMap.neutral;
    store.currentAnimal = key in animalMap ? key : 'neutral';
    const root = document.documentElement;
    root.style.setProperty('--cursor-main', value.fill);
    root.style.setProperty('--cursor-accent', value.accent);
    root.style.setProperty('--cursor-scale', String(value.scale));
    root.style.setProperty('--cursor-shadow', 'rgba(0, 0, 0, 0.22)');
    cursor.classList.remove('is-bear', 'is-cat', 'is-sheep', 'is-neutral');
    cursor.dataset.animal = store.currentAnimal;
  }

  function onPointerMove(event) {
    store.tx = event.clientX;
    store.ty = event.clientY;
  }

  function tick() {
    store.x += (store.tx - store.x) * 0.22;
    store.y += (store.ty - store.y) * 0.22;
    cursor.style.left = store.x + 'px';
    cursor.style.top = store.y + 'px';
    requestAnimationFrame(tick);
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', () => {
    cursor.classList.add('is-pressed');
    clearTimeout(cursor._pressTimer);
    cursor._pressTimer = setTimeout(() => cursor.classList.remove('is-pressed'), 130);

    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    } catch (error) {
      // no-op if sound is unavailable
    }
  });

  const interactiveSelector = [
    'a', 'button', 'input', 'select', 'textarea', 'label',
    '[role="button"]', 'img', 'svg', '.dock-item', '.rbtn',
    '.page-nav', '.reaction-toggle', '.animal-grid-item', '.animals-grid-toggle'
  ].join(', ');

  document.addEventListener('pointerover', (event) => {
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.add('is-hovering');
      store.hovered = true;
    }
  });

  document.addEventListener('pointerout', (event) => {
    if (!event.target.closest(interactiveSelector)) return;
    cursor.classList.remove('is-hovering');
    store.hovered = false;
  });

  applyCursorAnimal(getAnimalFromPage());
  cursor.classList.add('visible');
  requestAnimationFrame(tick);

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('visible');
  });
})();
