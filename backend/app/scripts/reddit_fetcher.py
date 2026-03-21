import requests
import json
import time
from datetime import datetime, timezone

# ── Configuración ─────────────────────────────────────────────────────────────

SUBREDDITS = ["wallstreetbets", "investing", "CryptoCurrency", "stocks"]
SORT_BY    = "hot"       # hot | new | top | rising
LIMIT      = 25          # posts por subreddit (máx 100)
OUTPUT_FILE = "reddit_posts.json"

HEADERS = {
    # Reddit bloquea requests sin User-Agent — pon algo descriptivo
    "User-Agent": "SAFA-sentiment-fetcher/1.0 (standalone test)"
}

# ── Funciones ─────────────────────────────────────────────────────────────────

def fetch_posts(subreddit: str, sort: str = "hot", limit: int = 25) -> list[dict]:
    """
    Obtiene posts de un subreddit usando el endpoint .json público.
    Devuelve una lista de dicts con los campos relevantes para análisis de sentimiento.
    """
    url = f"https://www.reddit.com/r/{subreddit}/{sort}.json?limit={limit}"

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)

        # 429 = rate limit — Reddit pide que esperes
        if response.status_code == 429:
            print(f"  [!] Rate limit en r/{subreddit}. Esperando 60s...")
            time.sleep(60)
            response = requests.get(url, headers=HEADERS, timeout=10)

        response.raise_for_status()
        raw_posts = response.json()["data"]["children"]

    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] No se pudo acceder a r/{subreddit}: {e}")
        return []

    posts = []
    for item in raw_posts:
        d = item["data"]

        # Convertimos el timestamp Unix a datetime legible
        created_at = datetime.fromtimestamp(d["created_utc"], tz=timezone.utc).isoformat()

        posts.append({
            "subreddit":    subreddit,
            "post_id":      d["id"],
            "title":        d["title"],
            "body":         d.get("selftext", "").strip(),
            "score":        d["score"],
            "upvote_ratio": d.get("upvote_ratio", None),
            "num_comments": d["num_comments"],
            "created_at":   created_at,
            "url":          f"https://reddit.com{d['permalink']}",
            # Texto combinado para pasarle a FinBERT directamente
            "text_for_analysis": f"{d['title']}. {d.get('selftext', '')}".strip()
        })

    return posts


def fetch_all(subreddits: list[str], sort: str, limit: int) -> list[dict]:
    """
    Itera todos los subreddits con una pausa entre requests
    para no sobrecargar el endpoint y evitar rate limits.
    """
    all_posts = []

    for subreddit in subreddits:
        print(f"Fetching r/{subreddit}...")
        posts = fetch_posts(subreddit, sort=sort, limit=limit)
        print(f"  -> {len(posts)} posts obtenidos")
        all_posts.extend(posts)

        # Pausa entre subreddits — Reddit recomienda ~2s entre requests
        time.sleep(5)

    return all_posts


def save_to_json(posts: list[dict], filepath: str) -> None:
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"\nGuardados {len(posts)} posts en '{filepath}'")


def print_summary(posts: list[dict]) -> None:
    """Muestra un resumen rápido por subreddit."""
    print("\n── Resumen ──────────────────────────────")
    by_sub = {}
    for p in posts:
        by_sub.setdefault(p["subreddit"], []).append(p)

    for sub, sub_posts in by_sub.items():
        avg_score = sum(p["score"] for p in sub_posts) / len(sub_posts)
        print(f"  r/{sub:<20} {len(sub_posts)} posts | avg score: {avg_score:.0f}")

    print(f"\n  Total: {len(posts)} posts")
    print("─────────────────────────────────────────")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"SAFA Reddit Fetcher — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Subreddits : {', '.join(SUBREDDITS)}")
    print(f"Sort by    : {SORT_BY} | Limit: {LIMIT} per subreddit\n")

    posts = fetch_all(SUBREDDITS, sort=SORT_BY, limit=LIMIT)

    if posts:
        print_summary(posts)
        save_to_json(posts, OUTPUT_FILE)
        print(f"\nEjemplo de post listo para FinBERT:")
        print(f"  \"{posts[0]['text_for_analysis'][:120]}...\"")
    else:
        print("\n[!] No se obtuvieron posts. Revisa tu conexión.")