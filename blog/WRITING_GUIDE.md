# Guide Complet de Rédaction (Chirpy Blog)

Ce guide vous explique comment tirer le meilleur parti de votre blog Chirpy pour vos writeups CTF, articles de recherche et labs d'IA.

---

## 1. Création d'un article

Utilisez le script Python pour générer le fichier avec les métadonnées correctes :

```bash
python new_post.py "Titre de l'Article" "Catégorie Principale, Sous-Catégorie" "tag1, tag2"
```

---

## 2. Métadonnées (Front Matter)

Le haut de votre fichier `.md` contrôle le comportement du thème :

```yaml
---
layout: post
title: "Mon Readup CTF"
date: 2026-02-19 10:00:00 +0000
categories: [CTF, Web]       # Toujours mettre entre crochets []
tags: [sql-injection, xss]   # Toujours mettre entre crochets []
pin: true                     # Pour épingler l'article en haut de la page d'accueil
toc: true                     # Afficher la table des matières (activé par défaut)
---
```

---

## 3. Liens et Fichiers

### Liens Externes
Utilisez la syntaxe Markdown standard pour l'accessibilité :
- **TryHackMe** : `[Lab BankGPT](https://tryhackme.com/jr/bankgpt)`
- **GitHub** : `[Code Source](https://github.com/Patrickleondev/repo)`

### Fichiers Téléchargeables (Solve Scripts, Binaires)
Si vous voulez partager un script de résolution ou un fichier PDF :
1. Placez le fichier dans `assets/files/`.
2. Créez un lien dans l'article :
   ```markdown
   [Télécharger le script de solve (Python)](/portfolio/blog/assets/files/solve.py)
   ```

---

## 4. Images et Captures d'écran

Placez vos images dans `assets/img/posts/`.
```markdown
![Capture d'écran de l'exploit](/portfolio/blog/assets/img/posts/exploit.png)
```
*Astuce : Chirpy supporte le zoom au clic sur les images !*

---

## 5. Blocs de Code et Alertes

### Blocs de code (Syntax Highlighting)
```python
def pwn():
    print("Flag found!")
```

### Alertes Spéciales (Chirpy)
> [!TIP]
> Utilisez cette alerte pour des astuces ou des raccourcis.

> [!WARNING]
> Utilisez celle-ci pour des avertissements de sécurité.

---

## 6. Structure Recommandée pour un CTF

Voici un exemple de structure pour un writeup :

```markdown
## 🕵️ Reconnaissance
Analyse des ports et services... (ex: `nmap -sV target`)

## 🚀 Exploitation
Description de la vulnérabilité et charge utile utilisée.

## 🚩 Flag
`CTF{Success_Is_Earned}`

## 💡 Leçons apprises
Ce que ce challenge m'a enseigné.
```

---

## 7. Prévisualisation locale

Si vous voulez voir le résultat avant de publier :
```bash
bundle exec jekyll serve
```
Puis ouvrez : `http://127.0.0.1:4000/portfolio/blog/`
