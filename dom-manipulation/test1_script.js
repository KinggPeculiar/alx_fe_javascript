const quotes = [
  { text: "Smile, it’s free therapy.", category: "Motivation" },
  { text: "A day without laughter is a day wasted.", category: "Happiness" },
  { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${text}" — ${category}`;

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
