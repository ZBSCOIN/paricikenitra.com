document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  const form = document.querySelector(".contact-form");
  if (form && form.action.includes("formspree.io")) {
    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.createElement("p");
    status.className = "small-note";
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "14px";
    form.appendChild(status);

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const originalText = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Envoi en cours...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          form.reset();
          status.textContent = "Merci. Votre demande a bien été envoyée. Nous revenons vers vous rapidement.";
          window.location.href = "merci.html";
          return;
        }

        const data = await response.json();
        status.textContent = data?.errors?.[0]?.message || "Une erreur est survenue. Merci de réessayer.";
      } catch (error) {
        status.textContent = "Impossible d’envoyer le formulaire pour le moment. Merci de réessayer plus tard.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item, index) {
    const button = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");

    if (!button || !panel) return;

    const buttonId = button.id || `faq-button-${index}`;
    const panelId = panel.id || `faq-panel-${index}`;

    button.id = buttonId;
    panel.id = panelId;

    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", buttonId);
    panel.setAttribute("aria-hidden", "true");
    panel.style.display = "none";

    button.addEventListener("click", function () {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", isOpen ? "false" : "true");
      panel.setAttribute("aria-hidden", isOpen ? "true" : "false");
      panel.style.display = isOpen ? "none" : "block";
      item.classList.toggle("is-open", !isOpen);
    });
  });
});
