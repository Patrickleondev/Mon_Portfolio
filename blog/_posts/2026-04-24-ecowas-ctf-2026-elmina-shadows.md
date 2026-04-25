---
layout: post
title: "ECOWAS CTF 2026 — Elmina Shadows [Steganography/Medium]"
date: 2026-04-24 11:15:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, xor, prng, png, zip-comment, repeating-key, medium]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐⭐ Medium · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `elmina.png` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/62_elmina_shadows.png) |

## Description du challenge

> "The stone fort of Elmina casts long shadows. One shadow carries the key and another carries the secret."

Le fort d'Elmina est un château colonial au Ghana, construit par les Portugais en 1482 — l'un des centres de la traite négrière. Le thème "ombre" est métaphorique : *une ombre porte la clé, une autre porte le secret*.

**Fichier fourni :** `elmina.zip`

---

## Analyse

### Étape 1 : Examiner le ZIP

```python
import zipfile

with zipfile.ZipFile('elmina.zip') as z:
    print('Comment ZIP:', z.comment)
    for info in z.infolist():
        print(info.filename, info.file_size)
```

**Trouvaille clé :** Le commentaire ZIP contient :

```
Shadow remembers its name: ELMINA
```

C'est la clé XOR/PRNG.

> **Astuce :** Les fichiers ZIP peuvent contenir un commentaire global, souvent ignoré. Toujours vérifier avec `zipfile.ZipFile.comment` ou `zipinfo`.

### Étape 2 : Analyser l'image

```python
from PIL import Image
import numpy as np

img = Image.open("fort.png")
arr = np.array(img).astype(np.int16)
# Taille : (300, 300) RGB

for ch, name in enumerate(['R', 'G', 'B']):
    vals = arr[:,:,ch].flatten()
    print(f"{name}: min={vals.min()}, max={vals.max()}, mean={vals.mean():.1f}")
```

**Observations :**
- Tous les pixels sont dans la plage [20, 180] — exactement la plage de `random.randint(20, 180)`.
- L'image ressemble à du bruit coloré aléatoire — probablement un **masque PRNG**.

### Étape 3 : Trouver le seed PRNG

On teste les seeds évidents (notamment `42` — un classique en CTF) :

```python
import random

arr = np.array(Image.open("fort.png")).astype(np.int16)
h, w, c = arr.shape  # 300, 300, 3
n_pixels = h * w * c  # 270000

for seed in ["ELMINA", "elmina", "shadow", 42, 0, 1]:
    random.seed(seed)
    shadow = np.array([random.randint(20, 180) for _ in range(n_pixels)],
                      dtype=np.int16).reshape(h, w, c)
    diff = (arr - shadow) % 256
    unique_vals = len(np.unique(diff.flatten()))
    print(f"Seed {seed!r}: valeurs_uniques={unique_vals}")
```

**Résultat crucial :**

```
Seed 'ELMINA': valeurs_uniques=256
Seed 42:       valeurs_uniques=3   ← !!!
```

Avec **seed=42**, la différence n'a que **3 valeurs** : `{0, 1, 255}`.  
- `0` → pixel inchangé  
- `1` → LSB mis à 1  
- `255` (= -1 mod 256) → LSB mis à 0

L'image a été construite avec `random.seed(42)` comme couverture PRNG.

### Étape 4 : Extraction des données cachées

La clé `ELMINA` est utilisée comme **clé XOR répétée** sur les bits extraits.

```python
import random

random.seed(42)
arr = np.array(Image.open("fort.png")).astype(np.int16)
h, w, c = arr.shape

# Générer le masque PRNG
shadow = np.array([random.randint(20, 180) for _ in range(h * w * c)],
                  dtype=np.int16).reshape(h, w, c)

# Extraire les bits LSB (différence entre image et masque)
diff = (arr - shadow).flatten()
bits = [1 if d == 1 else 0 if d in (0, -1, 255) else None for d in diff]
bits = [b for b in bits if b is not None]

# Regrouper en octets
raw_bytes = bytearray()
for i in range(0, len(bits) - 7, 8):
    byte = 0
    for j in range(8):
        byte = (byte << 1) | bits[i + j]
    raw_bytes.append(byte)

# Déchiffrement XOR avec la clé ELMINA
key = b"ELMINA"
decrypted = bytes(b ^ key[i % len(key)] for i, b in enumerate(raw_bytes))

# Chercher la position du flag
for offset in range(len(decrypted) - 10):
    chunk = decrypted[offset:offset+50]
    if b'EcowasCTF' in chunk or b'ecowas' in chunk.lower():
        print(f"Offset {offset}: {chunk}")
        break
```

**Résultat à l'offset 4 :**

```text
EcowasCTF{3lm1n4_sh4d0ws_x0r_r3p34t1ng_k3y}
```

---

## Flag

```text
EcowasCTF{3lm1n4_sh4d0ws_x0r_r3p34t1ng_k3y}
```

---

## Ce que j'ai retenu

- **Commentaire ZIP** : souvent ignoré mais peut contenir la clé ou un hint critique. Toujours vérifier `zipfile.comment`.
- **Plage de pixels restreinte [20, 180]** : signe fort d'une image générée par PRNG (`random.randint`), pas une photo naturelle.
- **Seed=42** : classique en CTF pour les PRNG Python. Si les valeurs uniques de la différence s'effondrent → bingo.
- **XOR répétée + clé dans le ZIP** : pattern "ombre porte la clé, ombre porte le secret" = deux couches (PRNG + XOR).

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
