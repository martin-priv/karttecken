/**
 * Vanliga Karttecken - Huvudlogik
 */

// Ljudsyntes via Web Audio API (inga externa ljudfiler behövs)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const start = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start + idx * 0.1);
        gain.gain.setValueAtTime(0.2, start + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.1 + 0.3);
        osc.start(start + idx * 0.1);
        osc.stop(start + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }
}

// Stränghantering och fuzzy string matching (Levenshtein)
function normalizeText(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[()\/,.\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripSwedishDiacritics(s) {
  return (s || "")
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o");
}

function calcLevenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function checkAnswerFuzzy(userInput, targetSymbol) {
  const normInput = normalizeText(userInput);
  if (!normInput) {
    return { isCorrect: false, score: 0, matchedAlias: "", isTypo: false };
  }

  const candidates = [
    targetSymbol.name,
    targetSymbol.shortName,
    ...(targetSymbol.aliases || [])
  ];

  let bestCandidate = targetSymbol.name;
  let minDistance = 999;
  let maxSimilarity = 0;

  for (const rawCandidate of candidates) {
    const normCand = normalizeText(rawCandidate);
    if (!normCand) continue;

    // Direkt exakt träff
    if (normInput === normCand) {
      return { isCorrect: true, score: 1.0, matchedAlias: rawCandidate, isTypo: false, distance: 0 };
    }

    // Träff utan å, ä, ö (t.ex. "hojdkurvor" vs "höjdkurvor")
    if (stripSwedishDiacritics(normInput) === stripSwedishDiacritics(normCand)) {
      return { isCorrect: true, score: 0.95, matchedAlias: rawCandidate, isTypo: true, distance: 1 };
    }

    const dist1 = calcLevenshtein(normInput, normCand);
    const dist2 = calcLevenshtein(stripSwedishDiacritics(normInput), stripSwedishDiacritics(normCand));
    const dist = Math.min(dist1, dist2);

    const maxLen = Math.max(normInput.length, normCand.length);
    const sim = maxLen > 0 ? (1 - dist / maxLen) : 0;

    if (dist < minDistance || sim > maxSimilarity) {
      minDistance = dist;
      maxSimilarity = sim;
      bestCandidate = rawCandidate;
    }
  }

  // Toleransregler baserat på ordlängd:
  // <= 4 bokstäver: max 1 fel (t.ex. "sten", "väg", "stup") om sim >= 0.70
  // 5-8 bokstäver: max 2 fel (t.ex. "byggnad", "vatten") om sim >= 0.70
  // > 8 bokstäver: max 3 fel (t.ex. "kraftledning", "höjdkurvor") om sim >= 0.70
  let allowedEdits = 1;
  if (normInput.length > 8) allowedEdits = 3;
  else if (normInput.length >= 5) allowedEdits = 2;

  if (minDistance <= allowedEdits && maxSimilarity >= 0.70) {
    return {
      isCorrect: true,
      score: maxSimilarity,
      matchedAlias: bestCandidate,
      isTypo: true,
      distance: minDistance
    };
  }

  return {
    isCorrect: false,
    score: maxSimilarity,
    matchedAlias: bestCandidate,
    isTypo: false,
    distance: minDistance
  };
}

// Applikationsklass
class KartteckenApp {
  constructor() {
    this.sfx = new SoundFX();
    this.currentCategory = "alla";
    this.currentMode = "1x2"; // '1x2' | 'free'
    this.queue = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.isAnswered = false;
    this.mistakes = [];
    this.currentOptions = []; // För 1 X 2

    this.cacheElements();
    this.bindEvents();
    this.startRound();
  }

  cacheElements() {
    this.elMode1x2 = document.getElementById("mode-1x2");
    this.elModeFree = document.getElementById("mode-free");
    this.elSoundToggle = document.getElementById("sound-toggle");
    this.elSoundIcon = document.getElementById("sound-icon");

    this.elQuizView = document.getElementById("quiz-view");
    this.elResultView = document.getElementById("result-view");
    this.elLibraryView = document.getElementById("library-view");

    this.elProgressText = document.getElementById("progress-text");
    this.elProgressBar = document.getElementById("progress-bar");
    this.elScoreText = document.getElementById("score-text");
    this.elStreakBadge = document.getElementById("streak-badge");

    this.elSymbolImage = document.getElementById("symbol-image");
    this.elCategoryBadge = document.getElementById("current-category-badge");

    this.elOptionsContainer = document.getElementById("options-container");
    this.elFreeInputContainer = document.getElementById("free-input-container");
    this.elFreeInput = document.getElementById("free-input");
    this.elFreeSubmitBtn = document.getElementById("free-submit-btn");

    this.elFeedbackBox = document.getElementById("feedback-box");
    this.elFeedbackTitle = document.getElementById("feedback-title");
    this.elFeedbackDesc = document.getElementById("feedback-desc");
    this.elNextBtn = document.getElementById("next-btn");

    this.elOpenLibraryBtn = document.getElementById("open-library-btn");
    this.elCloseLibraryBtn = document.getElementById("close-library-btn");
    this.elLibraryGrid = document.getElementById("library-grid");
  }

  bindEvents() {
    this.elMode1x2.addEventListener("click", () => this.setMode("1x2"));
    this.elModeFree.addEventListener("click", () => this.setMode("free"));

    this.elSoundToggle.addEventListener("click", () => {
      this.sfx.enabled = !this.sfx.enabled;
      this.elSoundIcon.textContent = this.sfx.enabled ? "🔊" : "🔇";
      this.elSoundToggle.setAttribute("aria-label", this.sfx.enabled ? "Ljud på" : "Ljud av");
    });

    this.elFreeSubmitBtn.addEventListener("click", () => this.handleFreeSubmit());
    this.elFreeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!this.isAnswered) {
          this.handleFreeSubmit();
        } else {
          this.nextQuestion();
        }
      }
    });

    this.elNextBtn.addEventListener("click", () => this.nextQuestion());

    // Tangentbordsstyrning
    window.addEventListener("keydown", (e) => {
      if (this.elLibraryView.classList.contains("active")) return;
      if (this.elResultView.classList.contains("active")) return;

      if (e.key === " " || (e.key === "Enter" && this.currentMode === "1x2")) {
        if (this.isAnswered) {
          e.preventDefault();
          this.nextQuestion();
          return;
        }
      }

      if (this.currentMode === "1x2" && !this.isAnswered) {
        const key = e.key.toUpperCase();
        if (key === "1") this.selectOption(0);
        else if (key === "X") this.selectOption(1);
        else if (key === "2") this.selectOption(2);
      }
    });

    this.elOpenLibraryBtn.addEventListener("click", () => this.openLibrary());
    this.elCloseLibraryBtn.addEventListener("click", () => this.closeLibrary());

    document.getElementById("restart-btn").addEventListener("click", () => this.startRound());
    document.getElementById("retry-mistakes-btn").addEventListener("click", () => this.startMistakesRound());
  }

  setMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.elMode1x2.classList.toggle("active", mode === "1x2");
    this.elModeFree.classList.toggle("active", mode === "free");
    this.renderCurrentQuestion();
  }

  startRound(symbolsPool = null) {
    const pool = (symbolsPool && symbolsPool.length > 0) ? symbolsPool : [...SYMBOLS];

    // Blanda frågorna
    this.queue = this.shuffleArray([...pool]);
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.mistakes = [];
    this.isAnswered = false;

    this.elQuizView.classList.add("active");
    this.elResultView.classList.remove("active");
    this.elLibraryView.classList.remove("active");

    this.renderCurrentQuestion();
  }

  startMistakesRound() {
    if (this.mistakes.length === 0) return;
    const pool = SYMBOLS.filter((s) => this.mistakes.includes(s.id));
    this.startRound(pool);
  }

  getCurrentSymbol() {
    return this.queue[this.currentIndex];
  }

  renderCurrentQuestion() {
    const symbol = this.getCurrentSymbol();
    if (!symbol) {
      this.showResults();
      return;
    }

    this.isAnswered = false;
    this.elFeedbackBox.classList.remove("show", "correct", "wrong");
    this.elNextBtn.style.display = "none";

    // Progress och Stats
    const total = this.queue.length;
    const currentNum = this.currentIndex + 1;
    this.elProgressText.textContent = `Tecken ${currentNum} av ${total}`;
    const pct = ((currentNum - 1) / total) * 100;
    this.elProgressBar.style.width = `${pct}%`;
    this.elScoreText.textContent = `Poäng: ${this.score}`;

    if (this.streak >= 2) {
      this.elStreakBadge.textContent = `🔥 ${this.streak} i rad!`;
      this.elStreakBadge.style.display = "inline-flex";
    } else {
      this.elStreakBadge.style.display = "none";
    }

    // Kategori-badge
    this.elCategoryBadge.textContent = symbol.categoryLabel;
    this.elCategoryBadge.className = `category-tag tag-${symbol.category}`;

    // Bild
    this.elSymbolImage.src = symbol.image;
    this.elSymbolImage.alt = "Karttecken att gissa";

    // Lägesberoende UI
    if (this.currentMode === "1x2") {
      this.elOptionsContainer.style.display = "grid";
      this.elFreeInputContainer.style.display = "none";
      this.render1x2Options(symbol);
    } else {
      this.elOptionsContainer.style.display = "none";
      this.elFreeInputContainer.style.display = "flex";
      this.elFreeInput.value = "";
      this.elFreeInput.disabled = false;
      this.elFreeSubmitBtn.disabled = false;
      setTimeout(() => this.elFreeInput.focus(), 50);
    }
  }

  render1x2Options(symbol) {
    this.elOptionsContainer.innerHTML = "";

    // Välj 2 smarta distraktorer
    const distractors = this.pickDistractors(symbol, 2);
    const options = [
      { text: symbol.name, isCorrect: true },
      { text: distractors[0], isCorrect: false },
      { text: distractors[1], isCorrect: false }
    ];

    this.currentOptions = this.shuffleArray(options);
    const slotLabels = ["1", "X", "2"];

    this.currentOptions.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="slot-badge">${slotLabels[idx]}</span>
        <span class="option-text">${opt.text}</span>
      `;
      btn.addEventListener("click", () => this.selectOption(idx));
      this.elOptionsContainer.appendChild(btn);
    });
  }

  pickDistractors(targetSymbol, count) {
    const list = [];

    // 1. Prioritera symbolens egna definierade distraktorer
    if (targetSymbol.distractors && targetSymbol.distractors.length > 0) {
      const shuffledDist = this.shuffleArray([...targetSymbol.distractors]);
      for (const d of shuffledDist) {
        if (!list.includes(d) && d !== targetSymbol.name) {
          list.push(d);
          if (list.length >= count) return list;
        }
      }
    }

    // 2. Fyll på från samma kategori
    const sameCategory = SYMBOLS.filter(
      (s) => s.category === targetSymbol.category && s.name !== targetSymbol.name
    );
    const shuffledSame = this.shuffleArray(sameCategory);
    for (const s of shuffledSame) {
      if (!list.includes(s.name)) {
        list.push(s.name);
        if (list.length >= count) return list;
      }
    }

    // 3. Fyll på från hela katalogen
    const allRemaining = this.shuffleArray(
      SYMBOLS.filter((s) => s.name !== targetSymbol.name && !list.includes(s.name))
    );
    for (const s of allRemaining) {
      list.push(s.name);
      if (list.length >= count) return list;
    }

    return list;
  }

  selectOption(chosenIndex) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const symbol = this.getCurrentSymbol();
    const chosen = this.currentOptions[chosenIndex];
    const buttons = this.elOptionsContainer.querySelectorAll(".option-btn");

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      const opt = this.currentOptions[idx];
      if (opt.isCorrect) {
        btn.classList.add("correct-highlight");
      }
      if (idx === chosenIndex && !opt.isCorrect) {
        btn.classList.add("wrong-highlight");
      }
    });

    if (chosen.isCorrect) {
      this.handleSuccess(symbol, "Rätt svar!");
    } else {
      this.handleMistake(symbol, `Fel! Rätt svar är: ${symbol.name}`);
    }
  }

  handleFreeSubmit() {
    if (this.isAnswered) return;
    const inputVal = this.elFreeInput.value.trim();
    if (!inputVal) {
      this.elFreeInput.focus();
      return;
    }

    this.isAnswered = true;
    this.elFreeInput.disabled = true;
    this.elFreeSubmitBtn.disabled = true;

    const symbol = this.getCurrentSymbol();
    const match = checkAnswerFuzzy(inputVal, symbol);

    if (match.isCorrect) {
      let msg = "Helt rätt!";
      if (match.isTypo) {
        msg = `Rätt! (Godkänt stavfel: <em>${symbol.name}</em>)`;
      }
      this.handleSuccess(symbol, msg);
    } else {
      this.handleMistake(symbol, `Inte riktigt! Rätt svar är: <strong>${symbol.name}</strong>`);
    }
  }

  handleSuccess(symbol, title) {
    this.score += 1;
    this.streak += 1;
    if (this.streak > this.bestStreak) this.bestStreak = this.streak;

    this.sfx.playCorrect();

    this.elFeedbackBox.className = "feedback-box show correct";
    this.elFeedbackTitle.innerHTML = `✓ ${title}`;
    this.elFeedbackDesc.textContent = symbol.description;
    this.elNextBtn.style.display = "inline-flex";
    this.elNextBtn.focus();

    this.elScoreText.textContent = `Poäng: ${this.score}`;
  }

  handleMistake(symbol, title) {
    this.streak = 0;
    if (!this.mistakes.includes(symbol.id)) {
      this.mistakes.push(symbol.id);
    }

    this.sfx.playWrong();

    this.elFeedbackBox.className = "feedback-box show wrong";
    this.elFeedbackTitle.innerHTML = `✗ ${title}`;
    this.elFeedbackDesc.textContent = symbol.description;
    this.elNextBtn.style.display = "inline-flex";
    this.elNextBtn.focus();
  }

  nextQuestion() {
    this.currentIndex += 1;
    if (this.currentIndex < this.queue.length) {
      this.renderCurrentQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    this.elQuizView.classList.remove("active");
    this.elResultView.classList.add("active");

    const total = this.queue.length;
    const pct = total > 0 ? Math.round((this.score / total) * 100) : 0;

    document.getElementById("result-score-number").textContent = `${this.score} / ${total}`;
    document.getElementById("result-pct-number").textContent = `${pct}% rätt`;

    let badge = "🌲 Nyfiken skogsvandrare";
    let message = "Bra kämpat! Träna lite till så sitter alla tecken perfekt.";

    if (pct === 100) {
      badge = "🏆 Guldkompassen - Kartmästare!";
      message = "Fantastiskt! Alla rätt. Du är redo för 10-mila och O-Ringen!";
      this.sfx.playFanfare();
      this.triggerConfetti();
    } else if (pct >= 80) {
      badge = "🧭 Rutinerad orienterare";
      message = "Mycket bra jobbat! Du har koll på terrängens vanligaste tecken.";
      this.sfx.playFanfare();
    } else if (pct >= 50) {
      badge = "🗺️ Lovande kartläsare";
      message = "En god bit på väg! Kolla in de tecken du missade nedan.";
    }

    document.getElementById("result-badge").textContent = badge;
    document.getElementById("result-message").textContent = message;

    const retryMistakesBtn = document.getElementById("retry-mistakes-btn");
    const mistakesList = document.getElementById("mistakes-list");
    mistakesList.innerHTML = "";

    if (this.mistakes.length > 0) {
      retryMistakesBtn.style.display = "inline-flex";
      retryMistakesBtn.textContent = `Träna på felen (${this.mistakes.length} st)`;

      const missedSymbols = SYMBOLS.filter((s) => this.mistakes.includes(s.id));
      missedSymbols.forEach((s) => {
        const item = document.createElement("div");
        item.className = "mistake-item";
        item.innerHTML = `
          <img src="${s.image}" alt="${s.name}" class="mistake-thumb">
          <div>
            <strong>${s.name}</strong>
            <p>${s.description}</p>
          </div>
        `;
        mistakesList.appendChild(item);
      });
    } else {
      retryMistakesBtn.style.display = "none";
    }
  }

  triggerConfetti() {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    container.innerHTML = "";
    const colors = ["#e64a19", "#2e7d32", "#0288d1", "#fbc02d", "#8d6e63"];
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti";
      conf.style.left = `${Math.random() * 100}%`;
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDelay = `${Math.random() * 1.5}s`;
      conf.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(conf);
    }
  }

  openLibrary() {
    this.elLibraryView.classList.add("active");
    this.renderLibrary();
  }

  closeLibrary() {
    this.elLibraryView.classList.remove("active");
  }

  renderLibrary() {
    this.elLibraryGrid.innerHTML = "";
    SYMBOLS.forEach((s) => {
      const card = document.createElement("div");
      card.className = "library-card";
      card.innerHTML = `
        <div class="library-img-wrap">
          <img src="${s.image}" alt="${s.name}">
        </div>
        <div class="library-content">
          <span class="category-tag tag-${s.category}">${s.categoryLabel}</span>
          <h3>${s.name}</h3>
          <p>${s.description}</p>
        </div>
      `;
      this.elLibraryGrid.appendChild(card);
    });
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Starta appen när DOM är redo
document.addEventListener("DOMContentLoaded", () => {
  window.app = new KartteckenApp();
});
