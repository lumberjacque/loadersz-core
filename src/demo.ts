import './loadersz';

import type { OrbState } from './core/types';

interface ModeInfo {
  state: OrbState;
  title: string;
  description: string;
}

const modes: ModeInfo[] = [
  { state: 'working', title: 'working', description: 'Particles work through orbital paths.' },
  { state: 'searching', title: 'searching', description: 'A scanning meridian sweeps the surface.' },
  { state: 'connecting', title: 'connecting', description: 'A living network finds its own connections.' },
  { state: 'weaving', title: 'weaving', description: 'Three strands trade places in a braid.' },
  { state: 'shaping', title: 'shaping', description: 'A dotted outline morphs between forms.' },
  { state: 'listening', title: 'listening', description: 'A waveform ripples through a dotted sphere.' },
  { state: 'breathing', title: 'breathing', description: 'Calm expanding rings soften the surface.' },
  { state: 'composing', title: 'composing', description: 'An undulating ribbon continuously rewrites itself.' },
  { state: 'solving', title: 'solving', description: 'A Rubik-like slice turns, holds, then releases.' },
  { state: 'observing', title: 'observing', description: 'A watchful halo circles a quiet core.' },
  { state: 'dreaming', title: 'dreaming', description: 'Particles flow through a dimensional tunnel.' },
  { state: 'charging', title: 'charging', description: 'A swarm gathers, surges and scatters.' },
  { state: 'flowing', title: 'flowing', description: 'A knot carries a bright signal through its loop.' },
  { state: 'awakening', title: 'awakening', description: 'A warm nova expands and reforms.' },
  { state: 'coding', title: 'coding', description: 'A responsive circuit grid fires up.' },
  { state: 'transcending', title: 'transcending', description: 'A dimensional portal cycles through space.' },
  { state: 'singing', title: 'singing', description: 'Aurora curtains dance across the sphere.' },
  { state: 'growing', title: 'growing', description: 'A double helix quietly builds itself.' },
  { state: 'blooming', title: 'blooming', description: 'A colour-shifting geometric flower opens.' },
  { state: 'wandering', title: 'wandering', description: 'Individual fireflies discover their own rhythm.' },
  { state: 'decoding', title: 'decoding', description: 'Data rain streams across a spherical field.' },
  { state: 'calibrating', title: 'calibrating', description: 'Three gyroscopic rings find their shared axis.' },
  { state: 'attracting', title: 'attracting', description: 'Field lines bend between two opposite poles.' },
  { state: 'shattering', title: 'shattering', description: 'Facets drift apart and pull themselves together.' },
  { state: 'crystallizing', title: 'crystallizing', description: 'A faceted particle structure forms and refracts.' },
  { state: 'constellating', title: 'constellating', description: 'Stars blink and trace a changing constellation.' },
  { state: 'folding', title: 'folding', description: 'A folded paper surface travels through its creases.' },
  { state: 'echoing', title: 'echoing', description: 'Pulses leave a soft, expanding echo.' },
  { state: 'balancing', title: 'balancing', description: 'A kinetic mobile keeps searching for balance.' },
  { state: 'weathering', title: 'weathering', description: 'Five wind arms curl into a weather vortex.' },
  { state: 'mapping', title: 'mapping', description: 'A living globe follows a single bright route.' },
  { state: 'forging', title: 'forging', description: 'Hot rings and sparks form a small furnace.' },
  { state: 'orbiting', title: 'orbiting', description: 'Fast satellites leave fine trails around a core.' },
  { state: 'racing', title: 'racing', description: 'Comets chase one another around a moving sphere.' },
  { state: 'bubbling', title: 'bubbling', description: 'Bright bubbles rise, stretch and pop through space.' },
  { state: 'spinning', title: 'spinning', description: 'A playful pinwheel keeps its particle blades turning.' },
  { state: 'electrifying', title: 'electrifying', description: 'Restless plasma threads carry quick electric pulses.' },
  { state: 'flocking', title: 'flocking', description: 'A small flock folds, turns and reforms in mid-air.' },
  { state: 'throbbing', title: 'throbbing', description: 'Dense beads beat outward in overlapping waves.' },
  { state: 'cascading', title: 'cascading', description: 'Drops fall in bright paths around an invisible globe.' },
  { state: 'spiraling', title: 'spiraling', description: 'A compact galaxy winds its glowing arms inward.' },
  { state: 'juggling', title: 'juggling', description: 'Five kinetic balls trade places in looping arcs.' },
];

function query<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing demo element: ${selector}`);
  return element;
}

const orb = query<HTMLElement>('#hero-orb');
const gallery = query<HTMLElement>('#gallery');
const modeSelect = query<HTMLSelectElement>('#mode');
const speed = query<HTMLInputElement>('#speed');
const density = query<HTMLInputElement>('#density');
const hue = query<HTMLInputElement>('#hue');
const colorEnabled = query<HTMLInputElement>('#color-enabled');
const theme = query<HTMLSelectElement>('#theme');
const pause = query<HTMLInputElement>('#pause');
const name = query<HTMLElement>('#selected-name');
const description = query<HTMLElement>('#selected-description');
const speedOutput = query<HTMLOutputElement>('#speed-output');
const densityOutput = query<HTMLOutputElement>('#density-output');

modeSelect.replaceChildren(...modes.map((mode) => new Option(mode.title, mode.state)));

const pendingAttributes = new Map<string, string | null>();
let updateFrame = 0;

function scheduleAttribute(name: string, value: string | null): void {
  pendingAttributes.set(name, value);
  if (updateFrame !== 0) return;
  updateFrame = requestAnimationFrame(() => {
    for (const [attribute, nextValue] of pendingAttributes) {
      if (nextValue === null) orb.removeAttribute(attribute);
      else orb.setAttribute(attribute, nextValue);
    }
    pendingAttributes.clear();
    updateFrame = 0;
  });
}

function updateOutputs(): void {
  document.documentElement.style.setProperty('--hue', hue.value);
  speedOutput.value = `${Number(speed.value).toFixed(2)}×`;
  densityOutput.value = `${Number(density.value).toFixed(2)}×`;
}

function syncAllControls(): void {
  scheduleAttribute('speed', speed.value);
  scheduleAttribute('density', density.value);
  scheduleAttribute('theme', theme.value);
  scheduleAttribute('paused', pause.checked ? '' : null);
  scheduleAttribute('hue', colorEnabled.checked ? hue.value : null);
  updateOutputs();
}

function selectMode(state: OrbState): void {
  const mode = modes.find((item) => item.state === state) ?? modes[0];
  scheduleAttribute('state', mode.state);
  modeSelect.value = mode.state;
  name.textContent = mode.title;
  description.textContent = mode.description;
  gallery.querySelectorAll<HTMLButtonElement>('.orb-card').forEach((card) => {
    card.setAttribute('aria-pressed', String(card.dataset.state === mode.state));
  });
}

for (const mode of modes) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'orb-card';
  card.dataset.state = mode.state;
  card.setAttribute('aria-pressed', String(mode.state === 'working'));
  card.setAttribute('aria-label', `Select ${mode.title}`);
  const preview = document.createElement('loadersz-loader');
  preview.setAttribute('state', mode.state);
  preview.setAttribute('size', '64');
  preview.setAttribute('density', '0.65');
  preview.setAttribute('theme', 'dark');
  preview.setAttribute('force-motion', '');
  preview.setAttribute('aria-label', `${mode.title} preview`);
  const label = document.createElement('span');
  label.textContent = mode.title;
  card.append(preview, label);
  card.addEventListener('click', () => selectMode(mode.state));
  gallery.append(card);
}

modeSelect.addEventListener('change', () => selectMode(modeSelect.value as OrbState));
speed.addEventListener('input', () => {
  scheduleAttribute('speed', speed.value);
  updateOutputs();
});
density.addEventListener('input', () => {
  scheduleAttribute('density', density.value);
  updateOutputs();
});
hue.addEventListener('input', () => {
  if (colorEnabled.checked) scheduleAttribute('hue', hue.value);
  updateOutputs();
});
colorEnabled.addEventListener('change', () => scheduleAttribute('hue', colorEnabled.checked ? hue.value : null));
theme.addEventListener('change', () => scheduleAttribute('theme', theme.value));
pause.addEventListener('change', () => scheduleAttribute('paused', pause.checked ? '' : null));
query<HTMLButtonElement>('#random').addEventListener('click', () => {
  selectMode(modes[Math.floor(Math.random() * modes.length)].state);
  hue.value = String(Math.floor(Math.random() * 361));
  colorEnabled.checked = Math.random() > 0.3;
  syncAllControls();
});

syncAllControls();
