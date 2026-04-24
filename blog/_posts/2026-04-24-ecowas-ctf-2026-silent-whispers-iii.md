---
layout: post
title: "ECOWAS CTF 2026 — Silent Whispers III [Steganography/500pts]"
date: 2026-04-24 10:13:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [steganography, stegsnow, aes-cbc, pcap, wireshark, key-extraction, network-forensics]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Steganography · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `traffic.pcapng` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/13_silent_whispers_iii.pcapng) |

---

## Description

Le troisième volume — le plus délicat. Les chuchotements sont maintenant chiffrés.

---

## Analyse

Encore STEGSNOW, mais cette fois la sortie est chiffrée en **AES-256-CBC**. La clé doit être trouvée ailleurs : dans un fichier PCAP fourni avec le challenge.

**Couches :**
1. **STEGSNOW** → données chiffrées AES-256-CBC
2. **PCAP analysis** → clé AES `ghostkey`
3. **AES-256-CBC decrypt** → flag

---

## Solution

### Étape 1 — STEGSNOW extraction

```bash
stegsnow -C information.txt > encrypted.bin
```

La sortie n'est pas lisible → données chiffrées.

### Étape 2 — Analyse PCAP

Ouverture du PCAP dans Wireshark. Recherche de chaînes lisibles dans les paquets TCP :

```
Follow TCP Stream → trouver "key=ghostkey"
```

Ou via `tshark` :

```bash
tshark -r capture.pcap -Y "tcp" -T fields -e data | xxd -r -p | strings | grep key
```

**Clé trouvée :** `ghostkey`

### Étape 3 — Déchiffrement AES-256-CBC

```python
from Crypto.Cipher import AES
import hashlib

key = hashlib.sha256(b"ghostkey").digest()  # 32 bytes pour AES-256
# IV extrait des 16 premiers octets du fichier chiffré
with open("encrypted.bin", "rb") as f:
    data = f.read()

iv = data[:16]
cipher_data = data[16:]
cipher = AES.new(key, AES.MODE_CBC, iv)
plaintext = cipher.decrypt(cipher_data)
print(plaintext.rstrip(b"\x00"))
```

---

## Flag

```text
flag{c0v3rt_chAnn3l_m@st3r}
```

---

## Leçon retenue

- Dans les challenges multi-fichiers, le PCAP est souvent l'endroit où se cache la clé de chiffrement
- STEGSNOW → AES est une combinaison classique dans les challenges avancés
- Toujours rechercher des chaînes lisibles dans les captures réseau (`strings`, `tshark`)

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
