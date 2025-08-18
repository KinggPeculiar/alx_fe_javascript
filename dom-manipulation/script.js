// ==================== Quotes Data ====================
const quotes = [
  { text: "Smile, it’s free therapy.", category: "Motivation" },
  { text: "A day without laughter is a day wasted.", category: "Happiness" },
  { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

// ==================== Local Storage Functions ====================
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
}

// ==================== Quote Display Functions ====================
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerHTML =
    quotes[randomIndex].text + " — " + quotes[randomIndex].category;
}

function createAddQuoteForm() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    // Add new quote to the array
    quotes.push({ text: text, category: category });
    saveQuotes();
    populateCategories();

    // Update DOM
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
    const newQuoteElement = document.createElement("p");
    newQuoteElement.textContent = text + " — " + category;
    quoteDisplay.appendChild(newQuoteElement);

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// ==================== JSON Import / Export ====================
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

function importFormJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ==================== Category Filtering ====================
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // clear existing
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last filter if exists
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = q.text + " — " + q.category;
    quoteDisplay.appendChild(p);
  });
}

// ==================== Server Sync Simulation ====================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server (simulate)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    // simulate server sending quotes
    const serverQuotes = data.slice(0, 5).map((item, idx) => ({
      text: item.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Failed to fetch server quotes", err);
  }
}

// Push new quotes to server (simulation)
async function pushQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
  } catch (err) {
    console.error("Failed to push quote", err);
  }
}

// Conflict resolution: server takes precedence
function resolveConflicts(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(
      q => q.text === serverQuote.text && q.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes updated from server (server data prioritized).");
  }
}

// Simple notification
function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "yellow";
  note.style.padding = "5px";
  note.style.margin = "5px 0";
  document.body.prepend(note);

  setTimeout(() => note.remove(), 4000);
}

// ==================== Event Listeners & Init ====================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

loadQuotes();
populateCategories();
filterQuotes();

// Periodically sync with server every 30s
setInterval(fetchQuotesFromServer, 30000);