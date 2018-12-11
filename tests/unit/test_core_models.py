"""Test core models for the organizer application.

This uses pytest and pytest-django to test.

Refer to https://pytest-django.readthedocs.io/en/latest/# for more information on testing
Django with pytest.
"""
from organizer.models.core import (
    CoreObject,
    Question,
    Fact,
    Topic,
    Word,
    Book,
    CORE_OBJECT_TYPES,
)
from organizer.view_utils import get_core_object_from_string


def test_core_object_model_inheritance():
    """Ensure `CoreObject` is subclassed correctly."""
    assert issubclass(Question, CoreObject)
    assert issubclass(Fact, CoreObject)
    assert issubclass(Topic, CoreObject)
    assert issubclass(Word, CoreObject)
    assert issubclass(Book, CoreObject)


def test_core_object_types_global():
    """Check `organizer.models.CORE_OBJECT_TYPES`.

    Ensure that every element in the core objects global variable is the __name__
    of a core object model.
    """
    for core_object_type in CORE_OBJECT_TYPES:
        core_object = get_core_object_from_string(core_object_type)
        assert core_object.__name__.lower() == core_object_type
