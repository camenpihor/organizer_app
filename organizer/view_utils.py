"""Utilities for views.py."""
from collections import namedtuple
from django.http import Http404

from .models.core import CORE_OBJECT_TYPES, Book, Fact, Question, Topic, Word
from .serializers import (
    BookSerializer,
    FactSerializer,
    QuestionSerializer,
    TopicSerializer,
    WordSerializer,
)

CoreObjectInfo = namedtuple("CoreObjectInfo", ["model", "serializer"])


def check_core_object_type(core_object_type):
    """Ensure input is in `models.core.CORE_OBJECT_TYPES`.

    Parameters
    ----------
    core_object_type : str
        Core object type.

    Raises
    ------
    Http404
        If `core_object_type` not in `CORE_OBJECT_TYPES`.
    """
    if core_object_type not in CORE_OBJECT_TYPES:
        raise Http404


def get_core_object_from_string(core_object_type):
    """Get the core object class from its type.

    Parameters
    ----------
    core_object_type : str
        A string representing the core object.

    Raises
    ------
    Http404
        If `core_object_type` does not match the `__name__` of any core objects in
        models.py
    """
    core_object_models = [Question, Book, Topic, Fact, Word]
    for core_object in core_object_models:
        if core_object_type == core_object.__name__.lower():
            return core_object
    raise Http404


def get_core_serializer_from_model(core_object_model):
    """Get the core object serializer from its model.

    Parameters
    ----------
    core_object_model : models.core.CoreObject
        A core object subclass.

    Raises
    ------
    Http404
        If `core_object_model` is not the base of any serializer.
    """
    core_object_serializers = [
        QuestionSerializer,
        BookSerializer,
        TopicSerializer,
        FactSerializer,
        WordSerializer,
    ]
    for serializer in core_object_serializers:
        if core_object_model == serializer.Meta.model:
            return serializer
    raise Http404


def validate_and_get_core_object_info(core_object_type):
    """Validate input and retrieve adjacent information.

    After validating `core_object_type` is in `models.core.CORE_OBJECT_TYPES`, retrieve
    the model class and serializer that are attached to the core object.

    Parameters
    ----------
    core_object_type : str
        Core object type.

    Returns
    -------
    CoreObjectInfo
        Model class and serializer attached to core object.
    """
    check_core_object_type(core_object_type)
    core_object_class = get_core_object_from_string(core_object_type)
    core_object_serializer = get_core_serializer_from_model(core_object_class)
    return CoreObjectInfo(model=core_object_class, serializer=core_object_serializer)
