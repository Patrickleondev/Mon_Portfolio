---
layout: post
title: "ECOWAS CTF 2026 — Approfondir [OSINT/100pts]"
date: 2026-04-24 11:14:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [osint, what3words, gps, coordinates, dms, geolocation, ecowas-headquarters, abuja]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** OSINT · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

`afterschool buffets rebuffed`

Où se trouve exactement le siège de l'ECOWAS ?

---

## Analyse

La phrase de trois mots est une adresse **what3words** — un système qui divise le monde en carrés de 3m × 3m, chacun identifié par une combinaison de 3 mots.

`afterschool.buffets.rebuffed` → coordonnées GPS → siège de l'ECOWAS à **Abuja, Nigeria**

**Format du flag :** Degrés-Minutes-Secondes (DMS)

---

## Solution

### Étape 1 — Résoudre l'adresse what3words

```
https://what3words.com/afterschool.buffets.rebuffed
```

Coordonnées : `9.04195°N, 7.524997°E`

### Étape 2 — Conversion décimal → DMS

$$\text{Latitude} = 9.04195° = 9° + 0.04195 \times 60' = 9°2.517' = 9°2'31''N$$

$$\text{Longitude} = 7.524997° = 7° + 0.524997 \times 60' = 7°31.4982' = 7°31'30''E$$

**Code Python :**

```python
def decimal_to_dms(decimal, is_lat=True):
    direction = ('N' if decimal >= 0 else 'S') if is_lat else ('E' if decimal >= 0 else 'W')
    decimal = abs(decimal)
    degrees = int(decimal)
    minutes_full = (decimal - degrees) * 60
    minutes = int(minutes_full)
    seconds = round((minutes_full - minutes) * 60)
    return f"{degrees}°{minutes}′{seconds}″{direction}"

lat = 9.04195
lon = 7.524997
print(decimal_to_dms(lat, True))   # 9°2′31″N
print(decimal_to_dms(lon, False))  # 7°31′30″E
```

---

## Flag

```
EcowasCTF{9°2′31″N 7°31′30″E}
```

---

## Leçons retenues

- **what3words** : 3 mots = position GPS à 3m près — à connaître pour les challenges OSINT géographiques
- Conversion DMS : `minutes = int((decimal_part) * 60)`, `seconds = round((minute_fraction) * 60)`
- Le siège de l'ECOWAS est à **Abuja** (capitale fédérale du Nigeria, pas Lagos)
- "Approfondir" = creuser plus profond — allusion à la précision géographique requise

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
