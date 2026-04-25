---
layout: post
title: "ECOWAS CTF 2026 — Yoruba VM [Reverse/500pts]"
date: 2026-04-24 11:16:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, elf, custom-vm, aes-sbox, xor, static-analysis, ghidra, inversion, yoruba]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `yoruba_vm.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/76_yoruba_vm.zip) |

## Description

Une machine virtuelle personnalisée nommée d'après le peuple **Yoruba** d'Afrique de l'Ouest. Rétro-ingénierie pour trouver le flag.

---

## Analyse

Le binaire ELF 64-bit implémente une **VM personnalisée** qui valide le flag caractère par caractère :

```
result = sbox[input[i] ^ keys[i]]
if result != targets[i] → Wrong
```

**Composants :**
- **S-Box AES** : table de substitution non-linéaire (256 bytes)
- **keys[32]** : tableau de clés XOR par position (hardcodé)
- **targets[32]** : valeurs cibles attendues (hardcodées)

**Inversion :** Construire la **S-Box inverse** et XOR avec les clés.

---

## Solution

### Étape 1 — Extraire les constantes depuis Ghidra

```python
# S-Box AES standard (ou extraire du binaire)
SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
    # ... 256 valeurs au total
]

# Extraire keys[] et targets[] depuis les sections .data du binaire
# (adresses à trouver dans Ghidra via la fonction de validation)
keys    = [0x..., ...]  # 32 bytes
targets = [0x..., ...]  # 32 bytes
```

### Étape 2 — Construire la S-Box inverse

```python
inv_sbox = [0] * 256
for i, v in enumerate(SBOX):
    inv_sbox[v] = i
```

### Étape 3 — Calculer le flag

```python
flag = []
for i in range(32):
    # input[i] = inv_sbox[targets[i]] ^ keys[i]
    flag.append(inv_sbox[targets[i]] ^ keys[i])

print(bytes(flag).decode())
```

### Vérification mathématique

$$\text{result} = \text{SBOX}[\text{input}[i] \oplus \text{keys}[i]] = \text{targets}[i]$$

$$\Rightarrow \text{input}[i] \oplus \text{keys}[i] = \text{SBOX}^{-1}[\text{targets}[i]]$$

$$\Rightarrow \text{input}[i] = \text{SBOX}^{-1}[\text{targets}[i]] \oplus \text{keys}[i]$$

---

## Flag

```text
EcowasCTF{y0rub4_vm_r3v_master!}
```

---

## Leçons retenues

- **Inverser une S-Box** : si `sbox[x] = y` alors `inv_sbox[y] = x` — simple tableau de 256 entrées
- Pas besoin d'exécuter le binaire — l'analyse statique suffit pour extraire les 3 tableaux
- La S-Box AES est une constante connue — vérifier si le binaire l'utilise directement
- **Yoruba** : peuple d'Afrique de l'Ouest (Nigeria, Bénin, Togo) avec une riche tradition cryptique dans l'Ifá

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
