/* Interactive qualitative example — the real per-round conversation of a
   ReViSe rollout on NExT-QA (video 8608712348, qid 8). Frames extracted at
   24 fps. Text is transcribed verbatim from the run log: each round shows the
   prompt the agent received (frames + the summary carried as state) and the
   agent's literal output (<summary> + <frames>/<answer>). Round 1 has NO prior
   summary — the agent only sees uniformly sampled frames. */

const QUAL = {
  dataset: "NExT-QA",
  meta: "24 s clip · video 8608712348",
  fps: 24,
  question:
    "How did the lady holding the baby react when the baby smiles happily in the middle of the video?",
  options: [
    "bounce ball while carrying baby",
    "rolled eyes",
    "laugh",
    "smile and look at baby",
    "rocks him left and right"
  ],
  answerIdx: 3, // D

  rounds: [
    {
      shown: [0, 146, 292, 438, 584],
      shownNote: "5 uniformly sampled frames",
      carried: null, // first round — no prior summary
      summary: {
        P: "previously seen frames show different scenes involving children and adults, including a child drinking from a cup and a baby being held by a lady",
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
      carried: 0, // carries Round 1's summary as its only memory
      summary: {
        P: "previously seen frames show different scenes involving children and adults, including a child drinking from a cup and a baby being held by a lady",
        O: "I observe the lady smiling and looking at the baby in frame 342 when the baby is smiling happily",
        H: "my belief is updated to include the lady's reaction when the baby smiles",
        U: "there is no remaining ambiguity that affects the answer",
        R: "answered"
      },
      action: { type: "answer", letter: "D" }
    }
  ]
};

const POHR_LABELS = { P: "Previously seen", O: "Observations", H: "Hypotheses", U: "Uncertainties", R: "Reasons" };
const KEYS = ["P", "O", "H", "U", "R"];

(function () {
  let cur = 0;
  let timer = null;

  const elOptions = document.getElementById("qualOptions");
  const elConvo = document.getElementById("qualConvo");
  const elSeen = document.getElementById("qualSeen");
  const elBar = document.getElementById("qualBar");
  const tabs = Array.from(document.querySelectorAll(".qual-tab"));
  const playBtn = document.getElementById("qualPlay");
  if (!elConvo) return;

  const letter = (i) => String.fromCharCode(65 + i);
  const tstamp = (f) => (f / QUAL.fps).toFixed(1);

  function renderOptions(showAnswer) {
    elOptions.innerHTML = QUAL.options
      .map((opt, i) => {
        const isAns = showAnswer && i === QUAL.answerIdx;
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
          <img src="static/images/qual/frame_${f}.jpg" alt="frame ${f}" loading="lazy">
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
        <span class="raw-gloss">&rarr; ${action.letter}. &ldquo;${QUAL.options[li]}&rdquo; <span class="qual-correct">&#10003; correct</span></span></div>`;
    }
    return `<div class="raw-tag is-request">&lt;frames&gt;${action.frames.join(", ")}&lt;/frames&gt;
      <span class="raw-gloss">&rarr; request these frames for the next round</span></div>`;
  }

  function roundHTML(r, idx) {
    const isFinal = r.action.type === "answer";
    // ----- PROMPT (what the agent receives) -----
    let promptInner = "";
    if (idx === 0) {
      promptInner += `<p class="turn-q">Q: ${QUAL.question}</p>`;
      promptInner += `<p class="turn-note">${r.shownNote} &middot; <em>first round — no prior summary</em></p>`;
      promptInner += framesRow(r.shown);
    } else {
      promptInner += `<p class="turn-note">${r.shownNote}</p>`;
      promptInner += framesRow(r.shown);
      promptInner += `<div class="carried">
          <div class="carried-head">Memory carried in &mdash; <em>Round ${idx}'s summary is the agent's only state</em></div>
          ${pohrBlock(QUAL.rounds[r.carried].summary, true)}
        </div>`;
    }
    // ----- RESPONSE (what the agent outputs) -----
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
    for (let i = 0; i <= upto; i++) QUAL.rounds[i].shown.forEach((f) => s.add(f));
    return s.size;
  }

  function render(c) {
    cur = c;
    const reachedFinal = QUAL.rounds[cur].action.type === "answer";
    tabs.forEach((t, i) => t.classList.toggle("is-active", i === cur));
    elBar.style.width = `${((cur + 1) / QUAL.rounds.length) * 100}%`;
    elSeen.textContent = `${cumulativeSeen(cur)} frames seen`;
    // accumulate the transcript up to the current round
    elConvo.innerHTML = QUAL.rounds.slice(0, cur + 1).map((r, i) => roundHTML(r, i)).join("");
    renderOptions(reachedFinal);
    const last = elConvo.querySelector(".qual-round.is-current");
    if (last && cur > 0) last.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.innerHTML = "&#9654; Play";
    playBtn.classList.remove("is-playing");
  }
  function play() {
    if (timer) { stop(); return; }
    if (cur === QUAL.rounds.length - 1) render(0);
    playBtn.innerHTML = "&#9632; Pause";
    playBtn.classList.add("is-playing");
    timer = setInterval(() => {
      if (cur >= QUAL.rounds.length - 1) { stop(); return; }
      render(cur + 1);
    }, 3200);
  }

  tabs.forEach((t, i) => t.addEventListener("click", () => { stop(); render(i); }));
  playBtn.addEventListener("click", play);
  render(0);
})();

/* ---- BibTeX one-click copy ---- */
(function () {
  const btn = document.getElementById("bibtexCopy");
  const pre = document.getElementById("bibtex");
  if (!btn || !pre) return;

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  const label = btn.querySelector(".bibtex-copy-label");
  btn.addEventListener("click", async () => {
    const text = pre.textContent;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch (e) {
      fallbackCopy(text);
    }
    btn.classList.add("is-copied");
    if (label) label.textContent = "Copied!";
    setTimeout(() => {
      btn.classList.remove("is-copied");
      if (label) label.textContent = "Copy";
    }, 1800);
  });
})();
