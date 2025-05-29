document.addEventListener("DOMContentLoaded", function () {
  const richtextSections = document.querySelectorAll(".rich-text")
  richtextSections.forEach(section => {
     const wrapper = section.querySelector(".description-wrapper");
  const content = wrapper.querySelector(".rich-text__text");
  const toggleBtn = section.querySelector(".show-more-description");

  const fullHTML = content.innerHTML.trim();
  const plainText = content.innerText.trim();
  const maxChars = 300;
  const cutIndex = plainText.slice(0, maxChars).lastIndexOf(" ");
  const shortText = plainText.slice(0, cutIndex) + "...";

  if (plainText.length <= maxChars) {
    toggleBtn.style.display = "none";
    return;
  }

  const originalHTML = fullHTML;
  content.innerText = shortText;
  wrapper.classList.add("collapsed");

  let isExpanded = false;

  toggleBtn.addEventListener("click", () => {
    if (isExpanded) {
      // === Схлопывание ===
      const currentHeight = wrapper.scrollHeight;
      wrapper.style.maxHeight = currentHeight + "px";

      // Ставим короткий текст, но только после анимации
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrapper.style.maxHeight = "130px";

          // Ждём завершения анимации, затем меняем HTML
          setTimeout(() => {
            content.innerText = shortText;
            toggleBtn.textContent = "Show more ↓";
            isExpanded = false;
          }, 500); // match transition-duration
        });
      });

    } else {
      // === Раскрытие ===
      content.innerHTML = originalHTML;
      const fullHeight = content.scrollHeight;
      wrapper.style.maxHeight = "130px"; // на всякий случай

      requestAnimationFrame(() => {
        wrapper.style.maxHeight = fullHeight + "px";
      });

      toggleBtn.textContent = "Hide ↑";
      isExpanded = true;
    }
  });
  })
 
});