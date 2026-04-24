---
layout: post
title: "ECOWAS CTF 2026 — Nyankonton [Reverse/200pts]"
date: 2026-04-24 10:33:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, mach-o, arm64, xor, keystream, static-analysis, ghidra]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐ (Medium) · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `nyancat.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/33_nyankonton.zip) |

## Description

Un binaire Mach-O ARM64 nommé d'après un esprit de la mythologie Akan. Que cache-t-il ?

---

## Analyse

Le binaire est un **Mach-O ARM64** (macOS). En ouvrant dans Ghidra, on localise la fonction de validation du flag. Elle XOR le flag attendu avec une **constante de keystream 64 bits** répétée.

**Constante keystream :** `0x0C5B0BB2A46A6CFC`

---

## Solution

```python
# Constante keystream 64 bits (répétée sur 8 octets)
keystream_const = 0x0C5B0BB2A46A6CFC
key_bytes = keystream_const.to_bytes(8, 'big')

# Données chiffrées extraites du binaire (section .data ou chaîne hardcodée)
encrypted = bytes.fromhex("...")  # à extraire depuis Ghidra

flag = bytes([b ^ key_bytes[i % 8] for i, b in enumerate(encrypted)])
print(flag.decode())
```

**Analyse Ghidra :**
1. Chercher la fonction `validate` ou `check_flag`
2. Localiser la constante XOR `0x0C5B0BB2A46A6CFC` dans les instructions ARM64
3. Extraire les bytes chiffrés du segment `__DATA`
4. XOR avec la clé → flag

---

## Flag

```
EcowasCTF{ny4n_ny4n_w4rp_p0rt4l_f0und_@t_last!!}
```

---

## Leçon retenue

- Les binaires Mach-O ARM64 s'analysent bien dans Ghidra (même sur Windows)
- Le XOR avec une constante 64 bits répétée est un schéma de chiffrement très commun dans les challenges Reverse
- Chercher les constantes 64 bits hardcodées dans les instructions `MOV` ARM64

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
