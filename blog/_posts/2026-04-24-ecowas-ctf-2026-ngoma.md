---
layout: post
title: "ECOWAS CTF 2026 — Ngoma [Reverse/300pts]"
date: 2026-04-24 10:34:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [reverse, elf, upx, custom-vm, aes, bytecode, static-analysis, ghidra, unpacking]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Reverse Engineering · **Difficulté :** ⭐⭐ (Medium-Hard) · **Points :** 300  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus, [contactez-moi](https://patrickleondev.github.io/portfolio/#contact) ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `ngoma.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/34_ngoma.zip) |

## Description

*Ngoma* — le tambour parlant. Un binaire ELF avec des couches de protection. Faites-le parler.

---

## Analyse

Le binaire est **packé avec UPX**. Après décompression, on découvre une **machine virtuelle personnalisée** qui :
1. Lit un bytecode embarqué
2. Passe chaque octet par une transformation : `b ^ (i * 91) ^ 0xa3`
3. Utilise AES pour la vérification finale

---

## Solution

### Étape 1 — Décompression UPX

```bash
upx -d ngoma -o ngoma_unpacked
```

### Étape 2 — Analyse de la VM

Dans Ghidra, la boucle principale de la VM :

```c
for (int i = 0; i < len; i++) {
    byte decoded = bytecode[i] ^ (i * 91) ^ 0xa3;
    process(decoded);
}
```

### Étape 3 — Inversion du bytecode

```python
# Bytecode extrait du binaire (section .data)
bytecode = bytes.fromhex("...")  # à extraire

decoded = bytes([b ^ (i * 91 & 0xFF) ^ 0xa3 for i, b in enumerate(bytecode)])
print(decoded)
```

### Étape 4 — Clé AES et déchiffrement

Le bytecode décodé contient la clé AES et les données chiffrées. L'AES opère en mode ECB ou CBC selon l'implémentation VM.

---

## Flag

```text
EcowasCTF{vm_ng0m4_spn_r1ng_0bf}
```

---

## Leçon retenue

- UPX est détectable via `file` + les chaînes `UPX!` dans le binaire — toujours décompresser avant d'analyser
- Les VMs customisées ont souvent des patterns de transformation simples (XOR avec position)
- `(i * 91) ^ 0xa3` : la multiplication par 91 crée un flux pseudo-aléatoire mais inversible

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
