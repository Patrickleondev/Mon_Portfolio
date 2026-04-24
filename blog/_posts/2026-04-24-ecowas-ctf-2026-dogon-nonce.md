---
layout: post
title: "ECOWAS CTF 2026 — Dogon Nonce [Crypto/Hard]"
date: 2026-04-24 10:30:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, ecdsa, hnp, lll, lattice, secp256k1, aes-cbc, hidden-number-problem, hard]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐⭐⭐ Hard · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `signatures.json.txt` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/56_dogon_nonce_signatures.txt) |

## Description du challenge

> The Dogon elder signs every prophecy with the same ritual, but his hand trembles, always in the same direction.

**Fichier fourni :** `signatures.json.txt` — JSON contenant 100 signatures ECDSA sur secp256k1, plus un flag chiffré AES-CBC-128 (`iv` + `ct`).

---

## Analyse

La phrase "sa main tremble, toujours dans la même direction" est le hint central : les nonces `k` de toutes les signatures partagent un **biais MSB fixé** — leurs bits les plus significatifs sont toujours à zéro.

C'est le **Hidden Number Problem (HNP)** appliqué à ECDSA biaisé.

### Le modèle mathématique

Pour chaque signature ECDSA `(r, s)` sur le hash de message `z` :

$$k = s^{-1}(z + r \cdot d) \pmod{n}$$

Si tous les $k_i < 2^{252}$ (4 bits MSB toujours à 0), on a :

$$k_i < n/2^4 \qquad \text{pour chaque signature}$$

Cela constitue le HNP : trouver $d$ étant donnés de nombreuses équations où chaque $k_i$ est "petit".

---

## Solution

### Étape 1 : Construction du réseau LLL

On reformule le HNP comme un problème de vecteur court (SVP). Pour $m = 99$ paires, on construit une matrice $(m+2) \times (m+2)$ :

$$M = \begin{pmatrix}
nW & & & & \\
& nW & & & \\
& & \ddots & & \\
v_0 W & v_1 W & \cdots & 1 & \\
u_0 W & u_1 W & \cdots & 0 & n
\end{pmatrix}$$

où $W = 2^l$ (facteur d'échelle pour le biais $l=4$), $u_i = s_i^{-1} z_i \bmod n$, $v_i = s_i^{-1} r_i \bmod n$.

Un vecteur court dans la base LLL réduite révèle $d \bmod n$.

```python
# sage (solve_hnp.sage)
M = Matrix(ZZ, m + 2, m + 2)
for i in range(m):
    M[i, i] = q * W          # q = n
    M[m,   i] = vs[i] * W    # vs[i] = s_inv * r_i mod n
    M[m+1, i] = us[i] * W    # us[i] = s_inv * z_i mod n
M[m,   m]   = 1
M[m+1, m+1] = q

L = M.LLL()

for row in L:
    d_cand = int(row[m]) % q
    if verify_d(d_cand, pub_x, pub_y):   # d_cand * G == pub ?
        print(f"[+] d = {d_cand}")
```

**Résultat :** `d = 67911827788850813800782243008577423926326109308252141481040446601251442842732`

### Étape 2 : Déchiffrement du flag

Vérification : $d \cdot G \stackrel{?}{=} Q_{pub}$ — **correspond**.  
Dérivation de la clé AES : `sha256(d.to_bytes(32, 'big'))[:16]`.

```python
import json, hashlib
from Crypto.Cipher import AES

with open("signatures.json.txt") as f:
    data = json.load(f)

d = 67911827788850813800782243008577423926326109308252141481040446601251442842732
iv = bytes.fromhex(data["iv"])
ct = bytes.fromhex(data["ct"])

key = hashlib.sha256(d.to_bytes(32, 'big')).digest()[:16]
pt  = AES.new(key, AES.MODE_CBC, iv).decrypt(ct)
pad = pt[-1]
print(pt[:-pad].decode())
```

### Script SageMath complet

```python
# solve_hnp.sage — attaque LLL (lancer dans SageMath Docker)
import json
from sage.all import *

def verify_d(d_cand, Gx, Gy, pub_x, pub_y, q):
    p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
    E = EllipticCurve(GF(p), [0, 7])
    G = E([Gx, Gy])
    return int(d_cand) * G == E([pub_x, pub_y])

with open("signatures.json.txt") as f:
    data = json.load(f)

q     = int(data["n"], 16)
pub_x = int(data["pub"][0], 16)
pub_y = int(data["pub"][1], 16)
sigs  = data["sigs"]
Gx    = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
Gy    = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8

m = 99
l_bias = 4
W = 2**l_bias

us = [(pow(int(s["s"]), -1, q) * int(s["z"])) % q for s in sigs[:m]]
vs = [(pow(int(s["s"]), -1, q) * int(s["r"])) % q for s in sigs[:m]]

M = Matrix(ZZ, m + 2, m + 2)
for i in range(m):
    M[i, i]   = q * W
    M[m,   i] = vs[i] * W
    M[m+1, i] = us[i] * W
M[m,   m]   = 1
M[m+1, m+1] = q

L = M.LLL()
for row in L:
    d_cand = int(row[m]) % q
    if d_cand > 0 and verify_d(d_cand, Gx, Gy, pub_x, pub_y, q):
        print(f"[+] d = {d_cand}")
        break
```

---

## Flag

```text
EcowasCTF{h1dd3n_numb3r_pr0bl3m_sh4k3s_th3_3ld3r}
```

---

## Ce que j'ai retenu

- **"Tremble toujours dans la même direction"** = nonces biaisés côté MSB → HNP (pas LSB, pas nonce fixe).
- Le réseau LLL standard avec `l = 4` et 99 équations suffit sur secp256k1 (256 bits) même avec un biais modéré.
- La dérivation de clé AES : `sha256(d_bytes)[:16]` est le pattern le plus courant en CTF — à essayer en premier.
- Confirmer le biais **après** la résolution : calculer tous les $k_i$ pour vérifier qu'ils sont bien `< 2^252`.

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
