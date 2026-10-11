"""Django settings for the Nexgate Properties API.

All secrets and environment-specific values come from environment variables.
See ../docs/ENVIRONMENT.md for the full list.
"""

import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def env(name: str, default: str | None = None) -> str | None:
    return os.environ.get(name, default)


def env_bool(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in (env(name, default) or "").split(",") if item.strip()]


DEBUG = env_bool("DJANGO_DEBUG", False)

SECRET_KEY = env("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-only-insecure-key-do-not-use-in-production"
    else:
        raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is off.")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "apps.core",
    "apps.properties",
    "apps.projects",
    "apps.insights",
    "apps.enquiries",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# PostgreSQL is the supported database. SQLite is only used when explicitly requested
# (DJANGO_DB_ENGINE=sqlite) for quick local experiments.
if env("DJANGO_DB_ENGINE") == "sqlite":
    DATABASES = {
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("POSTGRES_DB", "nexgate"),
            "USER": env("POSTGRES_USER", "nexgate"),
            "PASSWORD": env("POSTGRES_PASSWORD", ""),
            "HOST": env("POSTGRES_HOST", "localhost"),
            "PORT": env("POSTGRES_PORT", "5432"),
            "CONN_MAX_AGE": int(env("POSTGRES_CONN_MAX_AGE", "60") or 60),
            "OPTIONS": {"sslmode": env("POSTGRES_SSLMODE", "prefer")},
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = env("DJANGO_MEDIA_URL", "/media/")
MEDIA_ROOT = Path(env("DJANGO_MEDIA_ROOT", str(BASE_DIR / "media")))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Public site URL, used for absolute links in notifications.
SITE_URL = env("SITE_URL", "http://localhost:3000")

# Admin is mounted at a configurable, non-obvious path.
ADMIN_URL_PATH = (env("DJANGO_ADMIN_PATH", "manage-nexgate/") or "manage-nexgate/").strip("/") + "/"
API_PUBLIC_URL = (env("API_PUBLIC_URL", "http://localhost:8000") or "").rstrip("/")
SITE_ADMIN_URL = f"{API_PUBLIC_URL}/{ADMIN_URL_PATH}"
# Base URL used for media links returned by the API (e.g. a CDN). Defaults to the request host.
MEDIA_PUBLIC_BASE_URL = env("MEDIA_PUBLIC_BASE_URL", "")

# --- Django REST Framework ---------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "apps.core.pagination.StandardPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_THROTTLE_RATES": {
        "anon": env("API_THROTTLE_ANON", "120/min"),
        "enquiries": env("API_THROTTLE_ENQUIRIES", "5/hour"),
    },
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    # Number of trusted proxies in front of Django (e.g. the Next.js server and a load balancer).
    "NUM_PROXIES": int(env("API_NUM_PROXIES", "1") or 1),
}
if DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append("rest_framework.renderers.BrowsableAPIRenderer")

CACHES = {
    "default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache", "LOCATION": "nexgate"}
}
if env("REDIS_URL"):
    CACHES["default"] = {"BACKEND": "django.core.cache.backends.redis.RedisCache", "LOCATION": env("REDIS_URL")}

# --- CORS / CSRF -------------------------------------------------------------
# The Next.js server talks to the API server-to-server, so browsers normally never call
# the API directly. Only explicitly listed origins are allowed.
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "http://localhost:8000")
CORS_URLS_REGEX = r"^/api/.*$"

# Shared secret the Next.js server sends when submitting enquiries on behalf of visitors.
# When set, enquiry submissions without it are rejected.
ENQUIRY_API_KEY = env("ENQUIRY_API_KEY", "")

# On-demand cache refresh of the Next.js site after admin edits (optional).
FRONTEND_REVALIDATE_URL = env("FRONTEND_REVALIDATE_URL", "")
REVALIDATE_SECRET = env("REVALIDATE_SECRET", "")

# --- Email notifications (only when configured) ------------------------------
EMAIL_HOST = env("EMAIL_HOST", "")
EMAIL_PORT = int(env("EMAIL_PORT", "587") or 587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", "no-reply@localhost")
ENQUIRY_NOTIFICATION_EMAILS = env_list("ENQUIRY_NOTIFICATION_EMAILS", "")
EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
    if EMAIL_HOST
    else "django.core.mail.backends.console.EmailBackend"
)

# --- Uploads -----------------------------------------------------------------
MAX_IMAGE_UPLOAD_BYTES = int(env("MAX_IMAGE_UPLOAD_BYTES", str(8 * 1024 * 1024)) or 0)
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

# --- Security headers ---------------------------------------------------------
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(env("DJANGO_HSTS_SECONDS", "31536000") or 0)
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"plain": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "plain"}},
    "root": {"handlers": ["console"], "level": env("DJANGO_LOG_LEVEL", "INFO")},
    "loggers": {
        # Never log request bodies; enquiry payloads contain personal data.
        "django.request": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}
