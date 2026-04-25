---
layout: post
title: "ECOWAS CTF 2026 — Kora Strings [Misc/200pts]"
date: 2026-04-24 10:59:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [misc, audio, wav, riff, xor, metadata, steganography, west-africa, kora]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Misc · **Difficulté :** ⭐⭐ (Medium) · **Points :** 200  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `kora.wav` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/59_kora.wav) |

## Description

La kora — instrument à 21 cordes du Mandingue. Ce fichier WAV cache plus qu'une mélodie.

---

## Analyse

Le fichier WAV est un container **RIFF**. En plus des chunks standard (`fmt `, `data`), il contient :
- Un chunk **`flag`** non-standard avec des données XOR-obfusquées
- Un chunk **`ICMT`** (commentaire) dans le bloc `LIST INFO` contenant la clé XOR

**Metadata ICMT :** `"the string is tuned to 0x5B"`  
**Clé XOR :** `0x5B` (= 91 décimal = `[` en ASCII)

---

## Solution

```python
import struct
import wave

def parse_riff(filename):
    with open(filename, "rb") as f:
        data = f.read()
    
    # Parser les chunks RIFF
    assert data[:4] == b'RIFF'
    total_size = struct.unpack("<I", data[4:8])[0]
    assert data[8:12] == b'WAVE'
    
    pos = 12
    chunks = {}
    
    while pos < len(data):
        chunk_id = data[pos:pos+4]
        chunk_size = struct.unpack("<I", data[pos+4:pos+8])[0]
        chunk_data = data[pos+8:pos+8+chunk_size]
        
        chunks[chunk_id] = chunk_data
        pos += 8 + chunk_size + (chunk_size % 2)  # alignement pair
        
        # Parser LIST INFO pour ICMT
        if chunk_id == b'LIST' and chunk_data[:4] == b'INFO':
            sub_pos = 4
            while sub_pos < len(chunk_data):
                sub_id = chunk_data[sub_pos:sub_pos+4]
                sub_size = struct.unpack("<I", chunk_data[sub_pos+4:sub_pos+8])[0]
                sub_data = chunk_data[sub_pos+8:sub_pos+8+sub_size]
                chunks[sub_id] = sub_data
                sub_pos += 8 + sub_size
    
    return chunks

chunks = parse_riff("challenge.wav")

# Lire la clé depuis ICMT
icmt = chunks[b'ICMT'].decode().rstrip('\x00')
print(f"Commentaire: {icmt}")
# "the string is tuned to 0x5B"
xor_key = 0x5B

# Déchiffrer le chunk 'flag'
flag_chunk = chunks[b'flag']
flag = bytes([b ^ xor_key for b in flag_chunk])
print(f"Flag: {flag.decode()}")
```

---

## Flag

```text
EcowasCTF{mdr}
```

---

## Notes

Le flag court (`mdr` = *mort de rire* en français) est intentionnel — c'est le flag officiel du challenge.

---

## Leçons retenues

- Les WAV RIFF peuvent contenir des chunks non-standard — toujours lister tous les chunk IDs
- Le chunk `ICMT` (LIST INFO) est la métadata "commentaire" standard RIFF
- La clé de déchiffrement peut être cachée dans les métadonnées du fichier lui-même
- **Kora :** instrument emblématique de l'Afrique de l'Ouest, à 21 cordes, associé aux griots mandingues

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
