# Guide — Rédiger et publier un writeup CTF sur le blog

> Blog : **Jekyll + thème Chirpy** | Dépôt : `D:\New folder\portfolio`  
> URL live : `https://patrickleondev.github.io/portfolio/blog/`

---

## Table des matières

1. [Structure d'un fichier post](#1-structure-dun-fichier-post)
2. [Frontmatter YAML — les métadonnées](#2-frontmatter-yaml)
3. [Mise en forme du contenu](#3-mise-en-forme-du-contenu)
4. [Insérer des images](#4-insérer-des-images)
5. [Blocs de code avec syntaxe colorée](#5-blocs-de-code)
6. [Équations mathématiques](#6-équations-mathématiques)
7. [Liens et sources](#7-liens-et-sources)
8. [Ajouter des fichiers à télécharger](#8-fichiers-à-télécharger)
9. [Tags et catégories](#9-tags-et-catégories)
10. [Publier sur le blog (git push)](#10-publier-sur-le-blog)
11. [Template complet prêt à copier](#11-template-complet)

---

## 1. Structure d'un fichier post

Tous les posts sont dans :
```
D:\New folder\portfolio\blog\_posts\
```

**Règle de nommage des fichiers :**
```
AAAA-MM-JJ-titre-du-post.md
```

Exemples :
```
2026-04-24-ecowas-ctf-2026-sankofa.md
2026-04-24-mon-premier-writeup.md
```

> ⚠️ La date dans le nom du fichier = date d'affichage sur le blog. Un post daté dans le futur n'apparaîtra pas tant que la date n'est pas atteinte.

---

## 2. Frontmatter YAML

C'est le bloc entre les `---` au début du fichier. Jekyll lit ces métadonnées pour générer la page.

```yaml
---
layout: post
title: "ECOWAS CTF 2026 — Sankofa [Crypto/300pts]"
date: 2026-04-24 10:47:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [crypto, ecdsa, lcg, lattice, secp256k1]
toc: true
image:
  path: /portfolio/blog/assets/img/ecowas-2026/cover.jpeg
  alt: "Description de l'image pour l'accessibilité"
---
```

### Détail de chaque champ

| Champ | Rôle | Exemple |
|-------|------|---------|
| `layout` | Template utilisé — toujours `post` | `post` |
| `title` | Titre affiché en haut de la page et dans les listes | `"Mon Challenge [Crypto/500pts]"` |
| `date` | Date + heure UTC de publication | `2026-04-24 10:00:00 +0000` |
| `categories` | Dossiers de classement (max 2 recommandé) | `[CTF, ECOWAS-CTF-2026]` |
| `tags` | Mots-clés pour la recherche et le nuage de tags | `[crypto, rsa, brute-force]` |
| `toc` | Afficher la table des matières auto-générée | `true` ou `false` |
| `pin` | Épingler le post en haut de la liste | `true` (index uniquement) |
| `image` | Image de couverture (apparaît en haut + en miniature) | voir ci-dessous |

### Choisir ses tags

Les tags sont les mots-clés qui décrivent la technique ou l'outil utilisé. Exemples par catégorie :

| Catégorie CTF | Tags recommandés |
|--------------|-----------------|
| Crypto | `rsa`, `ecc`, `aes`, `ecdsa`, `lcg`, `lattice`, `coppersmith`, `hnp` |
| Reverse | `arm64`, `mach-o`, `ghidra`, `ida-pro`, `white-box`, `vm`, `decompilation` |
| Web | `xss`, `sqli`, `ssrf`, `jwt`, `cookie`, `header-injection`, `idor` |
| Forensics | `pcap`, `wireshark`, `firmware`, `iot`, `xor`, `memory-forensics` |
| Steg | `lsb`, `steghide`, `spectrogram`, `audio`, `png`, `bmp` |
| OSINT | `wayback-machine`, `archive`, `geolocation`, `dns` |
| Misc | `morse`, `rail-fence`, `rot13`, `base64`, `encoding` |

---

## 3. Mise en forme du contenu

### Titres (génèrent la table des matières)

```markdown
## Section principale       → H2, entrée dans le TOC
### Sous-section            → H3, sous-entrée dans le TOC
#### Détail                 → H4, ne s'affiche pas dans le TOC
```

> ⚠️ Ne pas utiliser `# H1` dans le contenu — le titre du post est déjà un H1.

### Blocs de citation (pour la description officielle du challenge)

```markdown
> Ceci est une citation. Parfait pour l'énoncé officiel du challenge.

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Crypto · **Points :** 500  
> **[← Retour à l'index](/portfolio/blog/posts/ecowas-ctf-2026/)**
```

### Texte en gras et italique

```markdown
**Mot important** → gras
*Terme technique* → italique
`code inline`     → police monospace (pour les noms de variables, fonctions, fichiers)
```

### Tableaux

```markdown
| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| valeur A  | valeur B  | valeur C  |
| valeur D  | valeur E  | valeur F  |
```

### Listes

```markdown
- Point 1
- Point 2
  - Sous-point (2 espaces d'indentation)

1. Étape 1
2. Étape 2
3. Étape 3
```

---

## 4. Insérer des images

### Où mettre les images ?

```
D:\New folder\portfolio\blog\assets\img\[dossier-du-ctf]\
```

Exemple :
```
blog\assets\img\ecowas-2026\cover.jpeg
blog\assets\img\ecowas-2026\screenshot-flag.png
```

### Syntaxe pour afficher une image

```markdown
![Description de l'image](/portfolio/blog/assets/img/ecowas-2026/cover.jpeg)
*Légende affichée sous l'image*
```

### Image centrée avec taille contrôlée (HTML dans Markdown)

```html
<img src="/portfolio/blog/assets/img/ecowas-2026/screenshot-flag.png" 
     alt="Screenshot du flag" 
     width="600" />
```

### Image de couverture (frontmatter)

```yaml
image:
  path: /portfolio/blog/assets/img/ecowas-2026/cover.jpeg
  alt: "Description alternative"
```

> 💡 L'image de couverture apparaît automatiquement en haut du post et comme miniature dans les listes.

---

## 5. Blocs de code

### Syntaxe générale

````markdown
```langage
votre code ici
```
````

### Langages disponibles (les plus utiles en CTF)

| Langage | Tag à utiliser |
|---------|---------------|
| Python | `python` |
| Bash / shell | `bash` |
| JSON | `json` |
| JavaScript | `javascript` |
| C / C++ | `c` / `cpp` |
| Assembleur | `nasm` |
| SQL | `sql` |
| Texte brut (flags, output) | `text` |
| SageMath | `python` (pas de tag sage) |

### Exemples

**Code Python avec coloration syntaxique :**
````markdown
```python
from Crypto.Util.number import long_to_bytes

n = 12345678901234567890
e = 3
c = 98765432198765432198

# Cube root attack
m = round(c ** (1/3))
print(long_to_bytes(m))
```
````

**Commande bash :**
````markdown
```bash
tshark -r capture.pcap -Y "arp.opcode == 2" \
  -T fields -e eth.src | sort | uniq -c | sort -rn
```
````

**Flag (texte brut) :**
````markdown
```text
EcowasCTF{this_is_the_flag_123}
```
````

### ⚠️ Erreurs fréquentes à éviter

```
# ❌ MAUVAIS — code inline sans bloc (difficile à lire)
La solution est : from Crypto.Util.number import long_to_bytes; m = round(c**(1/3)); print(long_to_bytes(m))

# ✅ CORRECT — code dans un bloc avec syntaxe
```python
from Crypto.Util.number import long_to_bytes
m = round(c ** (1/3))
print(long_to_bytes(m))
```
```

> 💡 **Règle d'or :** Dès que le code dépasse 2 mots, le mettre dans un bloc. Jamais de code Python sur une seule ligne dans le texte.

---

## 6. Équations mathématiques

Le thème Chirpy supporte **KaTeX** pour les formules mathématiques.

### Équation inline (dans une phrase)

```markdown
La clé privée satisfait $e \cdot d \equiv 1 \pmod{\phi(n)}$.
```

### Équation en bloc (centrée)

```markdown
$$
M = \begin{pmatrix}
nW & 0 & \cdots \\
0 & nW & \cdots \\
v_0 W & v_1 W & 1
\end{pmatrix}
$$
```

### Symboles utiles en CTF crypto

| Symbole | Code LaTeX |
|---------|-----------|
| Modulo | `\pmod{n}` |
| Produit | `\cdot` |
| Puissance | `^{-1}` (inverse) |
| Somme | `\sum_{i=0}^{n}` |
| Intégrale | `\int_{a}^{b}` |
| Fraction | `\frac{a}{b}` |
| Racine | `\sqrt{n}` |
| Appartient | `\in` |
| Flèche | `\rightarrow` ou `\to` |

---

## 7. Liens et sources

### Lien vers un autre post du blog

```markdown
[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)
[Voir le writeup de Sankofa](/portfolio/blog/posts/ecowas-ctf-2026-sankofa/)
```

> 💡 L'URL d'un post = `/portfolio/blog/posts/[nom-du-fichier-sans-date-sans-.md]/`  
> Exemple : `2026-04-24-ecowas-ctf-2026-sankofa.md` → `/portfolio/blog/posts/ecowas-ctf-2026-sankofa/`

### Lien externe (documentation, outil, référence)

```markdown
[Documentation SageMath](https://doc.sagemath.org/)
[CyberChef](https://gchq.github.io/CyberChef/)
[FactorDB](https://factordb.com/)
```

### Section "Sources" en fin de post (bonne pratique)

```markdown
## Sources et références

- [LLL Algorithm — Wikipedia](https://en.wikipedia.org/wiki/Lenstra%E2%80%93Lenstra%E2%80%93Lov%C3%A1sz_lattice_basis_reduction_algorithm)
- [Lattice Attacks on ECDSA — Boneh-Venkatesan](https://crypto.stanford.edu/~dabo/papers/boneh-venkatesan.pdf)
- [SageMath — LLL documentation](https://doc.sagemath.org/html/en/reference/matrices/sage/matrix/matrix2.html)
```

---

## 8. Fichiers à télécharger

### Où mettre les fichiers ?

```
D:\New folder\portfolio\blog\assets\files\ecowas-2026\
```

### Nommage recommandé

```
[numéro-challenge]_[nom-court].[extension]
Exemple : 47_sankofa_files.zip
```

### Syntaxe dans le post

```markdown
## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de
> téléchargement peuvent expirer après la fin de la compétition.

| Fichier | Télécharger |
|---------|-------------|
| `sankofa_files.zip` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/47_sankofa_files.zip) |
```

### Si le fichier est trop lourd pour le dépôt git

Pour les fichiers > 50 MB (ex : captures réseau, audio, images HD), deux options :
1. **Héberger sur Google Drive** et mettre un lien direct de téléchargement
2. **GitHub Releases** — créer une release et attacher le fichier

```markdown
| `huge_capture.pcapng` | [⬇ Google Drive](https://drive.google.com/file/d/XXXX/view) |
```

---

## 9. Tags et catégories

### Catégories

```yaml
categories: [CTF, ECOWAS-CTF-2026]
```

- **Maximum 2 catégories** recommandé
- La première catégorie = dossier principal (`CTF`)
- La deuxième = sous-dossier (`ECOWAS-CTF-2026`)
- L'URL du post ne change pas selon les catégories

### Tags — bonnes pratiques

```yaml
tags: [crypto, rsa, lattice, coppersmith, sage, brute-force]
```

- Tout en **minuscules** avec des tirets (pas d'espaces)
- 4 à 8 tags par post (ni trop peu, ni trop)
- Privilégier les termes recherchables : noms d'outils (`ghidra`, `z3`, `sagemath`), techniques (`rop`, `heap-overflow`, `format-string`), algorithmes (`aes-cbc`, `secp256k1`)

---

## 10. Publier sur le blog

### Processus complet

```bash
# 1. Naviguer vers le dépôt
cd "D:\New folder\portfolio"

# 2. Vérifier ce qui a changé
git status

# 3. Ajouter les nouveaux fichiers
git add blog/_posts/2026-04-24-mon-nouveau-post.md
git add blog/assets/img/ecowas-2026/ma-capture.png
git add blog/assets/files/ecowas-2026/challenge.zip

# Ou tout ajouter d'un coup (si on est sûr)
git add blog/

# 4. Créer un commit avec un message descriptif
git commit -m "Add writeup: Sankofa [Crypto/300pts] — ECOWAS CTF 2026"

# 5. Envoyer sur GitHub
git push origin main
```

### Ce qui se passe après le push

1. GitHub reçoit les fichiers
2. **GitHub Actions** déclenche automatiquement le build (`deploy.yml`)
3. Jekyll construit le site HTML depuis les fichiers Markdown
4. Le site est déployé sur GitHub Pages
5. Après ~2-3 minutes, les changements sont visibles sur `https://patrickleondev.github.io/portfolio/blog/`

### Vérifier le build GitHub Actions

→ Aller sur `https://github.com/patrickleondev/portfolio/actions`  
→ Si le build est vert ✅ : le site est à jour  
→ Si rouge ❌ : cliquer pour voir l'erreur (souvent un problème de YAML dans le frontmatter)

### Erreurs fréquentes

| Erreur | Cause | Solution |
|--------|-------|----------|
| Post invisible | Date dans le futur | Mettre une date passée ou du jour |
| Build échoue | YAML mal formé | Vérifier les guillemets et les `:` dans le frontmatter |
| Image non affichée | Chemin incorrect | Vérifier que le chemin commence par `/portfolio/blog/...` |
| Code sans coloration | Pas de langage spécifié | Ajouter le langage après les ` ``` ` |
| Équation non rendue | KaTeX pas activé | Vérifier `_config.yml` — `math: true` dans les defaults |

---

## 11. Template complet

Copier-coller ce template pour un nouveau writeup CTF et remplir les `[...]` :

```markdown
---
layout: post
title: "ECOWAS CTF 2026 — [Nom du Challenge] [[Catégorie]/[Points]pts]"
date: 2026-04-24 10:00:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [[tag1], [tag2], [tag3], [tag4]]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** [Catégorie] · **Difficulté :** ⭐⭐ ([Medium]) · **Points :** [300]  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Fichiers du challenge

> ⚠️ **Note :** Les fichiers sont hébergés sur la plateforme ECOWAS CTF. Les liens de téléchargement peuvent expirer après la fin de la compétition.

| Fichier | Télécharger |
|---------|-------------|
| `[nom_fichier.zip]` | [⬇ Télécharger](/portfolio/blog/assets/files/ecowas-2026/[xx_nom_fichier.zip]) |

---

## Description du challenge

> [Énoncé officiel du challenge — copier depuis la plateforme]

---

## Analyse

[Explication de ce qu'on comprend du challenge : quel est le problème, quelle vulnérabilité ?, quelle approche ?]

### [Sous-section d'analyse]

[Détails techniques]

---

## Solution

### [Étape 1 — Nom de l'étape]

[Explication de l'étape]

```python
# Code de la solution (bien indenté, chaque étape commentée)
from [module] import [fonction]

# Étape 1 : [description]
variable = valeur

# Étape 2 : [description]
resultat = calcul(variable)
print(resultat)
```

**Résultat :**

```text
EcowasCTF{le_flag_ici}
```

---

## Flag

```text
EcowasCTF{le_flag_ici}
```

---

## Leçon retenue

- [Ce que ce challenge apprend sur la sécurité / la technique]
- [L'erreur à ne pas reproduire / le piège classique]

---

## Sources et références

- [Lien vers outil ou documentation utilisée](https://example.com)
- [Article académique ou writeup similaire](https://example.com)
```

---

## Astuces de mise en forme

### Badges de difficulté

```
⭐           → Very Easy
⭐⭐          → Easy / Medium
⭐⭐⭐         → Hard
⭐⭐⭐⭐        → Very Hard / Insane
```

### Emojis utiles pour les titres de sections

```
🔑 Crypto       🔍 Forensics    📱 Mobile
⚙️ Reverse      🌐 Web          🕵️ OSINT
👁️ Steganography 🎭 Misc        💻 Binary/Pwn
```

### Raccourcis clavier pour les caractères spéciaux

| Caractère | Comment taper |
|-----------|--------------|
| `→` | Copier directement |
| `←` | Copier directement |
| `⬇` | Copier directement |
| `⚠️` | Copier directement |
| `φ` (phi) | Utiliser KaTeX : `$\phi$` |
| `≡` (congruent) | Utiliser KaTeX : `$\equiv$` |

---

*Guide rédigé pour le blog CTF de t3chw1z4rd — Avril 2026*
