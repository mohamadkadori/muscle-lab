// EDIT HERE: demo exercises. These are SAMPLE entries and will be replaced with real
// content later. `muscle` = muscle slug, `regions` = region ids from data/muscles.ts.

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Equipment =
  | 'Bodyweight'
  | 'Dumbbell'
  | 'Barbell'
  | 'Cable'
  | 'Machine'
  | 'Bench'
  | 'Band'
  | 'Pull-up bar';

export interface Exercise {
  slug: string;
  name: string;
  muscle: string;
  regions: string[];
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  tips: string[];
  secondary: string[];
}

const ex = (
  slug: string,
  name: string,
  muscle: string,
  regions: string[],
  equipment: Equipment,
  difficulty: Difficulty,
  description: string,
  instructions: string[],
  secondary: string[] = [],
  tips: string[] = ['Start lighter than you think you need to.', 'Control the lowering phase for two seconds.'],
): Exercise => ({ slug, name, muscle, regions, equipment, difficulty, description, instructions, tips, secondary });

export const EXERCISES: Exercise[] = [
  ex('incline-dumbbell-press', 'Incline Dumbbell Press', 'chest', ['upper'], 'Dumbbell', 'Beginner',
    'A press on a bench set to a low incline that puts focus on the upper chest.',
    ['Set the bench to about 30 degrees and sit with a dumbbell on each thigh.', 'Kick the weights up and hold them over your upper chest, palms forward.', 'Lower until your elbows are just below the bench, wrists stacked over elbows.', 'Press up and slightly inward until your arms are straight.'], ['shoulders', 'triceps']),
  ex('incline-push-up', 'Feet-Up Push-Up', 'chest', ['upper'], 'Bodyweight', 'Intermediate',
    'A push-up with your feet raised, shifting load toward the upper chest.',
    ['Place hands shoulder width apart and rest your feet on a low step.', 'Brace your abs and keep a straight line from head to heels.', 'Lower your chest to the floor with elbows at about 45 degrees.', 'Push the floor away until your arms lock out.'], ['shoulders', 'triceps']),
  ex('barbell-bench-press', 'Barbell Bench Press', 'chest', ['mid'], 'Barbell', 'Intermediate',
    'The classic flat press and the standard for chest strength.',
    ['Lie with eyes under the bar, feet planted, shoulder blades pinched together.', 'Unrack the bar and hold it over your mid chest.', 'Lower the bar to touch your chest lightly.', 'Press back up in a slight arc to straight arms.'], ['triceps', 'shoulders']),
  ex('dumbbell-fly', 'Dumbbell Fly', 'chest', ['mid'], 'Dumbbell', 'Beginner',
    'A hugging motion that stretches and squeezes the chest without much arm involvement.',
    ['Lie flat and hold dumbbells over your chest, palms facing each other.', 'With a soft bend in the elbows, open your arms wide in an arc.', 'Stop when you feel a stretch across the chest.', 'Hug the weights back together over your chest.'], ['shoulders']),
  ex('machine-chest-press', 'Machine Chest Press', 'chest', ['mid'], 'Machine', 'Beginner',
    'A guided press that is ideal for learning the pressing motion safely.',
    ['Adjust the seat so the handles line up with mid chest.', 'Sit tall with your back against the pad and grip the handles.', 'Push forward until your arms are almost straight.', 'Return slowly until you feel a light stretch.'], ['triceps', 'shoulders']),
  ex('chest-dip', 'Chest Dip', 'chest', ['lower'], 'Bodyweight', 'Advanced',
    'A bodyweight dip with a forward lean to bias the lower chest.',
    ['Grip parallel bars and lift yourself with straight arms.', 'Lean your torso forward and let elbows flare slightly.', 'Lower until you feel a deep chest stretch.', 'Press back up without swinging.'], ['triceps', 'shoulders']),
  ex('decline-press', 'Decline Dumbbell Press', 'chest', ['lower'], 'Dumbbell', 'Intermediate',
    'A press on a downward bench for the bottom edge of the pec.',
    ['Secure your legs on a decline bench and hold dumbbells at chest level.', 'Press the weights up over your lower chest.', 'Lower with control until elbows reach bench height.', 'Repeat without bouncing at the bottom.'], ['triceps']),
  ex('cable-low-to-high-fly', 'Cable Low-to-High Fly', 'chest', ['upper'], 'Cable', 'Intermediate',
    'A cable fly sweeping upward to hit the upper chest fibers.',
    ['Set both pulleys low and grab the handles, stepping forward.', 'Lean slightly and keep a soft bend in your elbows.', 'Sweep your hands up and together to chin height.', 'Return slowly to the start.'], ['shoulders']),

  ex('overhead-press', 'Dumbbell Shoulder Press', 'shoulders', ['front', 'side'], 'Dumbbell', 'Beginner',
    'A seated overhead press that builds the front and side delts.',
    ['Sit with back support and hold dumbbells at ear height.', 'Press straight up until arms are almost locked.', 'Pause briefly overhead.', 'Lower back to ear height under control.'], ['triceps', 'traps']),
  ex('front-raise', 'Plate Front Raise', 'shoulders', ['front'], 'Dumbbell', 'Beginner',
    'A raise that isolates the front of the shoulder.',
    ['Stand holding a light dumbbell in front of your thighs.', 'Lift the weight with straight arms to eye level.', 'Pause for a beat.', 'Lower slowly without leaning back.'], []),
  ex('lateral-raise', 'Lateral Raise', 'shoulders', ['side'], 'Dumbbell', 'Beginner',
    'The go-to move for wider-looking shoulders.',
    ['Stand with dumbbells at your sides and a soft elbow bend.', 'Raise arms out to the sides until they reach shoulder height.', 'Lead with your elbows, not your hands.', 'Lower slowly.'], ['traps']),
  ex('face-pull', 'Cable Face Pull', 'shoulders', ['rear'], 'Cable', 'Beginner',
    'A rope pull toward the face that trains rear delts and posture muscles.',
    ['Set a rope at upper chest height and step back.', 'Pull the rope toward your face, elbows high.', 'Finish with hands beside your ears.', 'Return with control.'], ['traps']),
  ex('reverse-fly', 'Reverse Dumbbell Fly', 'shoulders', ['rear'], 'Dumbbell', 'Beginner',
    'A bent-over raise for the rear delts.',
    ['Hinge forward with a flat back holding light dumbbells.', 'Raise your arms out to the sides.', 'Squeeze your shoulder blades gently at the top.', 'Lower slowly.'], ['traps']),

  ex('barbell-curl', 'Standing Barbell Curl', 'biceps', ['short'], 'Barbell', 'Beginner',
    'A two-arm curl that loads both biceps evenly.',
    ['Stand holding a bar with an underhand shoulder-width grip.', 'Keep elbows at your sides and curl the bar up.', 'Squeeze at the top.', 'Lower fully without swinging.'], ['forearms']),
  ex('incline-curl', 'Incline Dumbbell Curl', 'biceps', ['long'], 'Dumbbell', 'Intermediate',
    'Curling from a reclined bench stretches the long head.',
    ['Sit back on a bench at 45 degrees with arms hanging.', 'Curl both dumbbells up without moving your upper arms.', 'Squeeze at the top.', 'Lower to a full stretch.'], ['forearms']),
  ex('preacher-curl', 'Preacher Curl', 'biceps', ['short'], 'Machine', 'Beginner',
    'The pad locks your elbows in place so the biceps do all the work.',
    ['Adjust the seat so your armpits touch the pad.', 'Curl the handles toward your shoulders.', 'Pause at the top.', 'Lower until arms are almost straight.'], []),
  ex('hammer-curl', 'Hammer Curl', 'biceps', ['long'], 'Dumbbell', 'Beginner',
    'A neutral-grip curl that also builds the forearm.',
    ['Hold dumbbells with palms facing each other.', 'Curl one or both up, keeping the thumbs up.', 'Stop near your shoulder.', 'Lower slowly.'], ['forearms']),

  ex('wrist-curl', 'Seated Wrist Curl', 'forearms', ['flexors'], 'Dumbbell', 'Beginner',
    'A small movement that builds the underside of the forearm.',
    ['Rest forearms on your thighs, palms up, holding light dumbbells.', 'Let the weights roll to your fingertips.', 'Curl the wrist up as far as you can.', 'Lower slowly.'], []),
  ex('reverse-wrist-curl', 'Reverse Wrist Curl', 'forearms', ['extensors'], 'Dumbbell', 'Beginner',
    'The same move palms down for the top of the forearm.',
    ['Rest forearms on your thighs, palms down.', 'Lower the weights by bending your wrists down.', 'Lift the back of your hands toward the ceiling.', 'Keep your forearms still.'], []),
  ex('farmer-carry', 'Farmer Carry', 'forearms', ['flexors', 'extensors'], 'Dumbbell', 'Beginner',
    'Pick up heavy weights and walk. Simple and brutal for grip.',
    ['Pick up a heavy dumbbell in each hand.', 'Stand tall with shoulders back.', 'Walk 20 to 30 steps with short, steady strides.', 'Set the weights down under control.'], ['traps', 'abs']),

  ex('crunch', 'Floor Crunch', 'abs', ['upper'], 'Bodyweight', 'Beginner',
    'A short curl of the ribcage that trains the upper abs.',
    ['Lie on your back with knees bent and hands by your temples.', 'Exhale and curl your ribs toward your hips.', 'Lift only your shoulder blades off the floor.', 'Lower slowly.'], []),
  ex('cable-crunch', 'Kneeling Cable Crunch', 'abs', ['upper'], 'Cable', 'Intermediate',
    'A weighted crunch that lets you progress over time.',
    ['Kneel under a rope pulley and hold it by your head.', 'Curl your chest toward your knees.', 'Keep hips still.', 'Return slowly.'], []),
  ex('reverse-crunch', 'Reverse Crunch', 'abs', ['lower'], 'Bodyweight', 'Beginner',
    'Curling the hips off the floor to target the lower abs.',
    ['Lie on your back with knees bent over hips.', 'Curl your pelvis up toward your ribs.', 'Do not swing your legs.', 'Lower slowly.'], []),
  ex('hanging-knee-raise', 'Hanging Knee Raise', 'abs', ['lower'], 'Pull-up bar', 'Intermediate',
    'A hanging raise that builds lower abs and grip.',
    ['Hang from a bar with a firm grip.', 'Tuck your pelvis and raise your knees to hip height or higher.', 'Pause.', 'Lower without swinging.'], ['forearms']),

  ex('russian-twist', 'Russian Twist', 'obliques', ['rotation'], 'Bodyweight', 'Beginner',
    'A seated twist for rotating strength.',
    ['Sit leaning back with knees bent and feet low.', 'Hold hands together at your chest.', 'Rotate your ribcage to one side, then the other.', 'Keep your chest tall.'], ['abs']),
  ex('side-plank', 'Side Plank', 'obliques', ['side-bend'], 'Bodyweight', 'Beginner',
    'A static hold that builds side-body stability.',
    ['Lie on your side with your elbow under your shoulder.', 'Lift your hips so your body forms a line.', 'Hold for 20 to 40 seconds.', 'Switch sides.'], ['glutes']),
  ex('pallof-press', 'Pallof Press', 'obliques', ['rotation', 'side-bend'], 'Cable', 'Intermediate',
    'Press a cable away from your chest and resist the twist.',
    ['Stand sideways to a cable at chest height.', 'Hold the handle at your sternum.', 'Press straight out and hold for two seconds.', 'Bring it back without turning.'], ['abs']),

  ex('goblet-squat', 'Goblet Squat', 'quads', ['center', 'inner'], 'Dumbbell', 'Beginner',
    'A beginner-friendly squat with a weight held at the chest.',
    ['Hold one dumbbell vertically against your chest.', 'Stand with feet slightly wider than your shoulders.', 'Sit down between your knees keeping your chest tall.', 'Drive up through the whole foot.'], ['glutes', 'abs']),
  ex('leg-press', 'Leg Press', 'quads', ['outer', 'center'], 'Machine', 'Beginner',
    'A machine press that loads the quads with back support.',
    ['Sit with your back flat and feet shoulder width on the platform.', 'Unlock the safeties and lower until knees reach about 90 degrees.', 'Press up without locking the knees.', 'Repeat smoothly.'], ['glutes']),
  ex('leg-extension', 'Leg Extension', 'quads', ['center', 'inner'], 'Machine', 'Beginner',
    'An isolating machine move for the front of the thigh.',
    ['Adjust the pad to rest on your lower shins.', 'Straighten your legs fully.', 'Squeeze the quads for a second.', 'Lower slowly.'], []),
  ex('bulgarian-split-squat', 'Bulgarian Split Squat', 'quads', ['outer'], 'Dumbbell', 'Advanced',
    'A single-leg squat with the back foot elevated.',
    ['Rest your back foot on a bench behind you.', 'Step the front foot forward.', 'Lower straight down until the front thigh is parallel.', 'Drive back up.'], ['glutes']),

  ex('standing-calf-raise', 'Standing Calf Raise', 'calves', ['gastroc'], 'Machine', 'Beginner',
    'Straight-leg raises for the main calf muscle.',
    ['Place the balls of your feet on the platform.', 'Lower your heels for a full stretch.', 'Rise as high as you can.', 'Pause at the top.'], []),
  ex('seated-calf-raise', 'Seated Calf Raise', 'calves', ['soleus'], 'Machine', 'Beginner',
    'Bent-knee raises that shift work to the soleus.',
    ['Sit with the pads on your lower thighs.', 'Lower your heels deep.', 'Press up to the toes.', 'Pause, then lower.'], []),

  ex('dumbbell-shrug', 'Dumbbell Shrug', 'traps', ['upper'], 'Dumbbell', 'Beginner',
    'Lift your shoulders straight toward your ears.',
    ['Stand holding dumbbells at your sides.', 'Raise shoulders straight up.', 'Hold for a second.', 'Lower fully.'], ['forearms']),
  ex('seated-cable-row-mid', 'Chest-Supported Row', 'traps', ['mid'], 'Dumbbell', 'Beginner',
    'Rowing against a bench to isolate the mid back.',
    ['Lie chest-down on an incline bench with dumbbells hanging.', 'Row with elbows flared slightly.', 'Squeeze shoulder blades together.', 'Lower slowly.'], ['lats', 'shoulders']),
  ex('prone-y-raise', 'Prone Y Raise', 'traps', ['lower'], 'Dumbbell', 'Intermediate',
    'A light overhead raise lying face-down for the lower traps.',
    ['Lie face-down with arms forming a Y overhead and thumbs up.', 'Lift your arms a few inches.', 'Hold for a second.', 'Lower slowly.'], ['shoulders']),

  ex('tricep-pushdown', 'Cable Pushdown', 'triceps', ['lateral', 'medial'], 'Cable', 'Beginner',
    'Straightening your elbows against a cable.',
    ['Stand at a high pulley holding a bar with elbows tucked.', 'Press down until arms are straight.', 'Squeeze the triceps.', 'Let the bar rise to chest height.'], []),
  ex('overhead-extension', 'Overhead Dumbbell Extension', 'triceps', ['long'], 'Dumbbell', 'Beginner',
    'Overhead position stretches the long head.',
    ['Hold one dumbbell overhead with both hands.', 'Bend elbows to lower it behind your head.', 'Keep elbows pointing forward.', 'Extend back up.'], []),
  ex('bench-dip', 'Bench Dip', 'triceps', ['medial', 'lateral'], 'Bench', 'Beginner',
    'A dip with your hands on a bench behind you.',
    ['Sit on a bench edge, hands beside your hips.', 'Slide forward off the bench.', 'Lower until elbows hit 90 degrees.', 'Press up.'], ['shoulders']),

  ex('lat-pulldown', 'Lat Pulldown', 'lats', ['width'], 'Machine', 'Beginner',
    'A vertical pull for building back width.',
    ['Grip the bar slightly wider than your shoulders.', 'Lean back a little with chest up.', 'Pull the bar to your upper chest.', 'Control it back up.'], ['biceps']),
  ex('pull-up', 'Pull-Up', 'lats', ['width'], 'Pull-up bar', 'Advanced',
    'The ultimate bodyweight lat exercise.',
    ['Hang with palms facing away.', 'Pull your chest toward the bar.', 'Pause with your chin above it.', 'Lower to a full hang.'], ['biceps', 'forearms']),
  ex('one-arm-row', 'One-Arm Dumbbell Row', 'lats', ['thickness'], 'Dumbbell', 'Beginner',
    'A supported row that is easy to learn.',
    ['Place one hand and knee on a bench.', 'Row the dumbbell toward your hip.', 'Keep your torso still.', 'Lower fully.'], ['biceps', 'traps']),
  ex('seated-cable-row', 'Seated Cable Row', 'lats', ['thickness'], 'Cable', 'Beginner',
    'A steady horizontal pull for mid-back thickness.',
    ['Sit tall with feet braced and knees soft.', 'Pull the handle to your stomach.', 'Squeeze your shoulder blades.', 'Extend arms slowly.'], ['biceps']),

  ex('back-extension', 'Back Extension', 'lower-back', ['erectors', 'hinge'], 'Bodyweight', 'Beginner',
    'A hip-hinged extension on a 45-degree bench.',
    ['Anchor your feet and set pads at your hips.', 'Cross arms and hinge down with a flat back.', 'Rise until your body is in a line.', 'Do not over-arch.'], ['glutes', 'hamstrings']),
  ex('bird-dog', 'Bird Dog', 'lower-back', ['erectors'], 'Bodyweight', 'Beginner',
    'A low-impact move that teaches spine control.',
    ['Start on hands and knees.', 'Extend one arm and the opposite leg.', 'Hold for three seconds without rotating.', 'Switch sides.'], ['glutes', 'abs']),
  ex('good-morning', 'Barbell Good Morning', 'lower-back', ['hinge'], 'Barbell', 'Advanced',
    'A hip hinge with a bar on your back.',
    ['Rest the bar on your upper back.', 'Push hips back with a soft knee bend.', 'Lower the torso until parallel to the floor.', 'Drive the hips forward to stand.'], ['hamstrings', 'glutes']),

  ex('hip-thrust', 'Barbell Hip Thrust', 'glutes', ['max'], 'Barbell', 'Intermediate',
    'The most direct glute builder.',
    ['Sit with your upper back on a bench and a bar over your hips.', 'Drive through your heels to lift your hips.', 'Squeeze at the top.', 'Lower slowly.'], ['hamstrings']),
  ex('glute-bridge', 'Glute Bridge', 'glutes', ['max'], 'Bodyweight', 'Beginner',
    'A floor version of the hip thrust, perfect for learning the pattern.',
    ['Lie on your back with knees bent.', 'Press your feet into the floor and lift your hips.', 'Squeeze your glutes for two seconds.', 'Lower slowly.'], ['hamstrings']),
  ex('banded-lateral-walk', 'Banded Lateral Walk', 'glutes', ['med'], 'Band', 'Beginner',
    'Side stepping against a band for hip stability.',
    ['Place a band above your knees.', 'Sit into a quarter squat.', 'Step sideways, keeping tension.', 'Take 10 steps each way.'], []),

  ex('romanian-deadlift', 'Romanian Deadlift', 'hamstrings', ['inner', 'outer'], 'Barbell', 'Intermediate',
    'The foundational hamstring hinge.',
    ['Hold a bar at hip height with soft knees.', 'Push hips back, sliding the bar down your thighs.', 'Stop when you feel a hamstring stretch.', 'Drive hips forward to stand.'], ['glutes', 'lower-back']),
  ex('lying-leg-curl', 'Lying Leg Curl', 'hamstrings', ['outer'], 'Machine', 'Beginner',
    'Machine curl that isolates the hamstrings.',
    ['Lie face-down with the pad above your heels.', 'Curl your heels toward your glutes.', 'Squeeze at the top.', 'Lower slowly.'], []),
  ex('single-leg-rdl', 'Single-Leg Romanian Deadlift', 'hamstrings', ['inner'], 'Dumbbell', 'Intermediate',
    'A balance-heavy hinge on one leg.',
    ['Stand on one leg with a dumbbell in the opposite hand.', 'Hinge forward, trailing the other leg back.', 'Lower until torso is nearly parallel.', 'Return to standing.'], ['glutes']),
];

export const getExercise = (slug: string) => EXERCISES.find((e) => e.slug === slug);
export const EQUIPMENT: Equipment[] = ['Bodyweight', 'Dumbbell', 'Barbell', 'Cable', 'Machine', 'Bench', 'Band', 'Pull-up bar'];
export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
