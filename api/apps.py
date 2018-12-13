"""Application Configuration for the API.

Stores metadata for the application. For more information on applications in Django refer
to https://docs.djangoproject.com/en/2.1/ref/applications/.
"""
from django.apps import AppConfig


class APIConfig(AppConfig):
    """Class which stores metadata about the api application.

    Parameters
    ----------
    AppConfig : django.apps.AppConfig
        Django parent class which represents Django applications and their configurations.
    """

    name = "api"
