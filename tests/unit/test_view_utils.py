"""Test view_utils for the organizer application.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
from django.http import Http404
import pytest

from organizer.models import Question
from organizer.view_utils import get_core_object_from_string


def test_get_core_object_from_string():
    """Check that correct model class is returned."""
    core_object_type = "question"
    core_object_class = get_core_object_from_string(core_object_type)
    assert core_object_class == Question


def test_get_core_object_from_string_raises():
    """Check that assertion is raised if no matches are found."""
    with pytest.raises(Http404):
        get_core_object_from_string("this is not a core object")
