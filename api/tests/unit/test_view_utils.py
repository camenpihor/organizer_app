"""Test view_utils for the API.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
import pytest
from django.http import Http404
from api.view_utils import (
    OBJECT_MODELS,
    OBJECT_SERIALIZERS,
    CORE_OBJECT_TYPES,
    get_object_from_string,
    get_serializer_from_model,
)


def test_get_object_from_string():
    """Check that correct model class is returned for all `CORE_OBJECT_TYPES`."""
    for core_object_type in CORE_OBJECT_TYPES:
        core_object_class = get_object_from_string(core_object_type)
        assert core_object_class in OBJECT_MODELS


def test_get_object_from_string_raises():
    """Check that assertion is raised if no matches are found."""
    with pytest.raises(Http404):
        get_object_from_string("this is not a core object")


def test_get_serializer_from_model():
    """Check that core serializer is returned for all `CORE_OBJECT_MODELS`."""
    for object_model in OBJECT_MODELS:
        serializer = get_serializer_from_model(object_model)
        assert serializer in OBJECT_SERIALIZERS
