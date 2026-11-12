/* Japan Study Tour Journal — homepage interactions */

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-button");
  const searchInput = document.getElementById("journalSearch");
  const journalItems = [...document.querySelectorAll(".journal-item")];
  const noResults = document.getElementById("noResults");
  const resultsMessage = document.getElementById("resultsMessage");
  const currentYear = document.getElementById("currentYear");

  let activeFilter = "all";

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  function updateJournal() {
    const searchTerm = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    journalItems.forEach((item) => {
      const category = item.dataset.category || "";
      const searchableText = `${item.dataset.search || ""} ${item.textContent}`.toLowerCase();
      const matchesCategory = activeFilter === "all" || category === activeFilter;
      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const isVisible = matchesCategory && matchesSearch;

      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }

    if (resultsMessage) {
      if (searchTerm || activeFilter !== "all") {
        resultsMessage.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "entry" : "entries"}`;
      } else {
        resultsMessage.textContent = "The journal will grow as the study tour progresses.";
      }
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      updateJournal();
    });
  });

  searchInput?.addEventListener("input", updateJournal);

  // Persistent light/dark theme toggle. Dark is the default.
  const themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("theme-light", isLight);

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

      const icon = themeToggle.querySelector(".theme-toggle-icon");
      const label = themeToggle.querySelector(".theme-toggle-label");

      if (icon) icon.textContent = isLight ? "☀" : "☾";
      if (label) label.textContent = isLight ? "Light" : "Dark";
    }
  }

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("journal-theme") || "dark";
  } catch (error) {
    // Keep the default dark theme when local storage is unavailable.
  }
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("theme-light") ? "dark" : "light";
    applyTheme(nextTheme);

    try {
      localStorage.setItem("journal-theme", nextTheme);
    } catch (error) {
      // Theme switching still works for the current page.
    }
  });



});
