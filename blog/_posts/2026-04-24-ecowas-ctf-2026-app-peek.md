---
layout: post
title: "ECOWAS CTF 2026 — App Peek [Mobile/100pts]"
date: 2026-04-24 11:20:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [mobile, android, apk, resources-arsc, grep, static-analysis]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Mobile · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `App Peek.apk` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/23_app_peek.apk) |

## Description

Un APK minimaliste. Juste un coup d'œil suffit.

---

## Analyse

L'APK ne contient que 3 fichiers :
- `AndroidManifest.xml`
- `resources.arsc`
- `classes.dex`

Un APK est un fichier ZIP. Le flag est caché **en clair** dans `resources.arsc` — pas besoin de décompilation.

---

## Solution

### Option 1 — Grep dans le ZIP

```bash
# Extraire et chercher
unzip challenge.apk -d apk_contents/
grep -r "EcowasCTF" apk_contents/
```

### Option 2 — Strings directement

```bash
strings challenge.apk | grep "EcowasCTF"
```

### Option 3 — Python

```python
import zipfile
import re

with zipfile.ZipFile("challenge.apk", 'r') as apk:
    for name in apk.namelist():
        content = apk.read(name)
        matches = re.findall(rb'EcowasCTF\{[^}]+\}', content)
        if matches:
            print(f"{name}: {matches}")
```

**Résultat :** le flag est en texte brut dans `resources.arsc`.

---

## Flag

```text
EcowasCTF{m0b1l3_4pKK_p3ek}
```

---

## Leçons retenues

- Un APK = ZIP → `unzip` ou `zipfile` Python pour lister le contenu
- `resources.arsc` stocke les ressources compilées — parfois des strings hardcodées en clair
- Les challenges Mobile "Easy" ne nécessitent pas de décompiler `classes.dex` (jadx, apktool)
- Toujours commencer par `strings | grep` avant d'utiliser des outils lourds

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
