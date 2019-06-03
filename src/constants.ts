export const EDGE_SEPARATOR = '|';
export const LANE_CLICK_RADIUS = 20;
export const IMAGE_URL = 'https://i.imgur.com/i6tHnB9.png';
export const WIDTH = 385;
export const HEIGHT = 248;

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

export interface ILane {
  x: number,
  y: number;
  name: string;
}

export interface ILaneMap {
  [id: string]: ILane;
}

export const LANE_MAP: ILaneMap = {};
coordinates.forEach(([x, y], i) => {
	const lane = {
  	x,
    y,
    name: names[i],
  };
  LANE_MAP[lane.name] = lane;
});

export interface IEdges {
  [key: string]: boolean | undefined;
}
