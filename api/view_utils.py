"""Utilities for views.py."""
from collections import namedtuple

from django.http import Http404

from .models.core import CORE_OBJECT_TYPES, Book, Fact, Question, Topic, Word
from .models.supporting import SUPPORTING_OBJECT_TYPES
from .serializers import (
    BookSerializer,
    FactSerializer,
    QuestionSerializer,
    TopicSerializer,
    WordSerializer,
)

OBJECT_MODELS = [Question, Book, Topic, Fact, Word]
OBJECT_SERIALIZERS = [
    QuestionSerializer,
    BookSerializer,
    TopicSerializer,
    FactSerializer,
    WordSerializer,
]

ObjectInfo = namedtuple("ObjectInfo", ["model", "serializer"])


def check_object_type(object_type):
    """Validate object type.

    Ensure input is in `models.core.CORE_OBJECT_TYPES` or in
    `models.supporting.SUPPORTING_OBJECT_TYPES.

    Parameters
    ----------
    core_object_type : str
        Core object type.

    Raises
    ------
    Http404
        If `core_object_type` not in `CORE_OBJECT_TYPES`.
    """
    if (
        object_type not in CORE_OBJECT_TYPES
        and object_type not in SUPPORTING_OBJECT_TYPES
    ):
        raise Http404


def get_object_from_string(object_type):
    """Get the object class from its type.

    Parameters
    ----------
    object_type : str
        A string representing the object model.

    Raises
    ------
    Http404
        If `object_type` does not match the `__name__` of any objects in
        core.py or supporting.py
    """
    for object_model in OBJECT_MODELS:
        if object_type == object_model.__name__.lower():
            return object_model
    raise Http404


def get_serializer_from_model(object_model):
    """Get the object serializer from its model.

    Parameters
    ----------
    object_model : models.core.CoreObject || models.supproting.SupportingObject

    Raises
    ------
    Http404
        If `object_model` is not the base of any serializer.
    """
    for serializer in OBJECT_SERIALIZERS:
        if object_model == serializer.Meta.model:
            return serializer
    raise Http404


def validate_and_get_object_info(object_type):
    """Validate input and retrieve adjacent information.

    After validating `object_type`, retrieve the model class and serializer that are
    attached to the core object.

    Parameters
    ----------
    object_type : str

    Returns
    -------
    ObjectInfo
        Model class and serializer attached to core object.
    """
    check_object_type(object_type)
    object_class = get_object_from_string(object_type)
    object_serializer = get_serializer_from_model(object_class)
    return ObjectInfo(model=object_class, serializer=object_serializer)
