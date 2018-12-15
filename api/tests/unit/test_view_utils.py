"""Test view_utils for the API.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
import pytest
from django.http import Http404
from api.view_utils import (
    CORE_OBJECT_MODELS,
    CORE_OBJECT_SERIALIZERS,
    CORE_OBJECT_TYPES,
    get_core_object_from_string,
    get_core_serializer_from_model,
)


def test_get_core_object_from_string():
    """Check that correct model class is returned for all `CORE_OBJECT_TYPES`."""
    for core_object_type in CORE_OBJECT_TYPES:
        core_object_class = get_core_object_from_string(core_object_type)
        assert core_object_class in CORE_OBJECT_MODELS


def test_get_core_object_from_string_raises():
    """Check that assertion is raised if no matches are found."""
    with pytest.raises(Http404):
        get_core_object_from_string("this is not a core object")


def test_get_core_serializer_from_model():
    """Check that core serializer is returned for all `CORE_OBJECT_MODELS`."""
    for core_model in CORE_OBJECT_MODELS:
        core_serializer = get_core_serializer_from_model(core_model)
        assert core_serializer in CORE_OBJECT_SERIALIZERS
