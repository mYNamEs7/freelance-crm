"""
In-memory TTL cache. Не требует отдельного сервиса (Redis) на Railway.
Ключ — строка (например, f"clients:{user_id}"), значение — сериализуемые данные.
"""
import asyncio
from cachetools import TTLCache

# 5 минут TTL, до 500 ключей
_cache: TTLCache[str, list] = TTLCache(maxsize=500, ttl=300)
_lock = asyncio.Lock()


async def get_cached(key: str) -> list | None:
    async with _lock:
        return _cache.get(key)


async def set_cached(key: str, value: list) -> None:
    async with _lock:
        _cache[key] = value


async def invalidate_cached(prefix: str) -> None:
    """Удалить все ключи, начинающиеся с prefix (например, 'clients:42')."""
    async with _lock:
        to_del = [k for k in _cache if k.startswith(prefix)]
        for k in to_del:
            del _cache[k]
