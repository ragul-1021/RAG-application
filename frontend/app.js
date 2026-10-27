/* ════════════════════════════════════════════════
   RAG Assistant – app.js
   ════════════════════════════════════════════════ */

const API_URL = "/api/query";

const form        = document.getElementById("query-form");
const input       = document.getElementById("query-input");
const clearBtn    = document.getElementById("clear-btn");
const askBtn      = document.getElementById("ask-btn");
const topKSelect  = document.getElementById("top-k-select");
const resultsArea = document.getElementById("results-area");
const chips       = document.querySelectorAll(".chip");

// ── Suggestion chips ─────────────────────────────
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.q;
    input.dispatchEvent(new Event("input"));
    input.focus();
  });
});

// ── Clear button visibility ──────────────────────
input.addEventListener("input", () => {
  clearBtn.style.display = input.value ? "flex" : "none";
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  clearBtn.style.display = "none";
  input.focus();
});

// ── Form submit ──────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  await runQuery(query, parseInt(topKSelect.value, 10));
});

// ── Main query function ──────────────────────────
async function runQuery(query, topK) {
  setLoading(true);

  // Remove previous error cards (keep answers for history)
  document.querySelectorAll(".error-card").forEach((el) => el.remove());

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: topK }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    renderResult(data);
  } catch (err) {
    renderError(err.message || "An unexpected error occurred.");
  } finally {
    setLoading(false);
  }
}

// ── Render answer card ───────────────────────────
function renderResult(data) {
  const template = document.getElementById("result-template");
  const card = template.content.cloneNode(true).querySelector(".result-card");

  // Query label
  card.querySelector(".result-query-label").textContent = `"${data.query}"`;

  // Elapsed time
  const elapsedEl = card.querySelector(".result-elapsed");
  elapsedEl.textContent = `${data.elapsed}s`;

  // Answer text (typewriter effect)
  const answerEl = card.querySelector(".result-answer");
  typewrite(answerEl, data.answer || "No answer returned.");

  // Sources
  const sourcesList = card.querySelector(".sources-list");
  const sourcesCount = card.querySelector(".sources-count");
  const sources = data.sources || [];

  sourcesCount.textContent = `${sources.length} source chunk${sources.length !== 1 ? "s" : ""} retrieved`;

  sources.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "source-item";
    const score = (1 / (1 + src.distance)).toFixed(3); // convert L2 distance → similarity-ish
    item.innerHTML = `
      <div class="source-top">
        <span class="source-num">Source ${i + 1}</span>
        <span class="source-score">Relevance ~${score}</span>
      </div>
      <p class="source-text">${escHtml(src.text)}</p>
    `;
    sourcesList.appendChild(item);
  });

  // Prepend newest first
  resultsArea.insertBefore(card, resultsArea.firstChild);

  // Scroll into view
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Render error ─────────────────────────────────
function renderError(message) {
  const div = document.createElement("div");
  div.className = "error-card";
  div.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>${escHtml(message)}</span>
  `;
  resultsArea.insertBefore(div, resultsArea.firstChild);
}

// ── Typewriter helper ────────────────────────────
function typewrite(el, text, speed = 12) {
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    }
  };
  tick();
}

// ── Loading state ────────────────────────────────
function setLoading(on) {
  askBtn.disabled = on;
  if (on) {
    askBtn.classList.add("loading");
  } else {
    askBtn.classList.remove("loading");
  }
}

// ── Escape HTML ──────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
