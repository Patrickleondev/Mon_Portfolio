---
layout: post
title: "ECOWAS CTF 2026 — Sankofa [Crypto/300pts]"
date: 2026-04-24 10:47:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, ecdsa, lcg, nonce-reuse, secp256k1, lattice, aes-cbc, private-key-recovery, sqrt-mod]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 300  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `sankofa_files.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/47_sankofa_files.zip) |

## Description

*Sankofa* — "Retourner chercher ce qu'on a laissé derrière." Les nonces ECDSA suivent un pattern. Retrouvez-le.

---

## Analyse

Les nonces ECDSA sont générés par un **LCG (Linear Congruential Generator)** :

$$k_{i+1} = \alpha \cdot k_i + \beta \pmod{n}$$

Avec 4 signatures $(r_i, s_i, \text{msg}_i)$ et la clé publique $Q = d \cdot G$, on peut récupérer la clé privée $d$.

**Courbe :** secp256k1 (ordre `n`)

---

## Théorie de l'attaque

Chaque signature ECDSA donne :

$$s_i \cdot k_i = H(\text{msg}_i) + r_i \cdot d \pmod{n}$$

Donc :

$$k_i = s_i^{-1}(H_i + r_i \cdot d) = a_i + b_i \cdot d$$

avec $a_i = s_i^{-1} H_i$ et $b_i = s_i^{-1} r_i$.

La relation LCG donne :

$$k_{i+1} - \alpha k_i - \beta = 0 \pmod{n}$$

En substituant les expressions linéaires en $d$ :

$$(a_{i+1} + b_{i+1} d) - \alpha(a_i + b_i d) - \beta = 0$$

Pour deux paires consécutives, on obtient une **équation quadratique en $\alpha$** (en éliminant $\beta$).

---

## Solution

```python
from sympy import sqrt_mod
from sympy.ntheory import factorint

# Paramètres secp256k1
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

def modinv(a, m):
    return pow(a, -1, m)

# Données du challenge (4 signatures)
sigs = [(r1, s1, h1), (r2, s2, h2), (r3, s3, h3), (r4, s4, h4)]

# Pour chaque signature : k_i = a_i + b_i * d
coeffs = []
for r, s, h in sigs:
    s_inv = modinv(s, n)
    a = (s_inv * h) % n
    b = (s_inv * r) % n
    coeffs.append((a, b))

# Équation quadratique en alpha (à partir de 3 signatures)
# (a2 - a3) * b1 - (a1 - a3) * b2 + ... → quadratique
# Résoudre avec sqrt_mod

# Récupération de la clé privée d
# Pour chaque candidat alpha, calculer d et vérifier contre Q
for alpha_candidate in candidates:
    # Calculer beta depuis les nonces
    beta = (coeffs[1][0] - alpha_candidate * coeffs[0][0]) % n
    # Calculer d depuis k1
    k1 = (coeffs[0][0] + coeffs[0][1] * d_candidate) % n
    # Vérifier: Q == d * G
    ...

# Déchiffrement du flag (AES-256-CBC)
import hashlib
from Crypto.Cipher import AES

key = hashlib.sha256(d.to_bytes(32, 'big')).digest()
# iv et ciphertext donnés dans le challenge
cipher = AES.new(key, AES.MODE_CBC, iv)
flag = cipher.decrypt(ciphertext).rstrip(b'\x00')
print(flag.decode())
```

---

## Flag

```
EcowasCTF{r3turn_4nd_f3tch_1t_l1near_LCG_kn0n_nonces}
```

---

## Leçons retenues

- ECDSA + nonces LCG → attaque par équation quadratique mod n
- `sympy.sqrt_mod` gère les racines carrées modulaires (attention : peut retourner plusieurs solutions)
- Après récupération de d, déchiffrement AES avec `SHA256(d)` comme clé
- Référence culturelle : **Sankofa** = "il n'est pas mauvais de revenir en arrière" (proverbe Akan)

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
