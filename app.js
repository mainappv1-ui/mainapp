(() => {
  const page = document.getElementById("page");

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path><path d="M9 21v-7h6v7"></path></svg>',
    alocacao: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5a11 11 0 1 0 11 11"></path><path d="M16 5v11h11"></path></svg>',
    objetivo: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 6h14v5c0 6-2.8 9-7 9s-7-3-7-9z"></path><path d="M9 8H6v2c0 4 2 6 5 6M23 8h3v2c0 4-2 6-5 6"></path><path d="M16 20v6M11 28h10"></path></svg>',
    agente: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="9" width="20" height="15" rx="7"></rect><path d="M12 15h.01M20 15h.01M12 19h8M16 9V5"></path></svg>',
    definicoes: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6a4 4 0 0 1 4 4 10.5 10.5 0 0 1 3 1.8 4 4 0 1 1 4 6.9 10.5 10.5 0 0 1 0 3.6 4 4 0 1 1-4 6.9 10.5 10.5 0 0 1-3 1.8 4 4 0 1 1-8 0 10.5 10.5 0 0 1-3-1.8 4 4 0 1 1-4-6.9 10.5 10.5 0 0 1 0-3.6 4 4 0 1 1 4-6.9 4 4 0 0 1 3-1.8 4 4 0 0 1 4-4z"></path><circle cx="16" cy="20" r="4"></circle></svg>'
  };

  const tabs = [
    { id: "home", label: "Home" },
    { id: "alocacao", label: "Alocação" },
    { id: "objetivo", label: "Objetivo" },
    { id: "agente", label: "Agente" },
    { id: "definicoes", label: "Definições" }
  ];

  const emptyPage = () => '<div class="empty-page" aria-hidden="true"></div>';

  const definitionsPage = () => [
    '<div class="settings-list" aria-label="Definições">',
    '<button class="settings-pill" type="button" data-action="adicionar">Adicionar</button>',
    '<button class="settings-pill" type="button">Editar</button>',
    '<button class="settings-pill" type="button">Backup</button>',
    '<button class="settings-pill" type="button">Firestore</button>',
    '</div>'
  ].join("");

  function renderPage(id) {
    page.innerHTML = id === "definicoes" ? definitionsPage() : emptyPage();
    page.dataset.page = id;

    const addButton = page.querySelector('[data-action="adicionar"]');
    if (addButton) {
      addButton.addEventListener("click", openAdicionar);
    }
  }

  async function openAdicionar() {
    try {
      const module = await import("./definicoes/adicionar/adicionar.js");
      page.innerHTML = "";
      page.dataset.page = "adicionar";
      page.appendChild(module.renderAdicionar({
        onBack: () => renderPage("definicoes")
      }));
    } catch (error) {
      page.innerHTML = '<div class="add-error">Não foi possível abrir a página Adicionar.</div>';
    }
  }

  function renderSelector(selected) {
    const previous = document.querySelector(".seletorabas");
    if (previous) previous.remove();

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
