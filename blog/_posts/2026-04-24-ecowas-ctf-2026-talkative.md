---
layout: post
title: "ECOWAS CTF 2026 — Talkative [Misc/50pts]"
date: 2026-04-24 10:51:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [misc, morse-code, talking-drums, west-africa, cultural-context, encoding]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Misc · **Difficulté :** ⭐ (Very Easy) · **Points :** 50  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Les tambours parlent. Savez-vous les écouter ?

```
-.. .-. ..- -- ...   - .... .- -   - .- .-.. -.-   .- -.-. .-. --- ...…
```

---

## Analyse

Le ciphertext est du **code Morse** standard, avec :
- `.` = signal court (dit)
- `-` = signal long (dah)
- ` ` = séparateur de lettres
- `/` = séparateur de mots

La référence culturelle aux **tambours parlants** (*talking drums*) d'Afrique de l'Ouest est l'indice thématique.

---

## Solution

### Décodage manuel (table Morse)

| Morse | Lettre |
|-------|--------|
| `-..` | D |
| `.-.` | R |
| `..-` | U |
| `--` | M |
| `...` | S |
| `-` | T |
| `....` | H |
| `.-` | A |
| `-` | T |
| `-` | T |
| `.-` | A |
| `.-..` | L |
| `-.-` | K |
| `.-` | A |
| `-.-.` | C |
| `.-.` | R |
| `---` | O |
| `...` | S |
| `...` | S |
| `-` | T |
| `....` | H |
| `.-` | A |
| `...` | S |
| `.-` | A |
| `...-` | V |
| `.-` | A |
| `-..` | N |
| `-..` | N |
| `.-` | A |
| `...` | S |

Résultat : `DRUMS THAT TALK ACROSS THE SAVANNAH`

### Avec CyberChef

**From Morse Code** (séparateur espace/slash) → texte en clair.

---

## Flag

```
EcowasCTF{DRUMS_THAT_TALK_ACROSS_THE_SAVANNAH}
```

---

## Leçon retenue

- Les **talking drums** (djembe, fontomfrom) permettent de communiquer sur de longues distances en Afrique de l'Ouest — analogie avec le Morse
- Attention au dernier mot : SAVANNAH se termine en `-H` (7 lettres), pas SAVANNAS
- CyberChef "From Morse Code" est le plus rapide pour ce type de challenge

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
