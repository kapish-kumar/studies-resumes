document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    const years = [1, 2, 3];
    years.forEach((y) => {
      const yDiv = document.createElement("div");
      yDiv.innerHTML = `<h3>Year ${y}</h3>`;
      const list = document.createElement("ul");
      ["programacao","redes","matematica","fisica","quimica","tic"].forEach((s) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="year${y}/${s}.html">${s}</a>`;
        list.appendChild(li);
      });
      yDiv.appendChild(list);
      sidebar.appendChild(yDiv);
    });
  }

  // Theme toggle
  const toggle = document.getElementById("modeToggle");
  const setMode = (mode) => {
    document.body.classList.toggle("light", mode === "light");
    localStorage.setItem("mode", mode);
  };
  if (localStorage.getItem("mode") === "light") setMode("light");
  toggle?.addEventListener("click", () => {
    const mode = document.body.classList.contains("light") ? "dark" : "light";
    setMode(mode);
  });
});
