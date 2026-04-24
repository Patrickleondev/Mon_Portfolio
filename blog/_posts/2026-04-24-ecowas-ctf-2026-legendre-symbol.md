---
layout: post
title: "ECOWAS CTF 2026 — Legendre Symbol [Crypto/100pts]"
date: 2026-04-24 10:38:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, legendre-symbol, prg, quadratic-residues, number-theory, kpa, prime-recovery]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐ (Medium) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `output.txt` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/38_legendre_output.txt) |

---

## Description

> *"1797 — une date qui compte."* Un générateur pseudo-aléatoire basé sur le symbole de Legendre chiffre le flag bit à bit.

---

## Analyse

**Schéma de chiffrement :**
- Un premier `p` est choisi secrètement
- Pour chaque bit `b` du flag :
  - Si `b = 1` : on génère un résidu quadratique (QR) aléatoire mod `p`
  - Si `b = 0` : on génère un non-résidu quadratique (QNR) aléatoire mod `p`
- **Décodage :** $\left(\frac{c_i}{p}\right) = 1$ → bit `1`, sinon bit `0`

Le symbole de Legendre $\left(\frac{a}{p}\right) = a^{(p-1)/2} \mod p$.

**Note :** "1797" dans la description fait référence à l'**année de publication** de la notation par Legendre — pas à la valeur de `p`.

---

## Récupération de `p`

**Observation critique :** `p > max(enc)` toujours — le générateur produit des valeurs mod `p`.

**KPA (Known Plaintext Attack) sur le préfixe `EcowasCTF{` :**
- Le préfixe connu = 80 bits
- Pour chaque candidat `p` : calculer le Legendre symbol de chaque valeur chiffrée et vérifier si le préfixe correspond
- Probabilité de faux positif = $2^{-80}$ ≈ 0

```python
from sympy.ntheory import isprime, nextprime

# Valeurs chiffrées
enc = [...]  # liste de grands entiers (donnée)

# p > max(enc)
known_prefix_bits = [1,0,0,0,0,1,0,1,...]  # "EcowasCTF{" en binaire

def try_prime(p):
    for i, bit in enumerate(known_prefix_bits):
        legendre = pow(enc[i], (p-1)//2, p)
        predicted = 1 if legendre == 1 else 0
        if predicted != bit:
            return False
    return True

# Scanner les premiers premiers supérieurs à max(enc)
start = max(enc) + 1
p = nextprime(start)
while not try_prime(p):
    p = nextprime(p)

print(f"p trouvé : {p}")
```

**`p` trouvé :** `1007621497415251`

---

## Décodage du flag

```python
p = 1007621497415251
bits = []
for c in enc:
    legendre = pow(c, (p-1)//2, p)
    bits.append('1' if legendre == 1 else '0')

# Convertir les bits en ASCII (par groupes de 8)
chars = []
for i in range(0, len(bits), 8):
    byte = int(''.join(bits[i:i+8]), 2)
    chars.append(chr(byte))
print(''.join(chars))
```

---

## Flag

```
EcowasCTF{p4tterns_1n_re5idu3s_85e5ae3583}
```

---

## Leçons retenues

- **CRITIQUE :** `p > max(enc)` — commencer le scan KPA depuis `max(enc)+1`, pas depuis les petits premiers !
- "1797" = année de Legendre (contexte historique), pas un indice mathématique
- Le Legendre symbol distingue QR/QNR en $O(\log p)$ opérations
- Faux positif avec 80 bits connus = probabilité $2^{-80}$ → quasi impossible

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
