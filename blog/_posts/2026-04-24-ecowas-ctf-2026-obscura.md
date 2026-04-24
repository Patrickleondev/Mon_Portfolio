---
layout: post
title: "ECOWAS CTF 2026 — Obscura [Mobile/Easy]"
date: 2026-04-24 11:45:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [mobile, android, apk, dex, hardcoded-credentials, base64, reverse, easy]
toc: true
---

> **CTF :** ECOWAS CTF 2026 (Événement 3) · **Catégorie :** Mobile · **Difficulté :** ⭐ Easy · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `Obscura.apk.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/89_obscura.apk.zip) |

## Description du challenge

> I need your help to retrieve the secret from this mobile app, I've done what I can, and all I could find was this link `http://labs.ecowasctf.com.gh:5003/` from their employee. I couldn't extract any information from their app though!

**Fichier fourni :** `Obscura.apk.zip` (8.6 KB)

---

## Analyse

L'APK est minuscule — seulement **3 fichiers** :
- `AndroidManifest.xml`
- `classes.dex` (20 592 octets)
- `resources.arsc`

La petite taille + le package `com.metasploit.stage` signalent immédiatement un **stager Metasploit**. La logique intéressante se trouve dans `classes.dex`.

---

## Solution

### Étape 1 : Extraction des chaînes du DEX

On extrait toutes les chaînes ASCII du fichier DEX :

```python
import re

with open('classes.dex', 'rb') as f:
    data = f.read()

# Extraire les chaînes ASCII imprimables de longueur >= 4
strings = re.findall(rb'[\x20-\x7E]{4,}', data)
for s in strings:
    print(s.decode('ascii', errors='replace'))
```

Deux chaînes Base64 ressortent clairement :

```
YWRtaW4=  → admin
czNjcjN0IQ==  → s3cr3t!
```

Le code DEX contient deux méthodes `getUser()` et `getPass()` qui retournent ces valeurs décodées — des **credentials hardcodés**.

### Étape 2 : Exploitation du backend

Le serveur `http://labs.ecowasctf.com.gh:5003/` expose un endpoint `/login` (POST JSON) :

```python
import urllib.request
import json
import base64

# Décoder les credentials
user = base64.b64decode("YWRtaW4=").decode()    # admin
pwd  = base64.b64decode("czNjcjN0IQ==").decode() # s3cr3t!

payload = json.dumps({"username": user, "password": pwd}).encode()

req = urllib.request.Request(
    "http://labs.ecowasctf.com.gh:5003/login",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())
    print(data["flag"])
```

**Réponse du serveur :**

```json
{"flag": "EcowasCTF{h4rdc0d3d_m0b1l3_xpl0it}", "message": "Welcome admin"}
```

Ou en cURL :

```bash
curl -s -X POST http://labs.ecowasctf.com.gh:5003/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"s3cr3t!"}'
```

---

## Flag

```
EcowasCTF{h4rdc0d3d_m0b1l3_xpl0it}
```

---

## Ce que j'ai retenu

- **Ne jamais hardcoder des credentials dans un APK**, même encodés en Base64 — c'est trivial à extraire avec `strings` ou un hex dump du DEX.
- **Base64 ≠ chiffrement** : c'est de l'encodage réversible sans clé. Ça ne protège rien.
- **Stager Metasploit** dans un APK CTF → chercher les credentials hardcodés + l'URL du serveur C2, qui devient la cible d'exploitation.
- **Content-Type: application/json obligatoire** sur le backend Flask — un POST form-data échoue avec 400.

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
