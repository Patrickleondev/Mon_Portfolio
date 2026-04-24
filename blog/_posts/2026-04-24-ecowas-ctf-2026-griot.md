---
layout: post
title: "ECOWAS CTF 2026 — GrIOT [Forensics/100pts]"
date: 2026-04-24 10:43:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [forensics, iot, firmware, xor, gzip, tar, base64, ecfw, embedded-systems]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Forensics · **Difficulté :** ⭐⭐ (Medium) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `griot-gw-v1.3.bin` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/43_griot-gw-v1.3.bin) |

## Description

Un firmware IoT mystérieux au format ECFW. Extrayez les secrets de cet objet connecté.

---

## Analyse

Le fichier est un firmware au format **ECFW** (format custom). Structure :
- **Header :** contient `payload_offset` et `xor_key`
- **Payload :** données XOR-obfusquées
- **Contenu déobfusqué :** archive GZIP → TAR → fichiers de configuration

Le flag est encodé en **Base64** dans `etc/config/iot_cloud.conf` comme valeur du champ `api_token`.

---

## Solution

```python
import zlib
import tarfile
import io
import base64

with open("firmware.ecfw", "rb") as f:
    data = f.read()

# Parser le header ECFW
# Offset et clé XOR à extraire selon la structure
payload_offset = 0x1040  # lu depuis le header
xor_key = 0xa7           # lu depuis le header

# Déobfusquer le payload
payload = data[payload_offset:]
deobfuscated = bytes([b ^ xor_key for b in payload])

# Vérifier la magic GZIP (1f 8b)
assert deobfuscated[:2] == b'\x1f\x8b', "Pas un GZIP valide"

# Décompresser GZIP
gz_data = zlib.decompress(deobfuscated, zlib.MAX_WBITS | 16)

# Lire le TAR
with tarfile.open(fileobj=io.BytesIO(gz_data)) as tar:
    # Extraire le fichier de configuration
    config = tar.extractfile("etc/config/iot_cloud.conf")
    content = config.read().decode()
    print(content)

# Parser api_token
for line in content.splitlines():
    if "api_token" in line:
        token_b64 = line.split("=")[1].strip()
        flag = base64.b64decode(token_b64).decode()
        print(f"Flag: {flag}")
```

**Parsing du header ECFW :**

```python
import struct

with open("firmware.ecfw", "rb") as f:
    header = f.read(0x1050)

# Structure hypothétique du header (à ajuster selon l'analyse)
magic = header[:4]  # b'ECFW'
payload_offset = struct.unpack("<I", header[8:12])[0]
xor_key = header[16]
```

---

## Flag

```
EcowasCTF{f1rmw4r3_xor_fs_dump_gr10t}
```

---

## Leçon retenue

- Firmware IoT = souvent un container custom (XOR/RC4) → GZIP → TAR/SquashFS
- `zlib.MAX_WBITS | 16` permet de décompresser GZIP avec Python zlib
- Les credentials sont souvent encodés en Base64 dans les fichiers de config embarqués
- Référence culturelle : le **Griot** est un conteur/dépositaire de mémoire en Afrique de l'Ouest

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
