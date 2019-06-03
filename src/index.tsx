// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

export default {};

const EDGE_SEPARATOR = '|';
const LANE_CLICK_RADIUS = 20;
const IMAGE_URL = 'https://i.imgur.com/i6tHnB9.png';
const img = new Image();
img.addEventListener('load', () => {
  init();
}, { once: true });
img.src = IMAGE_URL;
const root = document.querySelector('#root')!;
const container = document.createElement('div');
container.style.position = 'relative';
root.appendChild(container);
let canvas: HTMLCanvasElement = null!;
let ctx: CanvasRenderingContext2D = null!;
const coordinates = [
  [
    156,
    61
  ],
  [
    192,
    59
  ],
  [
    221,
    62
  ],
  [
    251,
    66
  ],
  [
    345,
    99
  ],
  [
    346,
    122
  ],
  [
    341,
    143
  ],
  [
    339,
    165
  ],
  [
    249,
    209
  ],
  [
    220,
    206
  ],
  [
    188,
    205
  ],
  [
    150,
    203
  ],
  [
    54,
    164
  ],
  [
    57,
    143
  ],
  [
    56,
    122
  ],
  [
    55,
    97
  ]
]

const names = 'ABCDEFGHIJKLMNOP'.split('');

interface ILane {
  x: number,
  y: number;
  name: string;
}

interface ILaneMap {
  [id: string]: ILane;
}

const laneMap: ILaneMap = {};
const lanes = coordinates.map(([x, y], i) => {
	const lane = {
  	x,
    y,
    name: names[i],
  };
  laneMap[lane.name] = lane;
  return lane;
});

const edges: { [key: string]: boolean | undefined } = {
	// ['A' + EDGE_SEPARATOR + 'L']: true,
};

function renderCanvas(selectedLane: ILane | null) {
	if (!ctx) {
  	ctx = canvas.getContext('2d')!;
  }
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px arial';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'magenta';
  ctx.fillStyle = 'magenta';
  for (const edge of Object.keys(edges)) {
    if (!edges[edge]) {
      continue;
    }
  	const [start, end] = edge.split(EDGE_SEPARATOR);
    const a = laneMap[start];
    const b = laneMap[end];
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.fillRect(b.x - 5, b.y - 5, 10, 10);
  }
  for (const lane of lanes) {
    const selected = selectedLane && lane.name === selectedLane.name;
    ctx.fillStyle = selected ? 'red' : 'black';
  	ctx.fillText(lane.name, lane.x - 12, lane.y - 6);
  }
  ctx.restore();
}

let selectedLane: ILane | null = null;

let debug: HTMLElement = null!;

function updateDebug() {
  debug.innerHTML = [
    JSON.stringify(edges, null, 2),
    '---',
    'selected lane:',
    JSON.stringify(selectedLane, null, 2),
  ].join('\n')
}

function init() {
	container.appendChild(img);
  canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  canvas.width = img.width;
  canvas.height = img.height;
  container.appendChild(canvas);
  renderCanvas(selectedLane);
  debug = document.createElement('pre');
  container.appendChild(debug);
  updateDebug();
  canvas.addEventListener('click', (e) => {
    const bounds = canvas.getBoundingClientRect();
  	const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const sortedLanes = lanes
    	.map(lane => {
        const dx = x - lane.x;
        const dy = y - lane.y;
        return {
          lane,
          distance: Math.sqrt(dx ** 2 + dy ** 2),
        };
      })
      .sort((a, b) => a.distance - b.distance);
    const closest = sortedLanes[0];
    if (closest.distance > LANE_CLICK_RADIUS) {
      return;
    }
    const { lane } = closest;
    if (selectedLane) {
      // TODO: Link!
      if (selectedLane.name !== lane.name) {
        const edge = selectedLane.name + EDGE_SEPARATOR + lane.name;
        edges[edge] = !edges[edge];
      }
      selectedLane = null;
    } else {
      selectedLane = lane;
    }
    renderCanvas(selectedLane);
    updateDebug();
  });
}
