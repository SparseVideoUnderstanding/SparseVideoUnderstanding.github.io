/* Interactive qualitative examples — real ReViSe rollouts on NExT-QA.
   Data (window.QUAL_EXAMPLES, see qual_data.js) is transcribed VERBATIM from the
   run log: the complete system prompt, the complete per-round user prompt, and
   the complete raw model response. Nothing is paraphrased.

   Note on "thinking": ReViSe's output format forbids <think> — the model emits
   ONLY <summary>...</summary> followed by <frames> or <answer>. The POHR summary
   IS the model's reasoning; there is no separate hidden chain of thought.

   Source videos: NExT-QA (Xiao et al., CVPR 2021). */

const POHR_LABELS = { P: "Previously seen", O: "Observations", H: "Hypotheses", U: "Uncertainties", R: "Reasons" };
const KEYS = ["P", "O", "H", "U", "R"];

(function () {
  const DATA = window.QUAL_EXAMPLES || [];
  let curEx = 0;
  let view = "all"; // "all" or 0-based round index
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

  function esc(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function parsePOHR(raw) {
    const m = /<summary>([\s\S]*?)<\/summary>/.exec(raw || "");
    if (!m) return null;
    const body = m[1];
    const out = {};
    KEYS.forEach((k) => {
      const rx = new RegExp(k + ":\\s*([\\s\\S]*?)\\s*(?:;\\s*[POHUR]:|$)");
      const mm = rx.exec(body);
      out[k] = mm ? mm[1].trim() : "";
    });
    return out;
  }

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

  function pohrBlock(sum) {
    if (!sum) return "";
    return `<div class="pohr">${KEYS.map(
      (k) => `<div class="pohr-row">
        <span class="pohr-badge pohr-${k}">${k}</span>
        <span class="pohr-label">${POHR_LABELS[k]}</span>
        <span class="pohr-val">${esc(sum[k])}</span>
      </div>`
    ).join("")}</div>`;
  }

  function roundHTML(r, idx) {
    const isFinal = idx === lastIdx();
    const pohr = parsePOHR(r.raw_output);
    return `<div class="qual-round${view === idx ? " is-current" : ""}">
        <div class="round-label">Round ${idx + 1}${isFinal ? " &middot; answers" : ""}</div>

        <div class="turn turn-user">
          <div class="turn-head"><span class="turn-who who-prompt">Prompt</span> complete user message sent this round</div>
          <pre class="raw-block">${esc(r.user_text)}</pre>
          <div class="turn-sub">Frames shown this round (the <code>&lt;image&gt;</code> tokens above):</div>
          ${framesRow(r.current_frames)}
        </div>

        <div class="turn turn-agent">
          <div class="turn-head"><span class="turn-who who-agent">ReViSe</span> complete raw response</div>
          <pre class="raw-block">${esc(r.raw_output)}</pre>
          <div class="turn-sub">Parsed POHR summary (the model's reasoning):</div>
          ${pohrBlock(pohr)}
        </div>
      </div>`;
  }

  function shownRounds() {
    return view === "all" ? E().rounds.map((_, i) => i) : [view];
  }

  function render() {
    const ex = E();
    const idxs = shownRounds();
    const maxShown = idxs[idxs.length - 1];
    const showAnswer = idxs.includes(lastIdx());

    Array.from(elTabs.children).forEach((t) => {
      const v = t.dataset.view;
      t.classList.toggle("is-active", v === String(view));
    });
    elBar.style.width = view === "all" ? "100%" : `${((view + 1) / ex.rounds.length) * 100}%`;
    const seen = new Set();
    for (let i = 0; i <= maxShown; i++) ex.rounds[i].current_frames.forEach((f) => seen.add(f));
    elSeen.textContent = `${seen.size} frames seen`;

    elConvo.innerHTML = idxs.map((i) => roundHTML(ex.rounds[i], i)).join("");
    renderOptions(showAnswer);
    if (view !== "all") {
      const cur = elConvo.querySelector(".qual-round");
      if (cur) cur.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function setView(v) {
    view = v;
    render();
  }

  function buildTabs() {
    const btns = [`<button class="qual-tab" type="button" data-view="all">Full conversation</button>`].concat(
      E().rounds.map((r, i) => `<button class="qual-tab" type="button" data-view="${i}">Round ${i + 1}</button>`)
    );
    elTabs.innerHTML = btns.join("");
    Array.from(elTabs.children).forEach((t) =>
      t.addEventListener("click", () => {
        stop();
        const v = t.dataset.view;
        setView(v === "all" ? "all" : parseInt(v, 10));
      })
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
    elVideo.poster = framePath(ex.rounds[0].current_frames[0]);
    elSys.textContent = ex.system_prompt;
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
