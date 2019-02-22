"""URL Configuartion for the API.

The `urlpatterns` maps URLs to views for the API. For more information on URL
configuration in Django refer to https://docs.djangoproject.com/en/2.1/intro/tutorial01/.
"""
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views

# `format_suffix_patterns` does not support descending into `include()`
# https://www.django-rest-framework.org/api-guide/format-suffixes/
app_name = "api"
urlpatterns = [
    path(
        "api/<str:object_type>/", views.ObjectList.as_view(), name="model-list"
    ),
    path(
        "api/<str:object_type>/<int:object_id>/",
        views.ObjectDetail.as_view(),
        name="model-detail",
    ),
    path(
        "api/<str:core_object_type>/notebook/",
        views.CoreObjectNotebook.as_view(),
        name="core-notebook",
    ),
    path("api/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
