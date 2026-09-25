export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  const rawQuery = Array.isArray(req.query?.q) ? req.query.q[0] : req.query?.q;
  const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 80) : "";

  if (query.length < 2) {
    return res.status(400).json({
      error: "A pesquisa precisa de pelo menos 2 caracteres."
    });
  }

  const url = new URL("https://query1.finance.yahoo.com/v1/finance/search");
  url.searchParams.set("q", query);
  url.searchParams.set("quotesCount", "10");
  url.searchParams.set("newsCount", "0");
  url.searchParams.set("listsCount", "0");
  url.searchParams.set("lang", "pt-PT");
  url.searchParams.set("region", "PT");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MainApp/1.0)"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "O Yahoo Finance não respondeu corretamente.",
        upstreamStatus: response.status
      });
    }

    const data = await response.json();
    const quotes = Array.isArray(data?.quotes) ? data.quotes : [];

    const results = quotes
      .map((quote) => ({
        symbol: quote.symbol ?? "",
        name: quote.longname ?? quote.shortname ?? quote.symbol ?? "",
        exchange: quote.exchange ?? "",
        quoteType: quote.quoteType ?? "",
        type: quote.typeDisp ?? ""
      }))
      .filter((quote) => quote.symbol && quote.name);

    return res.status(200).json({ query, results });
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "A pesquisa demorou demasiado tempo."
      : "Não foi possível contactar o Yahoo Finance.";

    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
}
