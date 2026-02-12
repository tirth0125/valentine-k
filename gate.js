/* ==========================================================
   gate.js — Lock until Feb 14 00:00 IST (UTC+05:30)
   FIX: prevents redirect loop by persisting "unlocked" flag
========================================================== */

const GATE = {
  PREVIEW_MODE: true,
  PREVIEW_SECRET: "iloveher",
  TEST_TARGET_UTC_MS: null,
};

// Feb 14 00:00 IST = Feb 13 18:30 UTC
function targetUTCForISTYear(yearIST) {
  return new Date(Date.UTC(yearIST, 1, 13, 18, 30, 0));
}

function getISTYearNow() {
  const now = new Date();
  const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
  const ist = new Date(istMs);
  return ist.getUTCFullYear();
}

function getTargetUTC() {
  if (typeof GATE.TEST_TARGET_UTC_MS === "number") return new Date(GATE.TEST_TARGET_UTC_MS);
  return targetUTCForISTYear(getISTYearNow());
}

function hasPreviewAccess() {
  if (GATE.PREVIEW_MODE) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("preview") === GATE.PREVIEW_SECRET;
  } catch {
    return false;
  }
}

function unlockedKey() {
  // lock is yearly (IST year), so Feb 14 unlock stays unlocked for that year
  return `val_unlocked_${getISTYearNow()}`;
}

function isUnlockedFlagSet() {
  try {
    return localStorage.getItem(unlockedKey()) === "1";
  } catch {
    return false;
  }
}

function setUnlockedFlag() {
  try {
    localStorage.setItem(unlockedKey(), "1");
  } catch {}
}

function isUnlockedNow() {
  if (hasPreviewAccess()) return true;
  if (isUnlockedFlagSet()) return true;
  return Date.now() >= getTargetUTC().getTime();
}

function pad2(n) { return String(n).padStart(2, "0"); }

function diffParts(ms) {
  const total = Math.max(0, ms);
  const sec = Math.floor(total / 1000);
  const s = sec % 60;
  const min = Math.floor(sec / 60);
  const m = min % 60;
  const hr = Math.floor(min / 60);
  const h = hr % 24;
  const d = Math.floor(hr / 24);
  return { d, h, m, s };
}

function formatIST(now) {
  const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
  const ist = new Date(istMs);
  const y = ist.getUTCFullYear();
  const mo = pad2(ist.getUTCMonth() + 1);
  const d = pad2(ist.getUTCDate());
  const h = pad2(ist.getUTCHours());
  const m = pad2(ist.getUTCMinutes());
  const s = pad2(ist.getUTCSeconds());
  return `${y}-${mo}-${d} ${h}:${m}:${s} IST`;
}

(function bootGate() {
  const unlocked = isUnlockedNow();
  const page = (location.pathname || "").split("/").pop() || "index.html";
  const isIndex = page === "" || page === "index.html";

  // If user tries to open home/memories early -> redirect to index
  if (!isIndex && !unlocked) {
    const next = encodeURIComponent(page + location.search + location.hash);
    sessionStorage.setItem("gate_next", next);
    location.replace(`./index.html?next=${next}`);
    return;
  }

  // If unlocked by time, persist it so home/memories never bounce back
  if (unlocked && !hasPreviewAccess()) setUnlockedFlag();

  // Index countdown UI
  if (isIndex) {
    const dd = document.getElementById("dd");
    const hh = document.getElementById("hh");
    const mm = document.getElementById("mm");
    const ss = document.getElementById("ss");
    const lockMsg = document.getElementById("lockMsg");
    const istStamp = document.getElementById("istStamp");
    const enterBtn = document.getElementById("enterBtn");

    const params = new URLSearchParams(location.search);
    const nextParam = params.get("next");
    const storedNext = sessionStorage.getItem("gate_next");
    const next = nextParam || storedNext || encodeURIComponent("home.html");

    const goNext = () => {
      const raw = decodeURIComponent(next);
      const preview = params.get("preview");
      if (preview && !raw.includes("preview=")) {
        const joiner = raw.includes("?") ? "&" : "?";
        location.href = `./${raw}${joiner}preview=${encodeURIComponent(preview)}`;
      } else {
        location.href = `./${raw.replace(/^\.\//, "")}`;
      }
    };

    const tick = () => {
      if (istStamp) istStamp.textContent = `IST time: ${formatIST(new Date())}`;

      if (isUnlockedNow()) {
        // persist unlock immediately when it hits
        if (!hasPreviewAccess()) setUnlockedFlag();

        if (dd) dd.textContent = "00";
        if (hh) hh.textContent = "00";
        if (mm) mm.textContent = "00";
        if (ss) ss.textContent = "00";
        if (lockMsg) lockMsg.textContent = "💖 It’s time. Opening…";
        if (enterBtn) {
          enterBtn.disabled = false;
          enterBtn.classList.add("primary");
          enterBtn.textContent = "Enter 💘";
        }
        clearInterval(timer);
        setTimeout(goNext, 350);
        return;
      }

      const msLeft = getTargetUTC().getTime() - Date.now();
      const p = diffParts(msLeft);

      if (dd) dd.textContent = pad2(p.d);
      if (hh) hh.textContent = pad2(p.h);
      if (mm) mm.textContent = pad2(p.m);
      if (ss) ss.textContent = pad2(p.s);

      if (enterBtn) {
        enterBtn.disabled = true;
        enterBtn.classList.remove("primary");
        enterBtn.textContent = "Locked 🔒";
      }
    };

    const timer = setInterval(tick, 250); // faster checks so it flips instantly
    tick();

    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        if (isUnlockedNow()) goNext();
      });
    }
  }
})();

