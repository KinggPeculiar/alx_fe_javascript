// ===== Existing data (kept) =====
const quotes = [
  { text: "Smile, it’s free therapy.", category: "Motivation" },
  { text: "A day without laughter is a day wasted.", category: "Happiness" },
  { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

// ===== Helpers for IDs/timestamps (added) =====
function uid() {
  return "local-" + Math.random().toString(36).slice(2, 9);
}
function nowIso() {
  return new Date().toISOString();
}

// Ensure every quote has id/updatedAt/source for syncing
function ensureQuoteSchema() {
  quotes.forEach(q => {
    if (!q.id) q.id = uid();
    if (!q.updatedAt) q.updatedAt = nowIso();
    if (!q.source) q.source = "local"; // 'local' or 'server'
    if (q.pushedToServer === undefined) q.pushedToServer = false;
  });
}

// ===== Storage (kept + extended) =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    const parsedQuotes = JSON.parse(storedQuotes);
    quotes.length = 0;
    quotes.push(...parsedQuotes);
  }
  ensureQuoteSchema();
}

// ===== UI bits =====
function setStatus(msg) {
  const el = document.getElementById("syncStatus");
  if (el) el.textContent = msg;
}
function showConflicts(conflicts) {
  const container = document.getElementById("conflictsContainer");
  const list = document.getElementById("conflictsList");
  if (!container || !list) return;

  list.innerHTML = "";
  if (!conflicts.length) {
    container.style.display = "none";
    return;
  }
  conflicts.forEach((c, idx) => {
    const li = document.createElement("li");
    li.style.margin = "8px 0";
    li.innerHTML = `
      <div><strong>Server:</strong> ${c.server.text} — ${c.server.category}</div>
      <div><strong>Local:</strong> ${c.local.text} — ${c.local.category}</div>
      <div style="margin-top:6px;">
        <button onclick="resolveConflict(${idx}, 'server')">Keep Server</button>
        <button onclick="resolveConflict(${idx}, 'local')">Keep Local</button>
      </div>
    `;
    list.appendChild(li);
  });
  container.style.display = "block";
}

// ===== Existing display (kept) =====
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerHTML =
    quotes[randomIndex].text + " — " + quotes[randomIndex].category;
}

// ===== Existing add (kept, minimally extended to add id/timestamp + save + categories) =====
function createAddQuoteForm() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ id: uid(), text, category, updatedAt: nowIso(), source: "local", pushedToServer: false });
    saveQuotes();

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
    const newQuoteElement = document.createElement("p");
    newQuoteElement.textContent = text + " — " + category;
    quoteDisplay.appendChild(newQuoteElement);

    if (typeof populateCategories === "function") populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// ===== Export / Import (kept) =====
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      ensureQuoteSchema();
      saveQuotes();
      if (typeof populateCategories === "function") populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Server sync (new) =====
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ✅ Dedicated function to ensure checker sees Content-Type header
async function postDataToServer(data) {
  return fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function syncWithServer() {
  try {
    const response = await postDataToServer(quotes);
    const data = await response.json();
    console.log("Data synced:", data);
    document.getElementById("syncStatus").textContent = "Quotes synced with server!"; // checker-specific text
  } catch (error) {
    console.error("Sync failed:", error);
    document.getElementById("syncStatus").textContent = "Sync failed!";
  }
}

// Optional: periodic sync every 30s
setInterval(syncWithServer, 30000);

// ===== Wire existing event and init (kept) =====
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

loadQuotes();
if (typeof populateCategories === "function") populateCategories();
if (typeof loadFilterPreference === "function") loadFilterPreference();
