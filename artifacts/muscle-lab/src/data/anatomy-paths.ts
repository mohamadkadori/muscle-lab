// Geometry in the native 468x1024 space of the supplied diagrams.
// Paths cover the viewer's LEFT half (x < 234) and are mirrored for the right.
export type View = 'front' | 'back';
export const W = 468;
export const H = 1024;
export const MIRROR = 'translate(468 0) scale(-1 1)';

export interface MusclePart {
  slug: string;
  paths: string[];
}

const DELT = 'M165 200 Q125 205 102 235 Q96 270 105 285 Q125 290 147 280 L150 240 Z';
const ARM = 'M147 280 Q125 290 105 285 L98 320 Q95 345 110 362 L138 352 Q150 320 147 280 Z';
const FOREARM = 'M110 362 L98 380 Q80 430 62 480 L85 490 Q115 440 135 400 Q142 375 138 352 Z';

export const FRONT: MusclePart[] = [
  { slug: 'calves', paths: [
    'M162 720 Q148 742 151 775 Q155 823 174 881 L179 893 Q189 871 183 823 Q182 766 169 735 Z',
    'M207 722 Q214 749 210 786 Q204 836 194 878 Q187 849 191 811 Q190 765 207 722 Z',
  ] },
  { slug: 'quads', paths: ['M232 520 L232 600 Q228 650 215 680 Q180 690 170 650 Q150 600 145 520 Q148 450 172 440 Q205 480 232 520 Z'] },
  { slug: 'forearms', paths: [FOREARM] },
  { slug: 'biceps', paths: [ARM] },
  { slug: 'obliques', paths: ['M188 300 Q170 320 165 350 Q165 400 175 440 Q190 470 200 490 L195 420 Q190 360 190 300 Z'] },
  { slug: 'abs', paths: [
    'M193 304 Q214 296 229 296 Q236 302 232 322 Q214 330 193 337 Z',
    'M194 344 Q214 337 230 336 Q236 342 232 369 Q215 379 196 375 Z',
    'M198 384 Q217 379 230 381 Q236 385 232 410 Q215 414 199 412 Q194 400 198 384 Z',
    'M198 419 Q217 416 233 418 L234 506 Q218 503 210 475 Z',
  ] },
  { slug: 'chest', paths: ['M232 198 L232 290 Q200 298 160 282 Q145 270 140 250 Q145 215 165 203 Q200 195 232 198 Z'] },
  { slug: 'traps', paths: ['M215 165 L205 175 Q185 190 160 200 L200 198 L232 190 L232 170 Z'] },
  { slug: 'shoulders', paths: [DELT] },
];

export const BACK: MusclePart[] = [
  { slug: 'calves', paths: [
    'M161 708 Q147 733 148 773 Q149 807 163 823 Q181 826 183 790 Q186 746 174 708 Z',
    'M190 714 Q182 748 184 782 Q185 819 197 829 Q212 823 213 787 Q215 750 202 726 Z',
    'M151 810 Q158 851 166 884 L174 937 Q174 878 160 835 Z',
    'M204 838 Q194 881 198 944 L204 884 L209 831 Z',
  ] },
  { slug: 'hamstrings', paths: ['M232 545 Q200 540 168 550 Q160 620 180 690 Q215 700 232 620 Z'] },
  { slug: 'glutes', paths: [
    'M208 446 Q178 451 164 479 Q155 506 165 527 Q177 546 208 541 Q233 540 235 518 L235 485 Z',
    'M187 432 Q169 428 160 444 Q154 460 155 478 Q172 449 199 445 Z',
  ] },
  { slug: 'forearms', paths: [FOREARM] },
  { slug: 'triceps', paths: [ARM] },
  { slug: 'lats', paths: ['M232 330 L215 400 Q195 420 185 410 Q150 340 145 285 Q190 290 232 330 Z'] },
  { slug: 'lower-back', paths: ['M232 340 L215 395 Q200 420 215 440 L232 445 Z'] },
  { slug: 'traps', paths: ['M232 130 L215 130 Q205 150 210 175 Q180 195 150 200 Q190 225 232 330 Z'] },
  { slug: 'shoulders', paths: [DELT] },
];

type Rect = [number, number, number, number]; // x y w h
// Regions are rectangles clipped to the muscle shape, per view.
export const REGION_RECTS: Record<string, Record<string, Rect>> = {
  chest: { upper: [100, 190, 140, 45], mid: [100, 235, 140, 27], lower: [100, 262, 140, 40] },
  shoulders: { front: [125, 190, 40, 110], side: [90, 190, 35, 110], rear: [90, 190, 20, 110] },
  biceps: { long: [90, 270, 60, 40], short: [90, 310, 60, 60] },
  forearms: { flexors: [60, 350, 45, 150], extensors: [105, 350, 45, 150] },
  abs: { upper: [180, 280, 60, 100], lower: [180, 380, 60, 140] },
  obliques: { rotation: [150, 290, 60, 80], 'side-bend': [150, 370, 60, 130] },
  quads: { outer: [130, 430, 38, 270], inner: [190, 430, 50, 270], center: [168, 430, 22, 270] },
  calves: { gastroc: [140, 690, 100, 80], soleus: [140, 770, 100, 140] },
  traps: { upper: [140, 120, 100, 70], mid: [140, 190, 100, 70], lower: [140, 260, 100, 80] },
  triceps: { long: [90, 270, 60, 40], lateral: [90, 310, 35, 60], medial: [125, 310, 30, 60] },
  lats: { width: [140, 270, 100, 70], thickness: [140, 340, 100, 90] },
  'lower-back': { erectors: [190, 330, 50, 50], hinge: [190, 380, 50, 70] },
  glutes: { max: [150, 480, 90, 70], med: [150, 440, 90, 40] },
  hamstrings: { inner: [200, 540, 40, 170], outer: [150, 540, 50, 170] },
};
