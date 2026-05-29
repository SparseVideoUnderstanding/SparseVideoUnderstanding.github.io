window.QUAL_EXAMPLES = [
 {
  "id": "8608712348",
  "label": "Baby's smile",
  "tag": "Social",
  "fps": 24.0,
  "dur": "24 s",
  "question": "how did the lady holding the baby react when the baby smiles happily in the middle of the video",
  "choices": [
   "bounce ball while carrying baby",
   "rolled eyes",
   "laugh",
   "smile and look at baby",
   "rocks him left and right"
  ],
  "answerIdx": 3,
  "system_prompt": "You are REVISE, a multi-round video reasoning agent.\nEach round you will see: (1) a multiple-choice question with options, (2) the current belief summary, and (3) a few sampled video frames.\nIf you are confident, answer the question.\nIf you are NOT confident, request MORE video frames to view NEXT.\nFrames are sampled at ~1 fps; frame index ≈ timestamp in seconds.\n\nIMPORTANT: Output must follow EXACTLY ONE of the two formats below. Do not output any text outside tags.\nOutput ONLY <summary> plus either <frames> (request) OR <answer> (final).\nDo NOT output <think>.\nDo NOT output bare placeholders like '...', 'none', or 'N/A' as your summary fields.\nIt's OK to say something is unclear/unknown *within a sentence*, but do not leave fields empty.\n\nFormat 1 — Request more frames (use this only if NOT confident):\n<summary>P: previously seen frames show a person in the scene interacting with objects; O: I observe an action that may be relevant to the question; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>1, 3</frames>\n\nIf Candidate Frame IDs are provided in the user prompt, request using those IDs (e.g., <frames>1, 3</frames>).\n\nFormat 2 — Answer now (use this if confident):\n<summary>P: previously seen frames already contain the key evidence; O: the answer-relevant evidence is visible in the shown frames; H: my belief is updated based on the observed evidence; U: no remaining ambiguity that affects the answer; R: answered</summary>\n<answer>B</answer>\n\nTag meanings:\n- <summary>: the ONLY persistent memory across rounds. Keep it short and update it EVERY round.\n  The summary MUST be written in this exact order: P → O → H → U → R.\n  - P (Previously seen): which frames have already been used/seen (write as a sentence; no Python lists).\n  - O (Observations): what you currently observe in the selected frames.\n  - H (Belief updates): updated belief based on what has been observed so far (do NOT include the final answer letter).\n  - U (Uncertainties): what is still unknown or ambiguous.\n  - R (Reasons): why you need more frames and what evidence you are looking for next (or 'answered').\n\nRules:\n- Frame indices are 0-based in [0, L-1].\n- If you are confident, answer instead of requesting more frames.\n- If requesting, choose 1 to 5 NEW frames to view NEXT.\n- Do NOT output any frame index from the Seen frames list; those are already viewed.\n- When provided, request frames ONLY within the allowed unseen frame ranges.\n- When Candidate Frame IDs are provided, output those IDs (1..K) in <frames> instead of raw frame indices.\n- In <frames>, output comma-separated integers only (no brackets, no text).\n- In <summary>, include P/O/H/U/R as short natural-language sentences that reflect your current understanding.\n- The order inside <summary> MUST be: P then O then H then U then R.\n- In P, describe previously seen frames in a sentence (describe content; do NOT list frame indices or use Python lists like [4, 8, 12]).\n- In <answer>, output EXACTLY ONE option letter shown in the question (e.g., A/B/C/D/E). No words/punctuation.\n- Never copy the example text; replace it with information from the current video.\n",
  "rounds": [
   {
    "round": 1,
    "current_frames": [
     0,
     146,
     292,
     438,
     584
    ],
    "user_text": "Round 1 / Question:\nQuestion: how did the lady holding the baby react when the baby smiles happily in the middle of the video\nOptions:\nA. bounce ball while carrying baby\nB. rolled eyes\nC. laugh\nD. smile and look at baby\nE. rocks him left and right\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 585.\nSeen frames (already viewed; do NOT request these again): 0, 146, 292, 438, 584\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-145; 147-291; 293-437; 439-583\nCurrent summary:\n<summary>P: I will summarize what has been shown so far; O: I will record the key observations from the current evidence; H: I will update my belief as new evidence arrives; U: some key detail may still be unclear; R: request more evidence if needed</summary>\nFrames shown in this round:\nFrame 0 <image>\nFrame 146 <image>\nFrame 292 <image>\nFrame 438 <image>\nFrame 584 <image>",
    "raw_output": "<summary>P: previously seen frames show different scenes involving children and adults, including a child drinking from a cup and a baby being held by a lady; O: I observe a baby smiling happily in frame 292, but the lady's reaction is not clearly visible; H: based on the evidence so far, my belief is updated but still incomplete regarding the lady's reaction; U: a key detail needed to answer is still unclear, specifically the lady's reaction when the baby smiles; R: request additional frames to gather the missing evidence</summary>\n<frames>293, 342, 391</frames>"
   },
   {
    "round": 2,
    "current_frames": [
     293,
     342,
     391
    ],
    "user_text": "Round 2 / Question:\nQuestion: how did the lady holding the baby react when the baby smiles happily in the middle of the video\nOptions:\nA. bounce ball while carrying baby\nB. rolled eyes\nC. laugh\nD. smile and look at baby\nE. rocks him left and right\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 585.\nSeen frames (already viewed; do NOT request these again): 0, 146, 292, 438, 584, 293, 342, 391\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-145; 147-291; 294-341; 343-390; 392-437; 439-583\nCurrent summary:\n<summary>P: previously seen frames show different scenes involving children and adults, including a child drinking from a cup and a baby being held by a lady; O: I observe a baby smiling happily in frame 292, but the lady's reaction is not clearly visible; H: based on the evidence so far, my belief is updated but still incomplete regarding the lady's reaction; U: a key detail needed to answer is still unclear, specifically the lady's reaction when the baby smiles; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 293 <image>\nFrame 342 <image>\nFrame 391 <image>",
    "raw_output": "<summary>P: previously seen frames show different scenes involving children and adults, including a child drinking from a cup and a baby being held by a lady; O: I observe the lady smiling and looking at the baby in frame 342 when the baby is smiling happily; H: based on the evidence so far, my belief is updated to include the lady's reaction when the baby smiles; U: there is no remaining ambiguity that affects the answer; R: answered</summary>\n<answer>D</answer>"
   }
  ]
 },
 {
  "id": "4519255731",
  "label": "Water wheel",
  "tag": "Purpose",
  "fps": 24.0,
  "dur": "41 s",
  "question": "why are the kids rotating the water wheel",
  "choices": [
   "move the water",
   "catch fish",
   "boy can not control hose itself",
   "dancing",
   "to not fall off"
  ],
  "answerIdx": 0,
  "system_prompt": "You are REVISE, a multi-round video reasoning agent.\nEach round you will see: (1) a multiple-choice question with options, (2) the current belief summary, and (3) a few sampled video frames.\nIf you are confident, answer the question.\nIf you are NOT confident, request MORE video frames to view NEXT.\nFrames are sampled at ~1 fps; frame index ≈ timestamp in seconds.\n\nIMPORTANT: Output must follow EXACTLY ONE of the two formats below. Do not output any text outside tags.\nOutput ONLY <summary> plus either <frames> (request) OR <answer> (final).\nDo NOT output <think>.\nDo NOT output bare placeholders like '...', 'none', or 'N/A' as your summary fields.\nIt's OK to say something is unclear/unknown *within a sentence*, but do not leave fields empty.\n\nFormat 1 — Request more frames (use this only if NOT confident):\n<summary>P: previously seen frames show a person in the scene interacting with objects; O: I observe an action that may be relevant to the question; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>1, 3</frames>\n\nIf Candidate Frame IDs are provided in the user prompt, request using those IDs (e.g., <frames>1, 3</frames>).\n\nFormat 2 — Answer now (use this if confident):\n<summary>P: previously seen frames already contain the key evidence; O: the answer-relevant evidence is visible in the shown frames; H: my belief is updated based on the observed evidence; U: no remaining ambiguity that affects the answer; R: answered</summary>\n<answer>B</answer>\n\nTag meanings:\n- <summary>: the ONLY persistent memory across rounds. Keep it short and update it EVERY round.\n  The summary MUST be written in this exact order: P → O → H → U → R.\n  - P (Previously seen): which frames have already been used/seen (write as a sentence; no Python lists).\n  - O (Observations): what you currently observe in the selected frames.\n  - H (Belief updates): updated belief based on what has been observed so far (do NOT include the final answer letter).\n  - U (Uncertainties): what is still unknown or ambiguous.\n  - R (Reasons): why you need more frames and what evidence you are looking for next (or 'answered').\n\nRules:\n- Frame indices are 0-based in [0, L-1].\n- If you are confident, answer instead of requesting more frames.\n- If requesting, choose 1 to 5 NEW frames to view NEXT.\n- Do NOT output any frame index from the Seen frames list; those are already viewed.\n- When provided, request frames ONLY within the allowed unseen frame ranges.\n- When Candidate Frame IDs are provided, output those IDs (1..K) in <frames> instead of raw frame indices.\n- In <frames>, output comma-separated integers only (no brackets, no text).\n- In <summary>, include P/O/H/U/R as short natural-language sentences that reflect your current understanding.\n- The order inside <summary> MUST be: P then O then H then U then R.\n- In P, describe previously seen frames in a sentence (describe content; do NOT list frame indices or use Python lists like [4, 8, 12]).\n- In <answer>, output EXACTLY ONE option letter shown in the question (e.g., A/B/C/D/E). No words/punctuation.\n- Never copy the example text; replace it with information from the current video.\n",
  "rounds": [
   {
    "round": 1,
    "current_frames": [
     0,
     246,
     492,
     737,
     983
    ],
    "user_text": "Round 1 / Question:\nQuestion: why are the kids rotating the water wheel\nOptions:\nA. move the water\nB. catch fish\nC. boy can not control hose itself\nD. dancing\nE. to not fall off\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 984.\nSeen frames (already viewed; do NOT request these again): 0, 246, 492, 737, 983\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-245; 247-491; 493-736; 738-982\nCurrent summary:\n<summary>P: I will summarize what has been shown so far; O: I will record the key observations from the current evidence; H: I will update my belief as new evidence arrives; U: some key detail may still be unclear; R: request more evidence if needed</summary>\nFrames shown in this round:\nFrame 0 <image>\nFrame 246 <image>\nFrame 492 <image>\nFrame 737 <image>\nFrame 983 <image>",
    "raw_output": "<summary>P: previously seen frames show children and adults interacting with a water wheel mechanism; O: I observe the kids actively turning the wheel while adults assist them; H: based on the evidence so far, my belief is updated to suggest the activity involves moving water; U: it is unclear if there are other purposes for their actions beyond moving water; R: request additional frames to gather the missing evidence</summary>\n<frames>123, 365, 607</frames>"
   },
   {
    "round": 2,
    "current_frames": [
     123,
     365,
     607
    ],
    "user_text": "Round 2 / Question:\nQuestion: why are the kids rotating the water wheel\nOptions:\nA. move the water\nB. catch fish\nC. boy can not control hose itself\nD. dancing\nE. to not fall off\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 984.\nSeen frames (already viewed; do NOT request these again): 0, 246, 492, 737, 983, 123, 365, 607\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-122; 124-245; 247-364; 366-491; 493-606; 608-736; 738-982\nCurrent summary:\n<summary>P: previously seen frames show children and adults interacting with a water wheel mechanism; O: I observe the kids actively turning the wheel while adults assist them; H: based on the evidence so far, my belief is updated to suggest the activity involves moving water; U: it is unclear if there are other purposes for their actions beyond moving water; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 123 <image>\nFrame 365 <image>\nFrame 607 <image>",
    "raw_output": "<summary>P: previously seen frames show children and adults interacting with a water wheel mechanism; O: I observe the kids actively turning the wheel while adults assist them, and water is visibly being moved by the wheel; H: based on the evidence so far, my belief is updated to suggest the primary purpose is moving water; U: it is still unclear if there are secondary purposes for their actions; R: answered</summary>\n<answer>A</answer>"
   }
  ]
 },
 {
  "id": "9175190419",
  "label": "Sand bucket",
  "tag": "Temporal",
  "fps": 29.97,
  "dur": "59 s",
  "question": "what does the girl do after she has filled the bucket the first time",
  "choices": [
   "pour the sand out",
   "grab starfish",
   "put baby on leg",
   "studying the screen",
   "pick it up again"
  ],
  "answerIdx": 0,
  "system_prompt": "You are REVISE, a multi-round video reasoning agent.\nEach round you will see: (1) a multiple-choice question with options, (2) the current belief summary, and (3) a few sampled video frames.\nIf you are confident, answer the question.\nIf you are NOT confident, request MORE video frames to view NEXT.\nFrames are sampled at ~1 fps; frame index ≈ timestamp in seconds.\n\nIMPORTANT: Output must follow EXACTLY ONE of the two formats below. Do not output any text outside tags.\nOutput ONLY <summary> plus either <frames> (request) OR <answer> (final).\nDo NOT output <think>.\nDo NOT output bare placeholders like '...', 'none', or 'N/A' as your summary fields.\nIt's OK to say something is unclear/unknown *within a sentence*, but do not leave fields empty.\n\nFormat 1 — Request more frames (use this only if NOT confident):\n<summary>P: previously seen frames show a person in the scene interacting with objects; O: I observe an action that may be relevant to the question; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>1, 3</frames>\n\nIf Candidate Frame IDs are provided in the user prompt, request using those IDs (e.g., <frames>1, 3</frames>).\n\nFormat 2 — Answer now (use this if confident):\n<summary>P: previously seen frames already contain the key evidence; O: the answer-relevant evidence is visible in the shown frames; H: my belief is updated based on the observed evidence; U: no remaining ambiguity that affects the answer; R: answered</summary>\n<answer>B</answer>\n\nTag meanings:\n- <summary>: the ONLY persistent memory across rounds. Keep it short and update it EVERY round.\n  The summary MUST be written in this exact order: P → O → H → U → R.\n  - P (Previously seen): which frames have already been used/seen (write as a sentence; no Python lists).\n  - O (Observations): what you currently observe in the selected frames.\n  - H (Belief updates): updated belief based on what has been observed so far (do NOT include the final answer letter).\n  - U (Uncertainties): what is still unknown or ambiguous.\n  - R (Reasons): why you need more frames and what evidence you are looking for next (or 'answered').\n\nRules:\n- Frame indices are 0-based in [0, L-1].\n- If you are confident, answer instead of requesting more frames.\n- If requesting, choose 1 to 5 NEW frames to view NEXT.\n- Do NOT output any frame index from the Seen frames list; those are already viewed.\n- When provided, request frames ONLY within the allowed unseen frame ranges.\n- When Candidate Frame IDs are provided, output those IDs (1..K) in <frames> instead of raw frame indices.\n- In <frames>, output comma-separated integers only (no brackets, no text).\n- In <summary>, include P/O/H/U/R as short natural-language sentences that reflect your current understanding.\n- The order inside <summary> MUST be: P then O then H then U then R.\n- In P, describe previously seen frames in a sentence (describe content; do NOT list frame indices or use Python lists like [4, 8, 12]).\n- In <answer>, output EXACTLY ONE option letter shown in the question (e.g., A/B/C/D/E). No words/punctuation.\n- Never copy the example text; replace it with information from the current video.\n",
  "rounds": [
   {
    "round": 1,
    "current_frames": [
     0,
     442,
     883,
     1324,
     1766
    ],
    "user_text": "Round 1 / Question:\nQuestion: what does the girl do after she has filled the bucket the first time\nOptions:\nA. pour the sand out\nB. grab starfish\nC. put baby on leg\nD. studying the screen\nE. pick it up again\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 1767.\nSeen frames (already viewed; do NOT request these again): 0, 442, 883, 1324, 1766\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-441; 443-882; 884-1323; 1325-1765\nCurrent summary:\n<summary>P: I will summarize what has been shown so far; O: I will record the key observations from the current evidence; H: I will update my belief as new evidence arrives; U: some key detail may still be unclear; R: request more evidence if needed</summary>\nFrames shown in this round:\nFrame 0 <image>\nFrame 442 <image>\nFrame 883 <image>\nFrame 1324 <image>\nFrame 1766 <image>",
    "raw_output": "<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl filling the bucket with sand; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>221, 663, 1104</frames>"
   },
   {
    "round": 2,
    "current_frames": [
     221,
     663,
     1104
    ],
    "user_text": "Round 2 / Question:\nQuestion: what does the girl do after she has filled the bucket the first time\nOptions:\nA. pour the sand out\nB. grab starfish\nC. put baby on leg\nD. studying the screen\nE. pick it up again\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 1767.\nSeen frames (already viewed; do NOT request these again): 0, 442, 883, 1324, 1766, 221, 663, 1104\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-220; 222-441; 443-662; 664-882; 884-1103; 1105-1323; 1325-1765\nCurrent summary:\n<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl filling the bucket with sand; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 221 <image>\nFrame 663 <image>\nFrame 1104 <image>",
    "raw_output": "<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl filling the bucket with sand and then picking it up; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>884,1105</frames>"
   },
   {
    "round": 3,
    "current_frames": [
     884,
     1105
    ],
    "user_text": "Round 3 / Question:\nQuestion: what does the girl do after she has filled the bucket the first time\nOptions:\nA. pour the sand out\nB. grab starfish\nC. put baby on leg\nD. studying the screen\nE. pick it up again\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 1767.\nSeen frames (already viewed; do NOT request these again): 0, 442, 883, 1324, 1766, 221, 663, 1104, 884, 1105\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-220; 222-441; 443-662; 664-882; 885-1103; 1106-1323; 1325-1765\nCurrent summary:\n<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl filling the bucket with sand and then picking it up; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 884 <image>\nFrame 1105 <image>",
    "raw_output": "<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl holding the bucket and reaching into the sand; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>664,885,1106</frames>"
   },
   {
    "round": 4,
    "current_frames": [
     664,
     885,
     1106
    ],
    "user_text": "Round 4 / Question:\nQuestion: what does the girl do after she has filled the bucket the first time\nOptions:\nA. pour the sand out\nB. grab starfish\nC. put baby on leg\nD. studying the screen\nE. pick it up again\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 1767.\nSeen frames (already viewed; do NOT request these again): 0, 442, 883, 1324, 1766, 221, 663, 1104, 884, 1105, 664, 885, 1106\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-220; 222-441; 443-662; 665-882; 886-1103; 1107-1323; 1325-1765\nCurrent summary:\n<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl holding the bucket and reaching into the sand; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 664 <image>\nFrame 885 <image>\nFrame 1106 <image>",
    "raw_output": "<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl pouring sand out of the bucket; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\n<frames>443,665,886,1107,1325</frames>"
   },
   {
    "round": 5,
    "current_frames": [
     443,
     665,
     886,
     1107,
     1325
    ],
    "user_text": "Round 5 / Question:\nQuestion: what does the girl do after she has filled the bucket the first time\nOptions:\nA. pour the sand out\nB. grab starfish\nC. put baby on leg\nD. studying the screen\nE. pick it up again\nTo answer, output <summary>...</summary> then <answer>LETTER</answer> (LETTER must be one of: A, B, C, D, E).\nTotal frames L = 1767.\nSeen frames (already viewed; do NOT request these again): 0, 442, 883, 1324, 1766, 221, 663, 1104, 884, 1105, 664, 885, 1106, 443, 665, 886, 1107, 1325\nAllowed unseen frame ranges for <frames> (choose NEW indices only from these ranges): 1-220; 222-441; 444-662; 666-882; 887-1103; 1108-1323; 1326-1765\nCurrent summary:\n<summary>P: previously seen frames show a girl playing with sand and a bucket; O: I observe the girl pouring sand out of the bucket; H: based on the evidence so far, my belief is updated but still incomplete; U: a key detail needed to answer is still unclear; R: request additional frames to gather the missing evidence</summary>\nFrames shown in this round:\nFrame 443 <image>\nFrame 665 <image>\nFrame 886 <image>\nFrame 1107 <image>\nFrame 1325 <image>\n\nThis is the final round. You MUST answer now using <summary>...</summary> then <answer>LETTER</answer>.",
    "raw_output": "<summary>P: previously seen frames show a girl playing with sand and a bucket; O: the girl is seen pouring sand out of the bucket into the sandbox; H: based on the evidence so far, my belief is updated but still incomplete; U: no remaining ambiguity that affects the answer; R: answered</summary>\n<answer>A</answer>"
   }
  ]
 }
];
