const quotes = [
  { text: "Smile, it’s free therapy.", category: "Motivation" },
  { text: "A day without laughter is a day wasted.", category: "Happiness" },
  { text: "The best way to predict the future is to create it.", category: "Inspiration" }
];

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

    // clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}


document.getElementById("newQuote").addEventListener("click", showRandomQuote);
