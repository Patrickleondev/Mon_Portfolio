---
layout: post
title: "ECOWAS CTF 2026 — Coppersmith [Crypto/500pts]"
date: 2026-04-24 10:57:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, rsa, coppersmith, small-roots, lattice, sagemath, factorization, partial-key]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Les 319 bits inférieurs du premier facteur RSA ont fuité. Retrouvez le facteur complet.

---

## Analyse

**Données :**
- `N` : modulus RSA 1024 bits
- `e` : exposant public (65537)
- `c` : chiffré
- `p_low` : les 319 bits inférieurs de `p` (soit `p mod 2^319`)

**Objectif :** Retrouver `p` entier → factoriser `N` → déchiffrer `c`.

**Théorie — Méthode de Coppersmith :**

On pose $k = 319$ bits connus (les bits bas). L'inconnu est $p_{high} < 2^{193}$.

$$p = p_{high} \cdot 2^k + p_{low}$$

On construit le polynôme monic :

$$f(x) = x \cdot 2^k + p_{low} \pmod{N}$$

dont la racine $x_0 = p_{high}$ satisfait $f(x_0) \equiv 0 \pmod{p}$ (avec $p | N$).

`small_roots` de SageMath trouve $x_0$ via réduction de réseau (LLL).

---

## Solution (SageMath)

```python
# solve.sage
proof.arithmetic(False)

N = ...  # modulus 1024 bits
e = 65537
c = ...  # chiffré
p_low = ...  # 319 bits bas de p
k = 319      # nombre de bits connus

# Construire le polynôme
R = Zmod(N)['x']
x = R.gen()
f = x * pow(2, k) + p_low

# Coppersmith small_roots
# X = borne sur |x_0| = 2^(1024/2 - k) = 2^(512 - 319) = 2^193
X = 2^197  # légère marge
beta = 0.499  # p ~ sqrt(N), donc beta = 0.5 - epsilon

roots = f.small_roots(X=X, beta=beta, epsilon=1/40)
print(f"Roots: {roots}")

if roots:
    p_high = int(roots[0])
    p = p_high * (2**k) + p_low
    
    assert N % p == 0, "Facteur incorrect"
    q = N // p
    phi = (p - 1) * (q - 1)
    d = pow(e, -1, phi)
    
    m = pow(c, d, N)
    flag = bytes.fromhex(hex(m)[2:])
    print(flag.decode())
```

**Exécution :**
```bash
sage solve.sage
```

---

## Flag

```text
EcowasCTF{c0pp3rsm1th_f1nds_th3_nil3_s0urce}
```

---

## Leçons retenues

- `beta = 0.499` (pas 0.5) pour les facteurs de taille similaire
- `epsilon = 1/40` est souvent un bon point de départ si les paramètres par défaut échouent
- `X = 2^(unknown_bits + quelques bits de marge)` — ici 2^197 au lieu de 2^193
- `proof.arithmetic(False)` en première ligne SageMath pour éviter les vérifications lentes
- Référence : le **Nil** = fleuve africain, source de civilisation → "Coppersmith trouve la source"

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
