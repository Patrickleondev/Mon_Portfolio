---
layout: post
title: "ECOWAS CTF 2026 — Abnormal Chain [Misc/100pts]"
date: 2026-04-24 10:52:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [misc, encoding, base64, base85, hex, base32, reverse-string, layered-encoding, cyberchef]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Misc · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

*"Retrace tes pas."* Une chaîne anormalement encodée. Pelée couche par couche.

---

## Analyse

5 couches d'encodage successives :

1. **Base64** (couche externe)
2. **Base85** (ASCII85)
3. **Hex**
4. **Base32**
5. **Reverse** + **Base64** (couche finale)

L'indice "retrace tes pas" signale l'**inversion de chaîne** à l'étape 5.

---

## Solution

### CyberChef

Magic → From Base64 → From Base85 → From Hex → From Base32 → Reverse → From Base64.

### Python

```python
import base64
import binascii

# Étape 1 — Base64
ciphertext = "..."  # donné
step1 = base64.b64decode(ciphertext).decode()

# Étape 2 — Base85 (ASCII85)
step2 = base64.b85decode(step1).decode()

# Étape 3 — Hex
step3 = bytes.fromhex(step2).decode()

# Étape 4 — Base32
step4 = base64.b32decode(step3).decode()

# Étape 5 — Reverse + Base64
reversed_str = step4[::-1]
flag = base64.b64decode(reversed_str).decode()
print(flag)
```

---

## Flag

```text
EcowasCTF{n3st3d_l4y3rs_0f_s4nk0f4_w1sd0m}
```

---

## Leçons retenues

- Ordre des couches : Base64 → Base85 → Hex → Base32 → Reverse → Base64
- L'**inversion de chaîne** est souvent signalée par des indices comme "retrace" ou "backward"
- CyberChef Magic identifie bien Base64/Hex/Base32 mais peut manquer Base85 — l'ajouter manuellement
- Référence : **Sankofa** (wisdom = sagesse) dans le flag

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
