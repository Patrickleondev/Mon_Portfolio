---
layout: post
title:  "AI RedTeaming : Jailbreaking BankGPT"
date:   2026-02-07 00:15:00 +0100
categories: [AI RedTeaming, Labs]
tags: [prompt-injection, jailbreak, tryhackme]
toc: true
image:
  path: /assets/img/posts/ctf/bankgpt-prompt-1.png
  alt: BankGPT lab interaction screenshot
---

## Contexte du Lab

Dans ce lab pedagogique de red teaming LLM, l'objectif etait de verifier si un assistant pouvait maintenir ses garde-fous face a des requetes apparemment legitimes.

![Conversation screenshot 1](/portfolio/blog/assets/img/posts/ctf/bankgpt-prompt-1.png)

![Conversation screenshot 2](/portfolio/blog/assets/img/posts/ctf/bankgpt-prompt-2.png)

## Observation Principale

Le modele a fini par exposer une information sensible en repondant a une demande de clarification process, ce qui montre une faiblesse d'isolation entre:

- le contexte metier autorise
- les secrets internes

## Points de Defense

1. Ajouter une couche de redaction systematique des secrets en sortie
2. Renforcer les policies de refus sur les objets sensibles, meme en contexte legitimant
3. Mettre en place des tests automatiques de fuite d'information dans la CI
4. Segmenter les sources internes exposees au modele

## Conclusion

Cette experience confirme qu'un assistant peut paraitre robuste en tests directs, tout en restant fragile aux requetes decontournees. La posture defensive doit combiner filtrage de sortie, garde-fous contextuels et evaluation continue.
