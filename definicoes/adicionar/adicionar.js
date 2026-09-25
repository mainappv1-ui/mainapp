export function renderAdicionar({ onBack }) {
  const root = document.createElement("section");
  root.className = "add-page";
  root.innerHTML = [
    '<button class="add-back" type="button" aria-label="Voltar para Definições">‹</button>',
    '<div class="add-content">',
      '<input class="add-search" id="add-stock-search" type="search" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="Nome da ação..." aria-label="Nome da ação">',
      '<p class="add-hint">Pesquisa em tempo real no Yahoo Finance</p>',
      '<div class="add-results" id="add-results" aria-live="polite"><p class="add-empty">Escreve pelo menos 2 caracteres.</p></div>',
    '</div>'
  ].join("");

  const input = root.querySelector("#add-stock-search");
  const results = root.querySelector("#add-results");
  const back = root.querySelector(".add-back");

  let timer = null;
  let requestId = 0;

  back.addEventListener("click", onBack);

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderResults(items) {
    if (!items.length) {
      results.innerHTML = '<p class="add-empty">Nenhuma ação encontrada.</p>';
      return;
    }

    results.innerHTML = items.map((item) => {
      const name = escapeHtml(item.name);
      const exchange = escapeHtml(item.exchange || item.type || "Yahoo Finance");
      const symbol = escapeHtml(item.symbol);

      return [
        '<button class="add-result" type="button" data-symbol="',
        symbol,
        '">',
        '<span class="add-result-main"><strong>',
        name,
        '</strong><span>',
        exchange,
        '</span></span><span class="add-result-symbol">',
        symbol,
        "</span></button>"
      ].join("");
    }).join("");

    results.querySelectorAll(".add-result").forEach((button) => {
      button.addEventListener("click", () => {
        input.value = button.dataset.symbol || "";
        results.innerHTML = [
          '<div class="add-selected"><strong>',
          escapeHtml(button.dataset.symbol || ""),
          '</strong><span>Selecionada para adicionar.</span></div>'
        ].join("");
      });
    });
  }

  async function searchYahoo(query, currentRequestId) {
    try {
      const response = await fetch("/api/Yahoo?q=" + encodeURIComponent(query), {
        method: "GET",
        headers: { Accept: "application/json" }
      });

      const data = await response.json();

      if (currentRequestId !== requestId) return;

      if (!response.ok) {
        results.innerHTML = '<p class="add-empty">' +
          escapeHtml(data?.error || "Erro na pesquisa.") +
          "</p>";
        return;
      }

      renderResults(Array.isArray(data?.results) ? data.results : []);
    } catch {
      if (currentRequestId === requestId) {
        results.innerHTML = '<p class="add-empty">Não foi possível contactar o Yahoo Finance.</p>';
      }
    }
  }

  input.addEventListener("input", () => {
    clearTimeout(timer);
    requestId += 1;

    const query = input.value.trim();

    if (query.length < 2) {
      results.innerHTML = '<p class="add-empty">Escreve pelo menos 2 caracteres.</p>';
      return;
    }

    results.innerHTML = '<p class="add-empty">A procurar...</p>';

    const currentRequestId = requestId;
    timer = setTimeout(() => searchYahoo(query, currentRequestId), 250);
  });

  queueMicrotask(() => input.focus());

  return root;
}
