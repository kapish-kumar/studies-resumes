const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseDiv = document.getElementById('response');

// ⚠️ Replace this with your real OpenAI API key
const OPENAI_API_KEY = "";

askBtn.addEventListener('click', async () => {
  const question = userInput.value.trim();
  if (!question) {
    responseDiv.innerHTML = "Please enter a question!";
    return;
  }

  responseDiv.innerHTML = "<em>Thinking...</em>";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI tutor for students." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await res.json();

    if (data.error) {
      responseDiv.innerHTML = `<span style="color:red;">Error: ${data.error.message}</span>`;
      return;
    }

    const reply = data.choices[0].message.content;
    responseDiv.innerHTML = `<strong>AI:</strong> ${reply}`;

  } catch (error) {
    responseDiv.innerHTML = `<span style="color:red;">Error: ${error.message}</span>`;
  }
});
