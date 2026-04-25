---
layout: post
title: "ECOWAS CTF 2026 — Cookie Collector [Web/100pts]"
date: 2026-04-24 10:29:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [web, cookies, hex-encoding, hidden-endpoint, recon, flask]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Web · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Une application web collecte des cookies. Mais pas seulement les vôtres.

---

## Analyse

En inspectant l'application, on remarque que les **cookies** renvoyés par le serveur sont encodés en hexadécimal. Après décodage, on obtient un chemin d'accès caché.

---

## Solution

### Étape 1 — Récupérer le cookie

```bash
curl -v http://challenge-url/ 2>&1 | grep "Set-Cookie"
```

Le cookie renvoyé est de la forme : `session=<hex-string>`

### Étape 2 — Décoder

```python
hex_value = "2f68696464656e"  # exemple
print(bytes.fromhex(hex_value).decode())
# → /hidden
```

### Étape 3 — Accéder à l'endpoint caché

```bash
curl http://challenge-url/hidden
```

Réponse : flag directement dans le corps de la réponse.

---

## Flag

```text
EcowasCTF{c00kie_c0llect0r_m@st3R>!}
```

---

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
