---
layout: post
title: "ECOWAS CTF 2026 — Layer Cake [Crypto/100pts]"
date: 2026-04-24 10:37:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, encoding, base64, hex, layered-encoding, cyberchef]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Un gâteau en couches. Pelez-les une à une.

---

## Analyse

Le ciphertext est encodé en **3 couches successives** :

1. Base64 (inversé) → hex
2. Hex → Base64
3. Base64 → flag

Le piège est que la première couche est une chaîne Base64 **inversée** (lue à l'envers).

---

## Solution

### Avec CyberChef

CyberChef Magic peut détecter automatiquement la plupart des couches. Utiliser **Magic** + **From Base64** → **From Hex** → **From Base64**.

### En Python

```python
import base64

# Étape 1 : Inverser la chaîne et décoder Base64
ciphertext = "..."  # donné
step1 = base64.b64decode(ciphertext[::-1]).decode()

# Étape 2 : Hex → bytes → Base64 decode
step2 = base64.b64decode(bytes.fromhex(step1))

# Étape 3 : Dernier décodage Base64
step3 = base64.b64decode(step2)
print(step3.decode())
```

---

## Flag

```
EcowasCTF{l4y3r_by_l4y3r_sw33t}
```

---

## Leçon retenue

- Les challenges d'encodage en couches : toujours essayer CyberChef Magic en premier
- L'inversion de chaîne Base64 est un piège classique — vérifier si `len % 4 == 0` avant de décoder
- Pipeline : Base64 inversé → Hex → Base64 → flag

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
