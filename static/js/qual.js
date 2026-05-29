/* Interactive qualitative examples — real ReViSe rollouts on NExT-QA.
   Every round below is transcribed verbatim from the run log: the prompt the
   agent received (frames + the summary carried as state) and its literal output
   (<summary> + <frames>/<answer>). Round 1 has NO prior summary. Frames are the
   exact ones the agent saw; the original clip is shown alongside.
   Source videos: NExT-QA dataset (Xiao et al., CVPR 2021). */

const EXAMPLES = [
  {
    id: "8608712348",
    label: "Baby's smile",
    tag: "Social",
    fps: 24,
    dur: "24 s",
    question:
      "How did the lady holding the baby react when the baby smiles happily in the middle of the video?",
    options: [
      "bounce ball while carrying baby",
      "rolled eyes",
      "laugh",
      "smile and look at baby",
      "rocks him left and right"
    ],
    answerIdx: 3,
    rounds: [
      {
        shown: [0, 146, 292, 438, 584],
        shownNote: "5 uniformly sampled frames",
        carried: null,
        summary: {
          P: "previously seen frames show different scenes involving children and adults, including a baby being held by a lady",
          O: "I observe a baby smiling happily in frame 292, but the lady's reaction is not clearly visible",
          H: "my belief is updated but still incomplete regarding the lady's reaction",
          U: "a key detail is still unclear — the lady's reaction when the baby smiles",
          R: "request additional frames to gather the missing evidence"
        },
        action: { type: "request", frames: [293, 342, 391] }
      },
      {
        shown: [293, 342, 391],
        shownNote: "3 frames the agent requested",
        carried: 0,
        summary: {
          P: "previously seen frames show different scenes involving children and adults, including a baby being held by a lady",
          O: "I observe the lady smiling and looking at the baby in frame 342 when the baby is smiling happily",
          H: "my belief is updated to include the lady's reaction when the baby smiles",
          U: "there is no remaining ambiguity that affects the answer",
          R: "answered"
        },
        action: { type: "answer", letter: "D" }
      }
    ]
  },
  {
    id: "9645028313",
    label: "Where to cut",
    tag: "Action",
    fps: 25,
    dur: "77 s",
    question:
      "How does the man in the yellow helmet signal the man in the orange helmet where to cut?",
    options: [
      "point it out",
      "using the white paper",
      "use his hands to show him the way",
      "he ran",
      "talking while moving backwards"
    ],
    answerIdx: 0,
    rounds: [
      {
        shown: [0, 483, 966, 1448, 1931],
        shownNote: "5 uniformly sampled frames",
        carried: null,
        summary: {
          P: "previously seen frames show two men working on a roof, one in a yellow helmet and the other in an orange helmet",
          O: "I observe both men engaged in tasks involving tools, but their interaction isn't clear",
          H: "my belief is updated but still incomplete regarding how they communicate",
          U: "it is unclear how the man in the yellow helmet signals the man in the orange helmet",
          R: "request additional frames to gather the missing evidence"
        },
        action: { type: "request", frames: [242, 729, 1215] }
      },
      {
        shown: [242, 729, 1215],
        shownNote: "3 frames the agent requested",
        carried: 0,
        summary: {
          P: "previously seen frames show two men working on a roof, one in a yellow helmet and the other in an orange helmet",
          O: "I observe the man in the yellow helmet pointing towards the roof while the man in the orange helmet looks in that direction",
          H: "my belief is updated to suggest the man in the yellow helmet uses gestures to communicate",
          U: "it is still unclear if there are other methods of communication being used",
          R: "answered"
        },
        action: { type: "answer", letter: "A" }
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
    options: ["move the water", "catch fish", "boy cannot control hose itself", "dancing", "to not fall off"],
    answerIdx: 0,
    rounds: [
      {
        shown: [0, 246, 492, 737, 983],
        shownNote: "5 uniformly sampled frames",
        carried: null,
        summary: {
          P: "previously seen frames show children and adults interacting with a water wheel mechanism",
          O: "I observe the kids actively turning the wheel while adults assist them",
          H: "my belief is updated to suggest the activity involves moving water",
          U: "it is unclear if there are other purposes for their actions beyond moving water",
          R: "request additional frames to gather the missing evidence"
        },
        action: { type: "request", frames: [123, 365, 607] }
      },
      {
        shown: [123, 365, 607],
        shownNote: "3 frames the agent requested",
        carried: 0,
        summary: {
          P: "previously seen frames show children and adults interacting with a water wheel mechanism",
          O: "I observe the kids actively turning the wheel, and water is visibly being moved by the wheel",
          H: "my belief is updated to suggest the primary purpose is moving water",
          U: "it is still unclear if there are secondary purposes for their actions",
          R: "answered"
        },
        action: { type: "answer", letter: "A" }
      }
    ]
  }
];

const POHR_LABELS = { P: "Previously seen", O: "Observations", H: "Hypotheses", U: "Uncertainties", R: "Reasons" };
const KEYS = ["P", "O", "H", "U", "R"];

(function () {
  let curEx = 0;
  let cur = 0;
  let timer = null;

  const el = (id) => document.getElementById(id);
  const elExamples = el("qualExamples");
  const elVideo = el("qualVideo");
  const elQ = el("qualQ");
  const elMeta = el("qualMeta");
  const elOptions = el("qualOptions");
  const elTabs = el("qualTabs");
  const elConvo = el("qualConvo");
  const elSeen = el("qualSeen");
  const elBar = el("qualBar");
  const playBtn = el("qualPlay");
  if (!elConvo || !elExamples) return;

  const E = () => EXAMPLES[curEx];
  const letter = (i) => String.fromCharCode(65 + i);
  const tstamp = (f) => (f / E().fps).toFixed(1);
  const framePath = (f) => `static/images/qual/${E().id}/frame_${f}.jpg`;

  function renderOptions(showAnswer) {
    elOptions.innerHTML = E().options
      .map((opt, i) => {
        const isAns = showAnswer && i === E().answerIdx;
        return `<div class="qual-opt${isAns ? " is-answer" : ""}">
            <span class="qual-opt-key">${letter(i)}</span><span>${opt}</span>
            ${isAns ? '<span class="qual-check">&#10003;</span>' : ""}
          </div>`;
      })
      .join("");
  }

  function framesRow(frames) {
    return `<div class="qual-frames">${frames
      .map(
        (f) => `<figure class="qual-frame">
          <img src="${framePath(f)}" alt="frame ${f}" loading="lazy">
          <figcaption>frame ${f} &middot; t=${tstamp(f)}s</figcaption>
        </figure>`
      )
      .join("")}</div>`;
  }

  function pohrBlock(sum, compact) {
    return `<div class="pohr${compact ? " is-compact" : ""}">${KEYS.map(
      (k) => `<div class="pohr-row">
        <span class="pohr-badge pohr-${k}">${k}</span>
        <span class="pohr-label">${POHR_LABELS[k]}</span>
        <span class="pohr-val">${sum[k]}</span>
      </div>`
    ).join("")}</div>`;
  }

  function actionHTML(action) {
    if (action.type === "answer") {
      const li = action.letter.charCodeAt(0) - 65;
      return `<div class="raw-tag is-answer">&lt;answer&gt;${action.letter}&lt;/answer&gt;
        <span class="raw-gloss">&rarr; ${action.letter}. &ldquo;${E().options[li]}&rdquo; <span class="qual-correct">&#10003; correct</span></span></div>`;
    }
    return `<div class="raw-tag is-request">&lt;frames&gt;${action.frames.join(", ")}&lt;/frames&gt;
      <span class="raw-gloss">&rarr; request these frames for the next round</span></div>`;
  }

  function roundHTML(r, idx) {
    const isFinal = r.action.type === "answer";
    let promptInner = "";
    if (idx === 0) {
      promptInner += `<p class="turn-note">${r.shownNote} &middot; <em>first round &mdash; no prior summary</em></p>`;
      promptInner += framesRow(r.shown);
    } else {
      promptInner += `<p class="turn-note">${r.shownNote}</p>`;
      promptInner += framesRow(r.shown);
      promptInner += `<div class="carried">
          <div class="carried-head">Memory carried in &mdash; <em>Round ${idx}'s summary is the agent's only state</em></div>
          ${pohrBlock(E().rounds[r.carried].summary, true)}
        </div>`;
    }
    const responseInner = `
      <div class="raw-tag">&lt;summary&gt;</div>
      ${pohrBlock(r.summary, false)}
      <div class="raw-tag">&lt;/summary&gt;</div>
      ${actionHTML(r.action)}`;
    return `<div class="qual-round${idx === cur ? " is-current" : ""}">
        <div class="round-label">Round ${idx + 1}${isFinal ? " &middot; answers" : ""}</div>
        <div class="turn turn-user">
          <div class="turn-head"><span class="turn-who who-prompt">Prompt</span> frames + carried state</div>
          ${promptInner}
        </div>
        <div class="turn turn-agent">
          <div class="turn-head"><span class="turn-who who-agent">ReViSe</span> summary &amp; action</div>
          ${responseInner}
        </div>
      </div>`;
  }

  function cumulativeSeen(upto) {
    const s = new Set();
    for (let i = 0; i <= upto; i++) E().rounds[i].shown.forEach((f) => s.add(f));
    return s.size;
  }

  function render(c) {
    cur = c;
    const ex = E();
    const reachedFinal = ex.rounds[cur].action.type === "answer";
    Array.from(elTabs.children).forEach((t, i) => t.classList.toggle("is-active", i === cur));
    elBar.style.width = `${((cur + 1) / ex.rounds.length) * 100}%`;
    elSeen.textContent = `${cumulativeSeen(cur)} frames seen`;
    elConvo.innerHTML = ex.rounds.slice(0, cur + 1).map((r, i) => roundHTML(r, i)).join("");
    renderOptions(reachedFinal);
    const last = elConvo.querySelector(".qual-round.is-current");
    if (last && cur > 0) last.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function buildTabs() {
    elTabs.innerHTML = E()
      .rounds.map((r, i) => `<button class="qual-tab" type="button">Round ${i + 1}</button>`)
      .join("");
    Array.from(elTabs.children).forEach((t, i) =>
      t.addEventListener("click", () => { stop(); render(i); })
    );
  }

  function selectExample(i) {
    stop();
    curEx = i;
    const ex = E();
    Array.from(elExamples.children).forEach((b, j) => b.classList.toggle("is-active", j === i));
    elQ.textContent = ex.question;
    elMeta.innerHTML = `NExT-QA &middot; ${ex.dur} &middot; <span class="tag-chip">${ex.tag}</span>`;
    elVideo.src = `static/videos/${ex.id}.mp4`;
    elVideo.poster = framePath(ex.rounds[0].shown[0]);
    buildTabs();
    render(0);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.innerHTML = "&#9654; Play rounds";
    playBtn.classList.remove("is-playing");
  }
  function play() {
    if (timer) { stop(); return; }
    if (cur === E().rounds.length - 1) render(0);
    playBtn.innerHTML = "&#9632; Pause";
    playBtn.classList.add("is-playing");
    timer = setInterval(() => {
      if (cur >= E().rounds.length - 1) { stop(); return; }
      render(cur + 1);
    }, 3200);
  }

  // build example switcher
  elExamples.innerHTML = EXAMPLES.map(
    (ex, i) => `<button class="qual-ex" type="button">
        <span class="qual-ex-tag">${ex.tag}</span>${ex.label}
      </button>`
  ).join("");
  Array.from(elExamples.children).forEach((b, i) => b.addEventListener("click", () => selectExample(i)));

  playBtn.addEventListener("click", play);
  selectExample(0);
})();

/* ---- BibTeX one-click copy ---- */
(function () {
  const btn = document.getElementById("bibtexCopy");
  const pre = document.getElementById("bibtex");
  if (!btn || !pre) return;
  const label = btn.querySelector(".bibtex-copy-label");
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
  btn.addEventListener("click", async () => {
    const text = pre.textContent;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
    } catch (e) { fallbackCopy(text); }
    btn.classList.add("is-copied");
    if (label) label.textContent = "Copied!";
    setTimeout(() => { btn.classList.remove("is-copied"); if (label) label.textContent = "Copy"; }, 1800);
  });
})();
