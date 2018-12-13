"""Test supporting models for the API.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
from api.models.supporting import (
    SupportingObject,
    Answer,
    Concept,
    Notebook,
    Quote,
    Review,
    Resource,
)


def test_supporting_object_inheritance():
    """Ensure that `SupportingObject` is subclasses correctly."""
    assert issubclass(Answer, SupportingObject)
    assert issubclass(Concept, SupportingObject)
    assert issubclass(Notebook, SupportingObject)
    assert issubclass(Quote, SupportingObject)
    assert issubclass(Review, SupportingObject)
    assert issubclass(Resource, SupportingObject)
