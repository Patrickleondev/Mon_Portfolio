---
layout: post
title: "ECOWAS CTF 2026 — Golden Jubilee [OSINT/100pts]"
date: 2026-04-24 11:13:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [osint, wayback-machine, internet-archive, cdx-api, http-headers, ecowas-history]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** OSINT · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

En 2025, l'ECOWAS célèbre son **50e anniversaire** (Jubilé d'Or). Le tout premier site web de l'ECOWAS a été mis en ligne dans les années 2000. Quand a-t-il été mis à jour pour la dernière fois ?

---

## Analyse

**Objectif :** Trouver la date de dernière modification de la toute première version du site `ecowas.int`, capturée par le **Wayback Machine** (Internet Archive).

**Outil clé :** L'API CDX de l'Internet Archive permet de trouver la capture la plus ancienne.

---

## Solution

### Étape 1 — Trouver la capture la plus ancienne

```bash
curl "https://web.archive.org/cdx/search/cdx?url=ecowas.int&output=json&from=1990&to=2002&limit=5&fl=timestamp,original"
```

Résultat : première capture le **2001-02-02** sur `http://www.ecowas.int/`

### Étape 2 — Accéder à la capture archivée

```text
https://web.archive.org/web/20010202000000*/http://www.ecowas.int/
```

Naviguer vers `index2.htm` (page principale de l'époque).

### Étape 3 — Lire les métadonnées de la page

Dans le HTML de la page archivée, on trouve :

```html
Latest Update: Thursday, 26-Apr-2001 09:43:24 GMT
```

Cette ligne dans le contenu de la page donne la date exacte de dernière mise à jour.

### Alternative — En-têtes HTTP

```bash
curl -I "https://web.archive.org/web/20010426094324/http://www.ecowas.int/"
# Ou : regarder le header Last-Modified dans la réponse archivée
```

---

## Flag

```text
EcowasCTF{Thursday, 26-Apr-2001 09:43:24 GMT}
```

---

## Leçons retenues

- L'**API CDX** de l'Internet Archive est essentielle pour les challenges OSINT historiques
- Format CDX : `?url=...&output=json&from=YYYY&to=YYYY&limit=N&fl=timestamp,original`
- Le Jubilé d'Or de l'ECOWAS = 50 ans (1975–2025) → challenge numéro 73 de l'événement 2
- Toujours chercher les dates dans le **contenu HTML** des pages archivées, pas seulement les headers

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
