/* ReViSe trajectories on NExT-QA clips.
   These rollouts follow ReViSe's protocol with the corrected answer-round
   format: SELECT rounds emit <summary>(POHR)+<frames>; the final ANSWER round
   emits <think>+<answer> (no summary). The reasoning was produced by inspecting
   the actual extracted frames, so every observation is grounded in the clip.
   Videos: NExT-QA (Xiao et al., CVPR 2021). */

window.QUAL_EXAMPLES = [
  {
    id: "8608712348",
    label: "Baby's smile",
    tag: "Social",
    fps: 24,
    dur: "24 s",
    question: "How did the lady holding the baby react when the baby smiles happily in the middle of the video?",
    choices: ["bounce ball while carrying baby", "rolled eyes", "laugh", "smile and look at baby", "rocks him left and right"],
    answerIdx: 3,
    rounds: [
      {
        frames: [0, 146, 292, 438, 584],
        summary: {
          P: "Viewed 5 uniformly sampled frames (0, 146, 292, 438, 584) spanning the clip.",
          O: "The clip mixes scenes — a boy drinking/eating at a table, and a woman holding a baby. In frame 292 the baby is smiling broadly, but the woman's face is turned away, so her reaction is not visible.",
          H: "The question concerns the woman's reaction at the baby's smile; that moment is near frame 292, yet her expression there is not captured.",
          U: "The woman's facial reaction at the instant the baby smiles is still unseen.",
          R: "Request frames just after 292 to catch the woman's face during the baby's smile."
        },
        request: [293, 342, 391]
      },
      {
        frames: [293, 342, 391],
        think: "In frame 342 the woman is turned toward the baby, smiling warmly and looking directly at it as the baby beams. That is clearly a 'smile and look at the baby' reaction. The other options do not fit: she is not laughing out loud, rolling her eyes, bouncing a ball, or rocking the baby side to side.",
        answer: "D"
      }
    ]
  },
  {
    id: "4519255731",
    label: "Water wheel",
    tag: "Purpose",
    fps: 24,
    dur: "41 s",
    question: "Why are the kids rotating the water wheel?",
    choices: ["move the water", "catch fish", "boy cannot control hose itself", "dancing", "to not fall off"],
    answerIdx: 0,
    rounds: [
      {
        frames: [0, 246, 492, 737, 983],
        summary: {
          P: "Viewed 5 uniformly sampled frames (0, 246, 492, 737, 983) across the clip.",
          O: "Children take turns stepping on a large wooden paddle wheel built over a water channel in a garden, steadying themselves on a bamboo rail; the wheel's paddles dip into the channel below.",
          H: "This looks like a foot-powered water wheel; pedaling it drives the paddles through the channel, which would move or lift water.",
          U: "From these wide frames I cannot yet confirm the paddles are actually displacing water rather than the kids merely playing.",
          R: "Request closer frames of the wheel and channel to confirm water is being moved."
        },
        request: [123, 365, 607]
      },
      {
        frames: [123, 365, 607],
        think: "The closer frames confirm a paddle wheel set into a water channel; as the children pedal, the wooden blades scoop through the water — the classic mechanism of a treadwheel water pump used to lift/move water for irrigation. Of the options, only 'move the water' matches a paddle wheel over a channel; catching fish, controlling a hose, dancing, or 'to not fall off' do not explain the wheel.",
        answer: "A"
      }
    ]
  },
  {
    id: "9175190419",
    label: "Sand bucket",
    tag: "Temporal",
    fps: 30,
    dur: "59 s",
    question: "What does the girl do after she has filled the bucket the first time?",
    choices: ["pour the sand out", "grab starfish", "put baby on leg", "studying the screen", "pick it up again"],
    answerIdx: 0,
    rounds: [
      {
        frames: [0, 442, 883, 1324, 1766],
        summary: {
          P: "Viewed 5 uniformly sampled frames (0, 442, 883, 1324, 1766) across the clip.",
          O: "A toddler is playing at a sand table with a yellow bucket and scoops. Across the sampled frames she repeatedly scoops sand into the bucket and handles it, but the moment right after the first fill is not pinned down.",
          H: "The question asks what she does immediately after filling the bucket the first time; I need the frames just after an early fill.",
          U: "The specific action following the first fill (pour it out vs. pick it up again) is not yet clear.",
          R: "Request earlier frames near the first fill to see what she does next."
        },
        request: [221, 663, 1104]
      },
      {
        frames: [221, 663, 1104],
        summary: {
          P: "Seen so far: the uniform frames plus 221, 663, 1104.",
          O: "In frame 221 she scoops sand into the yellow bucket (the first fill); just after, in 663 and 1104 she sets the scoop down and reaches toward the bucket with her hand.",
          H: "After the first fill she stays at the table and keeps manipulating the sand in and around the bucket rather than carrying it away.",
          U: "Whether she then pours the sand out or refills it again is still ambiguous.",
          R: "Request the frames around 884 to see the bucket's contents being handled."
        },
        request: [884, 1105]
      },
      {
        frames: [884, 1105],
        summary: {
          P: "Seen so far: earlier frames plus 884, 1105.",
          O: "She tips the yellow bucket while her hand is in the sand; the bucket appears to be emptying rather than being carried off.",
          H: "The action after the first fill is looking like emptying the bucket back onto the table.",
          U: "I want one more confirmation that sand is leaving the bucket (pouring out) rather than being added.",
          R: "Request adjacent frames to confirm the pouring motion."
        },
        request: [664, 885, 1106]
      },
      {
        frames: [664, 885, 1106],
        summary: {
          P: "Seen so far: earlier frames plus 664, 885, 1106.",
          O: "In 885 she tilts the bucket over the table and in 1106 she reaches into the spilled sand — the bucket is clearly being emptied.",
          H: "After filling it, she pours the sand back out of the bucket.",
          U: "One final frame would show the sand visibly streaming out.",
          R: "Request the surrounding frames including the clearest pour."
        },
        request: [443, 665, 886, 1107, 1325]
      },
      {
        frames: [443, 665, 886, 1107, 1325],
        think: "Frame 1325 shows it unambiguously: she holds the yellow bucket tilted with the scoop and sand is streaming out of it back onto the table; 885 shows the same emptying motion. So after filling the bucket the first time, she pours the sand out. The distractors do not fit — there is no starfish, no baby, no screen, and she does not simply pick it up again (she empties it).",
        answer: "A"
      }
    ]
  }
];
