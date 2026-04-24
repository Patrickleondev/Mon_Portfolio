---
layout: post
title: "ECOWAS CTF 2026 — Djinn [Reverse/500pts]"
date: 2026-04-24 10:49:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, elf, lfsr, state-machine, ghidra, static-analysis, deterministic]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐⭐ (Hard) · **Points :** 500  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

| Fichier | Télécharger |
|---------|-------------|
| `djinn.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/49_djinn.zip) |

## Description

Un Djinn est emprisonné dans ce binaire ELF. Son état initial est `0xDEADBEEF`. Libérez-le.

---

## Analyse

Le binaire implémente une **machine à états basée sur un LFSR** (Linear Feedback Shift Register). Aucune entrée utilisateur n'est nécessaire — le flag est **généré de manière déterministe** à partir de l'état initial `0xDEADBEEF`.

**Structure :**
- Fonction `step()` : avance l'état LFSR
- Fonction `emit()` : produit un octet du flag
- Boucle principale : 37 itérations → 37 octets = flag complet

---

## Analyse dans Ghidra

```c
uint32_t state = 0xDEADBEEF;

uint32_t step(void) {
    // LFSR avec polynôme de rétroaction
    uint32_t feedback = __builtin_popcount(state & MASK) & 1;
    state = (state >> 1) | (feedback << 31);
    return state;
}

uint8_t emit(void) {
    uint32_t s = step();
    return (uint8_t)(s ^ (s >> 8) ^ (s >> 16) ^ (s >> 24));
}

// Main : génère 37 octets
for (int i = 0; i < 37; i++) {
    flag[i] = emit();
}
```

---

## Solution — Reproduire en Python

```python
def step(state, mask=0xB4BCD35C):  # polynôme du LFSR à extraire de Ghidra
    feedback = bin(state & mask).count('1') & 1
    state = ((state >> 1) | (feedback << 31)) & 0xFFFFFFFF
    return state

def emit(state):
    s = step(state)
    byte = (s ^ (s >> 8) ^ (s >> 16) ^ (s >> 24)) & 0xFF
    return byte, s

state = 0xDEADBEEF
flag_bytes = []
for _ in range(37):
    byte, state = emit(state)
    flag_bytes.append(byte)

print(bytes(flag_bytes).decode())
```

**Important :** Le polynôme de rétroaction exact (le masque LFSR) doit être extrait du binaire via Ghidra. La valeur ci-dessus est un exemple.

---

## Flag

```
EcowasCTF{Dj1nN_5t4t3_mAcH1n3_0xD34D}
```

---

## Leçons retenues

- Un état initial hardcodé = flag déterministe, pas besoin de fuzzing
- Les LFSR 32 bits ont un polynôme de rétroaction (masque) à identifier dans les instructions bit à bit
- `0xDEAD` → `0xD34D` dans le flag : les auteurs jouent sur la lisibilité leet speak
- Chercher les constantes magiques dans Ghidra : `0xDEADBEEF` apparaît dans l'initialisation

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
