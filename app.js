/* ==========================================================
   app.js
   - Floral frame (white roses + orchids)
   - MORE hopping bunnies always
   - Canvas hearts
   - Home letter fill
   - Active tab highlight
   - NEW: Big splash "HAPPY VALENTINE'S DAY" on first open
========================================================== */

const PERSONAL = {
  herName: "Kiku",   // change
  myName: "Tirth",        // change

  hookLines: [
    "I made this because I wanted you to smile like an idiot. but ur already one lmao",
    "This website contains: ur daddy 🐇"
  ],

  letterTitle: "Paragraph for Arguments",
  letterBody: [
    "Helloo kiku,",
 
    "Do you know that you're so so cute that i had to make a website for you like do u even know that?",
    "You make my days lighter and heavier. You make moments feel like they have war music idk lmao. And somehow, you do it without trying. hene? hahaha. nvm i hope we make it through this without killing each other",
    "I don’t just like you. I love you. I’m proud of you and everything u do doesnt matter what anyone thinks. And I still get that stupid happy feeling when I think about you like my brain just goes: “yes aa to marij che but retard che”.",
    "Also, small confession:",
    "I would cook and clean for you. (after u do it 100 times) ",
    "kainai jokes apart, i hope u liked it and just to let u know atyar jyar me aa banavu chu and tya tu revenge le che marapar and doing tit for tats. so please stop doing it and work on the relationship.. and i hope kaso moto jhagdo na thayo hoy and also i hope my emotional support never dies and i dont fall out of anything which i dont intend to do so dont think of me as a villan",
    "as im constantly trying to improve the relationship at any cost before ldr ends or else it would be a bigger nightmare irl i hope u get what i mean. ",
    "You’re my favorite decision and my favorite person. Happy Valentines Day <3",
 
    "Now enjoy the flowers and the random hopping rabbits across the screen if u can see them lol.",
 
    "Never yours,",
  ],
};

const $ = (id) => document.getElementById(id);

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ---------- IST Year for "show once per year" ---------- */
function getISTYear() {
  const now = new Date();
  const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
  const ist = new Date(istMs);
  return ist.getUTCFullYear();
}

function hasPreviewQuery() {
  try {
    return new URLSearchParams(location.search).has("preview");
  } catch {
    return false;
  }
}

/* ---------- Splash logic ---------- */
function showSplashIfNeeded() {
  const splash = $("splash");
  if (!splash) return;

  const page = (location.pathname || "").split("/").pop() || "home.html";
  if (page !== "home.html") return;

  const year = getISTYear();
  const key = `val_splash_shown_${year}`;
  const isPreview = hasPreviewQuery();

  // Preview: always show
  // Normal unlocked: show once per IST year
  const shouldShow = isPreview || !localStorage.getItem(key);
  if (!shouldShow) return;

  // mark as shown (unless preview)
  if (!isPreview) localStorage.setItem(key, "1");

  splash.classList.add("show");
  splash.setAttribute("aria-hidden", "false");

  // BIG center hearts while screaming
  burstCenterHearts(160);
  setTimeout(() => burstCenterHearts(120), 360);

  // Auto-hide after ~2 seconds
  setTimeout(() => {
    splash.classList.remove("show");
    splash.setAttribute("aria-hidden", "true");
    setTimeout(() => splash.remove(), 450);
  }, 2100);
}

/* ---------- Floral SVGs ---------- */
function roseSVG(){
  return `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="r" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(52 48) rotate(65) scale(70)">
        <stop stop-color="#ffffff"/>
        <stop offset="1" stop-color="#e9e9f2"/>
      </radialGradient>
    </defs>
    <path d="M60 18c10 0 18 8 18 18 0 6-3 11-8 14 8 1 14 8 14 16 0 10-8 18-18 18-3 0-6-1-8-2 1 3 2 6 2 9 0 10-8 18-18 18s-18-8-18-18c0-8 5-15 13-17-7-2-12-8-12-16 0-10 8-18 18-18 2 0 4 0 6 1-3-3-5-7-5-12 0-10 8-18 18-18Z" fill="url(#r)" opacity="0.96"/>
    <path d="M60 25c7 0 13 6 13 13 0 6-4 11-10 12 8 1 14 7 14 15 0 9-7 16-16 16-4 0-8-2-11-4 2 4 3 8 3 12 0 9-7 16-16 16s-16-7-16-16c0-8 5-14 12-15-7-2-12-8-12-15 0-9 7-16 16-16 3 0 6 1 8 2-2-2-4-6-4-10 0-7 6-13 13-13Z" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <path d="M46 63c4-7 20-7 24 0" stroke="rgba(255,143,185,.45)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="4" fill="rgba(255,143,185,.50)"/>
  </svg>`;
}

function orchidSVG(){
  return `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="o" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 54) rotate(70) scale(70)">
        <stop stop-color="#ffffff"/>
        <stop offset="1" stop-color="#eef0ff"/>
      </radialGradient>
    </defs>
    <path d="M60 22c10 0 18 10 18 22 0 8-4 15-10 18 9 1 18 8 18 18 0 12-10 22-26 22-9 0-16-4-20-10-4 6-11 10-20 10-16 0-26-10-26-22 0-10 9-17 18-18-6-3-10-10-10-18 0-12 8-22 18-22 8 0 15 6 20 15 5-9 12-15 20-15Z" fill="url(#o)" opacity="0.95"/>
    <path d="M60 32c7 0 12 8 12 16 0 7-4 12-10 13 9 1 16 6 16 14 0 9-8 16-20 16-9 0-15-4-18-10-3 6-9 10-18 10-12 0-20-7-20-16 0-8 7-13 16-14-6-1-10-6-10-13 0-8 5-16 12-16 7 0 13 6 20 16 7-10 13-16 20-16Z" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <path d="M60 56c-6 0-12 4-12 10 0 6 6 10 12 10s12-4 12-10c0-6-6-10-12-10Z" fill="rgba(255,143,185,.35)"/>
    <circle cx="60" cy="66" r="4.5" fill="rgba(255,143,185,.55)"/>
  </svg>`;
}

function mountFloralFrame(){
  if (document.querySelector(".floral-frame")) return;
  const frame = document.createElement("div");
  frame.className = "floral-frame";
  frame.innerHTML = `
    <div class="flower rose f1">${roseSVG()}</div>
    <div class="flower orchid f2">${orchidSVG()}</div>
    <div class="flower orchid f3">${orchidSVG()}</div>
    <div class="flower rose f4">${roseSVG()}</div>
  `;
  document.body.appendChild(frame);
}

/* ---------- Tabs: active highlight ---------- */
function markActiveTab(){
  const page = (location.pathname || "").split("/").pop() || "home.html";
  const homeTab = document.querySelector('[data-tab="home"]');
  const memTab = document.querySelector('[data-tab="memories"]');
  if (homeTab) homeTab.classList.toggle("active", page === "home.html");
  if (memTab) memTab.classList.toggle("active", page === "memories.html");
}

/* ---------- Home letter fill ---------- */
function fillHomeContent(){
  const her = document.querySelectorAll("[data-her]");
  her.forEach(el => el.textContent = PERSONAL.herName);

  const hook = $("hookLine");
  if (hook) {
    const lines = PERSONAL.hookLines || [];
    hook.textContent = lines.length ? lines[Math.floor(Math.random()*lines.length)] : "";
  }

  const letterTitle = $("letterTitle");
  const letterBody = $("letterBody");
  const letterSig = $("letterSig");

  if (letterTitle) letterTitle.textContent = PERSONAL.letterTitle;

  if (letterBody) {
    const html = (PERSONAL.letterBody || []).map(line => {
      if (line === "") return "<br/>";
      return escapeHtml(line);
    }).join("<br/>");
    letterBody.innerHTML = html;
  }

  if (letterSig) letterSig.textContent = `— ${PERSONAL.myName}`;
}

/* ---------- Bunnies (more frequent, always on) ---------- */
function bunnySVG(){
  return `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 45) rotate(70) scale(80)">
        <stop stop-color="#fff"/>
        <stop offset="1" stop-color="#e9e9f2"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="70" rx="30" ry="24" fill="url(#b)" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <ellipse cx="45" cy="40" rx="10" ry="26" fill="url(#b)" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <ellipse cx="75" cy="40" rx="10" ry="26" fill="url(#b)" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <circle cx="50" cy="67" r="4" fill="rgba(0,0,0,.65)"/>
    <circle cx="70" cy="67" r="4" fill="rgba(0,0,0,.65)"/>
    <path d="M60 72c-4 0-6 3-6 6 0 3 3 6 6 6s6-3 6-6c0-3-2-6-6-6Z" fill="rgba(255,143,185,.65)"/>
  </svg>`;
}

function spawnBunny(){
  const b = document.createElement("div");
  b.style.opacity = (0.28 + Math.random() * 0.22).toFixed(2);

  b.className = "bunny";
  const dir = Math.random() < 0.5 ? "hopRight" : "hopLeft";
  b.classList.add(dir);

  const top = Math.random() * 78 + 6;
  b.style.top = `${top}vh`;

  const duration = 3.2 + Math.random() * 3.0;
  b.style.animationDuration = `${duration}s`;

  const scale = 0.65 + Math.random() * 0.65;
  b.style.width = `${74 * scale}px`;
  b.style.height = `${74 * scale}px`;

  b.innerHTML = bunnySVG();
  document.body.appendChild(b);
  setTimeout(() => b.remove(), (duration + 0.2) * 1000);
}

function startBunnies(){
  setInterval(() => {
    if (document.hidden) return;
    spawnBunny();
    if (Math.random() < 0.65) setTimeout(spawnBunny, 160);
  }, 520);

  setTimeout(() => { spawnBunny(); spawnBunny(); }, 650);
}

/* ---------- Canvas hearts ---------- */
const canvas = document.getElementById("fx");
const c = canvas ? canvas.getContext("2d") : null;
let W=0, H=0;
const particles = [];
const dpr = () => Math.max(1, window.devicePixelRatio || 1);

function resize(){
  if (!canvas || !c) return;
  W = canvas.width = Math.floor(window.innerWidth * dpr());
  H = canvas.height = Math.floor(window.innerHeight * dpr());
}
window.addEventListener("resize", resize);
resize();

function rand(min,max){ return Math.random()*(max-min)+min; }
function addHeart(x,y,vx,vy,size,life){
  particles.push({ x,y,vx,vy,size, life, maxLife:life, rot:rand(-1,1), vr:rand(-0.03,0.03), hue:rand(330,380) });
}

function drawHeart(x,y,s,rot,hue,alpha){
  if (!c) return;
  const h = (hue%360+360)%360;
  c.save();
  c.translate(x,y);
  c.rotate(rot);
  c.globalAlpha = alpha;
  const grad = c.createLinearGradient(-s,-s,s,s);
  grad.addColorStop(0, `hsla(${h},95%,70%,${alpha})`);
  grad.addColorStop(1, `hsla(${(h+40)%360},95%,65%,${alpha})`);
  c.fillStyle = grad;
  const ss = s*0.9;
  c.beginPath();
  c.moveTo(0, ss*0.35);
  c.bezierCurveTo(ss*0.55, -ss*0.20, ss*0.95, ss*0.25, 0, ss*0.95);
  c.bezierCurveTo(-ss*0.95, ss*0.25, -ss*0.55, -ss*0.20, 0, ss*0.35);
  c.closePath();
  c.fill();
  c.restore();
}

function burstCenterHearts(n){
  if (!c) return;
  const cx = W*0.5;
  const cy = H*0.34;
  for (let i=0;i<n;i++){
    const a = rand(0, Math.PI*2);
    const sp = rand(0.4,2.4)*dpr();
    addHeart(
      cx + rand(-26,26)*dpr(),
      cy + rand(-26,26)*dpr(),
      Math.cos(a)*sp,
      Math.sin(a)*sp - rand(0.3,1.6)*dpr(),
      rand(12,22)*dpr(),
      rand(90,160)
    );
  }
}

function tick(){
  if (!c) return;
  c.clearRect(0,0,W,H);

  c.save();
  c.globalAlpha = 0.22;
  const v = c.createRadialGradient(W*0.5,H*0.5,10, W*0.5,H*0.5, Math.max(W,H)*0.6);
  v.addColorStop(0,"rgba(0,0,0,0)");
  v.addColorStop(1,"rgba(0,0,0,0.55)");
  c.fillStyle = v;
  c.fillRect(0,0,W,H);
  c.restore();

  for (let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life -= 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.012*dpr();
    p.rot += p.vr;

    const a = Math.max(0, p.life/p.maxLife);
    drawHeart(p.x,p.y,p.size,p.rot,p.hue, Math.min(1,a));

    if (p.life<=0 || p.y > H + 80*dpr()) particles.splice(i,1);
  }

  requestAnimationFrame(tick);
}
tick();

// click = hearts
window.addEventListener("pointerdown", (e) => {
  if (!c) return;
  const x = e.clientX * dpr();
  const y = e.clientY * dpr();
  for (let i=0;i<12;i++){
    addHeart(
      x+rand(-10,10)*dpr(),
      y+rand(-10,10)*dpr(),
      rand(-1.2,1.2)*dpr(),
      rand(-2.3,-0.6)*dpr(),
      rand(10,18)*dpr(),
      rand(80,140)
    );
  }
});

// ambient hearts
setInterval(() => {
  if (!c || document.hidden) return;
  const x = rand(W*0.2, W*0.8);
  const y = H + 30*dpr();
  addHeart(x,y, rand(-0.2,0.2)*dpr(), rand(-1.7,-0.8)*dpr(), rand(10,18)*dpr(), rand(110,200));
}, 300);

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  mountFloralFrame();
  markActiveTab();
  fillHomeContent();
  startBunnies();

  // show BIG splash first (then page is visible underneath)
  showSplashIfNeeded();
});
