# Cin--genes-ia

Application web mobile de création de montage vertical à partir de photos.

## Déploiement sur Render
- Build Command : `npm install`
- Start Command : `npm start`
- Runtime : Node.js 18 ou plus récent
- Ajoute `REPLICATE_API_TOKEN` dans Environment pour activer la génération d'image IA.
- Optionnel : `REPLICATE_API_MODEL` n'est pas utilisé; configure `REPLICATE_IMAGE_MODEL` si tu souhaites remplacer le modèle (défaut `black-forest-labs/flux-schnell`).

Le montage photo/vidéo local fonctionne dans le navigateur. La génération d'image IA utilise Replicate et peut nécessiter des crédits.

Structure :
- `server.js`
- `package.json`
- `public/index.html`
