// ===== SIDEBAR COLLAPSE HANDLING =====
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".sidebar nav ul li span");

  dropdowns.forEach(drop => {
    drop.addEventListener("click", () => {
      const nextUl = drop.nextElementSibling;
      if (nextUl && nextUl.tagName === "UL") {
        nextUl.style.display = nextUl.style.display === "block" ? "none" : "block";
      }
    });
  });
});

// ===== SMOOTH SCROLL TO TOP WHEN PAGE LOADS =====
window.addEventListener("load", () => window.scrollTo(0, 0));
