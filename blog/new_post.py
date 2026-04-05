import datetime
import os
import sys

def create_post(title, categories, tags):
    date_now = datetime.datetime.now()
    filename_date = date_now.strftime("%Y-%m-%d")
    post_date = date_now.strftime("%Y-%m-%d %H:%M:%S +0000")
    
    # Sanitize title for filename
    clean_title = title.lower().replace(" ", "-").replace(":", "").replace("'", "")
    filename = f"{filename_date}-{clean_title}.md"
    filepath = os.path.join("_posts", filename)
    
    if os.path.exists(filepath):
        print(f"Error: Post {filename} already exists!")
        return

    content = f"""---
layout: post
title: "{title}"
date: {post_date}
categories: [{categories}]
tags: [{tags}]
---

## Introduction

Commencez votre article ici...

## Section 1

Détails techniques...

## Conclusion

Résumé et leçons apprises.
"""
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Success: Created {filepath}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python new_post.py \"Title\" \"Category1, Category2\" \"tag1, tag2\"")
        sys.exit(1)
        
    title = sys.argv[1]
    categories = sys.argv[2] if len(sys.argv) > 2 else "Blog"
    tags = sys.argv[3] if len(sys.argv) > 3 else "general"
    
    create_post(title, categories, tags)
