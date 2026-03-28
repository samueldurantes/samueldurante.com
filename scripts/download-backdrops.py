#!/usr/bin/env python3
"""Download one TMDB backdrop for each movie in cinema.md"""

import json
import os
import random
import re
import sys
import time
import urllib.request

API_KEY = "c6aa5f3ffa2946a5b069acd9217f1b76"
CINEMA_MD = os.path.join(os.path.dirname(__file__), "..", "content", "cinema.md")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "cinema")

os.makedirs(OUT_DIR, exist_ok=True)

# Parse movies from markdown
with open(CINEMA_MD, "r") as f:
    content = f.read()

movies = re.findall(r"^- (.+?)(?:\s*★)?$", content, re.MULTILINE)

print(f"Found {len(movies)} movies")

for i, raw in enumerate(movies):
    match = re.match(r"^(.+?)\s*\((\d{4})\)$", raw.strip())
    if not match:
        print(f"[{i + 1}/{len(movies)}] SKIP (no match): {raw}")
        continue

    title = match.group(1)
    year = match.group(2)

    # Slug for filename
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    filepath = os.path.join(OUT_DIR, f"{slug}.jpg")

    if os.path.exists(filepath):
        print(f"[{i + 1}/{len(movies)}] EXISTS: {title}")
        continue

    # Search TMDB
    query = urllib.parse.urlencode({"query": title, "year": year, "api_key": API_KEY})
    url = f"https://api.themoviedb.org/3/search/movie?{query}"

    try:
        with urllib.request.urlopen(url) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"[{i + 1}/{len(movies)}] ERROR searching: {title} — {e}")
        continue

    results = data.get("results", [])
    if not results:
        print(f"[{i + 1}/{len(movies)}] NOT FOUND: {title} ({year})")
        continue

    movie_id = results[0]["id"]

    # Fetch all backdrops (stills/scenes) for this movie
    images_url = f"https://api.themoviedb.org/3/movie/{movie_id}/images?api_key={API_KEY}&include_image_language=null"
    try:
        with urllib.request.urlopen(images_url) as resp:
            images_data = json.loads(resp.read())
    except Exception as e:
        print(f"[{i + 1}/{len(movies)}] ERROR fetching images: {title} — {e}")
        continue

    backdrops = images_data.get("backdrops", [])
    if not backdrops:
        print(f"[{i + 1}/{len(movies)}] NO BACKDROPS: {title} ({year})")
        continue

    # Pick a random backdrop (scene)
    chosen = random.choice(backdrops)
    backdrop_path = chosen["file_path"]

    img_url = f"https://image.tmdb.org/t/p/w780{backdrop_path}"

    try:
        urllib.request.urlretrieve(img_url, filepath)
        print(f"[{i + 1}/{len(movies)}] OK: {title} ({year})")
    except Exception as e:
        print(f"[{i + 1}/{len(movies)}] DOWNLOAD ERROR: {title} — {e}")
        continue

    # Rate limit: ~4 req/sec to stay under TMDB limits
    time.sleep(0.1)

print("Done!")
