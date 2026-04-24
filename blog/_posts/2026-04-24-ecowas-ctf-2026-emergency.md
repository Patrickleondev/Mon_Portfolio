---
layout: post
title: "ECOWAS CTF 2026 — Emergency [Crypto/100pts]"
date: 2026-04-24 10:39:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, rot8000, unicode, cjk, rail-fence, cultural-context, ghana, cyberchef]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `output.txt` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/39_emergency_output.txt) |

---

## Description

Un message d'urgence en caractères CJK. Le nom du challenge est votre meilleur indice.

---

## Analyse

**Deux indices clés :**
1. Les caractères **CJK** (Sino-Japonais-Coréens) → **ROT8000** (ROT13 Unicode)
2. Le nom "Emergency" → numéro d'urgence du **Ghana** : **112** → Rail Fence Key=**11**, Offset=**2**

**ROT8000** encode les caractères ASCII vers des codepoints CJK selon :
```
codepoint = original_char + 9 + base_cjk
```
Décodage : `chr((ord(c) & 0xFF) - 9)`

**Rail Fence** est un chiffrement de transposition classique. CyberChef inclut un paramètre Offset que les implémentations Python standard oublient souvent.

---

## Solution

### Étape 1 — ROT8000 decode

```python
def rot8000_decode(text):
    result = []
    for c in text:
        code = ord(c)
        # Les CJK sont dans les plages unicode connues
        if 0x3400 <= code <= 0x9FFF:
            decoded = (code & 0xFF) - 9
            result.append(chr(decoded))
        else:
            result.append(c)
    return ''.join(result)

ciphertext = "..."  # caractères CJK du challenge
intermediate = rot8000_decode(ciphertext)
print(intermediate)  # texte Rail Fence
```

### Étape 2 — Rail Fence decode (Key=11, Offset=2)

Utiliser **CyberChef → Rail Fence Cipher Decode**, Key=11, Offset=2.

Ou en Python avec une implémentation supportant l'offset :

```python
def rail_fence_decode(text, rails, offset=0):
    n = len(text)
    pattern = []
    rail = 0
    direction = 1
    for i in range(n):
        actual_rail = (rail + offset) % rails
        pattern.append(actual_rail)
        rail += direction
        if rail == rails - 1 or rail == 0:
            direction = -direction
    
    # Reconstruire
    indices = sorted(range(n), key=lambda i: pattern[i])
    result = [''] * n
    for i, idx in enumerate(indices):
        result[idx] = text[i]
    return ''.join(result)

flag = rail_fence_decode(intermediate, rails=11, offset=2)
print(flag)
```

**Dérivation des paramètres :**
- Challenge = "Emergency" → numéro urgence Ghana = **112**
- "1, 1, 2" → Rail Fence Key=**11**, Offset=**2**

---

## Flag

```text
EcowasCTF{r0t_w1th_f3nc3_s0und5_fun_ce952d580499139}
```

---

## Leçons retenues

- Caractères CJK dans un ciphertext → toujours essayer ROT8000 en premier
- Le **nom du challenge** encode souvent les paramètres : "Emergency" → Ghana → 112
- CyberChef Rail Fence a un paramètre Offset — les implémentations Python standard en manquent
- ROT8000 = version Unicode de ROT13 pour les scripts non-latins

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
