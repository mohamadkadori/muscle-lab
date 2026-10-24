// SVG geometry for the anatomy figures. ViewBox 0 0 400 810, body centered on x=200.
// Every path is drawn for the viewer's LEFT half and mirrored for the right half.

export type View = 'front' | 'back';

export const MIRROR = 'translate(400 0) scale(-1 1)';

export const BODY_BASE =
  'M200 118 L182 122 L180 142 Q160 150 142 158 Q116 170 108 192 Q100 240 92 290 Q80 330 62 372 L40 394 L24 438 L32 444 L45 414 L48 442 L57 444 L61 412 L66 440 L75 438 L75 404 L82 386 Q110 338 121 300 Q128 270 140 260 Q146 300 138 330 Q130 360 128 380 Q124 460 134 520 Q138 560 141 568 Q132 610 138 650 L140 722 L126 758 L108 780 L114 792 L146 786 L152 760 L158 722 Q164 650 170 600 L173 568 Q186 500 194 440 L200 424 Z';

export const HEAD = 'M200 28 C180 28 172 48 174 74 C176 98 184 118 200 120 C216 118 224 98 226 74 C228 48 220 28 200 28 Z';
export const HEAD_BACK = HEAD;

export interface MusclePart {
  slug: string;
  paths: string[];
}

const DELT =
  'M152 158 Q126 160 110 188 Q104 212 118 224 Q134 218 140 200 Q146 178 160 166 Z';
const ARM_UPPER =
  'M118 224 Q104 262 90 296 Q98 316 110 322 Q124 290 134 262 Q140 236 140 206 Q130 218 118 224 Z';
const FOREARM =
  'M90 298 Q82 336 62 372 L74 384 Q104 350 114 324 Q100 316 90 298 Z';

export const FRONT: MusclePart[] = [
  { slug: 'calves', paths: ['M170 584 Q164 640 160 700 L146 716 Q140 680 138 640 Q134 610 142 584 Q156 590 170 584 Z'] },
  {
    slug: 'quads',
    paths: [
      'M200 424 Q192 470 180 520 L176 556 Q160 562 144 556 Q132 500 130 440 Q128 404 134 384 Q166 392 186 412 Z',
    ],
  },
  { slug: 'forearms', paths: [FOREARM] },
  { slug: 'biceps', paths: [ARM_UPPER] },
  {
    slug: 'obliques',
    paths: ['M160 262 Q154 300 164 340 Q148 372 130 380 Q132 356 142 330 Q138 290 142 252 Q150 262 160 262 Z'],
  },
  { slug: 'abs', paths: ['M200 250 L200 400 Q176 380 164 340 Q156 300 160 262 Q180 256 200 250 Z'] },
  {
    slug: 'chest',
    paths: ['M200 170 L200 250 Q176 258 158 246 Q142 226 140 200 Q146 178 160 166 Q184 172 200 170 Z'],
  },
  { slug: 'traps', paths: ['M182 124 L180 144 Q166 152 150 158 L178 166 Z'] },
  { slug: 'shoulders', paths: [DELT] },
];

export const BACK: MusclePart[] = [
  { slug: 'calves', paths: ['M172 584 Q170 640 160 690 L148 706 Q142 660 138 626 Q134 600 142 580 Q158 570 172 584 Z'] },
  {
    slug: 'hamstrings',
    paths: ['M200 432 Q176 444 150 432 Q132 470 138 520 Q144 556 150 562 Q172 566 182 558 Q196 500 200 432 Z'],
  },
  { slug: 'glutes', paths: ['M200 366 Q172 356 150 374 Q136 400 148 428 Q176 442 200 428 Z'] },
  { slug: 'forearms', paths: [FOREARM] },
  { slug: 'triceps', paths: [ARM_UPPER] },
  { slug: 'lats', paths: ['M140 210 Q134 250 144 300 Q168 336 200 346 L200 262 Q170 240 150 206 Z'] },
  { slug: 'lower-back', paths: ['M200 300 Q180 300 168 316 Q166 340 176 356 L200 364 Z'] },
  { slug: 'traps', paths: ['M200 128 L182 144 Q164 154 150 160 Q174 196 190 240 L200 268 Z'] },
  { slug: 'shoulders', paths: [DELT] },
];

// Decorative striations (non interactive)
export const FRONT_LINES: string[] = [
  'M200 170 L200 250',
  'M200 272 Q180 272 160 268',
  'M200 296 Q180 298 158 294',
  'M200 320 Q182 322 162 318',
  'M200 400 L200 424',
  'M178 408 Q158 470 156 520',
  'M150 394 Q150 460 156 530',
  'M154 584 Q158 640 154 700',
  'M146 160 Q154 190 160 220',
];
export const BACK_LINES: string[] = [
  'M200 128 L200 366',
  'M200 434 L200 560',
  'M200 600 L200 690',
  'M160 600 Q158 650 154 690',
  'M160 440 Q156 500 162 556',
  'M150 214 Q168 240 186 262',
];
