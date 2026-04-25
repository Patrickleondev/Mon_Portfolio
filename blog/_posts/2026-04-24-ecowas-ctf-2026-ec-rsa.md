---
layout: post
title: "ECOWAS CTF 2026 — EC-RSA [Crypto/Medium]"
date: 2026-04-24 12:15:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, rsa, ecc, singular-curve, discriminant, factorization, medium]
toc: true
---

> **CTF :** ECOWAS CTF 2026 (Événement 3) · **Catégorie :** Crypto · **Difficulté :** ⭐⭐ Medium · **Points :** 300  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `output.txt` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/91_ecrsa_output.txt) |

## Description du challenge

> Recover the message from the provided transcript.

**Fichier fourni :** `output.txt`

```
n = 8305897372294618303790730933026686028669411056636714917892749323959323161141424496679019375095063318029547175378175835239294264736699189945765919621993497
e = 65537
c = 7152339538563309886777736155323644747688648224058535449876896468684351408797422198135380268602537704783913811595122523148686419286175258107073807643373672

E: y^2 = x^3 + a*x + b (mod n)
a = 3274389938446888338023820165797459686305021683395026290963914161246738571343049592543548949358260111396442736057855513107175889757679976970124216595942918
b = 1547374211413410688995339412134250202225565292216313412288596797218494362933347691183761956769076338113411365898378081517680611545272465023573394573283537
G = (...)
```

---

## Analyse

RSA classique (n=512 bits, e=65537, c) **plus** une courbe elliptique E définie **mod n** — le même modulus RSA. La présence de la courbe est le hint d'attaque : elle permet de factoriser `n`.

### Rappel : la condition de non-singularité

Une courbe elliptique `y² = x³ + ax + b` est **non-singulière** si et seulement si son discriminant est non-nul :

$$\Delta = -16(4a^3 + 27b^2) \neq 0$$

Si $\Delta = 0$, la courbe est **singulière** (elle a un point de rebroussement ou une nœuds) et le groupe elliptique n'est plus sûr.

---

## Attaque : courbe singulière → factorisation de n

Les paramètres `a` et `b` ont été choisis intentionnellement de sorte que :

$$4a^3 + 27b^2 \equiv 0 \pmod{p}$$

où `p` est l'un des facteurs premiers de `n`. Cela signifie que `gcd(4a³ + 27b², n)` révèle directement `p` — en une seule opération.

```python
from math import gcd

n = 83058973722946183...  # (valeur complète dans output.txt)
a = 32743899384468883...
b = 15473742114134106...
e = 65537
c = 71523395385633098...

disc = (4 * pow(a, 3, n) + 27 * pow(b, 2, n)) % n
p = gcd(disc, n)
print(f"[+] p = {p}")
# 107947079974157289205788524077393656716464582533328595682737301537001105794041
```

### Déchiffrement RSA

Une fois `n = p × q` factorisé :

```python
q = n // p
assert p * q == n, "Factorisation incorrecte"

phi_n = (p - 1) * (q - 1)
d = pow(e, -1, phi_n)
m = pow(c, d, n)
flag = m.to_bytes((m.bit_length() + 7) // 8, 'big').decode()
print(f"[+] Flag : {flag}")
```

**Script complet :**

```python
from math import gcd

n = 8305897372294618303790730933026686028669411056636714917892749323959323161141424496679019375095063318029547175378175835239294264736699189945765919621993497
e = 65537
c = 7152339538563309886777736155323644747688648224058535449876896468684351408797422198135380268602537704783913811595122523148686419286175258107073807643373672
a = 3274389938446888338023820165797459686305021683395026290963914161246738571343049592543548949358260111396442736057855513107175889757679976970124216595942918
b = 1547374211413410688995339412134250202225565292216313412288596797218494362933347691183761956769076338113411365898378081517680611545272465023573394573283537

# 1. Factoriser n via le discriminant de la courbe singulière
disc = (4 * pow(a, 3, n) + 27 * pow(b, 2, n)) % n
p = gcd(disc, n)
assert 1 < p < n, "GCD n'a pas donné un facteur non trivial"
q = n // p
assert p * q == n

print(f"[+] p = {p}")
print(f"[+] q = {q}")

# 2. Déchiffrement RSA
phi_n = (p - 1) * (q - 1)
d = pow(e, -1, phi_n)
m = pow(c, d, n)
flag = m.to_bytes((m.bit_length() + 7) // 8, 'big').decode()
print(f"[+] Flag : {flag}")
```

**Sortie :**

```
[+] p = 107947079974157289205788524077393656716464582533328595682737301537001105794041
[+] q = 76944154936867018395553946448419766028148516817637820994009999834041474139057
[+] Flag : EcowasCTF{singular_curves_factor_rsa_keys}
```

---

## Flag

```text
EcowasCTF{singular_curves_factor_rsa_keys}
```

---

## Ce que j'ai retenu

- **Ne jamais réutiliser le modulus RSA `n` comme modulus d'une courbe elliptique** sans vérifier que `4a³ + 27b² ≢ 0 (mod p)` pour chaque facteur premier `p`.
- Le discriminant **fuit directement un facteur premier** via un simple `gcd` — c'est O(1), pas du ECM ou du NFS.
- Pattern : `n = RSA_modulus` + courbe E définie mod n → **toujours tester le discriminant en premier**.
- Cette attaque est liée au fait que sur une courbe singulière, le "groupe" elliptique se réduit à un groupe additif ou multiplicatif sur `GF(p)`, perdant toute sécurité ECC.

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
