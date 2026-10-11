from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = "apps.core"

    def ready(self):
        from .revalidation import connect_signals

        connect_signals()
