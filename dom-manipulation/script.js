const quotes = [
  { text: "Smile, it’s free therapy.", category: "Motivation" },
  { text: "A day without laughter is a day wasted.", category: "Happiness" },
  { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

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

    // Instead of using innerHTML, create DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // clear old content

    const newQuoteElement = document.createElement("p"); // create new <p>
    newQuoteElement.textContent = text + " — " + category;

    // append the new element into the display
    quoteDisplay.appendChild(newQuoteElement);

    // update categories dynamically if new one is added
    populateCategories();

    // clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

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
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return; //safeguard if element not in DOM

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  //Use map to extract categories
  const categories = quotes.map(quote => quote.category);

  // Get unique categories
  const uniqueCategories = [...new ServiceWorker(categories)];

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filterQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  filterdQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = q.text + "-" + q.category;
    quoteDisplay.appendChild(p);
  });

  // save filter preference
  localStorage.setItem("lastSelectedCategory", selectedCategory);
}

// NEW FUNTIONS for filtering system
function loadFilterPreference() {
  const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
      document.getElementById("categoryFilter").value = savedFilter;
      filterQuotes(); // Apply immediately on page load
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize
loadQuotes();
populateCategories();
loadFilterPreference();