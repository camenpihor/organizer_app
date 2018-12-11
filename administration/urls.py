"""URL Configuration for the organizer project.

The `urlpatterns` maps URLs to views for the project.
"""
from django.urls import include, path

urlpatterns = [path("", include("organizer.urls"))]
