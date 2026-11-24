const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 10000;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const IMAGE_MODEL = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-schnell";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Cin--genes-ia",
    imageModel: IMAGE_MODEL,
    apiKeyConfigured: Boolean(REPLICATE_API_TOKEN)
  });
});

app.post("/api/generate-image", async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN) {
      return res.status(503).json({
        error: "REPLICATE_API_TOKEN manquant. Ajoute-le dans les variables d'environnement de ton hébergement."
      });
    }

    const prompt = String(req.body?.prompt || "").trim();
    if (!prompt) return res.status(400).json({ error: "Le prompt est obligatoire." });

    const createResponse = await fetch("https://api.replicate.com/v1/models/" + IMAGE_MODEL + "/predictions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + REPLICATE_API_TOKEN,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({ input: { prompt, aspect_ratio: "9:16", output_format: "png" } })
    });

    const prediction = await createResponse.json();
    if (!createResponse.ok) {
      return res.status(createResponse.status).json({
        error: prediction.detail || prediction.title || "Échec de la génération chez Replicate."
      });
    }

    let result = prediction;
    for (let attempt = 0; attempt < 25 && result.status !== "succeeded" && result.status !== "failed" && result.status !== "canceled"; attempt++) {
      if (!result.urls?.get) break;
      await new Promise(resolve => setTimeout(resolve, 1500));
      const poll = await fetch(result.urls.get, {
        headers: { "Authorization": "Bearer " + REPLICATE_API_TOKEN }
      });
      result = await poll.json();
    }

    if (result.status !== "succeeded") {
      return res.status(502).json({ error: result.error || "La génération n'a pas abouti. Réessaie." });
    }

    const output = Array.isArray(result.output) ? result.output[0] : result.output;
    return res.json({ ok: true, output, imageUrl: output });
  } catch (error) {
    console.error("generate-image error:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la génération." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Cin--genes-ia lancé sur le port ${PORT}`));
