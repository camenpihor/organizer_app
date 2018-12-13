"""URL Configuration for the API.

The `urlpatterns` maps URLs to views for the project.
"""
from django.urls import include, path

urlpatterns = [path("", include("api.urls"))]
