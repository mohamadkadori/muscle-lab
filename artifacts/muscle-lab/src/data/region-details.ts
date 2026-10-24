export interface RegionDetail {
  anatomy: string;
  training: string;
  cue: string;
}

// Extra reading revealed after selecting a training region.
export const REGION_DETAILS: Record<string, RegionDetail> = {
  'chest/upper': {
    anatomy: 'The clavicular fibers of the pectoralis major begin near your collarbone. They help bring your upper arm forward and across your chest. “Upper chest” is a region of the same muscle, not a separate muscle.',
    training: 'A low-incline press can shift emphasis toward these fibers. Flat presses still involve them, so you do not need a completely separate routine for each chest region.',
    cue: 'Choose a comfortable incline, keep your wrists over your elbows, and lower the weight with control. A steeper incline generally asks more of the front shoulders.',
  },
  'chest/mid': {
    anatomy: 'The broad sternocostal fibers form much of the center of the pectoralis major. They help move your arms across your body and contribute strongly to pressing.',
    training: 'Flat presses, push-ups and fly variations train the chest through this movement. Mid chest is a useful training label, rather than a separate anatomical muscle.',
    cue: 'Use a range you can control without shoulder discomfort. Keep the movement steady rather than bouncing at the bottom or letting the weight pull your arms too far back.',
  },
  'chest/lower': {
    anatomy: 'The lower fibers are part of the sternocostal portion of the pectoralis major. They contribute to bringing the arm down and across the torso.',
    training: 'Decline presses and suitable cable angles can shift emphasis toward the lower chest. Dips can also train this area, but they are optional and can be demanding on the shoulders.',
    cue: 'Keep the load manageable and use a comfortable range. If dips feel uncomfortable, choose a pressing or cable variation instead of forcing a deep stretch.',
  },
  'shoulders/front': {
    anatomy: 'The anterior deltoid sits at the front of your shoulder. It helps lift the arm forward and works alongside the chest during pressing.',
    training: 'Overhead and chest presses already give it substantial work. Consider that pressing volume before adding lots of front raises.',
    cue: 'Avoid arching your back to move a heavier weight. Keep a controlled range and stop if the shoulder feels pinched.',
  },
  'shoulders/side': {
    anatomy: 'The lateral deltoid sits on the outside of your shoulder and helps lift your arm away from your side.',
    training: 'Lateral raises provide direct work for this head, alongside the contribution it makes to overhead presses.',
    cue: 'Start light, keep a soft bend in the elbow, and lift without swinging your torso or shrugging the weight up.',
  },
  'shoulders/rear': {
    anatomy: 'The posterior deltoid sits at the back of the shoulder. It helps move the upper arm backward and out to the side.',
    training: 'Reverse flys and rear-delt rows provide direct work. Rows also involve this head, depending on your arm path.',
    cue: 'Move from the shoulder with control. Keep the load light enough that momentum does not take over.',
  },
};
