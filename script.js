
const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const result = document.getElementById("result");
const errorMsg = document.getElementById("error");
const themeBtn = document.getElementById("theme-btn");

// Toggle dark/light theme
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Handle search
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const word = input.value.trim();

  errorMsg.textContent = "";
  result.innerHTML = "";

  if (word === "") {
    errorMsg.textContent = "Please type a word first.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      errorMsg.textContent = `Sorry, "${word}" was not found.`;
      return;
    }

    const data = await response.json();
    displayWord(data[0]);
  } catch (error) {
    errorMsg.textContent = "Something went wrong. Check your connection and try again.";
  }
});

function displayWord(entry) {
  const block = document.createElement("div");
  block.className = "word-block";

  // Pronunciation text and audio
  const phonetic = entry.phonetic || "";
  const audioObj = entry.phonetics.find((p) => p.audio);
  const audioHTML = audioObj
    ? `<button id="play-btn">Play pronunciation</button>`
    : "";

  let html = `<h2>${entry.word} <small>${phonetic}</small></h2>${audioHTML}`;

  // Meanings
  entry.meanings.forEach((meaning) => {
    const def = meaning.definitions[0];
    html += `<h3>${meaning.partOfSpeech}</h3>`;
    html += `<p><strong>Definition:</strong> ${def.definition}</p>`;
    if (def.example) {
      html += `<p><em>Example: ${def.example}</em></p>`;
    }
    if (meaning.synonyms.length > 0) {
      html += `<p><strong>Synonyms:</strong> ${meaning.synonyms.join(", ")}</p>`;
    }
  });

  // Source
  if (entry.sourceUrls && entry.sourceUrls.length > 0) {
    html += `<p>Source: <a href="${entry.sourceUrls[0]}" target="_blank">${entry.sourceUrls[0]}</a></p>`;
  }

  html += `<button id="save-btn">Save word</button>`;
  block.innerHTML = html;
  result.appendChild(block);

  // Audio playback
  if (audioObj) {
    document.getElementById("play-btn").addEventListener("click", () => {
      new Audio(audioObj.audio).play();
    });
  }

  // Highlight saved word
  document.getElementById("save-btn").addEventListener("click", () => {
    block.classList.add("saved");
