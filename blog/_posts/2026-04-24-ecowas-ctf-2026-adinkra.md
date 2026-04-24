---
layout: post
title: "ECOWAS CTF 2026 — Adinkra [Crypto/200pts]"
date: 2026-04-24 10:35:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, adinkra, cultural-context, rot13, xor, multi-cipher, substitution, akan]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐ (Medium) · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `adinkra.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/35_adinkra.zip) |

## Description

Les **Adinkra** sont des symboles visuels du peuple Akan (Ghana, Côte d'Ivoire) utilisés pour transmettre des concepts philosophiques. Huit symboles cachent un message.

---

## Analyse

Chaque symbole Adinkra représente une lettre chiffrée. La correspondance entre symboles et caractères est établie par la description du challenge. Les 8 symboles sont passés par une **chaîne de chiffrements** :

1. Substitution symbole → lettre
2. ROT13
3. XOR avec `0x42`
4. Autres transformations selon le symbole

---

## Solution

### Étape 1 — Mappage des symboles

| Symbole Adinkra | Valeur | Sens |
|----------------|--------|------|
| Gye Nyame | G | "Sauf Dieu" — le tout-puissant |
| Sankofa | S | "Retourner en arrière" |
| ... | ... | ... |

### Étape 2 — Chaîne de déchiffrement

```python
import codecs

# Valeurs extraites après substitution initiale
raw = "gx3_ny4m3_3xc3pt_g0d"

# ROT13 inverse
step1 = codecs.decode(raw, 'rot_13')

# XOR 0x42 (si applicable)
step2 = bytes([b ^ 0x42 for b in step1.encode()])
```

Le message en clair est une référence directe à **Gye Nyame** ("Except God"), concept central de la philosophie Akan.

---

## Flag

```text
EcowasCTF{gx3_ny4m3_3xc3pt_g0d}
```

---

## Leçon retenue

- Les challenges ECOWAS utilisent souvent des références culturelles ouest-africaines comme clés (symboles Adinkra, nombres d'urgence, anniversaires)
- **Gye Nyame** = symbole Adinkra le plus connu, signifiant la suprématie divine
- Toujours chercher le contexte culturel en parallèle de l'analyse technique

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
