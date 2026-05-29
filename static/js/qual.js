/* Interactive qualitative example — a real ReViSe rollout on NExT-QA.
   Data transcribed verbatim from the run log (Qwen2.5-VL teacher rollout,
   video 10211516755, qid 11). Frames extracted at 25 fps. */

const QUAL = {
  dataset: "NExT-QA",
  meta: "42 s clip · 25 fps",
  question: "How does the girl deliver the food on the table to her mouth at the end?",
  options: ["excited", "looked at baby", "by her hands", "shave the dog", "put on sofa"],
  answerIdx: 2, // C
  fps: 25,
  rounds: [
    {
      frames: [0, 263, 526, 789, 1052],
      note: "Round 1 · 5 uniformly sampled frames",
      pohr: {
        P: "previously seen frames show a girl eating from a bowl at a table",
        O: "I observe the girl using a spoon to eat",
        H: "my belief is updated that she uses utensils to eat",
        U: "it is unclear if she uses her hands at any point",
        R: "request additional frames to gather the missing evidence"
      },
      action: { type: "request", frames: [264, 527, 790] }
    },
    {
      frames: [264, 527, 790],
      note: "Round 2 · 3 targeted frames",
      pohr: {
        P: "previously seen frames show a girl eating from a bowl at a table",
        O: "I observe the girl using both a spoon and her hands to eat",
        H: "my belief is updated that she uses both utensils and hands to eat",
        U: "it is unclear if she exclusively uses her hands at the end",
        R: "request additional frames to gather the missing evidence"
      },
      action: { type: "request", frames: [791, 850, 900] }
    },
    {
      frames: [791, 850, 900],
      note: "Round 3 · 3 targeted frames (final segment)",
      pohr: {
        P: "previously seen frames show a girl eating from a bowl at a table",
        O: "I observe the girl using her hands to eat directly from the bowl",
        H: "my belief is updated that she uses her hands to eat at the end",
        U: "there is no remaining ambiguity about how she eats at the end",
        R: "answered — the question is now answerable"
      },
      action: { type: "answer", letter: "C" }
    }
  ]
};

const POHR_LABELS = {
  P: "Previously seen",
  O: "Observations",
  H: "Hypotheses",
  U: "Uncertainties",
  R: "Reasons"
};

(function () {
  let cur = 0;
  let timer = null;

  const elOptions = document.getElementById("qualOptions");
  const elFrames = document.getElementById("qualFrames");
  const elPohr = document.getElementById("qualPohr");
  const elAction = document.getElementById("qualAction");
  const elSeen = document.getElementById("qualSeen");
  const elNote = document.getElementById("qualNote");
  const elBar = document.getElementById("qualBar");
  const tabs = Array.from(document.querySelectorAll(".qual-tab"));
  const playBtn = document.getElementById("qualPlay");
  if (!elFrames) return; // section not present

  const letter = (i) => String.fromCharCode(65 + i);
  const tstamp = (f) => (f / QUAL.fps).toFixed(1);

  function renderOptions(showAnswer) {
    elOptions.innerHTML = QUAL.options
      .map((opt, i) => {
        const isAns = showAnswer && i === QUAL.answerIdx;
        return `<div class="qual-opt${isAns ? " is-answer" : ""}">
            <span class="qual-opt-key">${letter(i)}</span>
            <span>${opt}</span>
            ${isAns ? '<span class="qual-check">✓</span>' : ""}
          </div>`;
      })
      .join("");
  }

  function cumulativeSeen(uptoRound) {
    const seen = new Set();
    for (let r = 0; r <= uptoRound; r++) {
      QUAL.rounds[r].frames.forEach((f) => seen.add(f));
    }
    return seen.size;
  }

  function render(r) {
    cur = r;
    const round = QUAL.rounds[r];
    const isFinal = round.action.type === "answer";

    tabs.forEach((t, i) => t.classList.toggle("is-active", i === r));
    elBar.style.width = `${((r + 1) / QUAL.rounds.length) * 100}%`;
    elNote.textContent = round.note;

    elFrames.innerHTML = round.frames
      .map(
        (f) => `<figure class="qual-frame">
          <img src="static/images/qual/frame_${f}.jpg" alt="frame ${f}" loading="lazy">
          <figcaption>frame ${f} &middot; t=${tstamp(f)}s</figcaption>
        </figure>`
      )
      .join("");

    elPohr.innerHTML = ["P", "O", "H", "U", "R"]
      .map(
        (k) => `<div class="pohr-row">
          <span class="pohr-badge pohr-${k}">${k}</span>
          <span class="pohr-label">${POHR_LABELS[k]}</span>
          <span class="pohr-val">${round.pohr[k]}</span>
        </div>`
      )
      .join("");

    if (isFinal) {
      const li = round.action.letter.charCodeAt(0) - 65;
      elAction.className = "qual-action is-answer";
      elAction.innerHTML = `<strong>Answers ${round.action.letter}</strong> &mdash; &ldquo;${QUAL.options[li]}&rdquo; <span class="qual-correct">✓ correct</span>`;
    } else {
      elAction.className = "qual-action is-request";
      elAction.innerHTML = `<strong>Requests frames</strong> ${round.action.frames.join(", ")} &rarr; next round`;
    }

    elSeen.textContent = `${cumulativeSeen(r)} frames seen`;
    renderOptions(isFinal);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("is-playing");
  }

  function play() {
    if (timer) {
      stop();
      return;
    }
    if (cur === QUAL.rounds.length - 1) render(0);
    playBtn.textContent = "◼ Pause";
    playBtn.classList.add("is-playing");
    timer = setInterval(() => {
      if (cur >= QUAL.rounds.length - 1) {
        stop();
        return;
      }
      render(cur + 1);
    }, 2600);
  }

  tabs.forEach((t, i) =>
    t.addEventListener("click", () => {
      stop();
      render(i);
    })
  );
  playBtn.addEventListener("click", play);

  render(0);
})();
