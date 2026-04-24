---
layout: post
title: "ECOWAS CTF 2026 — Gates [Reverse/100pts]"
date: 2026-04-24 10:44:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, mach-o, strings, decoy-flags, static-analysis, arm64]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `gates.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/44_gates.zip) |

## Description

Un binaire Mach-O avec une seule porte de sortie. Mais laquelle ?

---

## Analyse

Le binaire contient **exactement 100 chaînes** au format `EcowasCTF{...}` — 99 leurres et 1 vraie. La logique du programme vérifie votre input contre la vraie flag.

**Technique :** Le vrai flag est **auto-descriptif** — il décrit littéralement le challenge lui-même.

---

## Solution

### Étape 1 — Extraire toutes les chaînes

```bash
strings gates | grep "EcowasCTF{"
```

Ou avec Python :

```python
import re

with open("gates", "rb") as f:
    binary = f.read()

flags = re.findall(rb'EcowasCTF\{[^}]+\}', binary)
for f in flags:
    print(f.decode())
```

### Étape 2 — Identifier le vrai flag

Parmi les 100 flags extraits :
```
EcowasCTF{n0m4d_tr41l_w1nd3s}      ← leurre (random)
EcowasCTF{fl4m1ng0_d4nc3s}         ← leurre (random)
EcowasCTF{vultur3_c1rcl3s}         ← leurre (random)
EcowasCTF{0nly_0n3_g4t3_0p3ns_th3_w4y}  ← AUTO-DESCRIPTIF !
EcowasCTF{fl4g_hunt3r_w1ns_n0t}    ← leurre
...
```

**Le flag auto-descriptif** dit "seulement une porte ouvre le chemin" — ce qui décrit exactement le challenge.

### Étape 3 — Vérification dans Ghidra

```c
// La comparaison dans main() utilise :
target = "EcowasCTF{0nly_0n3_g4t3_0p3ns_th3_w4y}";
if (strcmp(user_input, target) == 0) {
    print("Correct!");
}
```

---

## Flag

```
EcowasCTF{0nly_0n3_g4t3_0p3ns_th3_w4y}
```

---

## Leçon retenue

- Face à des leurres en masse : chercher le flag **sémantiquement cohérent** avec le challenge
- Le flag auto-référentiel est une signature classique dans ce type de challenge
- `strings | grep` sur le binaire suffit ici — pas besoin de décompilation complète

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
