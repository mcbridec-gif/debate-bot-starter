// Example skeleton; replace prompts.json-driven content as you populate it.
const SECTIONS = [
  { name: "Affirmative Opening", minutes: 5, side: "affirmative", type: "opening" },
  { name: "Negative Opening", minutes: 5, side: "negative", type: "opening" },
  { name: "Crossfire", minutes: 3, type: "crossfire" },
  { name: "Affirmative Rebuttal", minutes: 4, side: "affirmative", type: "rebuttal" },
  { name: "Negative Rebuttal", minutes: 4, side: "negative", type: "rebuttal" },
  { name: "Moderator Questions", minutes: 3, type: "moderator" },
  { name: "Affirmative Closing", minutes: 3, side: "affirmative", type: "closing" },
  { name: "Negative Closing", minutes: 3, side: "negative", type: "closing" },
];

const PROMPTS = {
  opening: "Deliver a clear opening: state your thesis, outline your main points, and connect to the resolution.",
  crossfire: "Ask concise, targeted questions; seek clear answers and challenge assumptions.",
  rebuttal: "Address major arguments from opponent with logic, evidence, and examples.",
  moderator: "Answer moderator's question with clarity and civility.",
  closing: "Summarize your case, reinforce impact, and end with a strong closing line."
};

let currentIndex = -1;
let timer = null;
let secondsLeft = 0;
let currentSide = "affirmative";

const sideSelect = document.getElementById("side");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const switchBtn = document.getElementById("switchBtn");
const segmentNameEl = document.getElementById("segmentName");
const timeLeftEl = document.getElementById("timeLeft");
const progressEl = document.getElementById("progress");
const contentTextEl = document.getElementById("contentText");
const rubricListEl = document.getElementById("rubricList");
const logEl = document.getElementById("log");

function formatMMSS(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateRubric() {
  const categories = [
    "Likeness to Reagan",
    "Organization and Clarity",
    "Knowledge of the Topic",
    "Persuasiveness",
    "Rebuttals",
    "Conduct and Civility"
  ];
  rubricListEl.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = `${cat}: Excellent (5) / Good (4) / Fair (3) / Poor (2)`;
    rubricListEl.appendChild(li);
  });
}

function setSegment(index) {
  const seg = SECTIONS[index];
  if (!seg) return;
  segmentNameEl.textContent = seg.name;
  const mins = seg.minutes || 2;
  secondsLeft = mins * 60;
  timeLeftEl.textContent = formatMMSS(secondsLeft);
  const prompt = PROMPTS[seg.type] || "";
  contentTextEl.textContent = prompt;
  log(`Starting: ${seg.name} (${seg.side || "both"})`);
}

function log(message) {
  const t = new Date().toLocaleTimeString();
  logEl.textContent += `[${t}] ${message}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function updateProgress() {
  const total = (SECTIONS[currentIndex].minutes || 2) * 60;
  const pct = Math.max(0, Math.min(100, ((total - secondsLeft) / total) * 100));
  progressEl.style.width = `${pct}%`;
}

function tick() {
  secondsLeft--;
  timeLeftEl.textContent = formatMMSS(secondsLeft);
  updateProgress();
  if (secondsLeft <= 0) {
    clearInterval(timer);
    timer = null;
    currentIndex++;
    if (currentIndex < SECTIONS.length) {
      setSegment(currentIndex);
      startTimer();
    } else {
      segmentNameEl.textContent = "Session complete";
      contentTextEl.textContent = "Debate practice complete. Great job!";
      timeLeftEl.textContent = "00:00";
    }
  }
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 1000);
  startBtn.disabled = true;
  sideSelect.disabled = true;
}

function resetSession() {
  if (timer) clearInterval(timer);
  timer = null;
  currentIndex = -1;
  secondsLeft = 0;
  segmentNameEl.textContent = "Waiting to start...";
  timeLeftEl.textContent = "00:00";
  progressEl.style.width = "0%";
  contentTextEl.textContent = "";
  startBtn.disabled = false;
  sideSelect.disabled = false;
  logEl.textContent = "";
}

startBtn.addEventListener("click", () => {
  currentIndex = 0;
  currentSide = sideSelect.value;
  setSegment(currentIndex);
  log(`Session started. Side: ${currentSide}`);
  startTimer();
});

resetBtn.addEventListener("click", () => {
  resetSession();
});

switchBtn.addEventListener("click", () => {
  currentSide = currentSide === "affirmative" ? "negative" : "affirmative";
  sideSelect.value = currentSide;
  log(`Switched side to: ${currentSide}`);
});

sideSelect.addEventListener("change", () => {
  currentSide = sideSelect.value;
  log(`Side set to: ${currentSide}`);
});

function init() {
  updateRubric();
  segmentNameEl.textContent = "Ready. Click Start to begin.";
  contentTextEl.textContent = "This session follows the exact sequence. Bot acts as opposing side.";
}

init();
