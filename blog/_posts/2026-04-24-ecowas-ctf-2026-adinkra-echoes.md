---
layout: post
title: "ECOWAS CTF 2026 — Adinkra Echoes [Steganography/Medium]"
date: 2026-04-24 11:00:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, lsb, png, alpha-channel, vigenere, medium]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐⭐ Medium · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `adinkra.png` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/61_adinkra_echoes.png) |

## Description du challenge

> "The Adinkra symbols echo the wisdom of those who came before. Listen carefully to what the image whispers."

**Fichier fourni :** `adinkra.zip` → `adinkra.png` (image PNG 200×200, mode RGBA)

---

## Analyse

Le mot **Adinkra** fait référence aux pictogrammes culturels du peuple Akan (Ghana/Côte d'Ivoire), thème récurrent de ce CTF africain. Le titre "Echoes" et la catégorie Steganography indiquent que l'image cache un message.

L'image est en mode **RGBA** (4 canaux). La présence du canal Alpha est suspecte — c'est un vecteur classique pour cacher des données via LSB.

---

## Solution

### Étape 1 : Lire les métadonnées PNG

```python
from PIL import Image

img = Image.open("adinkra.png")
print(img.size, img.mode)  # (200, 200) RGBA

for key, val in img.info.items():
    print(f"{key}: {val}")
```

**Trouvaille :** Un chunk `tEXt` contient :

```
hint: Nyansapo keeps the key
```

**Nyansapo** est un symbole Adinkra signifiant "nœud de sagesse" — c'est notre clé de déchiffrement.

### Étape 2 : Extraction LSB du canal Alpha

```python
from PIL import Image
import numpy as np

img = Image.open("adinkra.png")
arr = np.array(img)

# Extraire le LSB du canal Alpha (canal 3)
alpha = arr[:, :, 3]
lsb_bits = alpha.flatten() & 1  # Garde seulement le bit de poids faible

# Regrouper les bits en octets (MSB first)
bytes_data = bytearray()
for i in range(0, len(lsb_bits) - 7, 8):
    byte = 0
    for j in range(8):
        byte = (byte << 1) | int(lsb_bits[i + j])
    bytes_data.append(byte)

print(bytes_data.decode("utf-8", errors="replace"))
```

**Résultat :**

```
RaojssRHS{3pz03g_0f_4d1bxp4_n1v3a3r3}
```

On reconnaît la structure d'un flag chiffré : `XXXXX{...}` avec du l33tspeak.

### Étape 3 : Déchiffrement Vigenère étendu

Le challenge s'appelle "Adinkra Echoes" et le hint mentionne "Nyansapo keeps the key". Clé + substitution alphabétique → **chiffre de Vigenère**.

La subtilité : cette implémentation utilise un **Vigenère étendu** — la clé avance sur **tous les caractères** (y compris `{`, `_`, chiffres), mais ne déplace que les lettres alphabétiques.

```python
def vigenere_decrypt_extended(ciphertext, key):
    """La clé avance sur TOUS les caractères, mais déplace seulement les lettres."""
    key = key.upper()
    key_idx = 0
    result = ""
    for char in ciphertext:
        shift = ord(key[key_idx % len(key)]) - ord('A')
        key_idx += 1  # Avance sur TOUS les caractères

        if char.isalpha():
            if char.isupper():
                result += chr((ord(char) - ord('A') - shift) % 26 + ord('A'))
            else:
                result += chr((ord(char) - ord('a') - shift) % 26 + ord('a'))
        else:
            result += char
    return result

ciphertext = "RaojssRHS{3pz03g_0f_4d1bxp4_n1v3a3r3}"
print(vigenere_decrypt_extended(ciphertext, "NYANSAPO"))
# → EcowasCTF{3ch03s_0f_4d1nkr4_v1g3n3r3}
```

> **Pièges évité :** le Vigenère *standard* (clé n'avance que sur les lettres) donnait un mauvais résultat. Si le déchiffrement "presque marche", essayez de modifier la logique d'avancement de la clé.

---

## Flag

```
EcowasCTF{3ch03s_0f_4d1nkr4_v1g3n3r3}
```

Traduit du l33tspeak : "echoes of adinkra vigenere" — une belle référence au thème du challenge.

---

## Ce que j'ai retenu

- **PNG RGBA** : le canal Alpha est rarement utilisé en stéganographie — à toujours vérifier en premier.
- **Chunks PNG** : le chunk `tEXt` peut contenir des hints cachés. Lire toutes les métadonnées avec `img.info.items()`.
- **Vigenère étendu** : si le Vigenère standard échoue de peu, changer la règle d'avancement de l'index de clé.

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
