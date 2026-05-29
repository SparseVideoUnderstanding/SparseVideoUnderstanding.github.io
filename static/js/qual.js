/* Interactive qualitative examples — ReViSe trajectories on NExT-QA clips.
   window.QUAL_EXAMPLES (qual_data.js) holds structured rounds. SELECT rounds
   carry a POHR <summary> + <frames> request; the final ANSWER round emits
   <think> + <answer> (no summary). Only the summary is passed between rounds.
   Source videos: NExT-QA (Xiao et al., CVPR 2021). */

const POHR_LABELS = { P: "Previously seen", O: "Observations", H: "Hypotheses", U: "Uncertainties", R: "Reasons" };
const KEYS = ["P", "O", "H", "U", "R"];

const SYS_PROMPT =
`You are ReViSe, a multi-round video reasoning agent.

Each round you receive: (1) the question with options, (2) your current summary
state, and (3) a few sampled video frames (with timestamps; frame index ≈ seconds).

Maintain a compact summary-as-state in POHR order — it is the ONLY memory carried
across rounds:
  P (Previously seen)  — which frames have been inspected.
  O (Observations)     — what you see in the current frames.
  H (Hypotheses)       — how the evidence updates your belief.
  U (Uncertainties)    — what is still unclear.
  R (Reasons)          — which frames to view next, and why.

Respond with EXACTLY one of two formats (no other text):

  • Not yet confident — request more frames:
      <think> brief reasoning over what you see </think>
      <summary>P: …; O: …; H: …; U: …; R: …</summary>
      <frames>idx, idx, …</frames>

  • Confident — give the final answer:
      <think> brief reasoning over the gathered evidence </think>
      <answer>LETTER</answer>

Request only NEW frame indices you have not seen. Stop and answer as soon as the
evidence is sufficient.`;

(function () {
  const DATA = window.QUAL_EXAMPLES || [];
  let curEx = 0;
  let view = "all";
  let timer = null;

  const el = (id) => document.getElementById(id);
  const elExamples = el("qualExamples");
  const elVideo = el("qualVideo");
  const elQ = el("qualQ");
  const elMeta = el("qualMeta");
  const elOptions = el("qualOptions");
  const elSys = el("qualSys");
  const elTabs = el("qualTabs");
  const elConvo = el("qualConvo");
  const elSeen = el("qualSeen");
  const elBar = el("qualBar");
  const playBtn = el("qualPlay");
  if (!elConvo || !elExamples || !DATA.length) return;

  const E = () => DATA[curEx];
  const letter = (i) => String.fromCharCode(65 + i);
  const tstamp = (f) => (f / E().fps).toFixed(1);
  const framePath = (f) => `static/images/qual/${E().id}/frame_${f}.jpg`;
  const lastIdx = () => E().rounds.length - 1;
  const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function renderOptions(showAnswer) {
    elOptions.innerHTML = E().choices
      .map((opt, i) => {
        const isAns = showAnswer && i === E().answerIdx;
        return `<div class="qual-opt${isAns ? " is-answer" : ""}">
            <span class="qual-opt-key">${letter(i)}</span><span>${esc(opt)}</span>
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
    if (!sum) return "";
    return `<div class="pohr${compact ? " is-compact" : ""}">${KEYS.map(
      (k) => `<div class="pohr-row">
        <span class="pohr-badge pohr-${k}">${k}</span>
        <span class="pohr-label">${POHR_LABELS[k]}</span>
        <span class="pohr-val">${esc(sum[k])}</span>
      </div>`
    ).join("")}</div>`;
  }

  function roundHTML(r, idx) {
    const isFinal = !!r.answer;
    const carried = idx > 0 ? E().rounds[idx - 1].summary : null;
    const n = r.frames.length;
    const note = idx === 0
      ? `${n} uniformly sampled frames &middot; <em>no prior summary yet</em>`
      : `${n} requested frames &middot; plus the summary carried from Round ${idx}`;

    const carriedBlock = idx === 0
      ? ""
      : `<div class="carried">
          <div class="carried-head">Carried summary <span class="pfield-sub">&mdash; the only state passed in</span></div>
          ${pohrBlock(carried, true)}
        </div>`;

    let responseHead, responseBody;
    if (isFinal) {
      const li = r.answer.charCodeAt(0) - 65;
      responseHead = `<span class="turn-who who-agent">ReViSe</span> thinks, then answers`;
      responseBody = `
        <div class="think-block"><span class="tag-lab">&lt;think&gt;</span> ${esc(r.think)}</div>
        <div class="qual-action is-answer"><span class="act-tag">&lt;answer&gt;</span>
          <strong>${r.answer}</strong> &mdash; &ldquo;${esc(E().choices[li])}&rdquo;
          <span class="qual-correct">&#10003; correct</span></div>`;
    } else {
      responseHead = `<span class="turn-who who-agent">ReViSe</span> thinks, updates its summary &amp; requests frames`;
      responseBody = `
        <div class="think-block"><span class="tag-lab">&lt;think&gt;</span> ${esc(r.think)}</div>
        ${pohrBlock(r.summary, false)}
        <div class="qual-action is-request"><span class="act-tag">&lt;frames&gt;</span>
          requests frames <strong>${r.request.join(", ")}</strong> &rarr; next round</div>`;
    }

    return `<div class="qual-round${view === idx ? " is-current" : ""}">
        <div class="round-label">Round ${idx + 1}${isFinal ? " &middot; answers" : ""}</div>
        <div class="turn turn-user">
          <div class="turn-head"><span class="turn-who who-prompt">Prompt</span> what the agent sees</div>
          <p class="turn-note">${note}</p>
          ${framesRow(r.frames)}
          ${carriedBlock}
        </div>
        <div class="turn-arrow" aria-hidden="true">&darr;</div>
        <div class="turn turn-agent">
          <div class="turn-head">${responseHead}</div>
          ${responseBody}
        </div>
      </div>`;
  }

  const shownRounds = () => (view === "all" ? E().rounds.map((_, i) => i) : [view]);

  function render() {
    const ex = E();
    const idxs = shownRounds();
    const maxShown = idxs[idxs.length - 1];
    const showAnswer = idxs.includes(lastIdx());

    Array.from(elTabs.children).forEach((t) => t.classList.toggle("is-active", t.dataset.view === String(view)));
    elBar.style.width = view === "all" ? "100%" : `${((view + 1) / ex.rounds.length) * 100}%`;
    const seen = new Set();
    for (let i = 0; i <= maxShown; i++) ex.rounds[i].frames.forEach((f) => seen.add(f));
    elSeen.textContent = `${seen.size} frames seen`;

    elConvo.innerHTML = idxs.map((i) => roundHTML(ex.rounds[i], i)).join("");
    renderOptions(showAnswer);
    if (view !== "all") {
      const cur = elConvo.querySelector(".qual-round");
      if (cur) cur.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  const setView = (v) => { view = v; render(); };

  function buildTabs() {
    const btns = [`<button class="qual-tab" type="button" data-view="all">Full conversation</button>`].concat(
      E().rounds.map((r, i) => `<button class="qual-tab" type="button" data-view="${i}">Round ${i + 1}</button>`)
    );
    elTabs.innerHTML = btns.join("");
    Array.from(elTabs.children).forEach((t) =>
      t.addEventListener("click", () => { stop(); const v = t.dataset.view; setView(v === "all" ? "all" : parseInt(v, 10)); })
    );
  }

  function selectExample(i) {
    stop();
    curEx = i;
    view = "all";
    const ex = E();
    Array.from(elExamples.children).forEach((b, j) => b.classList.toggle("is-active", j === i));
    elQ.textContent = ex.question;
    elMeta.innerHTML = `NExT-QA &middot; ${ex.dur} &middot; <span class="tag-chip">${ex.tag}</span>`;
    elVideo.src = `static/videos/${ex.id}.mp4`;
    elVideo.poster = framePath(ex.rounds[0].frames[0]);
    elSys.textContent = SYS_PROMPT;
    buildTabs();
    render();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.innerHTML = "&#9654; Play rounds";
    playBtn.classList.remove("is-playing");
  }
  function play() {
    if (timer) { stop(); return; }
    setView(0);
    playBtn.innerHTML = "&#9632; Pause";
    playBtn.classList.add("is-playing");
    timer = setInterval(() => {
      if (view === "all" || view >= lastIdx()) { stop(); return; }
      setView(view + 1);
    }, 3400);
  }

  elExamples.innerHTML = DATA.map(
    (ex) => `<button class="qual-ex" type="button"><span class="qual-ex-tag">${ex.tag}</span>${ex.label}
        <span class="qual-ex-rounds">${ex.rounds.length} rounds</span></button>`
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
