"""URL Configuartion for the organizer application.

The `urlpatterns` maps URLs to views for the organizer application. For more information
on URL configuration in Django refer to
https://docs.djangoproject.com/en/2.1/intro/tutorial01/.
"""
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

# `format_suffix_patterns` does not support descending into `include()`
# https://www.django-rest-framework.org/api-guide/format-suffixes/
app_name = "organizer"
urlpatterns = [
    path("", views.base, name="base"),
    path("<str:core_object_type>/home", views.home, name="home"),
    path("<str:core_object_type>/archive", views.archive, name="archive"),
    path("<str:core_object_type>/stats", views.stats, name="stats"),
    path("<str:core_object_type>/<int:object_id>", views.item, name="item"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
