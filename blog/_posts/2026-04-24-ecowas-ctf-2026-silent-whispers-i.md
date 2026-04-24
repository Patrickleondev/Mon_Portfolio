---
layout: post
title: "ECOWAS CTF 2026 — Silent Whispers I [Steganography/100pts]"
date: 2026-04-24 10:11:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, stegsnow, whitespace, tabs-spaces, huffman]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Un fichier texte apparemment innocent. Rien à voir ici... ou pas ?

---

## Analyse

En inspectant le fichier avec `hexdump -C`, on remarque des octets `0x09` (tab) et `0x20` (espace) en fin de lignes, avant les retours à la ligne `0x0A`. Ce schéma irrégulier est la signature de **STEGSNOW**.

**STEGSNOW** encode des données dans les espaces blancs de fin de ligne en utilisant :
- Tabulation (`\t`) = 1 bit
- Espace (` `) = 0 bit
- Compression Huffman interne

---

## Solution

```bash
stegsnow -C information.txt
```

Sortie directe sans mot de passe → flag.

---

## Flag

```
EcowasCTF{wh1t3sp4c3_s3cr3ts_h1dd3n}
```

---

## Leçon retenue

- Toujours inspecter les caractères invisibles de fin de ligne avec `hexdump -C` ou `cat -A`
- STEGSNOW = stéganographie dans les espaces blancs, réflexe à avoir sur tout fichier texte

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
