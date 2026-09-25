(() => {
  const page = document.getElementById("page");

  const icons = {
    home: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path>
        <path d="M9 21v-7h6v7"></path>
      </svg>`,
    alocacao: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4a8 8 0 1 0 8 8"></path>
        <path d="M12 4v8h8"></path>
      </svg>`,
    objetivo: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5h8v4c0 4-1.8 6-4 6s-4-2-4-6z"></path>
        <path d="M8 7H5v2c0 3 2 5 4 5"></path>
        <path d="M16 7h3v2c0 3-2 5-4 5"></path>
        <path d="M12 15v4"></path>
        <path d="M8 21h8"></path>
      </svg>`,
    agente: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="7" width="14" height="13" rx="6"></rect>
        <path d="M9 12h.01M15 12h.01"></path>
        <path d="M9 16h6"></path>
        <path d="M12 7V4"></path>
      </svg>`,
    definicoes: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4a8 8 0 0 0-7.2 11.5"></path>
        <path d="M4.8 15.5A8 8 0 0 0 12 20"></path>
        <path d="M12 20a8 8 0 0 0 7.2-11.5"></path>
        <path d="M19.2 8.5A8 8 0 0 0 12 4"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`
  };

  const tabs = [
    { id: "home", label: "Home" },
    { id: "alocacao", label: "Alocação" },
    { id: "objetivo", label: "Objetivo" },
    { id: "agente", label: "Agente" },
    { id: "definicoes", label: "Definições" }
  ];

  const emptyPage = () => `<div class="empty-page" aria-hidden="true"></div>`;

  const definitionsPage = () => `
    <div class="settings-list" aria-label="Definições">
      <button class="settings-pill" type="button">Adicionar</button>
      <button class="settings-pill" type="button">Editar</button>
      <button class="settings-pill" type="button">Backup</button>
      <button class="settings-pill" type="button">Firestore</button>
    </div>
  `;

  function renderPage(id) {
    page.innerHTML = id === "definicoes" ? definitionsPage() : emptyPage();
    page.dataset.page = id;
  }

  function renderSelector(selected) {
    const nav = document.createElement("nav");
    nav.className = "seletorabas";
    nav.setAttribute("aria-label", "Navegação principal");

    tabs.forEach(({ id, label }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seletoraba" + (id === selected ? " active" : "");
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-current", id === selected ? "page" : "false");
      button.dataset.page = id;
      button.innerHTML = icons[id];

      button.addEventListener("click", () => {
        renderPage(id);
        renderSelector(id);
      });

      nav.appendChild(button);
    });

    document.body.appendChild(nav);
  }

  renderPage("home");
  renderSelector("home");
})();
