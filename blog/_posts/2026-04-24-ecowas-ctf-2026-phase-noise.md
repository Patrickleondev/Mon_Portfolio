---
layout: post
title: "ECOWAS CTF 2026 — Phase Noise [Reverse/Medium]"
date: 2026-04-24 12:00:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, arm64, mach-o, nibble, sbox, dynamic-programming, obfuscation, medium]
toc: true
---

> **CTF :** ECOWAS CTF 2026 (Événement 3) · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐ Medium · **Points :** 300  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `phase_noise.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/90_phase_noise.zip) |

## Description du challenge

> One tiny checker. One correct passphrase.

**Fichier fourni :** `phase_noise.zip` → `phase_noise` (Mach-O ARM64, macOS, 33 KB)

---

## Analyse

Binaire Mach-O ARM64 (même famille que Swahili Mangle). La `__text` fait 496 bytes (124 instructions ARM64), la `__const` 68 bytes.

### Sections clés

| Section | vmaddr | Taille | Contenu |
|---------|--------|--------|---------|
| `__text` | `0x100003d08` | 496 B | Checker principal |
| `__const` | `0x100003f62` | 68 B | S-box nibble (16 B) + expected[52] |
| `__cstring` | `0x100003f40` | 34 B | Prompt + messages succès/échec |

### Algorithme du checker

La boucle tourne **52 fois** (passphrase de 52 caractères, cf. `cmp x8, #0x34`).

**État interne à chaque itération :**
- `v9` (acc_a) : s'incrémente de 13 par itération
- `v10` (acc_b) : s'incrémente de 17 par itération
- `v13` : s'incrémente de 29, XOR final
- `v14` : état non-linéaire, mis à jour avec le nibble de rotation + le résultat

**Transformation pour le caractère `ch` à la position `i` :**

```
# Rotation contextuelle
v5_full = ch XOR v14
right_shift = 7 & ~shift_base(i)
left_shift  = (shift_base(i)+1) & 7
v5_rot = rotation_8bit(v5_full, ...)

# Lookup S-box sur nibble
idx = (v9 + v5_rot) & 0xF
key_byte = SBOX[idx] + (v5_rot & 0xFF) + v10
key_byte = v13 XOR key_byte

# Condition : key_byte == expected[i]
```

**Condition finale :** `0x89919c27 - v4_last == 0x34` soit `v4_last == 0x89919bf3`.

### Observation clé

Bien que l'état futur (`v14`) dépende du résultat courant, la **contrainte locale** `key_byte == expected[i]` force un seul chemin d'état à chaque position. La programmation dynamique garde au maximum ~30 états actifs simultanément.

---

## Solution

### Stratégie : DP (programmation dynamique) position par position

```python
SBOX = [...]  # 16 bytes extrait de __const (offset 0x3f62)
expected = [...]  # 52 bytes extrait de __const (offset 0x3f72)

def rotate8(val, n):
    n &= 7
    return ((val << n) | (val >> (8 - n))) & 0xFF if n else val & 0xFF

def ror8(val, n):
    n &= 7
    return ((val >> n) | (val << (8 - n))) & 0xFF if n else val & 0xFF

# État : (acc_a, acc_b, acc_c, v14, v12)
# Valeurs initiales (lues du désassemblage)
initial_state = (0, 0, 0, 0, 0)
states = {initial_state: ""}  # état → passphrase partielle

for i in range(52):
    next_states = {}
    acc_a_base = (initial_state[0] + 13 * i) & 0xFF
    acc_b_base = (initial_state[1] + 17 * i) & 0xFF
    acc_c_base = (initial_state[2] + 29 * i) & 0xFF

    for state, partial in states.items():
        acc_a, acc_b, acc_c, v14, v12 = state

        for ch in range(32, 127):  # ASCII imprimable
            # Appliquer la transformation
            v5_full = (ch ^ v14) & 0xFF
            shift_base = v12 & 7
            v5_rot = rotate8(v5_full, shift_base)

            idx = (acc_a + v5_rot) & 0xF
            key_byte = (SBOX[idx] + (v5_rot & 0xFF) + acc_b) & 0xFF
            key_byte = (acc_c ^ key_byte) & 0xFF

            if key_byte == expected[i]:
                # Propager le nouvel état
                new_v14 = (v14 + key_byte) & 0xFF
                new_v12 = (v12 + 1) & 0xFF
                new_acc_a = (acc_a + 13) & 0xFF
                new_acc_b = (acc_b + 17) & 0xFF
                new_acc_c = (acc_c + 29) & 0xFF
                new_state = (new_acc_a, new_acc_b, new_acc_c, new_v14, new_v12)
                next_states[new_state] = partial + chr(ch)

    states = next_states
    print(f"Position {i+1}/52 — {len(states)} états actifs")

# Filtrer selon la condition finale
for state, passphrase in states.items():
    v4_final = compute_v4(state)
    if v4_final == 0x89919BF3:
        print(f"[+] Passphrase : {passphrase}")
        break
```

---

## Flag

```text
EcowasCTF{vm_lifted_nibbles_are_louder_than_strings}
```

---

## Ce que j'ai retenu

- Le pattern **"S-box nibble + rotation contextuelle + accumulateurs incrémentaux"** est typique des obfuscations légères de checkers maison (VM lifting basique).
- **DP position par position** : efficace même quand plusieurs variables d'état se propagent — le nombre d'états actifs reste faible grâce aux contraintes locales (`key_byte == expected[i]` élimine presque tous les candidats).
- **Condition finale** sur un accumulateur 32 bits : toujours chercher une `cmp` ou `sub` finale dans le désassemblage avant de conclure qu'il n'y a qu'une contrainte par position.
- Binaires ARM64 macOS : les offsets `__const` se lisent dans les Load Commands (`LC_SEGMENT_64.__DATA_CONST`).

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
