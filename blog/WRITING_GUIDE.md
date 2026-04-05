# Guide de Redaction Pro (Blog)

Ce guide sert de standard editorial pour publier des articles techniques et writeups CTF de maniere claire, credible et lisible.

## 1) Creation rapide d'un post

```bash
python new_post.py "Titre" "Categorie1, Categorie2" "tag1, tag2"
```

## 2) Front Matter recommande

```yaml
---
layout: post
title: "Titre de l'article"
date: 2026-04-05 10:00:00 +0000
categories: [CTF, Web]
tags: [xss, auth, hardening]
toc: true
image:
    path: /portfolio/blog/assets/img/posts/ctf/cover.png
    alt: Capture principale de l'analyse
---
```

## 3) Structure standard d'un article technique

```markdown
## Contexte
## Objectif
## Methodologie
## Resultats / Observations
## Impact (business ou securite)
## Remediation / Bonnes pratiques
## Conclusion
```

## 4) Structure standard d'un writeup CTF

```markdown
## Contexte du challenge
## Triage et hypotheses
## Analyse
## Resolution
## Lessons learned
```

## 5) Assets et liens

- Images: placer dans `assets/img/posts/...`
- Fichiers: placer dans `assets/files/...`
- Toujours utiliser des chemins absolus compatibles GitHub Pages:

```markdown
![preuve](/portfolio/blog/assets/img/posts/future-interns/zap-dashboard.png)
[Script](/portfolio/blog/assets/files/solve.py)
```

## 6) Regles qualite

- Un article = une idee principale
- Preuves visuelles quand possible
- Eviter les blocs trop longs, preferer des sections courtes
- Toujours terminer avec un plan d'action ou une lecon

## 7) Preview locale

```bash
bundle exec jekyll serve --baseurl /portfolio/blog
```

Ouvrir: `http://127.0.0.1:4000/portfolio/blog/`
