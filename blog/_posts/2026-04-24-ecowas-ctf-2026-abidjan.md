---
layout: post
title: "ECOWAS CTF 2026 — Abidjan [Network Forensics/100pts]"
date: 2026-04-24 10:24:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [network-forensics, pcap, arp, arp-poisoning, wireshark, tshark, mac-address]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Network Forensics · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition. Si un lien ne fonctionne plus ou consultez les archives de la plateforme.

| Fichier | Télécharger |
|---------|-------------|
| `Abidjan.pcap` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/24_abidjan.pcap) |

## Description

Un PCAP capturé sur le réseau d'Abidjan. Une machine se comporte de manière suspecte. Identifiez l'attaquant.

---

## Analyse

Le challenge porte sur une **ARP Poisoning Attack**. Dans ce type d'attaque, une machine envoie des réponses ARP non sollicitées (*gratuitous ARP*) pour empoisonner les caches ARP des victimes et intercepter le trafic réseau.

**Objectif :** Trouver l'adresse MAC de la machine qui envoie le plus de réponses ARP non sollicitées.

---

## Solution

### Avec Wireshark

Filtre : `arp.opcode == 2` (ARP Reply)

Aller dans **Statistics → Endpoints → Ethernet** pour voir quelle adresse MAC génère le plus de trames ARP.

### Avec tshark

```bash
tshark -r capture.pcap -Y "arp.opcode == 2" \
  -T fields -e eth.src | sort | uniq -c | sort -rn | head
```

L'adresse MAC qui ressort avec le plus de réponses ARP non sollicitées est l'attaquant.

**Résultat :** `00:11:22:33:44:55`

---

## Flag

```text
EcowasCTF{00:11:22:33:44:55}
```

---

**[← Retour à l'index ECOWAS CTF 2026](/portfolio/blog/posts/ecowas-ctf-2026/)**
