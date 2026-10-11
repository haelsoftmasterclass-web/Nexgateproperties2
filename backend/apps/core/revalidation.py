"""Tells the Next.js site to refresh cached pages after content changes in the admin."""

import json
import logging
import threading
import urllib.request

from django.conf import settings
from django.db import transaction
from django.db.models.signals import post_delete, post_save

logger = logging.getLogger(__name__)


def _send(tags: list[str]) -> None:
    url, secret = settings.FRONTEND_REVALIDATE_URL, settings.REVALIDATE_SECRET
    if not (url and secret):
        return
    req = urllib.request.Request(
        url,
        data=json.dumps({"tags": tags}).encode(),
        headers={"Content-Type": "application/json", "X-Revalidate-Secret": secret},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=5).close()
    except Exception as exc:  # noqa: BLE001 - content is saved; cache will expire on its own
        logger.warning("Frontend revalidation failed for %s: %s", tags, exc)


def request_revalidation(tags: list[str]) -> None:
    transaction.on_commit(lambda: threading.Thread(target=_send, args=(tags,), daemon=True).start())


def connect_signals():
    from apps.core import models as core
    from apps.insights.models import Article
    from apps.projects.models import Project, ProjectFAQ, ProjectImage
    from apps.properties.models import Property, PropertyImage

    def tagger(fn):
        def handler(sender, instance, **kwargs):
            request_revalidation(fn(instance))

        return handler

    mapping = {
        Property: lambda i: ["properties", f"property:{i.slug}", "redirects"],
        PropertyImage: lambda i: ["properties", f"property:{i.property.slug}"],
        Project: lambda i: ["projects", f"project:{i.slug}", "properties", "redirects"],
        ProjectImage: lambda i: ["projects", f"project:{i.project.slug}"],
        ProjectFAQ: lambda i: ["projects", f"project:{i.project.slug}"],
        Article: lambda i: ["articles", f"article:{i.slug}", "redirects"],
        core.FAQ: lambda i: ["faqs"],
        core.FAQCategory: lambda i: ["faqs"],
        core.LegalPage: lambda i: ["legal"],
        core.ServiceContent: lambda i: ["services"],
        core.MarketOption: lambda i: ["markets"],
        core.SiteSettings: lambda i: ["site-settings"],
        core.Office: lambda i: ["site-settings"],
        core.PhoneNumber: lambda i: ["site-settings"],
        core.SocialLink: lambda i: ["site-settings"],
        core.AffiliateBrand: lambda i: ["site-settings"],
    }
    for model, fn in mapping.items():
        handler = tagger(fn)
        post_save.connect(handler, sender=model, weak=False, dispatch_uid=f"revalidate-save-{model.__name__}")
        post_delete.connect(handler, sender=model, weak=False, dispatch_uid=f"revalidate-delete-{model.__name__}")
