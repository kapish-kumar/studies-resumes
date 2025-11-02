const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let notesText = "";

// Load your notes text
fetch("../notes/structure.html")
  .then(res => res.text())
  .then(text => {
    // Strip HTML tags for clean search
    notesText = text.replace(/<[^>]*>?/gm, " ").toLowerCase();
  })
  .catch(err => console.error("Failed to load notes:", err));

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add(sender);
  div.textContent = `${sender === "user" ? "You" : "NotesBot"}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function findRelevantInfo(question) {
  if (!notesText) return "I couldn’t load your notes yet.";
  const words = question.toLowerCase().split(" ");
  let bestMatch = "";
  let bestCount = 0;

  // Split notes into sentences
  const sentences = notesText.split(/[.?!]/);

  sentences.forEach(sentence => {
    let count = 0;
    words.forEach(word => {
      if (sentence.includes(word)) count++;
    });
    if (count > bestCount) {
      bestCount = count;
      bestMatch = sentence.trim();
    }
  });

  if (bestCount === 0) return "I didn’t find anything relevant in your notes.";
  return bestMatch.length > 0 ? bestMatch : "No relevant info found.";
}

sendBtn.addEventListener("click", () => {
  const question = userInput.value.trim();
  if (!question) return;
  addMessage("user", question);
  userInput.value = "";

  const answer = findRelevantInfo(question);
  setTimeout(() => addMessage("ai", answer), 400);
});
