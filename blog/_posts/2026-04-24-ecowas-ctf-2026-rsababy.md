---
layout: post
title: "ECOWAS CTF 2026 — Rsababy [Crypto/50pts]"
date: 2026-04-24 10:36:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, rsa, small-exponent, cube-root, e3, no-padding, gmpy2]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐ (Easy) · **Points :** 50  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

RSA pour bébés. L'exposant est très petit.

---

## Analyse

**Attaque :** RSA avec `e = 3` et sans padding (textbook RSA).

Quand `e = 3` et que le message $m$ est petit par rapport à $n$, le chiffré satisfait simplement :

$$c = m^3 \mod n$$

Si $m^3 < n$ (pas de réduction modulaire), alors :

$$m = \lfloor c^{1/3} \rfloor$$

Il suffit de calculer la **racine cubique entière** de `c`.

---

## Solution

```python
import gmpy2

# Valeurs du challenge
n = ...  # modulus (donné)
e = 3
c = ...  # chiffré (donné)

# Racine cubique entière exacte
m, exact = gmpy2.iroot(c, 3)

if exact:
    print(bytes.fromhex(hex(m)[2:]).decode())
else:
    # Si m^3 > n, la réduction modulaire a joué → autre approche
    print("Besoin d'une autre méthode")
```

**Sans gmpy2 :**

```python
def iroot(n, k):
    """Racine k-ième entière de n."""
    if n < 0:
        return -iroot(-n, k), False
    if n == 0:
        return 0, True
    x = int(round(n ** (1/k)))
    for x in [x-1, x, x+1]:
        if x**k == n:
            return x, True
    return x, False

m, _ = iroot(c, 3)
print(bytes.fromhex(hex(m)[2:]).decode())
```

---

## Flag

```text
EcowasCTF{cub3_r00t_n0_p4dd1ng_ez}
```

---

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
