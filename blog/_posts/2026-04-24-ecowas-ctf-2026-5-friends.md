---
layout: post
title: "ECOWAS CTF 2026 — 5 Friends [Crypto/500pts]"
date: 2026-04-24 11:16:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, rsa, shared-modulus, miller-rabin, factorization, multi-exponent, private-key-leak]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `output.txt` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/86_5friends_output.txt) |

## Description

Cinq amis partagent le même modulus RSA `N`, chacun avec son propre exposant `e_i`. L'un d'eux a laissé fuiter sa clé privée. Utilisez-la pour déchiffrer le message commun.

---

## Analyse

**Données :**
- `N` : modulus RSA commun (partagé par les 5)
- `e1, e2, e3, e4, e5` : exposants publics distincts
- `d_leaked` : clé privée d'un ami (ex: pour `e = 65537`)
- `c` : chiffré avec `E_total = e1 * e2 * e3 * e4 * e5`

**Deux étapes :**
1. **Factoriser N** avec la paire `(e_leaked, d_leaked)` via Miller-Rabin randomisé
2. **Calculer `d_total`** = inverse de `E_total` mod `φ(N)`

---

## Théorie — Factorisation avec (e, d) connu

Si on connaît `(e, d)` tels que `e·d ≡ 1 (mod φ(N))`, alors `e·d - 1 = k·φ(N)`.

L'algorithme de Miller-Rabin randomisé exploite cette relation :

```python
import random
import math

def factor_with_ed(N, e, d):
    k = e * d - 1  # = multiple de phi(N)
    
    while True:
        g = random.randint(2, N - 2)
        t = k
        
        while t % 2 == 0:
            t //= 2
            x = pow(g, t, N)
            
            if x > 1 and math.gcd(x - 1, N) > 1:
                p = math.gcd(x - 1, N)
                if 1 < p < N:
                    return p, N // p
```

---

## Solution

```python
import math

# Données du challenge
N  = ...
e1, e2, e3, e4, e5 = ...  # les 5 exposants
e_leaked = 65537
d_leaked = ...
c = ...

# Étape 1 — Factoriser N
p, q = factor_with_ed(N, e_leaked, d_leaked)
phi = (p - 1) * (q - 1)

# Étape 2 — Calculer E_total et d_total
E_total = e1 * e2 * e3 * e4 * e5
d_total = pow(E_total, -1, phi)

# Étape 3 — Déchiffrer
m = pow(c, d_total, N)
flag = bytes.fromhex(hex(m)[2:])
print(flag.decode())
```

---

## Flag

```
EcowasCTF{90715ab05d61b03306f1ebf7e0fced7a}
```

---

## Leçons retenues

- Shared RSA modulus : si un ami compromise sa clé privée, tout le groupe est compromis
- La factorisation Miller-Rabin avec `(e, d)` est probabiliste mais converge rapidement (~quelques itérations)
- `E_total = e1 * e2 * e3 * e4 * e5` puis `d_total = E_total^{-1} mod φ(N)`
- La clé fuitée (e=65537) suffit à factoriser N — pas besoin de la clé correspondant à E_total

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
