---
layout: post
title: "ECOWAS CTF 2026 — Silent Whispers II [Steganography/200pts]"
date: 2026-04-24 10:12:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, stegsnow, base64, zip, zipcrpto, password-cracking, rockyou]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐⭐ (Medium) · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Le deuxième volume des chuchotements. Plus de couches cette fois.

---

## Analyse

Comme dans Silent Whispers I, le fichier texte contient des tabs et espaces en fin de ligne. STEGSNOW est à nouveau utilisé, mais la sortie n'est pas directement le flag.

**Couches :**
1. **STEGSNOW** → blob Base64
2. **Base64 decode** → fichier ZIP chiffré (ZipCrypto)
3. **Crack du mot de passe ZIP** → flag.txt

---

## Solution

### Étape 1 — Extraction STEGSNOW

```bash
stegsnow -C information_II.txt > blob.b64
```

### Étape 2 — Décodage Base64

```bash
base64 -d blob.b64 > flag.zip
```

### Étape 3 — Crack du mot de passe

Le ZIP utilise **ZipCrypto**, vulnérable au dictionnaire. Avec `rockyou.txt` :

```python
import zipfile

with zipfile.ZipFile("flag.zip") as zf:
    with open("/usr/share/wordlists/rockyou.txt", "rb") as wl:
        for line in wl:
            pwd = line.strip()
            try:
                zf.extractall(pwd=pwd)
                print(f"Password: {pwd.decode()}")
                break
            except:
                pass
```

Mot de passe trouvé : **`stealth123`** (~position 783 000 dans rockyou)

### Étape 3 bis — Extraction

```bash
unzip -P stealth123 flag.zip
cat flag.txt
```

---

## Flag

```text
flag{l@y37s_0n_l@y3rs}
```

---

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
