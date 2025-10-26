from __future__ import annotations

from types import SimpleNamespace


def ensure_bcrypt_about() -> None:
    """Patch bcrypt >=4 so passlib can read its version metadata."""
    try:
        import bcrypt  # type: ignore
    except ImportError:
        return

    if getattr(bcrypt, "__about__", None) is None:
        version = getattr(bcrypt, "__version__", "0")
        bcrypt.__about__ = SimpleNamespace(__version__=version)
