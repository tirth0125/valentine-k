/* ==========================================================
   gate.js — Lock until Feb 14 00:00 IST + REVEAL splash routing
   - Locked pages redirect to index
   - First unlocked open (or preview) goes to reveal.html then to target
========================================================== */

const GATE = {
  PREVIEW_MODE: false,
  PREVIEW_SECRET: "iloveher",
};

// Feb 14 00:00 IST = Feb 13 18:30 UTC
function getValentineTargetUTC(nowUtcMs) {
  const now = new Date(nowUtcMs);
  const year = now.getUTCFullYear();

  const targetThisYear = new Date(Date.UTC(year, 1, 13, 18, 30, 0));
  if (now < targetThisYear) return targetThisYear;
  return new Date(Date.UTC(year + 1, 1, 13, 18, 30, 0));
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

function isUnlockedNow() {
  if (hasPreviewAccess()) return true;
  const target = getValentineTargetUTC(Date.now());
  return Date.now() >= target.getTime();
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

function getISTYear() {
  const now = new Date();
  const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
  const ist = new Date(istMs);
  return ist.getUTCFullYear();
}

function stripPreviewFromCurrent() {
  const page = (location.pathname || "").split("/").pop() || "home.html";
  const params = new URLSearchParams(location.search);
  params.delete("preview");
  const qs = params.toString();
  return page + (qs ? "?" + qs : "") + (location.hash || "");
}

function needsRevealNow() {
  const year = getISTYear();
  const preview = hasPreviewAccess();

  try {
    if (preview) {
      const k = `val_preview_reveal_${year}`;
      return !sessionStorage.getItem(k);
    } else {
      const k = `val_reveal_${year}`;
      return !localStorage.getItem(k);
    }
  } catch {
    return true;
  }
}

(function bootGate() {
  const unlocked = isUnlockedNow();

  const page = (location.pathname || "").split("/").pop() || "index.html";
  const isIndex = page === "" || page === "index.html";
  const isReveal = page === "reveal.html";

  // If NOT index/reveal and locked -> redirect to index
  if (!isIndex && !isReveal && !unlocked) {
    const next = encodeURIComponent(page + location.search + location.hash);
    sessionStorage.setItem("gate_next", next);
    location.replace(`./index.html?next=${next}`);
    return;
  }

  // If unlocked and not index and not reveal: force reveal once (or per preview session)
  if (!isIndex && !isReveal && unlocked && needsRevealNow()) {
    const params = new URLSearchParams(location.search);
    const previewVal = params.get("preview"); // keep it if present
    const to = encodeURIComponent(stripPreviewFromCurrent());
    const q = new URLSearchParams();
    q.set("to", to);
    if (previewVal) q.set("preview", previewVal);
    location.replace(`./reveal.html?${q.toString()}`);
    return;
  }

  // Index countdown UI
  if (isIndex) {
    const dd = document.getElementById("dd");
    const hh = document.getElementById("hh");
    const mm = document.getElementById("mm");
    const ss = document.getElementById("ss");
    const lockMsg = document.getElementById("lockMsg");
    const istStamp = document.getElementById("istStamp");
    const enterBtn = document.getElementById("enterBtn");

    const targetUTC = getValentineTargetUTC(Date.now());

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
        setTimeout(goNext, 650);
        return;
      }

      const msLeft = targetUTC.getTime() - Date.now();
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

    const timer = setInterval(tick, 1000);
    tick();

    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        if (isUnlockedNow()) goNext();
      });
    }
  }
})();

