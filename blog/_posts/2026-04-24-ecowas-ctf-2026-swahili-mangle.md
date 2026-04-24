---
layout: post
title: "ECOWAS CTF 2026 — Swahili Mangle [Reverse/Hard]"
date: 2026-04-24 11:30:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, arm64, mach-o, white-box, table-lookup, brute-force, hard]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐⭐ Hard · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `swahili.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/75_swahili_mangle.zip) |

## Description du challenge

> *[énoncé du challenge]*

**Fichier fourni :** `swahili.zip` → `swahili_mangle` (binaire Mach-O ARM64, 116 352 octets)

---

## Analyse

### Identification du binaire

```
Magic: 0xCFFAEDFE  → Mach-O ARM64 (little-endian, 64-bit)
Taille: 116 352 octets
```

Même série que les autres challenges reverse de cet événement — des binaires macOS ARM64 analysés **statiquement** sous Windows avec capstone.

### Architecture de l'algorithme

Le binaire valide une passphrase de **40 caractères** via un système de **table lookup en boîte blanche** :

- **4 rounds** de transformation
- **5 tables** de lookup par round
- Les rotations à appliquer sont guidées par des valeurs clés en `__const`
- La sortie attendue (40 bytes) est stockée dans la section `__const`

À chaque position, la transformation est **indépendante** : la valeur transformée de `char[i]` ne dépend pas de `char[j]` pour `j ≠ i`. Ce fait crucial permet un **brute-force caractère par caractère**.

---

## Solution

### Stratégie : brute-force position par position

Puisque chaque position est indépendante :

```python
flag = []
for position in range(40):
    for candidate in range(32, 127):  # ASCII imprimable
        result = apply_whitebox(candidate, position)
        if result == expected[position]:
            flag.append(chr(candidate))
            break
```

### Implémentation

```python
import struct

# Charger le binaire
with open('swahili_mangle', 'rb') as f:
    binary = f.read()

# Localiser la section __const (offset à adapter selon le binaire)
CONST_OFFSET = 0x3f62  # offset dans le fichier
tables_raw = binary[CONST_OFFSET:]

# Parser les 5 tables (256 entrées × 4 rounds chacune)
# et les 40 bytes d'output attendu
TABLES = []
for t in range(5):
    table = list(struct.unpack_from('256B', tables_raw, t * 256))
    TABLES.append(table)

expected = list(struct.unpack_from('40B', tables_raw, 5 * 256))

# Clés de rotation extraites de __const
rotation_keys = list(struct.unpack_from('40B', tables_raw, 5 * 256 + 40))

def apply_whitebox(ch, pos):
    """Applique les 4 rounds de table lookup pour un caractère à la position pos."""
    val = ch
    rot_key = rotation_keys[pos]
    for r in range(4):
        # Rotation guidée par la clé
        rot = (rot_key >> (r * 2)) & 0x7
        val = ((val << rot) | (val >> (8 - rot))) & 0xFF
        # Table lookup
        val = TABLES[r][val]
    return val

# Brute-force position par position
flag = []
for pos in range(40):
    for candidate in range(32, 127):
        if apply_whitebox(candidate, pos) == expected[pos]:
            flag.append(chr(candidate))
            break
    else:
        flag.append('?')

print(''.join(flag))
```

**Résultat :**

```text
EcowasCTF{wh1t3_b0x_t4bl3s_sw4h1l1_2026}
```

---

## Flag

```text
EcowasCTF{wh1t3_b0x_t4bl3s_sw4h1l1_2026}
```

---

## Ce que j'ai retenu

- **White-box table lookup** : quand un checker est composé exclusivement de lookups et rotations, chercher si les positions sont indépendantes → brute-force O(40 × 95) au lieu de O(95^40).
- **Mach-O ARM64 sous Windows** : analyse 100% statique avec Python + `struct` pour parser les sections, capstone pour désassembler. Pas besoin d'un Mac.
- **Indépendance des positions** = le meilleur ami du reverseur. Toujours vérifier si la sortie en position `i` dépend de l'entrée en position `j ≠ i`.

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
