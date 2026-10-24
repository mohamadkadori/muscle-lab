// EDIT HERE: muscle groups and their training regions (sub-muscles).
// Exercises reference a muscle `slug` and a region `id` from this list.

export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface Muscle {
  slug: string;
  name: string;
  views: ('front' | 'back')[];
  summary: string;
  job: string;
  beginnerTip: string;
  regions: Region[];
}

export const MUSCLES: Muscle[] = [
  {
    slug: 'chest',
    name: 'Chest',
    views: ['front'],
    summary: 'The pectoral muscles: a broad fan across the front of the ribcage.',
    job: 'Pushes your arms forward and across your body, like closing a door or doing a push-up.',
    beginnerTip: 'Most pressing moves hit all of the chest. Angle changes just shift the emphasis.',
    regions: [
      { id: 'upper', name: 'Upper chest', description: 'The fibers just under your collarbone. Trained by pressing on an upward incline.' },
      { id: 'mid', name: 'Mid chest', description: 'The thick center of the pec. Flat pressing and flys work it most.' },
      { id: 'lower', name: 'Lower chest', description: 'The bottom edge of the pec. Declined pressing and dips pull it in.' },
    ],
  },
  {
    slug: 'shoulders',
    name: 'Shoulders',
    views: ['front', 'back'],
    summary: 'The deltoids: a cap of muscle with three heads wrapping the shoulder joint.',
    job: 'Lifts your arm forward, out to the side and back. Every overhead movement runs through here.',
    beginnerTip: 'Rear delts are the ones people forget. Add one rear-focused move to balance pressing.',
    regions: [
      { id: 'front', name: 'Front delt', description: 'Raises the arm forward. Already busy in every chest press.' },
      { id: 'side', name: 'Side delt', description: 'Raises the arm out wide. Builds shoulder width.' },
      { id: 'rear', name: 'Rear delt', description: 'Pulls the arm back. Helps posture and shoulder health.' },
    ],
  },
  {
    slug: 'biceps',
    name: 'Biceps',
    views: ['front'],
    summary: 'The two-headed muscle on the front of your upper arm.',
    job: 'Bends your elbow and turns your palm up. It is the muscle behind every curl and pull.',
    beginnerTip: 'Your biceps already work in every row and pulldown. Two curl sets is plenty to start.',
    regions: [
      { id: 'long', name: 'Long head', description: 'The outer head. Loaded most when your elbows stay behind your body.' },
      { id: 'short', name: 'Short head', description: 'The inner head. Loaded when elbows travel in front of the body.' },
    ],
  },
  {
    slug: 'forearms',
    name: 'Forearms',
    views: ['front', 'back'],
    summary: 'A bundle of small muscles between the elbow and wrist that run your grip.',
    job: 'Closes your hand, bends your wrist and holds the bar when things get heavy.',
    beginnerTip: 'Heavy rows and carries already train your grip. Add direct work later.',
    regions: [
      { id: 'flexors', name: 'Flexors', description: 'Underside of the forearm. They curl the wrist and close the grip.' },
      { id: 'extensors', name: 'Extensors', description: 'Top of the forearm. They lift the wrist and balance the flexors.' },
    ],
  },
  {
    slug: 'abs',
    name: 'Abs',
    views: ['front'],
    summary: 'The rectus abdominis: the vertical strap of muscle down the front of your midsection.',
    job: 'Curls your ribs toward your hips and braces your trunk so your spine stays safe under load.',
    beginnerTip: 'Slow and controlled beats fast and many. Exhale as you crunch.',
    regions: [
      { id: 'upper', name: 'Upper abs', description: 'The top of the strap. Reached by curling the ribcage down.' },
      { id: 'lower', name: 'Lower abs', description: 'The area below the navel. Trained by tilting the pelvis up.' },
    ],
  },
  {
    slug: 'obliques',
    name: 'Obliques',
    views: ['front'],
    summary: 'Muscles on the sides of your waist running diagonally across the ribs.',
    job: 'Rotates and bends your torso sideways, and resists being twisted.',
    beginnerTip: 'Anti-rotation moves like the Pallof press teach the obliques their real job.',
    regions: [
      { id: 'rotation', name: 'Rotation', description: 'Twisting your ribcage toward one hip.' },
      { id: 'side-bend', name: 'Side bend and brace', description: 'Leaning sideways, or holding still against a sideways pull.' },
    ],
  },
  {
    slug: 'quads',
    name: 'Quads',
    views: ['front'],
    summary: 'Four muscles on the front of the thigh, the largest group in the legs.',
    job: 'Straightens the knee. You use them to stand up, climb stairs and squat.',
    beginnerTip: 'Learn a bodyweight squat first. Depth you control is better than weight you cannot.',
    regions: [
      { id: 'outer', name: 'Outer quad', description: 'Vastus lateralis, the outer sweep of the thigh.' },
      { id: 'inner', name: 'Inner quad', description: 'Vastus medialis, the teardrop above the knee.' },
      { id: 'center', name: 'Center quad', description: 'Rectus femoris, which also helps lift the knee.' },
    ],
  },
  {
    slug: 'calves',
    name: 'Calves',
    views: ['front', 'back'],
    summary: 'The muscles of the lower leg that lift your heel.',
    job: 'Points your toes down: walking, running, jumping and standing on tiptoe.',
    beginnerTip: 'Use a full range: stretch the heel low, then rise all the way up and pause.',
    regions: [
      { id: 'gastroc', name: 'Gastrocnemius', description: 'The visible bulge. Trained best with straight legs.' },
      { id: 'soleus', name: 'Soleus', description: 'The flatter muscle beneath. Trained best with bent knees.' },
    ],
  },
  {
    slug: 'traps',
    name: 'Traps',
    views: ['front', 'back'],
    summary: 'A diamond of muscle from your neck across the shoulders and down the mid back.',
    job: 'Shrugs and steadies the shoulder blades, which keeps your shoulders from rounding forward.',
    beginnerTip: 'Rows and carries train the traps well. Shrugs are an optional extra.',
    regions: [
      { id: 'upper', name: 'Upper traps', description: 'The slope toward the neck. They lift your shoulders.' },
      { id: 'mid', name: 'Mid traps', description: 'Between the shoulder blades. They pull the blades together.' },
      { id: 'lower', name: 'Lower traps', description: 'Pull the blades down and support overhead reach.' },
    ],
  },
  {
    slug: 'triceps',
    name: 'Triceps',
    views: ['back'],
    summary: 'The three-headed muscle on the back of the upper arm, about two thirds of arm size.',
    job: 'Straightens your elbow. It finishes every press and push-up.',
    beginnerTip: 'Presses already train triceps. Add pushdowns or extensions for direct volume.',
    regions: [
      { id: 'long', name: 'Long head', description: 'Biggest head. Loaded when your arms are overhead.' },
      { id: 'lateral', name: 'Lateral head', description: 'The outer horseshoe. Pushdowns hit it well.' },
      { id: 'medial', name: 'Medial head', description: 'Deep head that works in almost every extension.' },
    ],
  },
  {
    slug: 'lats',
    name: 'Lats',
    views: ['back'],
    summary: 'Latissimus dorsi: the large wings along the sides of your back.',
    job: 'Pulls your arms down and back, the motion of a pull-up or a row.',
    beginnerTip: 'Think elbows, not hands. Drive your elbows toward your hips.',
    regions: [
      { id: 'width', name: 'Upper lats (width)', description: 'Vertical pulls from overhead build the V-taper.' },
      { id: 'thickness', name: 'Mid lats (thickness)', description: 'Horizontal rows add density through the middle back.' },
    ],
  },
  {
    slug: 'lower-back',
    name: 'Lower back',
    views: ['back'],
    summary: 'The erector spinae: two columns of muscle that run alongside the spine.',
    job: 'Keeps your spine upright and extends your torso when you stand up from a bend.',
    beginnerTip: 'Treat it as a bracing muscle. Move from the hips and keep your back flat.',
    regions: [
      { id: 'erectors', name: 'Erector spinae', description: 'The long columns beside the spine that hold you upright.' },
      { id: 'hinge', name: 'Hip hinge support', description: 'The low back working with glutes and hamstrings in a hinge.' },
    ],
  },
  {
    slug: 'glutes',
    name: 'Glutes',
    views: ['back'],
    summary: 'The muscles of your hips and backside, the strongest in the body.',
    job: 'Extends your hip: standing from a chair, climbing, sprinting and lifting from the floor.',
    beginnerTip: 'Squeeze at the top of every rep and do not lean back to fake the lockout.',
    regions: [
      { id: 'max', name: 'Gluteus maximus', description: 'The big shaping muscle. Hip thrusts and hinges.' },
      { id: 'med', name: 'Gluteus medius', description: 'The upper outer hip. It steadies you on one leg.' },
    ],
  },
  {
    slug: 'hamstrings',
    name: 'Hamstrings',
    views: ['back'],
    summary: 'Three muscles down the back of the thigh.',
    job: 'Bends your knee and extends your hip. They protect the knee and drive running.',
    beginnerTip: 'Hinging patterns like the Romanian deadlift teach them in a safe way.',
    regions: [
      { id: 'inner', name: 'Inner hamstring', description: 'Semitendinosus and semimembranosus, along the inside.' },
      { id: 'outer', name: 'Outer hamstring', description: 'Biceps femoris, along the outer edge. Leg curls reach it.' },
    ],
  },
];

export const getMuscle = (slug: string) => MUSCLES.find((m) => m.slug === slug);
