---
layout: post
title: "ECOWAS CTF 2026 — Star Drums [Steganography/Medium]"
date: 2026-04-24 10:45:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, morse, audio, base64, rot13, wav, medium]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐⭐ Medium · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `star_drums.wav` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/60_star_drums.wav) |

## Description du challenge

> Drums across the Sahel carry messages in their rhythm. Can you decode the beats?

**Fichier fourni :** `drums.wav` — fichier WAV mono 8 kHz, ~57 secondes, contenant des battements rythmiques.

---

## Analyse

Le fichier audio encode un flag via du code Morse. Mais le flag a été transformé avant l'encodage audio :

1. Flag brut `EcowasCTF{...}` → **encodé en base64**
2. Chaque lettre du base64 → **ROT-13** (les chiffres et `=` restent inchangés)
3. Tout mis en **majuscules** (perte d'information de casse)
4. Converti en **Morse/audio**

Pour retrouver le flag, il faut inverser la chaîne dans l'ordre inverse.

---

## Solution

### Étape 1 : Décodage Morse depuis l'audio

Analyse de l'énergie en trames de 10 ms pour détecter les patterns on/off (dit/dah/espace).

```python
import wave, numpy as np

with wave.open('drums.wav') as wf:
    rate = wf.getframerate()          # 8000 Hz
    raw = wf.readframes(wf.getnframes())

data = np.frombuffer(raw, dtype=np.int16).astype(float)
frame_size = 80   # 10 ms à 8 kHz
energy = np.array([np.sum(data[i*80:(i+1)*80]**2) for i in range(len(data)//80)])
active = energy / np.max(energy) > 0.05

# Mesurer les longueurs de séquences → classifier en dit (1 unité),
# dah (3 unités), inter-symbole, espace-mot
```

**Résultat du décodage Morse :**

```
EJAIQ2SMD1ETR3Z0NQAFK2ELAT1MK20JPAZMK2V2AS9LZUDKZ30=
```

La chaîne termine par `=` et ne contient que des alphanumériques — c'est caractéristique du **base64**.

### Étape 2 : Récupération de la casse perdue (ROT-13 + majuscules)

Chaque lettre majuscule peut correspondre à deux caractères base64 (ex: Morse `E` vient de base64 `R` ou `e` après ROT-13 + majuscule). On teste toutes les combinaisons groupe par groupe de 4 caractères base64 en maximisant le score de lisibilité.

```python
import base64
from itertools import product

morse_decoded = 'EJAIQ2SMD1ETR3Z0NQAFK2ELAT1MK20JPAZMK2V2AS9LZUDKZ30='

def rot13_inv(c):
    """Lettre Morse majuscule → deux candidats base64 possibles (maj et min)."""
    if c.isdigit() or c == '=':
        return [c]
    idx = ord(c) - ord('A')
    upper = chr(ord('A') + (idx + 13) % 26)
    return [upper, upper.lower()]

possible = [rot13_inv(c) for c in morse_decoded]

def printable_score(data):
    if not data:
        return -1
    return sum(1 for b in data if 32 <= b < 127)

# Recherche gloutonne par groupes de 4
result_chars = []
for i in range(0, len(possible), 4):
    group = possible[i:i+4]
    best_score = -1
    best_combo = [opts[0] for opts in group]
    for combo in product(*group):
        test_b64 = ''.join(result_chars) + ''.join(combo)
        pad = (4 - len(test_b64) % 4) % 4
        try:
            dec = base64.b64decode(test_b64 + '=' * pad)
            sc = printable_score(dec[-3:])
            if sc > best_score:
                best_score, best_combo = sc, list(combo)
        except Exception:
            pass
    result_chars.extend(best_combo)

b64_str = ''.join(result_chars)
flag = base64.b64decode(b64_str).decode()
print(f"[+] Flag: {flag}")
```

**Base64 récupéré :** `RWNvd2FzQ1RGe3M0aDNsX2RyNG1zX20wcnMzX2I2NF9yMHQxM30=`  
**Décodé :** `EcowasCTF{s4h3l_dr4ms_m0rs3_b64_r0t13}` ✅

---

## Flag

```
EcowasCTF{s4h3l_dr4ms_m0rs3_b64_r0t13}
```

---

## Ce que j'ai retenu

- Une chaîne Morse qui se termine par `=` et ne contient que des alphanumériques → **base64 probable**.
- ROT-13 + majuscule supprime l'information de casse → la récupération gloutonne groupe par groupe (4 chars = 3 bytes décodés) est efficace sans brute-force total.
- Le titre + description ("Sahel drums") indiquait la chaîne de transformation complète, encodée dans le flag lui-même (`m0rs3_b64_r0t13`).

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
