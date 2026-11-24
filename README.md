# TikTok Genesis AI — prototype v1

Cette version remplace l'interface web par une interface TikTok verticale.

## Installation dans le dépôt existant

1. Téléverse le dossier `public` dans ton dépôt GitHub (à la racine, à côté de `server.js`).
2. Conserve le `server.js` actuel et `package.json` : l'interface appelle `/api/health` et `/api/generate-image`.
3. Vérifie que `server.js` contient `app.use(express.static("public"));`.
4. Déploie sur Render et ouvre l'adresse du service.

## Fonctionnalités

- Import multiple depuis le téléphone et sélection des photos.
- Styles prédéfinis et prompt.
- Aperçu vertical, animations simples (zoom/pan) et export WebM local via le navigateur.
- Génération d'image text-to-image avec l'endpoint existant `/api/generate-image`.
- Ajout de l'image IA générée au montage.

## Limites à connaître

Le serveur actuel est un endpoint Replicate text-to-image. Il ne reçoit pas les photos importées comme références et ne produit pas de vidéo IA image-to-video. L'export WebM actuel crée un montage animé à partir des photos (zoom/pan), pas une vidéo générée par un modèle vidéo. Le modèle/API vidéo devra être ajouté séparément pour l'animation IA réelle. Le navigateur doit prendre en charge `MediaRecorder` et `canvas.captureStream`.
