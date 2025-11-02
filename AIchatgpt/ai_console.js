const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add(sender);
  div.textContent = `${sender === "user" ? "You" : "AI"}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    addMessage("ai", reply);
  } catch (err) {
    addMessage("ai", "Error: " + err.message);
  }
});
