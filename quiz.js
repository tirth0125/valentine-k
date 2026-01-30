/* ==========================================================
   quiz.js (3 questions)
   Q1: NO teleports anywhere on screen
   Q2: NO goes invisible
   Q3: NO turns into YES
   Quiz centered for iPhone 14 (body.quiz-mode)
========================================================== */

(function () {
  const QUESTIONS = [
    "1) Am I always right?",
    "2) Should I always be the dominating one?",
    "3) Am I a brother to you?"
  ];

  function getISTYear() {
    const now = new Date();
    const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
    const ist = new Date(istMs);
    return ist.getUTCFullYear();
  }

  const KEY = `val_quiz_done_${getISTYear()}`;

  function isDone() {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  }
  function setDone() {
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  const $ = (id) => document.getElementById(id);
  const page = () => (location.pathname || "").split("/").pop() || "index.html";

  function lockTabs(locked) {
    const bar = document.querySelector(".tabbar");
    if (!bar) return;
    bar.classList.toggle("locked", locked);
  }

  function show(el, yes) {
    if (!el) return;
    el.hidden = !yes;
  }

  function burstHearts() {
    // Uses your app.js pointerdown hearts (if present)
    try {
      window.dispatchEvent(new PointerEvent("pointerdown", { clientX: innerWidth/2, clientY: innerHeight/3 }));
      setTimeout(() => window.dispatchEvent(new PointerEvent("pointerdown", { clientX: innerWidth/2.2, clientY: innerHeight/3.1 })), 140);
    } catch {}
  }

function ensureNoPortal(){
  let portal = document.getElementById("noPortal");
  if (!portal) {
    portal = document.createElement("div");
    portal.id = "noPortal";
    portal.style.position = "fixed";
    portal.style.inset = "0";
    portal.style.zIndex = "9999";
    portal.style.pointerEvents = "none"; // portal itself doesn't block anything
    document.body.appendChild(portal);
  }
  return portal;
}

// Q1: NO goes anywhere on screen (true viewport space)
function teleportNoAnywhere(noBtn, arena) {
  if (!noBtn) return;

  // Move button OUTSIDE the transformed quiz card
  const portal = ensureNoPortal();
  if (noBtn.parentElement !== portal) portal.appendChild(noBtn);
  noBtn.classList.add("noPortalBtn");


  noBtn.style.pointerEvents = "auto";
  noBtn.style.position = "fixed";
  noBtn.style.opacity = "1";

  const bw = noBtn.offsetWidth || 140;
  const bh = noBtn.offsetHeight || 44;
  const pad = 12;

  const maxX = Math.max(pad, window.innerWidth - bw - pad);
  const maxY = Math.max(pad, window.innerHeight - bh - pad);

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const rot = (Math.random() * 18 - 9).toFixed(1);
  const sc = (0.90 + Math.random() * 0.22).toFixed(2);
  noBtn.style.transform = `rotate(${rot}deg) scale(${sc})`;

  const texts = ["NO 🙃", "nope 😭", "catch me 🐇", "lol nah", "try again 😤"];
  noBtn.textContent = texts[Math.floor(Math.random() * texts.length)];
}


  // Q2: NO goes invisible
  function makeNoInvisible(noBtn) {
    if (!noBtn) return;
    noBtn.style.opacity = "0";
    noBtn.style.transform = "scale(.8)";
    noBtn.style.pointerEvents = "none";
    // keep its position, but it's gone
  }

  // Q3: NO turns into YES (acts exactly like yes)
  function turnNoIntoYes(noBtn, onYes) {
  if (!noBtn) return null;

  // restore into quiz area styling
  noBtn.removeAttribute("style");
  noBtn.classList.remove("noPortalBtn");
  noBtn.classList.add("primary");
  noBtn.textContent = "Yes 💘";

  // clone to wipe old listeners
  const clone = noBtn.cloneNode(true);
  clone.id = "noBtn"; // keep id stable
  // ensure required classes are present
  clone.className = "btn quizBtn noBtn primary";

  noBtn.parentNode.replaceChild(clone, noBtn);

  clone.addEventListener("click", (e) => {
    e.preventDefault();
    onYes();
  });

  return clone;
}


  function initHomeQuiz() {
    const quizGate = $("quizGate");
    const homeMain = $("homeMain");
    if (!quizGate || !homeMain) return;

    const qText = $("qText");
    const qStep = $("qStep");
    const qTotal = $("qTotal");
    const yesBtn = $("yesBtn");
    let noBtn = $("noBtn");

    // done already -> show main
    if (isDone()) {
      document.body.classList.remove("quiz-mode");
      show(quizGate, false);
      show(homeMain, true);
      lockTabs(false);
      return;
    }

    // show quiz
    document.body.classList.add("quiz-mode");
    show(quizGate, true);
    show(homeMain, false);
    lockTabs(true);

    let idx = 0;
    let noAttempts = 0;

    if (qTotal) qTotal.textContent = String(QUESTIONS.length);

    const onYes = () => {
      yesBtn?.classList.remove("quizYesPop");
      void (yesBtn?.offsetWidth);
      yesBtn?.classList.add("quizYesPop");

      burstHearts();

      idx++;
      if (idx >= QUESTIONS.length) {
        setDone();
        show(quizGate, false);
        show(homeMain, true);
        lockTabs(false);
        document.body.classList.remove("quiz-mode");
        return;
      }
      render();
      
    };

    function resetNoButton() {
  const arena = document.getElementById("quizButtons");
  let btn = document.getElementById("noBtn");
  if (!arena || !btn) return null;

  // Always bring NO back into the quiz button container
  arena.appendChild(btn);

  // Wipe any inline styles from Q1 (fixed position/left/top/etc.)
  btn.removeAttribute("style");

  // Restore default look/text
  btn.textContent = "No 🙃";
  btn.classList.remove("primary");

  // Remove old event listeners by cloning (clean slate)
  const clean = btn.cloneNode(true);
  arena.replaceChild(clean, btn);
  return clean;
}


    function handleNoAttempt(e) {
      e.preventDefault();
      e.stopPropagation();
      noAttempts++;

      // per-question behavior
      if (idx === 0) {
        teleportNoAnywhere(noBtn);
      } else if (idx === 1) {
        makeNoInvisible(noBtn);
      } else if (idx === 2) {
        // turn into YES and let her click it
        const newBtn = turnNoIntoYes(noBtn, onYes);
        if (newBtn) noBtn = newBtn;
      }
    }

    function attachNoBehavior() {
  if (!noBtn) return;

  noBtn.addEventListener("pointerenter", handleNoAttempt);
  noBtn.addEventListener("pointerdown", handleNoAttempt);
  noBtn.addEventListener("click", handleNoAttempt);
  noBtn.addEventListener("touchstart", handleNoAttempt, { passive: false });

  // Only Q1 uses “near finger” teleport
  if (idx === 0) window.addEventListener("pointermove", nearMove, { passive: true });
  else window.removeEventListener("pointermove", nearMove);
}


    function nearMove(ev) {
      if (idx !== 0 || !noBtn) return;
      // if pointer is within ~80px, teleport
      const r = noBtn.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;
      if ((dx*dx + dy*dy) < (80*80)) teleportNoAnywhere(noBtn);
    }

    function render() {
      noBtn = resetNoButton();


      if (qText) qText.textContent = QUESTIONS[idx];
      if (qStep) qStep.textContent = String(idx + 1);
      if (qTotal) qTotal.textContent = String(QUESTIONS.length);

      // Q2 starts normal, becomes invisible on attempt
      // Q3 starts normal, becomes YES on attempt
      attachNoBehavior();

      // YES button always works
      yesBtn?.removeEventListener("click", onYes);
      yesBtn?.addEventListener("click", onYes);
    }

    render();
  }

  function protectMemories() {
    if (page() !== "memories.html") return;
    if (!isDone()) location.replace("./home.html");
  }

  document.addEventListener("DOMContentLoaded", () => {
    protectMemories();
    if (page() === "home.html") initHomeQuiz();
  });
})();
